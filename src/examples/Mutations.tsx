import { gql, useMutation, useQuery } from '@apollo/client'
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
const RESET_BOOKS = gql`
  mutation ResetBooks {
    resetBooks {
      success
      code
      books {
        title
        author
      }
    }
  }
`

let nextBookTitle = 1
function getNextBookTitleSuffix() {
  return nextBookTitle++
}

export function Mutations() {
  const { data: booksData, refetch } = useQuery(GET_BOOKS)
  const [addBook, { data, loading, error, reset }] = useMutation(ADD_BOOK)
  const [resetBooks] = useMutation(RESET_BOOKS)

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
      <div className="mx-auto my-4 flex w-fit flex-col items-center gap-1">
        <BorderButton
          className="block"
          onClick={async () => {
            await addBook({
              variables: {
                title: 'New book title ' + getNextBookTitleSuffix(),
                author: 'New book author',
              },
            })
            await refetch()
          }}
        >
          Add book
        </BorderButton>
        <BorderButton className="block" onClick={reset}>
          <code>useMutation().reset()</code>
        </BorderButton>
        <BorderButton className="block" onClick={() => resetBooks()}>
          Reset books
        </BorderButton>
      </div>
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
