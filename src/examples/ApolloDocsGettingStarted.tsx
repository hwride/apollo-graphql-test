import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useQuery,
} from '@apollo/client'
import { Link } from '../components/Link.tsx'
import { Page } from '../components/Page.tsx'
import { PageParagraph } from '../components/PageParagraph.tsx'

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

export function ApolloDocsGettingStarted() {
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

  let content
  if (loading) content = <p>Loading...</p>
  else if (error) content = <p>Error : {error.message}</p>
  else
    content = data.locations.map(({ id, name, description, photo }: any) => (
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
    ))
  return (
    <Page title="Apollo getting started example">
      <PageParagraph>
        This is the code for the{' '}
        <Link
          href="https://www.apollographql.com/docs/react/get-started"
          target="_blank"
        >
          Apollo client getting started example
        </Link>
        .
      </PageParagraph>
      {content}
    </Page>
  )
}
