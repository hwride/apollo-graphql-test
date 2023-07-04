import { NetworkStatus, gql, useQuery } from '@apollo/client'
import { DelayServerSelect } from '../components/DelayServerSelect.tsx'
import { BorderButton } from '../components/ui/Button.tsx'
import { CenteredCodeSample } from '../components/ui/CodeSample.tsx'
import { ControlGrid } from '../components/ui/ControlGrid.tsx'
import { Page } from '../components/ui/Page.tsx'
import { PageParagraph } from '../components/ui/PageParagraph.tsx'

export const GET_UNIQUE_NAME = gql`
  query GetUniqueName {
    uniqueName {
      name
    }
  }
`

export function QueriesMultipleQuickly() {
  const { loading, error, data, networkStatus, refetch } = useQuery(
    GET_UNIQUE_NAME,
    {
      notifyOnNetworkStatusChange: true,
    }
  )

  const testQueries = async () => {
    refetch()
    refetch()
    setTimeout(() => {
      refetch()
    }, 100)
  }

  console.group('Queries render')
  const networkStatusName = NetworkStatus[networkStatus]
  console.log(
    `loading: ${loading}, networkStatus: ${networkStatusName} (${networkStatus}), data: %o, error: %o`,
    data,
    error
  )
  console.groupEnd()

  return (
    <Page title="Queries">
      <Docs />
      <ControlGrid>
        <DelayServerSelect />
        <BorderButton
          className="col-span-2 my-2 justify-self-center"
          onClick={() => testQueries()}
        >
          Make queries
        </BorderButton>
      </ControlGrid>
      <dl className="mx-auto my-2 grid w-[500px] grid-cols-2">
        <dt>
          <code>loading</code>
        </dt>
        <dd>{JSON.stringify(loading)}</dd>
        <dt>
          <code>networkStatus</code>
        </dt>
        <dd>Network {`${networkStatusName} (${networkStatus})`}</dd>
        <dt>
          <code>error</code>
        </dt>
        <dd>{error === undefined ? 'undefined' : error.message}</dd>
        <dt>
          <code>data</code>
        </dt>
        <dd>
          {data === undefined ? (
            'undefined'
          ) : (
            <code>{`{ title: ${data.uniqueName.name} }`}</code>
          )}
        </dd>
      </dl>
    </Page>
  )
}

function Docs() {
  return (
    <>
      <PageParagraph>
        This is a test of how Apollo Client handles multiple query requests made
        quickly
      </PageParagraph>
      <PageParagraph>
        The "Make queries" button executes the following code:
      </PageParagraph>
      <CenteredCodeSample language="jsx">
        {`refetch()
refetch()
setTimeout(() => {
  refetch()
}, 100)`}
      </CenteredCodeSample>
      <PageParagraph>
        I.e. it makes two fetches in quick succession, then another after 100ms.
      </PageParagraph>
      <PageParagraph>
        First set server delay to 1000ms. Then click the make queries button.
        You'll see in the network tab only one request is made to{' '}
        <code>GetUniqueName</code>. This is because Apollo Client will not make
        a second request to a query if another is still pending.
      </PageParagraph>
      <PageParagraph>
        Then set server delay to 0ms and click the make queries button again.
        This time in the network tab you'll see two requests being made to{' '}
        <code>GetUniqueName</code>. The first two calls to <code>refetch</code>
        are made immediately after one another, so you can see those are still
        de-duped. But the second call is after 100ms, and by this time our query
        has already returned, so that second fetch is still made.
      </PageParagraph>
    </>
  )
}
