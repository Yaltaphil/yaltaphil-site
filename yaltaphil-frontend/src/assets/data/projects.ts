import type IProject from '@/models/IProject'

export const projects: IProject[] = [
  {
    title: 'DOIT gaming portal',
    description: 'Gaming portal prototype project with custom design features.',
    picture: '/img/portfolio/doit1.jpg',
    link: 'https://doit.yaltaphil.ru',
    tags: ['Nuxt', 'Vue'],
    year: 2021,
  },
  {
    title: 'Kino-CMS',
    description: 'Cinema site and admin panel with Google Firebase backend.',
    picture: '/img/portfolio/kinocms.jpg',
    link: 'https://kinocms.yaltaphil.ru',
    tags: ['Vue 2', 'Firebase', 'Bootstrap'],
    year: 2021,
  },
  {
    title: 'Big Theater landing',
    description: 'Landing page for a big theater. Animated with pure SCSS.',
    picture: '/img/portfolio/big-theater.gif',
    link: 'https://yaltaphil.github.io/big-theater/',
    tags: ['SCSS', 'HTML'],
    year: 2020,
  },
  {
    title: 'Porten landing',
    description: 'Landing page for luxury watches shop.',
    picture: '/img/portfolio/porten.jpg',
    link: 'https://yaltaphil.github.io/porten/',
    tags: ['HTML', 'CSS', 'JS'],
    year: 2020,
  },
  {
    title: 'KPK Status',
    description: 'Site for a credit union built with Vue 2 and Vuetify.',
    picture: '/img/portfolio/kpk.jpg',
    link: 'https://kpk-status.yaltaphil.ru',
    tags: ['Vue 2', 'Vuetify'],
    year: 2021,
  },
  {
    title: 'TODO application',
    description: 'Simple todo list app with localStorage persistence.',
    picture: '/img/portfolio/todo.jpg',
    link: 'https://todo.yaltaphil.ru',
    tags: ['Vue', 'LocalStorage'],
    year: 2022,
  },
]
