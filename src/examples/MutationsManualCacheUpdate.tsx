import { Page } from '../components/Page.tsx'
import { PageParagraph } from '../components/PageParagraph.tsx'

export function MutationsManualCacheUpdate() {
  return (
    <Page title="Mutations - manual cache update">
      <Docs />
    </Page>
  )
}

function Docs() {
  return (
    <>
      <PageParagraph>Manual cache update</PageParagraph>
    </>
  )
}
