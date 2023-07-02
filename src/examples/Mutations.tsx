import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { BorderButton } from '../components/Button.tsx'
import { ControlGrid } from '../components/ControlGrid.tsx'
import { BoolLabelledSelect } from '../components/LabelledSelect.tsx'
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
  const { data: booksData } = useQuery(GET_BOOKS)
  const [refetchGetBooks, setRefetchGetBooks] = useState(true)
  const refetchQueries = refetchGetBooks ? [GET_BOOKS] : undefined
  const [addBook, { data, loading, error, reset }] = useMutation(ADD_BOOK, {
    refetchQueries,
  })
  const [resetBooks] = useMutation(RESET_BOOKS, {
    refetchQueries,
  })

  console.group('Mutations render')
  console.log(`loading: ${loading}, data: %o, error: %o`, data, error)
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
        If a mutation result contains an object with <code>__typename</code> and
        the correct ID attribute (default <code>id</code>), then it will
        automatically be added to the cache. Try turning off refetch after
        mutation and adding a book. See how even though the book list doesn't
        update, the new book returned from the <code>addBook</code> mutation is
        added to the query cache.
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
