import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { createEmbeddings, transcribeAudio } from "../../services/gemini.ts";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const UpoloadAudio: FastifyPluginAsyncZod = async (server) => {
    server.post("/rooms/:roomId/audio", {
        schema: {
            params: z.object({
                roomId: z.string(),
            }),
        }
    }, async (request, reply) => {
        const { roomId } = request.params
         
        const audio = await request.file()
        if(!audio) {
            throw new Error("Audio is requered!")
        }

        const audioBuffer = await audio.toBuffer()
        const audioAsBase64 = audioBuffer.toString('base64')

        const transcription = await transcribeAudio(audioAsBase64, audio.mimetype )
        const embeddings = await createEmbeddings(transcription)

        const data = await db.insert(schema.audioChunk)
        .values({
            roomId,
            transcription,
            embeddigs: embeddings // erro de digitação
        }).returning()

        const chunk = data[0]
        if(!chunk){
            throw new Error("Erro ao salvar chunk de audio")
        }


        return reply.status(201).send({chunk: chunk.id})
    })
}