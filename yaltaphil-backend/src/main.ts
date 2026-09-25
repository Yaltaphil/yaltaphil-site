import 'reflect-metadata'
import { createServer } from 'node:net'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'

const DEFAULT_PORT = 8080

const MONGO_HINT = [
  'Create yaltaphil-backend/.env with one of:',
  '  MONGO_URI=mongodb://127.0.0.1:27017/yaltaphil',
  '  MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/yaltaphil',
  '',
  'The database name comes from the URI, there is no fallback in the code.',
  'The file is read from the current working directory, so start from yaltaphil-backend/.',
].join('\n')

function validateMongoUri(): string | null {
  const uri = process.env.MONGO_URI
  if (!uri) {
    return `MONGO_URI is not set, so the backend has no database to talk to.\n\n${MONGO_HINT}`
  }
  if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
    return [
      'MONGO_URI is set, but it is not a MongoDB connection string.',
      'It has to start with mongodb:// or mongodb+srv:// (the value is not printed on purpose).',
      '',
      MONGO_HINT,
    ].join('\n')
  }
  return null
}

function parsePort(): number | null {
  const raw = process.env.PORT
  if (!raw) return DEFAULT_PORT
  const port = Number(raw)
  if (!Number.isInteger(port) || port < 1 || port > 65535) return null
  return port
}

function portAdvice(port: number): string {
  const alternative = port === DEFAULT_PORT ? DEFAULT_PORT + 1 : DEFAULT_PORT
  return [
    `Set a free port in yaltaphil-backend/.env, for example PORT=${alternative}.`,
    '',
    `To see what holds ${port} on Windows: netstat -aon | findstr :${port}`,
    'Check the process behind that PID before stopping it - it is usually another dev server.',
  ].join('\n')
}

function probePort(port: number): Promise<string | null> {
  return new Promise((resolve) => {
    const probe = createServer()
    probe.once('error', (err: NodeJS.ErrnoException) => {
      resolve(
        err.code === 'EADDRINUSE'
          ? `Port ${port} is already in use, so the backend has nowhere to listen.`
          : `Port ${port} could not be checked (${err.code ?? err.message}).`,
      )
    })
    probe.once('listening', () => probe.close(() => resolve(null)))
    probe.listen(port)
  })
}

function refuse(message: string): void {
  console.error(`\n[warning] ${message}\n`)
  process.exitCode = 1
}

async function bootstrap() {
  const mongoProblem = validateMongoUri()
  if (mongoProblem) {
    refuse(mongoProblem)
    return
  }

  const port = parsePort()
  if (port === null) {
    refuse(
      [
        `PORT="${process.env.PORT}" is not a TCP port - use a whole number from 1 to 65535.`,
        '',
        `Remove the line from yaltaphil-backend/.env to fall back to ${DEFAULT_PORT}.`,
      ].join('\n'),
    )
    return
  }

  const portProblem = await probePort(port)
  if (portProblem) {
    refuse(`${portProblem}\n\n${portAdvice(port)}`)
    return
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
  app.useBodyParser('urlencoded', { extended: false })
  await app.listen(port)
  console.log(`listening at http://localhost:${port}`)
}

bootstrap()
