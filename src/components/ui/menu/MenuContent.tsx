import { clsx } from 'clsx'
import { HTMLMotionProps, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Menu as MenuIcon } from 'react-feather'
import { ConfigEntry, componentConfig } from '../../../exampleConfig.ts'
import { Button } from '../Button.tsx'

export { MenuIcon }

export function MenuContent({
  onMenuItemClick,
  selectedExampleId,
  closeIconSlot,
}: {
  onMenuItemClick: (entry?: ConfigEntry) => void
  selectedExampleId?: string
  closeIconSlot?: ReactNode
}) {
  return (
    <nav>
      <div className="flex items-start justify-between">{closeIconSlot}</div>
      <ol className="m-0 flex-1 list-none">
        {componentConfig.map((entry) => {
          const isCurrentEg = selectedExampleId === entry.id
          return (
            <motion.li
              key={entry.id}
              className={clsx('relative', isCurrentEg ? 'bg-blue-50' : '')}
              aria-current={isCurrentEg ? 'page' : undefined}
              whileHover={{ scale: 1.04, transition: { duration: 0.05 } }}
              whileTap={{ scale: 0.9 }}
            >
              <ListButton
                className="w-full"
                onClick={() => onMenuItemClick(entry)}
              >
                {entry.label}
              </ListButton>
            </motion.li>
          )
        })}
      </ol>
    </nav>
  )
}

function ListButton({
  children,
  className,
  ...rest
}: HTMLMotionProps<'button'> & { children: ReactNode }) {
  return (
    <Button className={className} {...rest}>
      {children}
    </Button>
  )
}
