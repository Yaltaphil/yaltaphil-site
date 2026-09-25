export type TechCategory = 'Frontend' | 'Backend' | 'Tools' | 'Cloud & AI'

export interface ITechnology {
  title: string
  logo: string
  category: TechCategory
  /** Single-colour black artwork (Simple Icons glyphs). Inverted in dark mode, otherwise
   *  it renders at 1.43:1 against the tile and disappears. Multi-colour logos are exempt:
   *  they carry their own light values. */
  monochrome?: boolean
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
  { title: 'NestJS',       logo: '/img/icons/nestjs.svg',      category: 'Backend',  monochrome: true },
  { title: 'Python',       logo: '/img/icons/python.svg',      category: 'Backend'  },
  { title: 'Git / GitHub', logo: '/img/icons/github.svg',      category: 'Tools',    monochrome: true },
  { title: 'VS Code',      logo: '/img/icons/vscode.svg',      category: 'Tools'    },
  { title: 'Vite',         logo: '/img/icons/vitejs.svg',      category: 'Tools'    },
  { title: 'Webpack',      logo: '/img/icons/webpack.svg',     category: 'Tools'    },
  { title: 'Jest',         logo: '/img/icons/jest.svg',        category: 'Tools'    },
  { title: 'Storybook',    logo: '/img/icons/storybook.svg',   category: 'Tools'    },
  { title: 'Claude AI',    logo: '/img/icons/anthropic.svg',   category: 'Cloud & AI', monochrome: true },
  { title: 'Qwen AI',      logo: '/img/icons/qwen.svg',        category: 'Cloud & AI', monochrome: true },
]

export const CATEGORY_ORDER: TechCategory[] = ['Frontend', 'Backend', 'Tools', 'Cloud & AI']
