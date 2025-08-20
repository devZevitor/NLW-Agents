import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { createEmbeddings, generateAnswer } from "../../services/gemini.ts";
import { and, eq, sql } from "drizzle-orm";

export const CreateQuestion: FastifyPluginAsyncZod = async (server) => {
    server.post("/rooms/:roomId/question", {
        schema: {
            params: z.object({
                roomId: z.string(),
            }),
            body: z.object({
                question: z.string(),
            })
        }
    }, async (request, reply) => {
        const { roomId } = request.params
        const { question } = request.body

        const embeddings = await createEmbeddings(question)
        const embeddingsAsString = `[${embeddings.join(',')}]`

        const chunks = await db
        .select({
            id: schema.audioChunk.id,
            transcription: schema.audioChunk.transcription,
            similarity: sql<Number>`1 - (${schema.audioChunk.embeddigs} <=> ${embeddingsAsString}::vector)`
        })
        .from(schema.audioChunk)
        .where(
            and(
                eq(schema.audioChunk.roomId, roomId),
                sql`1 - (${schema.audioChunk.embeddigs} <=> ${embeddingsAsString}::vector) > 0.7`
            )
        )
        .orderBy(sql`${schema.audioChunk.embeddigs} <=> ${embeddingsAsString}::vector`)
        .limit(3)

        let answer: string | null = null
        if(chunks.length > 0){
            const transcriptions = chunks.map(chunk => chunk.transcription)

            answer = await generateAnswer(question, transcriptions)
        }  
       
        const data = await db.insert(schema.questions)
        .values({
            roomId,
            question,
            answer
        }).returning()

        const dataReceveid = data[0]

        if(!dataReceveid) throw new Error("Erro ao criar a pergunta")

        return reply.status(201).send({questionId: dataReceveid.id, answer})
    })
}