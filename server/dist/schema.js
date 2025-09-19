import { pgTable, text, serial, integer, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export const games = pgTable("games", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    gameId: integer("game_id").references(() => games.id).notNull(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    role: text("role").notNull().default("admin"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const registrations = pgTable("registrations", {
    id: serial("id").primaryKey(),
    gameId: integer("game_id").notNull().references(() => games.id),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull(),
    videoWatched: boolean("video_watched").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const settings = pgTable("settings", {
    id: serial("id").primaryKey(),
    gameId: integer("game_id").notNull().references(() => games.id),
    key: text("key").notNull().unique(),
    value: text("value").notNull(),
    description: text("description"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
    // 👇 composite unique constraint (gameId + key)
    uniqueGameSetting: uniqueIndex("unique_game_setting").on(t.gameId, t.key),
}));
export const insertUserSchema = createInsertSchema(users).pick({
    username: true,
    password: true,
    role: true,
});
export const loginSchema = z.object({
    username: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});
export const updateUserSchema = z.object({
    username: z.string().email("Please enter a valid email address").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
});
export const insertRegistrationSchema = createInsertSchema(registrations).pick({
    name: true,
    phone: true,
    email: true,
    videoWatched: true,
});
export const insertSettingSchema = createInsertSchema(settings).pick({
    gameId: true,
    key: true,
    value: true,
    description: true,
});
export const updateSettingSchema = z.object({
    value: z.string(),
    description: z.string().optional(),
});
