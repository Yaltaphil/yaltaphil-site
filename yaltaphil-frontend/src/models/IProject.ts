export default interface IProject {
  title: string
  description: string
  picture: string
  link: string
  tags?: string[]
  year?: number
  role?: string  // e.g. 'Frontend Dev', 'Team Lead' — omit for solo projects
}
