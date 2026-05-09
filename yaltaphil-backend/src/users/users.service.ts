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

  async addOne(name: string, role: string): Promise<User> {
    return this.userModel.create({ name, role })
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean()
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).lean()
  }

  async updateOne(id: string, patch: { name?: string; role?: string }): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, patch, { new: true }).lean()
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id)
    return result !== null
  }

  async findByName(name: string): Promise<User[]> {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return this.userModel.find({ name: new RegExp(escaped, 'i') }).lean()
  }
}
