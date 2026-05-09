import { Body, Controller, Delete, Get, Header, HttpCode, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  getRoot(): string {
    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Users</title>
<style>
  body { font-family: sans-serif; padding: 24px; background: #f9fafb; }
  table { border-collapse: collapse; width: 100%; max-width: 600px; margin-top: 16px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
  th, td { border-bottom: 1px solid #e5e7eb; padding: 10px 14px; text-align: left; }
  th { background: #f3f4f6; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; }
  tr:last-child td { border-bottom: none; }
  .actions { display: flex; gap: 8px; margin-bottom: 16px; }
  button { cursor: pointer; border: none; border-radius: 6px; padding: 8px 16px; font-size: 14px; font-weight: 500; transition: opacity .15s; }
  button:hover { opacity: .85; }
  .btn-add  { background: #4f46e5; color: #fff; }
  .btn-clear { background: #ef4444; color: #fff; }
  .btn-del  { background: #fee2e2; color: #b91c1c; padding: 4px 10px; font-size: 12px; }
  .search { display: flex; gap: 8px; margin-bottom: 16px; max-width: 600px; }
  .search input { flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; outline: none; }
  .search input:focus { border-color: #4f46e5; box-shadow: 0 0 0 2px #e0e7ff; }
  .btn-search { background: #0ea5e9; color: #fff; }
  .btn-reset { background: #e5e7eb; color: #374151; }
</style>
</head>
<body>
  <h1 id="title">Users</h1>
  <div class="search">
    <input id="query" type="text" placeholder="Search by name..." onkeydown="if(event.key==='Enter') search()" />
    <button class="btn-search" onclick="search()">Find</button>
    <button class="btn-reset" onclick="reset()">Reset</button>
  </div>
  <div class="actions">
    <button class="btn-add" onclick="addRandom()">+ Add 5 random</button>
    <button class="btn-clear" onclick="clearAll()">🗑 Clear all</button>
  </div>
  <table>
    <thead><tr><th>Name</th><th>Role</th><th></th></tr></thead>
    <tbody id="tbody"></tbody>
  </table>
  <script>
    async function loadUsers(name) {
      const url = name ? '/users?name=' + encodeURIComponent(name) : '/users'
      const users = await fetch(url).then(r => r.json())
      const label = name ? 'Results for "' + name + '": ' + users.length : 'Users (' + users.length + ')'
      document.getElementById('title').textContent = label
      document.getElementById('tbody').innerHTML = users.map(u =>
        '<tr id="row-' + u._id + '">' +
          '<td>' + u.name + '</td>' +
          '<td>' + u.role + '</td>' +
          '<td><button class="btn-del" onclick="deleteUser(\\'' + u._id + '\\')">Delete</button></td>' +
        '</tr>'
      ).join('')
    }

    function search() {
      const q = document.getElementById('query').value.trim()
      if (q) loadUsers(q)
    }

    function reset() {
      document.getElementById('query').value = ''
      loadUsers()
    }

    async function addRandom() {
      await fetch('/add5')
      loadUsers(document.getElementById('query').value.trim() || undefined)
    }

    async function clearAll() {
      await fetch('/clear')
      document.getElementById('query').value = ''
      loadUsers()
    }

    async function deleteUser(id) {
      await fetch('/users/' + id, { method: 'DELETE' })
      document.getElementById('row-' + id).remove()
      const count = document.querySelectorAll('#tbody tr').length
      document.getElementById('title').textContent = 'Users (' + count + ')'
    }

    loadUsers()
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
  async clear() {
    const deleted = await this.usersService.clearAll()
    return { deleted }
  }

  @Get('users')
  async getUsers(@Query('name') name?: string) {
    if (name) return this.usersService.findByName(name)
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
