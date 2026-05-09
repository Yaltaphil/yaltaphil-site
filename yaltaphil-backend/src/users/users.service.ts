import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { HydratedDocument, Model } from 'mongoose'
import { User } from './user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private static readonly NAMES = [
    'Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Hank',
    'Ivy', 'Jack', 'Karen', 'Leo', 'Mia', 'Nate', 'Olivia', 'Pete',
  ]

  private static readonly ROLES = [
    'frontend dev', 'backend dev', 'designer', 'QA engineer',
    'devops', 'product manager', 'data analyst', 'tech lead',
  ]

  private randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  async addRandom(count: number): Promise<void> {
    const docs = Array.from({ length: count }, () => ({
      name: `${this.randomItem(UsersService.NAMES)} ${this.randomItem(UsersService.NAMES)}`,
      role: this.randomItem(UsersService.ROLES),
    }))
    await this.userModel.insertMany(docs)
  }

  async clearAll(): Promise<number> {
    const result = await this.userModel.deleteMany({})
    return result.deletedCount
  }

  async addOne(name: string, role: string): Promise<User> {
    return this.userModel.create({ name, role })
  }

  async findAll(): Promise<HydratedDocument<User>[]> {
    return this.userModel.find().exec()
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
