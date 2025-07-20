import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { z } from "zod/v4";
import { desc, eq } from "drizzle-orm";

export const GetRoomsQuestion:FastifyPluginAsyncZod = async (server)=> {
    server.get("/rooms/:roomId/question", {
        schema: {
            params: z.object({
                roomId: z.string(),
            })
        }
    },async (request, reply) => {
        const { roomId } = request.params

        const data = await db
        .select({
            id: schema.questions.id,
            questions: schema.questions.question,
            answer: schema.questions.answer,
            created_at: schema.questions.created_at
        })
        .from(schema.questions)
        .where(eq(schema.questions.roomId, roomId))
        .orderBy(desc(schema.questions.created_at))

        return data
    })
}