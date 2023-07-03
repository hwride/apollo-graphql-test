import { gql, useMutation, useQuery } from '@apollo/client'
import { Books } from '../components/Books.tsx'
import { DelayServerSelect } from '../components/DelayServerSelect.tsx'
import { getNextBookTitleSuffix } from '../components/MutationsAddBookSkeleton.tsx'
import { BorderButton } from '../components/ui/Button.tsx'
import { ControlGrid } from '../components/ui/ControlGrid.tsx'
import { Link } from '../components/ui/Link.tsx'
import { Page } from '../components/ui/Page.tsx'
import { PageParagraph } from '../components/ui/PageParagraph.tsx'
import { ADD_BOOK, GET_BOOKS, RESET_BOOKS } from './queries.ts'

export function MutationsOptimisticUpdateNoID() {
  console.group('Mutations render')
  const { data: booksData, loading: getBooksLoading } = useQuery(GET_BOOKS, {
    notifyOnNetworkStatusChange: true,
  })
  const [addBook, { data, loading, error }] = useMutation(ADD_BOOK, {
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
            console.log(
              `useMutation(ADD_BOOK) update - newBookRef: %o`,
              newBookRef
            )
            return [...existingBooks, newBookRef]
          },
        },
      })
    },
  })
  const [resetBooks] = useMutation(RESET_BOOKS, {
    refetchQueries: [GET_BOOKS],
  })

  console.log(
    `getBooks - loading: ${getBooksLoading}, booksData: %o`,
    booksData
  )
  console.log(`addBook - loading: ${loading}, data: %o, error: %o`, data, error)
  console.groupEnd()

  return (
    <Page title="Mutations - optimistic update no ID">
      <Docs />

      <ControlGrid>
        <DelayServerSelect />
      </ControlGrid>
      <div className="mx-auto my-4 flex w-fit flex-col items-center gap-1">
        <BorderButton
          className="block"
          onClick={() => {
            const newBook = {
              title: 'New book title ' + getNextBookTitleSuffix(),
              author: 'New book author',
            }
            addBook({
              variables: newBook,
              optimisticResponse: {
                addBook: {
                  success: true,
                  code: 200,
                  book: {
                    id: 'optimistic-id',
                    __typename: 'Book',
                    ...newBook,
                  },
                },
              },
            })
          }}
        >
          Add book
        </BorderButton>
        <BorderButton className="block" onClick={() => resetBooks()}>
          Reset books
        </BorderButton>
      </div>
      <Books booksData={booksData} />
    </Page>
  )
}

function Docs() {
  return (
    <>
      <PageParagraph>
        This example is showing how to perform optimistic updates for a new
        object you don't yet have an ID for. See{' '}
        <Link
          href="https://www.apollographql.com/docs/react/performance/optimistic-ui#example-adding-a-new-object-to-a-list"
          target="_blank"
        >
          apollo docs
        </Link>
        .
      </PageParagraph>
      <PageParagraph>
        Click "Add book". You should see the book updated on the page before any
        network request is made. You can also see this in the cache in Apollo
        DevTools, <code>Book:optimistic-id</code> will appear for the duration
        of the optimistic update. Once the mutation request returns it
        overwrites the temporary optimistic cache entry, in case of any changes.
      </PageParagraph>
      <PageParagraph>
        Note you need to define an <code>update</code> function as part of your{' '}
        <code>useMutation</code> call for optimistic updates to work with for
        things like adding or removing items from a list, as in this example.
      </PageParagraph>
    </>
  )
}
