import { users, registrations, settings } from "./schema.js";
import { db } from "./db";
import { eq, count, desc } from "drizzle-orm";
export class DatabaseStorage {
    async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || undefined;
    }
    async getUserByUsername(username) {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        return user || undefined;
    }
    async createUser(insertUser) {
        const [user] = await db
            .insert(users)
            .values(insertUser)
            .returning();
        return user;
    }
    async getRegistrationByEmail(email) {
        const [registration] = await db.select().from(registrations).where(eq(registrations.email, email));
        return registration || undefined;
    }
    async createRegistration(insertRegistration) {
        const [registration] = await db
            .insert(registrations)
            .values(insertRegistration)
            .returning();
        return registration;
    }
    async getRegistrationCount() {
        const [result] = await db.select({ count: count() }).from(registrations);
        return Number(result.count);
    }
    async getAllRegistrations() {
        const results = await db.select().from(registrations).orderBy(desc(registrations.createdAt));
        return results;
    }
    async deleteRegistration(id) {
        await db.delete(registrations).where(eq(registrations.id, id));
    }
    async bulkDeleteRegistrations(ids) {
        if (ids.length === 0)
            return;
        for (const id of ids) {
            await db.delete(registrations).where(eq(registrations.id, id));
        }
    }
    async updateUser(id, updateData) {
        const [user] = await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, id))
            .returning();
        return user;
    }
    async createDefaultAdmin() {
        const existingAdmin = await this.getUserByUsername("admin@doneforyoupros.com");
        if (!existingAdmin) {
            await this.createUser({
                username: "admin@doneforyoupros.com",
                password: "password@security",
                role: "admin"
            });
        }
    }
    async getSetting(key) {
        const [setting] = await db.select().from(settings).where(eq(settings.key, key));
        return setting || undefined;
    }
    async setSetting(key, value, description) {
        const existingSetting = await this.getSetting(key);
        if (existingSetting) {
            const [setting] = await db
                .update(settings)
                .set({
                value,
                description: description || existingSetting.description,
                updatedAt: new Date()
            })
                .where(eq(settings.key, key))
                .returning();
            return setting;
        }
        else {
            const [setting] = await db
                .insert(settings)
                .values({ key, value, description })
                .returning();
            return setting;
        }
    }
    async getAllSettings() {
        const results = await db.select().from(settings);
        return results;
    }
    async initializeDefaultSettings() {
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
            const existing = await this.getSetting(setting.key);
            if (!existing) {
                await this.setSetting(setting.key, setting.value, setting.description);
            }
        }
    }
}
export const storage = new DatabaseStorage();
