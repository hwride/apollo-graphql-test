import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
  useMutation,
  useQuery,
} from '@apollo/client'
import { BorderButton } from '../components/Button.tsx'
import { Page } from '../components/Page.tsx'

const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
    }
  }
`
const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!) {
    addBook(title: $title, author: $author) {
      success
      code
      book {
        title
        author
      }
    }
  }
`

export function Mutations() {
  const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache(),
  })
  return (
    <ApolloProvider client={client}>
      <MutationsInner />
    </ApolloProvider>
  )
}

function MutationsInner() {
  const { data: booksData, refetch } = useQuery(GET_BOOKS)
  const [addBook, { data, loading, error }] = useMutation(ADD_BOOK)

  console.group('Mutations render')
  console.log(`loading: ${loading}, data: %o, error: %o`, data, error)
  console.groupEnd()

  return (
    <Page title="Mutations">
      <div className="mx-auto w-fit">
        <h2 className="font-bold">Books</h2>
        {booksData != null && (
          <ul>
            {booksData.books.map((book: any) => {
              return (
                <li key={book.id}>
                  {book.title} by {book.author}
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <BorderButton
        className="mx-auto my-4 block w-fit"
        onClick={async () => {
          await addBook({
            variables: {
              title: 'New book title',
              author: 'New book author',
            },
          })
          await refetch()
        }}
      >
        Add book
      </BorderButton>
      <div className="mx-auto w-fit">
        <h2 className="font-bold">Mutation results</h2>
        <dl className="my-2 grid w-[500px] grid-cols-2">
          <dt>
            <code>loading</code>
          </dt>
          <dd>{JSON.stringify(loading)}</dd>
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
              <code>{`{ title: ${data.addBook.book.title} }`}</code>
            )}
          </dd>
        </dl>
      </div>
    </Page>
  )
}
