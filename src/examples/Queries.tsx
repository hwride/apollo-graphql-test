import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
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
  const { loading, error, data } = useQuery(GET_LOCATION, {
    variables: { locationId: locationId },
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
          value={locationId}
          onOptionChange={setLocationId}
        >
          <option value="loc-1">loc-1</option>
          <option value="loc-2">loc-2</option>
          <option value="loc-3">loc-3</option>
          <option value="loc-4">loc-4</option>
          <option value="loc-5">loc-5</option>
        </LabelledSelect>
      </ControlGrid>
      {resultContent}
    </Page>
  )
}
