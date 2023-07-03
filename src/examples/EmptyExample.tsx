import { Page } from '../components/ui/Page.tsx'

/**
 * Example that is shown when nothing is selected.
 */
export function EmptyExample() {
  return (
    <Page className="h-full">
      <div className="flex h-full items-center justify-center">
        Choose an example
      </div>
    </Page>
  )
}
