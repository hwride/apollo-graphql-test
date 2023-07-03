import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { Books } from '../components/Books.tsx'
import { BorderButton } from '../components/ui/Button.tsx'
import { ControlGrid } from '../components/ui/ControlGrid.tsx'
import { BoolLabelledSelect } from '../components/ui/LabelledSelect.tsx'
import { Link } from '../components/ui/Link.tsx'
import { Page } from '../components/ui/Page.tsx'
import {
  H3PageParagraph,
  PageParagraph,
} from '../components/ui/PageParagraph.tsx'

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

export function MutationsManualCacheUpdate() {
  const { data: booksData, loading: getBooksLoading } = useQuery(GET_BOOKS)
  const [refetchGetBooks, setRefetchGetBooks] = useState(false)
  const refetchQueries = refetchGetBooks ? [GET_BOOKS] : undefined
  const [addBook, { data, loading, error, reset }] = useMutation(ADD_BOOK, {
    refetchQueries,
    // Use update to manually modify the cache after the mutation completes and
    // add the new book.
    update(cache, { data: { addBook } }) {
      cache.modify({
        fields: {
          books(existingBooks = []) {
            // The book will have already been created automatically from the data returned from the mutation.
            // So we just want to get a reference to it and add it to the books list in the cache.
            // cache.writeFragment can be used to get a reference to an object that already exists.
            const newBookRef = cache.writeFragment({
              data: addBook.book,
              fragment: gql`
                fragment NewBook on Book {
                  id
                  title
                  author
                }
              `,
            })
            console.log(`newBookRef: %o`, newBookRef)
            return [...existingBooks, newBookRef]
          },
        },
      })
    },
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
    <Page title="Mutations - manual cache update">
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
        This example is showing how to update the cache manually after a
        mutation with the{' '}
        <Link
          href="https://www.apollographql.com/docs/react/data/mutations/#the-update-function"
          target="_blank"
        >
          <code>update</code>
        </Link>{' '}
        function. This can be necessary when the automatic cache update that
        happens after a mutation response isn't sufficient to update all
        appropriate fields, this can happen for example in list fields.
      </PageParagraph>
      <H3PageParagraph heading="Updating of related queries">
        Note how the books query automatically updates in response to the cache
        data we set inside <code>update</code> after the mutation.
      </H3PageParagraph>
      <H3PageParagraph heading="Refetch after update">
        You do still have the option to{' '}
        <Link
          href="https://www.apollographql.com/docs/react/data/mutations/#refetching-after-update"
          target="_blank"
        >
          refetch after <code>update</code>
        </Link>{' '}
        if you'd like to make doubly sure everything is in sync. In this case
        the refetch would overwrite local changes made if the data was
        different.
      </H3PageParagraph>
    </>
  )
}
