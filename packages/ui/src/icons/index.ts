// SVG exportados de Figma (página 1), limpiados a currentColor. `size` es el tamaño original en Figma.
import arrowDown from './arrow-down.svg?raw'
import arrowLeft from './arrow-left.svg?raw'
import arrowUp from './arrow-up.svg?raw'
import arrowUpLarge from './arrow-up-large.svg?raw'
import arrowUpRight from './arrow-up-right.svg?raw'
import circleAlert from './circle-alert.svg?raw'
import database from './database.svg?raw'
import download from './download.svg?raw'
import github from './github.svg?raw'
import linkedin from './linkedin.svg?raw'
import lockKeyhole from './lock-keyhole.svg?raw'
import mail from './mail.svg?raw'
import messageCircle from './message-circle.svg?raw'
import panelsTopLeft from './panels-top-left.svg?raw'
import x from './x.svg?raw'

export const icons = {
  'arrow-down': { svg: arrowDown, size: 17 },
  'arrow-left': { svg: arrowLeft, size: 17 },
  'arrow-up': { svg: arrowUp, size: 15 },
  /** Misma flecha que `arrow-up` con trazo 1.5 (Figma: "Enviar consulta" del chat). */
  'arrow-up-large': { svg: arrowUpLarge, size: 18 },
  'arrow-up-right': { svg: arrowUpRight, size: 17 },
  'circle-alert': { svg: circleAlert, size: 20 },
  database: { svg: database, size: 24 },
  download: { svg: download, size: 17 },
  github: { svg: github, size: 17 },
  linkedin: { svg: linkedin, size: 17 },
  'lock-keyhole': { svg: lockKeyhole, size: 18 },
  mail: { svg: mail, size: 17 },
  'message-circle': { svg: messageCircle, size: 20 },
  'panels-top-left': { svg: panelsTopLeft, size: 24 },
  x: { svg: x, size: 18 },
} as const

export type IconName = keyof typeof icons

export const iconNames = Object.keys(icons) as IconName[]
