import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import {
  ADD_BOOK,
  GET_BOOKS,
  MutationsAddBookSkeleton,
  RESET_BOOKS,
} from '../components/MutationsAddBookSkeleton.tsx'
import { Link } from '../components/ui/Link.tsx'
import { Page } from '../components/ui/Page.tsx'
import {
  H3PageParagraph,
  PageParagraph,
} from '../components/ui/PageParagraph.tsx'

export function MutationsManualCacheUpdate() {
  const getBooksQuery = useQuery(GET_BOOKS)
  const [refetchGetBooks, setRefetchGetBooks] = useState(false)
  const refetchQueries = refetchGetBooks ? [GET_BOOKS] : undefined
  const addBookMutation = useMutation(ADD_BOOK, {
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
  const resetBooksMutation = useMutation(RESET_BOOKS, {
    refetchQueries,
    update(cache, { data: { resetBooks } }) {
      cache.modify({
        fields: {
          books() {
            const newBookRefs = resetBooks.books.map((book: any) =>
              cache.writeFragment({
                data: book,
                fragment: gql`
                  fragment NewBook on Book {
                    id
                    title
                    author
                  }
                `,
              })
            )
            console.log(`newBookRefs: %o`, newBookRefs)
            return newBookRefs
          },
        },
      })
    },
  })

  return (
    <Page title="Mutations - manual cache update">
      <Docs />

      <MutationsAddBookSkeleton
        getBooksQuery={getBooksQuery}
        addBookMutation={addBookMutation}
        resetBooksMutation={resetBooksMutation}
        refetchGetBooks={refetchGetBooks}
        setRefetchGetBooks={setRefetchGetBooks}
      />
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
