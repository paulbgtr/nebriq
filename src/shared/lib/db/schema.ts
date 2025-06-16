import { integer, serial, text, pgTable, timestamp } from "drizzle-orm/pg-core";

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tokenLimits = pgTable("token_limits", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  tokensUsed: integer("tokens_used").notNull().default(0),
  tokenLimit: integer("token_limit").notNull().default(500),
  resetDate: timestamp("reset_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const noteTags = pgTable("note_tags", {
  id: serial("id").primaryKey(),
  noteId: text("note_id").notNull(),
  tagId: text("tag_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messageNotes = pgTable("message_notes", {
  id: serial("id").primaryKey(),
  messageId: text("message_id").notNull(),
  noteId: text("note_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messageTags = pgTable("message_tags", {
  id: serial("id").primaryKey(),
  messageId: text("message_id").notNull(),
  noteId: text("note_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
