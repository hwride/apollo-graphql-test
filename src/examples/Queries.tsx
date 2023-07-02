import {
  NetworkStatus,
  WatchQueryFetchPolicy,
  gql,
  useQuery,
} from '@apollo/client'
import { useState } from 'react'
import { BorderButton } from '../components/Button.tsx'
import { ControlGrid } from '../components/ControlGrid.tsx'
import {
  BoolLabelledSelect,
  LabelledSelect,
} from '../components/LabelledSelect.tsx'
import { Link } from '../components/Link.tsx'
import { Page } from '../components/Page.tsx'
import { PageParagraph } from '../components/PageParagraph.tsx'

const GET_BOOK = gql`
  query GetBook($bookId: ID!) {
    book(id: $bookId) {
      id
      title
    }
  }
`

const fetchPolicies = (
  <>
    <option value="cache-first">cache-first</option>
    <option value="cache-only">cache-only</option>
    <option value="cache-and-network">cache-and-network</option>
    <option value="network-only">network-only</option>
    <option value="no-cache">no-cache</option>
    <option value="standby">standby</option>
  </>
)

export function Queries() {
  const [bookId, setbookId] = useState('1')
  const [pollInterval, setPollInterval] = useState(0)
  const [fetchPolicy, setFetchPolicy] = useState('cache-first')
  const [nextFetchPolicy, setNextFetchPolicy] = useState('cache-first')
  const [notifyOnNetworkStatusChange, setNotifyOnNetworkStatusChange] =
    useState(true)
  const { loading, error, data, networkStatus, refetch } = useQuery(GET_BOOK, {
    pollInterval,
    notifyOnNetworkStatusChange,
    fetchPolicy: fetchPolicy as WatchQueryFetchPolicy, // Used for first execution
    nextFetchPolicy: nextFetchPolicy as WatchQueryFetchPolicy, // Used for subsequent executions
    variables: { bookId },
  })

  console.group('Queries render')
  const networkStatusName = NetworkStatus[networkStatus]
  console.log(
    `bookId: ${bookId}, pollInterval: ${pollInterval}, fetchPolicy: ${fetchPolicy}` +
      `, nextFetchPolicy: ${nextFetchPolicy}, notifyOnNetworkStatusChange: ${notifyOnNetworkStatusChange}`
  )
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
        <LabelledSelect
          label="Book ID"
          selectClassName="font-mono"
          value={bookId}
          onOptionChange={setbookId}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5 (does not exist)</option>
        </LabelledSelect>
        <LabelledSelect
          label={
            <>
              <code>pollInterval</code> (ms)
            </>
          }
          selectClassName="font-mono"
          value={String(pollInterval)}
          onOptionChange={(newPollStr) => setPollInterval(Number(newPollStr))}
        >
          <option value="0">0</option>
          <option value="500">500</option>
        </LabelledSelect>
        <BoolLabelledSelect
          label={<code>notifyOnNetworkStatusChange</code>}
          value={notifyOnNetworkStatusChange}
          onOptionChange={setNotifyOnNetworkStatusChange}
        />
        <LabelledSelect
          label={<code>fetchPolicy</code>}
          selectClassName="font-mono"
          value={fetchPolicy}
          onOptionChange={setFetchPolicy}
        >
          {fetchPolicies}
        </LabelledSelect>
        <LabelledSelect
          label={<code>nextFetchPolicy</code>}
          selectClassName="font-mono"
          value={nextFetchPolicy}
          onOptionChange={setNextFetchPolicy}
        >
          {fetchPolicies}
        </LabelledSelect>
        <BorderButton
          className="col-span-2 my-2 justify-self-center"
          onClick={() => refetch()}
        >
          <code>refetch()</code>
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
            <code>{`{ title: ${data.book.title} }`}</code>
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
        This is a test of different Apollo Client query options.
      </PageParagraph>
      <PageParagraph>
        When{' '}
        <Link
          href="https://www.apollographql.com/docs/react/data/queries#inspecting-loading-states"
          target="_blank"
        >
          <code>notifyOnNetworkStatusChange</code>
        </Link>{' '}
        is false the component will not re-render when fetching with an update{' '}
        <code>loading</code> or <code>networkStatus</code> attribute for either
        polling or refetch.
      </PageParagraph>
      <PageParagraph>
        Note when <code>notifyOnNetworkStatusChange</code> is true and the
        component re-renders while data is being fetched, the old data remains
        available in <code>data</code>.
      </PageParagraph>
      <PageParagraph>
        But also notice that regardless of the value of{' '}
        <code>notifyOnNetworkStatusChange</code> the component will re-render
        and <code>loading</code> will change when you submit a new ID. This
        seems to suggest the disabling of re-renders by default for subsequent
        fetches only applies to objects already requested.
      </PageParagraph>
    </>
  )
}
