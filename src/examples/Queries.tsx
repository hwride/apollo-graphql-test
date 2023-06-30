import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  WatchQueryFetchPolicy,
  gql,
  useQuery,
} from '@apollo/client'
import { useState } from 'react'
import { ControlGrid } from '../components/ControlGrid.tsx'
import { LabelledSelect } from '../components/LabelledSelect.tsx'
import { Page } from '../components/Page.tsx'

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
  const [fetchPolicy, setFetchPolicy] = useState('cache-first')
  const [nextFetchPolicy, setNextFetchPolicy] = useState('cache-first')
  const { loading, error, data } = useQuery(GET_LOCATION, {
    fetchPolicy: fetchPolicy as WatchQueryFetchPolicy, // Used for first execution
    nextFetchPolicy: nextFetchPolicy as WatchQueryFetchPolicy, // Used for subsequent executions
    variables: { locationId },
  })

  let resultContent
  if (loading) resultContent = <p>Loading...</p>
  else if (error) resultContent = <p>Error : {error.message}</p>
  else {
    const { id, name, description, photo } = data.location
    resultContent = (
      <div key={id}>
        <h3>{name}</h3>
        <img
          width="400"
          height="250"
          alt="location-reference"
          src={`${photo}`}
        />
        <br />
        <b>About this location:</b>
        <p>{description}</p>
        <br />
      </div>
    )
  }

  return (
    <Page title="Queries">
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
      </ControlGrid>
      {resultContent}
    </Page>
  )
}
