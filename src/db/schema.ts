import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull().default(""),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const galleryImages = sqliteTable("gallery_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  src: text("src").notNull(),
  alt: text("alt").notNull().default(""),
  category: text("category").notNull().default("Wedding"),
  title: text("title").notNull().default(""),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const stories = sqliteTable("stories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  location: text("location").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  category: text("category").notNull().default("Wedding"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  images: text("images").notNull().default("[]"),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  text: text("text").notNull(),
  rating: integer("rating").notNull().default(5),
  date: text("date").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull().default(""),
  category: text("category").notNull().default("Photography"),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
