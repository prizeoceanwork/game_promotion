import { 
  users, 
  registrations, 
  settings, 
  games, 
  type User, 
  type InsertUser, 
  type Registration, 
  type InsertRegistration, 
  type UpdateUserData, 
  type Setting, 
  type InsertSetting, 
  type UpdateSetting, 
  type Game, 
  type InsertGame 
} from "./schema";
import { db } from "./db";
import { eq, count, desc ,and,  inArray  } from "drizzle-orm";
import { randomBytes } from "crypto";

export interface IStorage {
  // Game
  getGameBySlug(slug: string): Promise<Game | undefined>;
  createGame(insertGame: InsertGame): Promise<Game>;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(id: number, updateData: UpdateUserData): Promise<User>;
  // createDefaultAdmin(): Promise<void>;

  // Registrations
  getRegistrationByEmail(gameId: number, email: string): Promise<Registration | undefined>;
  createRegistration(gameId: number, insertRegistration: InsertRegistration): Promise<Registration>;
  getRegistrationCount(gameId: number): Promise<number>;
  getAllRegistrations(gameId: number): Promise<Registration[]>;
  deleteRegistration(id: number, gameId: number): Promise<void>;
  bulkDeleteRegistrations(ids: number[], gameId: number): Promise<void>;

  // Settings (per game)
  getSetting(gameId: number, key: string): Promise<Setting | undefined>;
  setSetting(gameId: number, key: string, value: string, description?: string): Promise<Setting>;
  getAllSettings(gameId: number): Promise<Setting[]>;
  initializeDefaultSettings(gameId: number): Promise<void>;
}

function generatePassword(slug: string): string {
  const randomPart = randomBytes(3).toString("base64") 
    .replace(/[^a-zA-Z0-9]/g, "") 
    .slice(0, 6); 
  return `${slug}-${randomPart}`;
}

export class DatabaseStorage implements IStorage {
  // ---------------- GAMES ----------------
  async getGameBySlug(slug: string): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.slug, slug));
    return game || undefined;
  }

  

async createGame(insertGame: InsertGame): Promise<Game> {
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
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updateData: UpdateUserData): Promise<User> {
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
 async getRegistrationByEmail(gameId: number, email: string): Promise<Registration | undefined> {
  const [registration] = await db
    .select()
    .from(registrations)
    .where(and(eq(registrations.gameId, gameId), eq(registrations.email, email)));

  return registration || undefined;
}

  async createRegistration(gameId: number, insertRegistration: InsertRegistration): Promise<Registration> {
    const [registration] = await db
      .insert(registrations)
      .values({ ...insertRegistration, gameId })
      .returning();
    return registration;
  }

  async getRegistrationCount(gameId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(registrations)
      .where(eq(registrations.gameId, gameId));
    return Number(result.count);
  }

  async getAllRegistrations(gameId: number): Promise<Registration[]> {
    const results = await db
      .select()
      .from(registrations)
      .where(eq(registrations.gameId, gameId))
      .orderBy(desc(registrations.createdAt));
    return results;
  }

 async deleteRegistration(id: number, gameId: number): Promise<void> {
  await db
    .delete(registrations)
    .where(and(eq(registrations.id, id), eq(registrations.gameId, gameId)));
}

async bulkDeleteRegistrations(ids: number[], gameId: number): Promise<void> {
  if (ids.length === 0) return;

  await db
    .delete(registrations)
    .where(and(inArray(registrations.id, ids), eq(registrations.gameId, gameId)));
}

  // ---------------- SETTINGS (per game) ----------------
 async getSetting(gameId: number, key: string): Promise<Setting | undefined> {
  const [setting] = await db
    .select()
    .from(settings)
    .where(and(eq(settings.gameId, gameId), eq(settings.key, key)));

  return setting || undefined;
}

  async setSetting(gameId: number, key: string, value: string, description?: string): Promise<Setting> {
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
    } else {
      const [setting] = await db
        .insert(settings)
        .values({ gameId, key, value, description })
        .returning();
      return setting;
    }
  }

  async getAllSettings(gameId: number): Promise<Setting[]> {
    const results = await db.select().from(settings).where(eq(settings.gameId, gameId));
    return results;
  }

  async initializeDefaultSettings(gameId: number): Promise<void> {
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
