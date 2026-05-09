export type TechCategory = 'Frontend' | 'Backend' | 'Tools' | 'Cloud & AI'

export interface ITechnology {
  title: string
  logo: string
  category: TechCategory
}

export const technologies: ITechnology[] = [
  { title: 'HTML5',        logo: '/img/icons/html5.svg',       category: 'Frontend' },
  { title: 'CSS3',         logo: '/img/icons/css3.svg',        category: 'Frontend' },
  { title: 'JavaScript',   logo: '/img/icons/javascript.svg',  category: 'Frontend' },
  { title: 'TypeScript',   logo: '/img/icons/typescript.svg',  category: 'Frontend' },
  { title: 'Vue',          logo: '/img/icons/vuejs.svg',       category: 'Frontend' },
  { title: 'Nuxt',         logo: '/img/icons/nuxtjs.svg',      category: 'Frontend' },
  { title: 'React',        logo: '/img/icons/react.svg',       category: 'Frontend' },
  { title: 'Sass',         logo: '/img/icons/sass.svg',        category: 'Frontend' },
  { title: 'Bootstrap',    logo: '/img/icons/bootstrap.svg',   category: 'Frontend' },
  { title: 'Vuetify',      logo: '/img/icons/vuetify.svg',     category: 'Frontend' },
  { title: 'Tailwind CSS', logo: '/img/icons/tailwindcss.svg', category: 'Frontend' },
  { title: 'Node.js',      logo: '/img/icons/nodejs.svg',      category: 'Backend'  },
  { title: 'NestJS',       logo: '/img/icons/nestjs.svg',      category: 'Backend'  },
  { title: 'Python',       logo: '/img/icons/python.svg',      category: 'Backend'  },
  { title: 'Git / GitHub', logo: '/img/icons/github.svg',      category: 'Tools'    },
  { title: 'VS Code',      logo: '/img/icons/vscode.svg',      category: 'Tools'    },
  { title: 'Vite',         logo: '/img/icons/vitejs.svg',      category: 'Tools'    },
  { title: 'Claude AI',    logo: '/img/icons/anthropic.svg',   category: 'Cloud & AI' },
]

export const CATEGORY_ORDER: TechCategory[] = ['Frontend', 'Backend', 'Tools', 'Cloud & AI']
