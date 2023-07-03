import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { MutationsAddBookSkeleton } from '../components/MutationsAddBookSkeleton.tsx'
import { BoolLabelledSelect } from '../components/ui/LabelledSelect.tsx'
import { Link } from '../components/ui/Link.tsx'
import { Page } from '../components/ui/Page.tsx'
import {
  H3PageParagraph,
  PageParagraph,
} from '../components/ui/PageParagraph.tsx'
import { ADD_BOOK, GET_BOOKS, RESET_BOOKS } from './queries.ts'

export function MutationsManualCacheUpdate() {
  console.group('Mutations render')
  const getBooksQuery = useQuery(GET_BOOKS, {
    notifyOnNetworkStatusChange: true,
  })
  const [refetchGetBooks, setRefetchGetBooks] = useState(false)
  const [includeOnQueryUpdated, setIncludeOnQueryUpdated] = useState(false)
  const [refetchInsideOnQueryUpdated, setRefetchInsideOnQueryUpdated] =
    useState(false)
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
            console.log(
              `useMutation(ADD_BOOK) update - newBookRef: %o`,
              newBookRef
            )
            return [...existingBooks, newBookRef]
          },
        },
      })
    },
    onQueryUpdated: includeOnQueryUpdated
      ? (observableQuery) => {
          console.log(
            `useMutation(ADD_BOOK) onQueryUpdated - observableQuery: %o`,
            observableQuery
          )
          if (refetchInsideOnQueryUpdated) {
            return observableQuery.refetch()
          }
        }
      : undefined,
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
            console.log(
              `useMutation(RESET_BOOKS) update - newBookRefs: %o`,
              newBookRefs
            )
            return newBookRefs
          },
        },
      })
    },
    onQueryUpdated: includeOnQueryUpdated
      ? (observableQuery) => {
          console.log(
            `useMutation(RESET_BOOKS) onQueryUpdated - observableQuery: %o`,
            observableQuery
          )
          if (refetchInsideOnQueryUpdated) {
            return observableQuery.refetch()
          }
        }
      : undefined,
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
        customControls={
          <>
            <BoolLabelledSelect
              label={
                <>
                  Include <code>onQueryUpdated</code> callback
                </>
              }
              value={includeOnQueryUpdated}
              onOptionChange={setIncludeOnQueryUpdated}
            />
            <BoolLabelledSelect
              label={
                <>
                  Refetch inside <code>onQueryUpdated</code>
                </>
              }
              value={refetchInsideOnQueryUpdated}
              onOptionChange={setRefetchInsideOnQueryUpdated}
            />
          </>
        }
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
      <H3PageParagraph
        heading={
          <Link
            href="https://www.apollographql.com/docs/react/data/mutations/#refetching-after-update"
            target="_blank"
          >
            <code>onQueryUpdated</code>
          </Link>
        }
      >
        You can use this function to conditionally decide whether to refetch
        queries or not. It will by default auto-detect related queries and pass
        them to this function. If a query is missed you want to refetch, simply
        add it to <code>refetchQueries</code> and it will be passed to this
        function. Note if this callback is defined, no queries will refetched
        even if defined in <code>refetchQueries</code>, unless you call{' '}
        <code>observableQuery.refetch()</code> inside{' '}
        <code>onQueryUpdated</code>.
      </H3PageParagraph>
    </>
  )
}
