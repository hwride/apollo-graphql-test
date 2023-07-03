import * as Dialog from '@radix-ui/react-dialog'
import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { X as CloseIcon } from 'react-feather'
import { ConfigEntry } from '../../../exampleConfig.ts'
import { IconButton } from '../IconButton.tsx'
import { MenuContent } from './MenuContent.tsx'
import { useMobileMenu } from './MobileMenuContext.tsx'

export function MobileMenu({
  selectedExampleId,
  onMenuItemClick,
  openButton,
}: {
  selectedExampleId?: string
  onMenuItemClick: (entry?: ConfigEntry) => void
  openButton: ReactNode
}) {
  const { menuVisible, setMenuVisible } = useMobileMenu()

  return (
    <Dialog.Root
      open={menuVisible}
      onOpenChange={(open) => setMenuVisible(open)}
    >
      <Dialog.Trigger asChild>{openButton}</Dialog.Trigger>
      <AnimatePresence>
        {menuVisible && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="sm:no fixed inset-[0] bg-black opacity-40 "
              ></motion.div>
            </Dialog.Overlay>
            <Dialog.Content
              forceMount
              asChild
              className={clsx(
                'fixed z-50',
                'h-full w-[85vw] max-w-md p-4 md:w-full',
                'left-0 top-0',
                'bg-white',
                'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
              )}
            >
              <motion.div
                initial={{ transform: 'translateX(-100%)' }}
                animate={{ transform: 'translateX(0)' }}
                exit={{ transform: 'translateX(-100%)' }}
                transition={{ duration: 0.2 }}
              >
                <MenuContent
                  onMenuItemClick={onMenuItemClick}
                  selectedExampleId={selectedExampleId}
                  closeIconSlot={
                    <Dialog.Close asChild>
                      <IconButton aria-label="Close menu" className="mb-2">
                        <CloseIcon />
                      </IconButton>
                    </Dialog.Close>
                  }
                />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
