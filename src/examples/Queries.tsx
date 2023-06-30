import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useQuery,
} from '@apollo/client'

const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
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
  const { loading, error, data } = useQuery(GET_LOCATIONS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error : {error.message}</p>

  return data.locations.map(({ id, name, description, photo }: any) => (
    <div key={id}>
      <h3>{name}</h3>
      <img width="400" height="250" alt="location-reference" src={`${photo}`} />
      <br />
      <b>About this location:</b>
      <p>{description}</p>
      <br />
    </div>
  ))
}
