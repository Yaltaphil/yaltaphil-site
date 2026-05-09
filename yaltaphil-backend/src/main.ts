import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
  app.useBodyParser('urlencoded', { extended: false })
  const port = process.env.PORT ?? 8080
  await app.listen(port)
  console.log(`listening at http://localhost:${port}`)
}

bootstrap()
