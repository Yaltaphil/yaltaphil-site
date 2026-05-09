import { Body, Controller, Delete, Get, Header, HttpCode, NotFoundException, Param, Patch, Post } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  async getRoot(): Promise<string> {
    const users = await this.usersService.findAll()
    const rows = users.map(u => `
      <tr id="row-${u._id}">
        <td>${u.name}</td>
        <td>${u.role}</td>
        <td>
          <button onclick="deleteUser('${u._id}')">Delete</button>
        </td>
      </tr>`).join('')

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Users</title>
<style>
  body { font-family: sans-serif; padding: 24px; }
  table { border-collapse: collapse; width: 100%; max-width: 600px; margin-top: 16px; }
  th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
  th { background: #f5f5f5; }
  button { cursor: pointer; }
  .actions { display: flex; gap: 8px; margin-bottom: 16px; }
</style>
</head>
<body>
  <h1>Users (${users.length})</h1>
  <div class="actions">
    <a href="/add5"><button>+ Add 5 random</button></a>
    <a href="/clear"><button>🗑 Clear all</button></a>
  </div>
  <table>
    <thead><tr><th>Name</th><th>Role</th><th></th></tr></thead>
    <tbody id="tbody">${rows}</tbody>
  </table>
  <script>
    async function deleteUser(id) {
      await fetch('/users/' + id, { method: 'DELETE' })
      document.getElementById('row-' + id).remove()
      const h = document.querySelector('h1')
      h.textContent = 'Users (' + document.querySelectorAll('#tbody tr').length + ')'
    }
  </script>
</body>
</html>`
  }

  @Get('add5')
  async add5() {
    await this.usersService.addRandom(5)
    return { added: 5 }
  }

  @Get('clear')
  @Header('Content-Type', 'text/html')
  async clear(): Promise<string> {
    const count = await this.usersService.clearAll()
    return `<h1>Deleted ${count} users. <a href="/">Back</a></h1>`
  }

  @Get('users')
  async getUsers() {
    return this.usersService.findAll()
  }

  @Post('users')
  @HttpCode(201)
  async createUser(@Body() body: { name: string; role: string }) {
    return this.usersService.addOne(body.name, body.role)
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findById(id)
    if (!user) throw new NotFoundException()
    return user
  }

  @Patch('users/:id')
  async updateUser(@Param('id') id: string, @Body() body: { name?: string; role?: string }) {
    const user = await this.usersService.updateOne(id, body)
    if (!user) throw new NotFoundException()
    return user
  }

  @Delete('users/:id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const deleted = await this.usersService.deleteOne(id)
    if (!deleted) throw new NotFoundException()
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
