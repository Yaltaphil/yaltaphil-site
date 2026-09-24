export default interface IProject {
  title: string
  description: string
  picture: string
  /** Pre-generated small variant from scripts/optimize-images.mjs; falls back to `picture`. */
  card?: string
  /** 'contain' for artwork that must not be cropped (logos, small sources). */
  imageFit?: 'cover' | 'contain'
  link: string
  tags?: string[]
  year?: number
  role?: string  // e.g. 'Frontend Dev', 'Team Lead' — omit for solo projects
}
