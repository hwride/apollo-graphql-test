import { gql } from '@apollo/client'
import { ReactNode } from 'react'
import { Books } from '../components/Books.tsx'
import { BorderButton } from '../components/ui/Button.tsx'
import { ControlGrid } from '../components/ui/ControlGrid.tsx'
import { BoolLabelledSelect } from '../components/ui/LabelledSelect.tsx'

export const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
    }
  }
`
export const ADD_BOOK = gql`
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
export const RESET_BOOKS = gql`
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

export function MutationsAddBookSkeleton({
  getBooksQuery,
  addBookMutation,
  resetBooksMutation,
  refetchGetBooks,
  setRefetchGetBooks,
  customControls,
}: {
  getBooksQuery: any
  addBookMutation: any
  resetBooksMutation: any
  refetchGetBooks: any
  setRefetchGetBooks: any
  customControls?: ReactNode
}) {
  const { data: booksData, loading: getBooksLoading } = getBooksQuery
  const [addBook, { data, loading, error, reset }] = addBookMutation
  const [resetBooks] = resetBooksMutation

  console.log(
    `getBooks - loading: ${getBooksLoading}, booksData: %o`,
    booksData
  )
  console.log(`addBook - loading: ${loading}, data: %o, error: %o`, data, error)
  console.groupEnd()

  return (
    <>
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
        {customControls}
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
    </>
  )
}
