import { useCallback, useState } from 'react'

/** Estado de apertura del drawer de chat. */
export function useChatDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return { isOpen, open, close }
}
