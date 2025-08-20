import fastify from 'fastify'
import {fastifyMultipart} from "@fastify/multipart"
import fastifyCors from '@fastify/cors'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './env.ts'
import { GetRooms } from './http/routes/get-rooms.ts'
import { CreateRoom } from './http/routes/create-room.ts'
import { GetRoomsQuestion } from './http/routes/get-rooms-questions.ts'
import { CreateQuestion } from './http/routes/create-question.ts'
import { UpoloadAudio } from './http/routes/upload-audio.ts'

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.register(fastifyMultipart)
server.register(fastifyCors, {
  origin: '*',
})

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.get('/helth', () => {
  return 'OK'
})

server.register(GetRooms)
server.register(CreateRoom)
server.register(GetRoomsQuestion)
server.register(CreateQuestion)
server.register(UpoloadAudio)

server.listen({ port: env.PORT || 3333 })
