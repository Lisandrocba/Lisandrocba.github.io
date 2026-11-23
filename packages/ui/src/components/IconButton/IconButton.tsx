import type { ComponentPropsWithoutRef } from 'react'
import type { IconName } from '../../icons/index.ts'
import { Icon } from '../Icon/Icon.tsx'
import styles from './IconButton.module.css'

export type IconButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'aria-label'> & {
  /** Icono de Figma, único contenido visible del botón. */
  icon: IconName
  /** Nombre accesible (`aria-label`). Obligatorio porque el botón no tiene texto. */
  label: string
  /**
   * Estilo visual. `primary`: relleno claro ("Enviar consulta"). `secondary`: contorno ("Cerrar modal").
   * `accent`: relleno de acento ("Chat flotante").
   */
  variant?: 'primary' | 'secondary' | 'accent'
  /** sm = 36 px · md = 40 px · lg = 56 px. */
  size?: 'sm' | 'md' | 'lg'
}

/** Botón circular con un solo icono. Se renderiza como `<button type="button">`. */
export function IconButton({
  icon,
  label,
  variant = 'secondary',
  size = 'md',
  type = 'button',
  className,
  ...rest
}: IconButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ')

  return (
    <button {...rest} type={type} aria-label={label} className={classes}>
      <Icon name={icon} />
    </button>
  )
}
