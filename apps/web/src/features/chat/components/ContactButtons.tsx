import { Button } from '@portfolio/ui'
import type { Contact } from '@portfolio/api'
import styles from './ContactButtons.module.css'

type ContactButtonsProps = {
  contact: Contact
}

/** Figma: "Canales de contacto" (`69:809`) — LinkedIn y Email. También es el CTA mientras no exista `POST /leads`. */
export function ContactButtons({ contact }: ContactButtonsProps) {
  return (
    <div className={styles.channels}>
      <Button
        href={contact.linkedinUrl}
        target="_blank"
        rel="noreferrer"
        variant="primary"
        icon="linkedin"
        className={`${styles.channel} ${styles.linkedin}`}
      >
        LinkedIn
      </Button>
      <Button href={`mailto:${contact.email}`} icon="mail" className={styles.channel}>
        Email
      </Button>
    </div>
  )
}
