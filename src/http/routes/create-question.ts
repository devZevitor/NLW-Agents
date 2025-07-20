import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const CreateQuestion: FastifyPluginAsyncZod = async (server)=> {
    server.post("/rooms/:roomId/question", {
        schema: {
            params: z.object({
                roomId: z.string(),
            }),
            body: z.object({
                question: z.string(),
            })
        }
    }, async (request, reply)=> {
        const { roomId } = request.params
        const { question } = request.body

        const data = await db.insert(schema.questions)
        .values({
            roomId,
            question
        }).returning()

        const dataReceveid = data[0]

        if(!dataReceveid) throw new Error("Erro ao criar a pergunta")

        return reply.status(201).send({questionId: dataReceveid.id})
    })
}