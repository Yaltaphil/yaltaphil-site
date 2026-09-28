import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { Message } from './message.schema'
import { MessagesGateway } from './messages.gateway'

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly gateway: MessagesGateway,
  ) {}

  async create(dto: CreateMessageDto): Promise<Message> {
    const created = await this.messageModel.create({ text: dto.text, author: dto.author })
    this.gateway.broadcast('message:new', created)
    return created
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.find().sort({ createdAt: 1 }).lean()
  }

  async findOne(id: string): Promise<Message | null> {
    return this.messageModel.findById(id).lean()
  }

  async update(id: string, dto: UpdateMessageDto): Promise<Message | null> {
    const updated = await this.messageModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .lean()
    if (updated) this.gateway.broadcast('message:updated', updated)
    return updated
  }

  async remove(id: string): Promise<boolean> {
    const deleted = await this.messageModel.findByIdAndDelete(id)
    if (!deleted) return false
    this.gateway.broadcast('message:deleted', { id })
    return true
  }
}
