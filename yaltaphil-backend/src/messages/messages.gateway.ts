import { Logger } from '@nestjs/common'
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import type { WebSocket as WsClient, WebSocketServer as WsServer } from 'ws'
import { WebSocket } from 'ws'

/**
 * Frames are JSON `{ event, data }` — that is the wire format of
 * `@nestjs/platform-ws`, so a plain browser `WebSocket` can read it without any client library.
 */
@WebSocketGateway({ path: '/ws' })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(MessagesGateway.name)

  @WebSocketServer()
  server!: WsServer

  handleConnection(client: WsClient): void {
    client.send(JSON.stringify({ event: 'ready', data: { clients: this.clientCount() } }))
  }

  handleDisconnect(): void {}

  broadcast(event: string, data: unknown): void {
    if (!this.server) return
    const frame = JSON.stringify({ event, data })
    for (const client of this.server.clients) {
      if (client.readyState === WebSocket.OPEN) client.send(frame)
    }
  }

  private clientCount(): number {
    return this.server?.clients.size ?? 0
  }
}
