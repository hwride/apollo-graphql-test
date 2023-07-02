import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { BorderButton } from '../components/Button.tsx'
import { ControlGrid } from '../components/ControlGrid.tsx'
import { BoolLabelledSelect } from '../components/LabelledSelect.tsx'
import { Link } from '../components/Link.tsx'
import { Page } from '../components/Page.tsx'
import { PageParagraph } from '../components/PageParagraph.tsx'

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
        id
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
        id
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
  const { data: booksData, loading: getBooksLoading } = useQuery(GET_BOOKS)
  const [refetchGetBooks, setRefetchGetBooks] = useState(true)
  const refetchQueries = refetchGetBooks ? [GET_BOOKS] : undefined
  const [addBook, { data, loading, error, reset }] = useMutation(ADD_BOOK, {
    refetchQueries,
  })
  const [resetBooks] = useMutation(RESET_BOOKS, {
    refetchQueries,
  })

  console.group('Mutations render')
  console.log(
    `getBooks - loading: ${getBooksLoading}, booksData: %o`,
    booksData
  )
  console.log(`addBook - loading: ${loading}, data: %o, error: %o`, data, error)
  console.groupEnd()

  return (
    <Page title="Mutations">
      <Docs />

      <ControlGrid>
        <BoolLabelledSelect
          label={
            <>
              Refetch <code>GetBooks</code> after mutations
            </>
          }
          value={refetchGetBooks}
          onOptionChange={setRefetchGetBooks}
        />
      </ControlGrid>
      <div className="mx-auto my-4 flex w-fit flex-col items-center gap-1">
        <BorderButton
          className="block"
          onClick={async () =>
            addBook({
              variables: {
                title: 'New book title ' + getNextBookTitleSuffix(),
                author: 'New book author',
              },
            })
          }
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

      <Books booksData={booksData} />
    </Page>
  )
}

function Docs() {
  return (
    <>
      <PageParagraph>
        This contains an example of a GraphQL mutation to add a book to our
        books list. At the bottom is a display of the current list of books. The
        default behaviour is to automatically refetch the list of books after
        the add book mutation completes, via{' '}
        <Link
          href="https://www.apollographql.com/docs/react/data/mutations/#refetching-queries"
          target="_blank"
        >
          <code>refetchQueries</code>
        </Link>
        .
      </PageParagraph>
      <PageParagraph>
        If a mutation result contains an object with <code>__typename</code> and
        the correct ID attribute (
        <Link
          href="https://www.apollographql.com/docs/react/caching/cache-configuration/#customizing-cache-ids"
          target="_blank"
        >
          by default <code>id</code>
        </Link>
        ), then it will automatically be added to the cache. Try turning off
        refetch after mutation and adding a book. See how even though the book
        list doesn't update, the new book returned from the <code>addBook</code>{' '}
        mutation is added to the query cache.
      </PageParagraph>
      <PageParagraph>
        You can avoid an extra fetch as in this example by{' '}
        <Link
          href="https://www.apollographql.com/docs/react/data/mutations/#updating-the-cache-directly"
          target="_blank"
        >
          updating the cache directly
        </Link>
        , see other examples.
      </PageParagraph>
    </>
  )
}

function Books({ booksData }: { booksData: any }) {
  return (
    <div className="mx-auto mb-2 w-fit">
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
  )
}
