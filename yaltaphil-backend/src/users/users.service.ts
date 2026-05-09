import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async addMany(count: number): Promise<void> {
    const docs = Array.from({ length: count }, (_, i) => ({
      name: `new user - ${i}`,
      role: 'new player',
    }))
    await this.userModel.insertMany(docs)
  }

  async findByName(name: string): Promise<User[]> {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return this.userModel.find({ name: new RegExp(escaped, 'i') }).lean()
  }
}
