import { users, registrations, settings, games } from "./schema.js";
import { db } from "./db.js";
import { eq, count, desc, and, inArray } from "drizzle-orm";
import { randomBytes } from "crypto";
function generatePassword(slug) {
    const randomPart = randomBytes(3).toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 6);
    return `${slug}-${randomPart}`;
}
export class DatabaseStorage {
    // ---------------- GAMES ----------------
    async getGameBySlug(slug) {
        const [game] = await db.select().from(games).where(eq(games.slug, slug));
        return game || undefined;
    }
    async createGame(insertGame) {
        const [game] = await db.insert(games).values(insertGame).returning();
        // Initialize default settings for this game
        await this.initializeDefaultSettings(game.id);
        // Create admin for this game
        const passwordPlain = generatePassword(game.slug);
        const email = `admin@${game.slug}.com`;
        await this.createUser({
            gameId: game.id,
            username: email,
            password: passwordPlain,
            role: "admin",
        });
        console.log(`Admin created for ${game.slug}: ${email} / ${passwordPlain}`);
        return game;
    }
    // ---------------- USERS ----------------
    async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || undefined;
    }
    async getUserByUsername(username) {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        return user || undefined;
    }
    async createUser(insertUser) {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
    }
    async updateUser(id, updateData) {
        const [user] = await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, id))
            .returning();
        return user;
    }
    // async createDefaultAdmin(): Promise<void> {
    //   const existingAdmin = await this.getUserByUsername("admin@doneforyoupros.com");
    //   if (!existingAdmin) {
    //     // find or create default game
    //     let [game] = await db.select().from(games).limit(1);
    //     if (!game) {
    //       [game] = await db.insert(games).values({
    //         name: "Default Game",
    //         slug: "default-game"
    //       }).returning();
    //     }
    //     await this.createUser({
    //       gameId: game.id,  // 
    //       username: "admin@doneforyoupros.com",
    //       password: "password@security",
    //       role: "admin"
    //     });
    //   }
    // }
    // ---------------- REGISTRATIONS ----------------
    async getRegistrationByEmail(gameId, email) {
        const [registration] = await db
            .select()
            .from(registrations)
            .where(and(eq(registrations.gameId, gameId), eq(registrations.email, email)));
        return registration || undefined;
    }
    async createRegistration(gameId, insertRegistration) {
        const [registration] = await db
            .insert(registrations)
            .values({ ...insertRegistration, gameId })
            .returning();
        return registration;
    }
    async getRegistrationCount(gameId) {
        const [result] = await db
            .select({ count: count() })
            .from(registrations)
            .where(eq(registrations.gameId, gameId));
        return Number(result.count);
    }
    async getAllRegistrations(gameId) {
        const results = await db
            .select()
            .from(registrations)
            .where(eq(registrations.gameId, gameId))
            .orderBy(desc(registrations.createdAt));
        return results;
    }
    async deleteRegistration(id, gameId) {
        await db
            .delete(registrations)
            .where(and(eq(registrations.id, id), eq(registrations.gameId, gameId)));
    }
    async bulkDeleteRegistrations(ids, gameId) {
        if (ids.length === 0)
            return;
        await db
            .delete(registrations)
            .where(and(inArray(registrations.id, ids), eq(registrations.gameId, gameId)));
    }
    // ---------------- SETTINGS (per game) ----------------
    async getSetting(gameId, key) {
        const [setting] = await db
            .select()
            .from(settings)
            .where(and(eq(settings.gameId, gameId), eq(settings.key, key)));
        return setting || undefined;
    }
    async setSetting(gameId, key, value, description) {
        const existingSetting = await this.getSetting(gameId, key);
        if (existingSetting) {
            const [setting] = await db
                .update(settings)
                .set({
                value,
                description: description || existingSetting.description,
                updatedAt: new Date()
            })
                .where(eq(settings.id, existingSetting.id))
                .returning();
            return setting;
        }
        else {
            const [setting] = await db
                .insert(settings)
                .values({ gameId, key, value, description })
                .returning();
            return setting;
        }
    }
    async getAllSettings(gameId) {
        const results = await db.select().from(settings).where(eq(settings.gameId, gameId));
        return results;
    }
    async initializeDefaultSettings(gameId) {
        const defaultSettings = [
            {
                key: 'duplicate_email_check',
                value: 'true',
                description: 'Enable duplicate email checking to prevent multiple registrations with same email'
            },
            {
                key: 'duplicate_phone_check',
                value: 'true',
                description: 'Enable duplicate phone checking to prevent multiple registrations with same phone'
            },
            {
                key: 'video_requirement_enabled',
                value: 'true',
                description: 'Require users to watch video before registration form unlocks'
            }
        ];
        for (const setting of defaultSettings) {
            const existing = await this.getSetting(gameId, setting.key);
            if (!existing) {
                await this.setSetting(gameId, setting.key, setting.value, setting.description);
            }
        }
    }
}
export const storage = new DatabaseStorage();
