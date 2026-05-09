import { Body, Controller, Get, Header, Post } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  getRoot(): string {
    return `
      <h1>Server is running</h1>
      <form action="/result" method="POST">
        <input type="text" name="name" placeholder="Search user..." />
        <button>Search</button>
      </form>
      <p><a href="/add500">Add 500 test users</a></p>
    `
  }

  @Get('add500')
  @Header('Content-Type', 'text/html')
  async add500(): Promise<string> {
    await this.usersService.addMany(500)
    return '<h1>500 users added</h1>'
  }

  @Post('result')
  @Header('Content-Type', 'text/html')
  async result(@Body() body: { name?: string }): Promise<string> {
    const name = body.name ?? ''
    const data = await this.usersService.findByName(name)
    const list = data.map(u => `<li>${u.name} — ${u.role}</li>`).join('')
    return `<h1>${data.length} results for "${name}"</h1><ol>${list}</ol>`
  }
}
