export interface ICertificate {
  title: string
  issuer: string
  year: number
  thumb: string
  full: string
  alt: string
}

const src = (name: string) => ({
  thumb: `/img/certificates/${name}-thumb.webp`,
  full: `/img/certificates/${name}.webp`,
})

export const certificates: ICertificate[] = [
  {
    title: 'JavaScript from Zero to Result',
    issuer: 'Udemy',
    year: 2020,
    alt: 'Udemy certificate — JavaScript from zero to result, 2020',
    ...src('udemy-javascript-2020'),
  },
  {
    title: 'AWSome Day Online Conference',
    issuer: 'AWS',
    year: 2021,
    alt: 'AWS AWSome Day Online Conference certificate, 2021',
    ...src('aws-awesome-day-2021'),
  },
  {
    title: 'Cloud Practitioner Essentials Day',
    issuer: 'AWS',
    year: 2021,
    alt: 'AWS Cloud Practitioner Essentials Day certificate, 2021',
    ...src('aws-cloud-practitioner-2021'),
  },
  {
    title: 'AWS Innovate Online Conference',
    issuer: 'AWS',
    year: 2021,
    alt: 'AWS Innovate Online Conference certificate, 2021',
    ...src('aws-innovate-2021'),
  },
  {
    title: 'Node.js with NestJS',
    issuer: 'JavaScript.ru',
    year: 2025,
    alt: 'JavaScript.ru certificate — Node.js with NestJS, 2025',
    ...src('javascriptru-nodejs-nestjs-2025'),
  },
]
