import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useQuery,
} from '@apollo/client'

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
  const { loading, error, data } = useQuery(GET_LOCATION, {
    variables: { locationId: 'loc-1' },
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

  return <>{resultContent}</>
}
