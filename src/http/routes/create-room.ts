import type {FastifyPluginAsyncZod} from "fastify-type-provider-zod"
import z from "zod/v4"
import { db } from "../../db/connection.ts"
import { schema } from "../../db/schema/index.ts"

export const CreateRoom: FastifyPluginAsyncZod = async (server)=> {
    server.post("/rooms", {
        schema: {
            body: z.object({
                name: z.string().min(3),
                description: z.string().optional()
            })
        }
    }, async (request, reply)=> {
        const {name, description} = request.body

        const data = await db.insert(schema.rooms).values({
            name,
            description
        }).returning()

        const dataReceveid = data[0]

        if(!dataReceveid){throw new Error("Erro ao criar a sala.")}

        return reply.status(201).send({roomId: dataReceveid.id})
        
    })
}