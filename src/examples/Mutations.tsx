import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import {
  ADD_BOOK,
  GET_BOOKS,
  MutationsAddBookSkeleton,
  RESET_BOOKS,
} from '../components/MutationsAddBookSkeleton.tsx'
import { Link } from '../components/ui/Link.tsx'
import { Page } from '../components/ui/Page.tsx'
import { H3PageParagraph, PageParagraph } from '../components/ui/PageParagraph'

export function Mutations() {
  console.group('Mutations render')
  const getBooksQuery = useQuery(GET_BOOKS)
  const [refetchGetBooks, setRefetchGetBooks] = useState(true)
  const refetchQueries = refetchGetBooks ? [GET_BOOKS] : undefined
  const addBookMutation = useMutation(ADD_BOOK, {
    refetchQueries,
  })
  const resetBooksMutation = useMutation(RESET_BOOKS, {
    refetchQueries,
  })
  return (
    <Page title="Mutations">
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
        This contains an example of a GraphQL mutation to add a book to our
        books list. At the bottom is a display of the current list of books.
      </PageParagraph>
      <H3PageParagraph
        heading={
          <Link
            href="https://www.apollographql.com/docs/react/data/mutations/#include-modified-objects-in-mutation-responses"
            target="_blank"
          >
            Automatically adding objects to the cache
          </Link>
        }
      >
        Notice that if a mutation result contains an object with{' '}
        <code>__typename</code> and the correct ID attribute (
        <Link
          href="https://www.apollographql.com/docs/react/caching/cache-configuration/#customizing-cache-ids"
          target="_blank"
        >
          by default <code>id</code>
        </Link>
        ), then it is automatically added to the cache. Try turning off refetch
        after mutation and adding a book. See how even though the book list
        doesn't update, the new book returned from the <code>addBook</code>{' '}
        mutation is added to the query cache.
      </H3PageParagraph>
      <H3PageParagraph heading="Refetching data after a mutation">
        In this example we enable refetching of the book list query after the
        mutation completes, via{' '}
        <Link
          href="https://www.apollographql.com/docs/react/data/mutations/#refetching-queries"
          target="_blank"
        >
          <code>refetchQueries</code>
        </Link>
        . You can turn this off in the controls. You can avoid this extra fetch
        altogether by{' '}
        <Link
          href="https://www.apollographql.com/docs/react/data/mutations/#updating-the-cache-directly"
          target="_blank"
        >
          updating the cache directly
        </Link>
        , this is covered in other examples.
      </H3PageParagraph>
      <H3PageParagraph heading="Storage of list objects">
        Notice in the cache how the list of books returned by the{' '}
        <code>GetBooks</code> query does not have a top-level cache entry like
        our individual books object, but only exists under{' '}
        <code>ROOT_QUERY/books</code>.
      </H3PageParagraph>
    </>
  )
}
