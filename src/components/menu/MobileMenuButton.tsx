import { clsx } from 'clsx'
import { ConfigEntry } from '../../exampleConfig.ts'
import { colours } from '../../utils/tailwind.ts'
import { MotionIconButton } from '../IconButton.tsx'
import { MenuIcon } from './MenuContent.tsx'
import { MobileMenu } from './MobileMenu.tsx'
import { useMobileMenu } from './MobileMenuContext.tsx'

export function MobileMenuButton({
  onMenuItemClick,
  selectedExampleId,
}: {
  onMenuItemClick: (entry?: ConfigEntry) => void
  selectedExampleId?: string
}) {
  const { menuVisible, setMenuVisible } = useMobileMenu()

  return (
    <MobileMenu
      onMenuItemClick={onMenuItemClick}
      selectedExampleId={selectedExampleId}
      openButton={
        <MotionIconButton
          aria-label="Open menu"
          className={clsx(
            'ml-auto',
            menuVisible
              ? `bg-gray-200 shadow-[0_0_0_1px_${colours.gray300}]`
              : ''
          )}
          onClick={() => setMenuVisible(true)}
          animate={menuVisible ? { rotate: 180 } : undefined}
          transition={{ duration: 0.3 }}
        >
          <MenuIcon />
        </MotionIconButton>
      }
    />
  )
}
