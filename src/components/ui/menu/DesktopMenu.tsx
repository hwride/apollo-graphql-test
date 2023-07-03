import { ConfigEntry } from '../../../exampleConfig.ts'
import { MenuContent } from './MenuContent.tsx'

export function DesktopMenu({
  selectedExampleId,
  onMenuItemClick,
}: {
  selectedExampleId?: string
  onMenuItemClick: (entry?: ConfigEntry) => void
}) {
  return (
    <div className="hidden border-r border-gray-800 p-4 sm:block">
      <MenuContent
        selectedExampleId={selectedExampleId}
        onMenuItemClick={onMenuItemClick}
      />
    </div>
  )
}
