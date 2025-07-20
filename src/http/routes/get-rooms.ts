import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import {count,eq} from "drizzle-orm"

export const GetRooms:FastifyPluginAsyncZod = async (server)=> {
    server.get("/rooms", async () => {
        return await  db
        .select({
            id: schema.rooms.id,
            name: schema.rooms.name,
            questionsCount: count(schema.questions.id),
            createdAt: schema.rooms.creeatedAt
        })
        .from(schema.rooms)
        .leftJoin(schema.questions, eq(schema.questions.roomId, schema.rooms.id))
        .groupBy(schema.rooms.id)
        .orderBy(schema.rooms.creeatedAt)
    })
}