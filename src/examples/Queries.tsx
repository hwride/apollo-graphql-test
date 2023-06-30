import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
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
import { Page } from '../components/Page.tsx'
import { PageParagraph } from '../components/PageParagraph.tsx'

const GET_LOCATION = gql`
  query GetLocation($locationId: ID!) {
    location(id: $locationId) {
      id
      name
      description
      photo
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
  const client = new ApolloClient({
    uri: 'https://flyby-router-demo.herokuapp.com/',
    cache: new InMemoryCache(),
  })
  return (
    <ApolloProvider client={client}>
      <QueriesInner />
    </ApolloProvider>
  )
}

function QueriesInner() {
  const [locationId, setLocationId] = useState('loc-1')
  const [pollInterval, setPollInterval] = useState(0)
  const [fetchPolicy, setFetchPolicy] = useState('cache-first')
  const [nextFetchPolicy, setNextFetchPolicy] = useState('cache-first')
  const [notifyOnNetworkStatusChange, setNotifyOnNetworkStatusChange] =
    useState(true)
  const { loading, error, data, networkStatus, refetch } = useQuery(
    GET_LOCATION,
    {
      pollInterval,
      notifyOnNetworkStatusChange,
      fetchPolicy: fetchPolicy as WatchQueryFetchPolicy, // Used for first execution
      nextFetchPolicy: nextFetchPolicy as WatchQueryFetchPolicy, // Used for subsequent executions
      variables: { locationId },
    }
  )

  const networkStatusName = NetworkStatus[networkStatus]
  console.log(
    `loading: ${loading}, networkStatus: ${networkStatusName} (${networkStatus}), data: %o, error: %o`,
    data,
    error
  )

  let dataContent = data ? (
    <div key={data.location.id}>
      <h3>{data.location.name}</h3>
      <img
        width="400"
        height="250"
        alt="location-reference"
        src={data.location.photo}
      />
      <br />
      <b>About this location:</b>
      <p>{data.location.description}</p>
      <br />
    </div>
  ) : (
    data
  )

  return (
    <Page title="Queries">
      <Docs />
      <ControlGrid>
        <LabelledSelect
          label="Location ID"
          selectClassName="font-mono"
          value={locationId}
          onOptionChange={setLocationId}
        >
          <option value="loc-1">loc-1</option>
          <option value="loc-2">loc-2</option>
          <option value="loc-3">loc-3</option>
          <option value="loc-4">loc-4</option>
          <option value="loc-5">loc-5</option>
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
      <dl className="mx-auto my-2 grid w-[300px] grid-cols-2">
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
      </dl>
      {dataContent}
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
        When <code>notifyOnNetworkStatusChange</code> is false the component
        will not re-render when fetching with an update <code>loading</code> or{' '}
        <code>networkStatus</code> attribute for either polling or refetch.
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
