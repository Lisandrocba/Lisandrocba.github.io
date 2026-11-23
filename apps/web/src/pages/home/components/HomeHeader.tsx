import { Button, IconButton } from '@portfolio/ui'
import { navLinks, profile, sectionIds } from '../data/profile.ts'
import styles from './HomeHeader.module.css'

type HomeHeaderProps = {
  /** `id` del drawer de chat que controla el botón. */
  chatId: string
  isChatOpen: boolean
  onOpenChat: () => void
}

/** Figma: "Inicio › Navegación" (desktop `5:2210`) y "Navegación" + "Enlaces" (mobile). */
export function HomeHeader({ chatId, isChatOpen, onOpenChat }: HomeHeaderProps) {
  return (
    <header id={sectionIds.top} className={styles.header}>
      <div className={styles.bar}>
        <a href={`#${sectionIds.top}`} className={styles.identity}>
          <span className={styles.symbol} aria-hidden="true">{'{ / }'}</span>
          <span className={styles.name}>{profile.name}</span>
        </a>
        <nav className={styles.nav} aria-label="Secciones">
          <ul className={styles.links}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <Button href={`#${sectionIds.contact}`} icon="arrow-up-right" className={styles.cta}>
          Hablemos
        </Button>
        {/* Figma: "Chat flotante" — acento con el drawer cerrado y contorno con el drawer abierto (`69:679`). */}
        <IconButton
          icon="message-circle"
          label="Abrir chat sobre mi perfil"
          variant={isChatOpen ? 'secondary' : 'accent'}
          size="lg"
          className={styles.chat}
          aria-haspopup="dialog"
          aria-expanded={isChatOpen}
          aria-controls={chatId}
          onClick={onOpenChat}
        />
      </div>
    </header>
  )
}
