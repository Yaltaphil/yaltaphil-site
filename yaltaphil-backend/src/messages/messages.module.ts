import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Message, MessageSchema } from './message.schema'
import { MessagesController } from './messages.controller'
import { MessagesGateway } from './messages.gateway'
import { MessagesService } from './messages.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
