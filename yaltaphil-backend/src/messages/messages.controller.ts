import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post } from '@nestjs/common'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { MessagesService } from './messages.service'

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() body: CreateMessageDto) {
    return this.messagesService.create(body)
  }

  @Get()
  findAll() {
    return this.messagesService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const message = await this.messagesService.findOne(id)
    if (!message) throw new NotFoundException()
    return message
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateMessageDto) {
    const message = await this.messagesService.update(id, body)
    if (!message) throw new NotFoundException()
    return message
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const deleted = await this.messagesService.remove(id)
    if (!deleted) throw new NotFoundException()
  }
}
