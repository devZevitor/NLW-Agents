import {pgTable, uuid, text, vector, timestamp} from "drizzle-orm/pg-core"
import { rooms } from "./rooms.ts"

export const audioChunk = pgTable('audioChunk', {
    id: uuid().primaryKey().defaultRandom(),
    roomId: uuid().references(() => rooms.id).notNull(),
    transcription: text().notNull(),
    embeddigs: vector({dimensions: 768}).notNull(),
    createdAt: timestamp().defaultNow().notNull()
})