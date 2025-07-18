import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const GetRooms:FastifyPluginAsyncZod = async (server)=> {
    server.get("/rooms", async () => {
        return await  db.select({
            Id: schema.rooms.id,
            name: schema.rooms.name
        }).from(schema.rooms).orderBy(schema.rooms.creeatedAt)
    })
}