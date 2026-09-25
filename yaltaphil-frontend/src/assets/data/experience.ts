export interface IExperience {
  company: string
  role: string
  location: string
  start: string
  end: string
  duration: string
  stack?: string[]
  bullets?: string[]
}

export interface IEarlierRole {
  field: string
  role: string
  location: string
  period: string
}

export interface IEducation {
  school: string
  faculty: string
  degree: string
  location: string
  period: string
}

/** Frontend roles only — the pre-2021 career is a single compact line below the timeline. */
export const experience: IExperience[] = [
  {
    company: 'Matreshka TV',
    role: 'Frontend Developer',
    location: 'Stavropol',
    start: 'Apr 2022',
    end: 'Jun 2026',
    duration: '4 yrs 3 mos',
    stack: ['Nuxt', 'Vue', 'SCSS'],
    bullets: [
      'Frontend of a Russian video platform — a home for video creators and their communities.',
    ],
  },
  {
    company: 'Avada Media',
    role: 'Frontend Developer',
    location: 'Odesa',
    start: 'May 2021',
    end: 'Mar 2022',
    duration: '11 mos',
    stack: ['Vue', 'Nuxt', 'JavaScript', 'SCSS'],
    bullets: [
      'Joined as an intern, then moved into building websites and web applications on Vue and Nuxt.',
    ],
  },
]

export const earlierRole: IEarlierRole = {
  field: 'Financial sector',
  role: 'Economist',
  location: 'Yalta',
  period: '2000 — 2021',
}

export const education: IEducation = {
  school: 'Sevastopol State University',
  faculty: 'Institute of Economics and Management',
  degree: 'Enterprise Economics',
  location: 'Sevastopol',
  period: '1994 — 1999',
}
