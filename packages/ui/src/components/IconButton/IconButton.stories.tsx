import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { iconNames } from '../../icons/index.ts'
import { IconButton } from './IconButton.tsx'

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component:
          'Botón circular con un solo icono ("Cerrar modal", "Enviar consulta" y "Chat flotante" en Figma). ' +
          '`label` es obligatorio porque es el único nombre accesible. El estado deshabilitado sale de "Envío deshabilitado"; ' +
          'hover y active **no están definidos en Figma**.',
      },
    },
  },
  args: {
    icon: 'x',
    label: 'Cerrar',
    variant: 'secondary',
    size: 'md',
    onClick: fn(),
  },
  argTypes: {
    icon: { control: 'select', options: iconNames },
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'accent'], table: { defaultValue: { summary: 'secondary' } } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], table: { defaultValue: { summary: 'md' } } },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

/** Figma: "Cerrar modal" (36 px). */
export const Secondary: Story = {
  args: { icon: 'x', label: 'Cerrar', size: 'sm' },
}

/** Figma: "Enviar consulta" (40 px). */
export const Primary: Story = {
  args: { icon: 'arrow-up-large', label: 'Enviar', variant: 'primary' },
}

/** Figma: "Chat flotante" (56 px). */
export const Accent: Story = {
  args: { icon: 'message-circle', label: 'Abrir chat', variant: 'accent', size: 'lg' },
}

/** Figma: "Envío deshabilitado". */
export const Disabled: Story = {
  args: { icon: 'lock-keyhole', label: 'Envío deshabilitado', variant: 'primary', disabled: true },
}

/** `aria-disabled`: mismo aspecto que deshabilitado, pero el botón conserva el foco (p. ej. mientras se espera una respuesta). */
export const AriaDisabled: Story = {
  args: { icon: 'arrow-up-large', label: 'Esperando la respuesta', variant: 'primary', 'aria-disabled': true },
}
