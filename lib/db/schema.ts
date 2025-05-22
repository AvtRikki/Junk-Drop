import {pgTable, text, uuid, integer, boolean, timestamp} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const entities = pgTable("entities", {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    path: text("path").notNull(),
    size: integer("size").notNull(),
    type: text("type").notNull(),

    fileUrl: text("file_url").notNull(),
    thumbnailUrl: text("thumbnail_url"),

    userId: text("user_id").notNull(),
    parentId: uuid("parent_id"),

    isFolder: boolean("is_folder").default(false).notNull(),
    isFavorite: boolean("is_favorite").default(false).notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const entitiesRelations = relations(entities, ({ one, many }) => ({
    parent: one(entities, {
        fields: [entities.parentId],
        references: [entities.id]
    }),

    children: many(entities)
}));

export type File = typeof entities.$inferSelect;
export type NewFile = typeof entities.$inferInsert;

export type Folder = typeof entities.$inferSelect;
export type NewFolder = typeof entities.$inferInsert;
