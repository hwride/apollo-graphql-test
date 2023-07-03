import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { Books } from '../components/Books.tsx'
import { DelayServerSelect } from '../components/DelayServerSelect.tsx'
import {
  GET_BOOKS,
  RESET_BOOKS,
} from '../components/MutationsAddBookSkeleton.tsx'
import { BorderButton } from '../components/ui/Button.tsx'
import { ControlGrid } from '../components/ui/ControlGrid.tsx'
import { Link } from '../components/ui/Link.tsx'
import { Page } from '../components/ui/Page.tsx'
import {
  H3PageParagraph,
  PageParagraph,
} from '../components/ui/PageParagraph.tsx'
import { TextInput } from '../components/ui/TextInput.tsx'

const GET_BOOK = gql`
  query GetBook($bookId: ID!) {
    book(id: $bookId) {
      id
      title
      author
    }
  }
`

const UPDATE_BOOK = gql`
  mutation UpdateBook(
    $id: ID!
    $title: String
    $author: String
    $delayMs: Int
  ) {
    updateBook(id: $id, title: $title, author: $author, delayMs: $delayMs) {
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

export function MutationsOptimisticUpdate() {
  console.group('Mutations render')
  const [bookId, setBookId] = useState('1')
  const [newTitle, setNewTitle] = useState('New title')
  const [delayMs, setDelayMs] = useState(2000)
  const { data: bookData } = useQuery(GET_BOOK, {
    notifyOnNetworkStatusChange: true,
    variables: { bookId },
  })
  const { data: booksData, loading: getBooksLoading } = useQuery(GET_BOOKS, {
    notifyOnNetworkStatusChange: true,
  })
  const [updateBook, { data, loading, error }] = useMutation(UPDATE_BOOK)
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
    <Page title="Mutations - optimistic update">
      <Docs />

      <ControlGrid>
        <label htmlFor="bookId">Book ID</label>
        <TextInput
          id="bookId"
          type="text"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
        />
        <label htmlFor="title">New title</label>
        <TextInput
          id="title"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <DelayServerSelect delayMs={delayMs} setDelayMs={setDelayMs} />
      </ControlGrid>
      <div className="mx-auto my-4 flex w-fit flex-col items-center gap-1">
        <BorderButton
          className="block"
          onClick={() => {
            const updatedBook = {
              id: bookId,
              title: newTitle,
              author: 'New book author',
            }
            updateBook({
              variables: {
                ...updatedBook,
                delayMs,
              },
              optimisticResponse: {
                updateBook: {
                  success: true,
                  code: 200,
                  book: {
                    __typename: 'Book',
                    ...updatedBook,
                  },
                },
              },
            })
          }}
        >
          Update book
        </BorderButton>
        <BorderButton
          className="block"
          onClick={() =>
            resetBooks({
              variables: { delayMs },
            })
          }
        >
          Reset books
        </BorderButton>
      </div>
      <div className="mx-auto mb-2 w-fit min-w-[300px]">
        <h2 className="font-bold">Book ID: {bookId}</h2>
        {bookData?.book && (
          <>
            {bookData.book.title} by {bookData.book.author}
          </>
        )}
      </div>
      <Books booksData={booksData} />
    </Page>
  )
}

function Docs() {
  return (
    <>
      <PageParagraph>
        This example is showing how to perform an{' '}
        <Link
          href="https://www.apollographql.com/docs/react/performance/optimistic-ui"
          target="_blank"
        >
          optimistic update
        </Link>{' '}
        for an object we already know about.
      </PageParagraph>
      <PageParagraph>
        Click "Update book". You should see the book updated on the page before
        any network request is made. You can also see this in the cache in
        Apollo DevTools. Once the mutation request returns it overwrites the
        temporary optimistic cache entry, in case of any changes.
      </PageParagraph>
      <H3PageParagraph heading="Lists">
        Notice that both our individual book and our list of books update when
        we optimistically update our book. This happens because our list has a
        reference to the book object, so updates are automatically shared.
      </H3PageParagraph>
      <PageParagraph>
        But if we had added a new item instead of updating an existing one, that
        would not have been automatically added to our list. To solve this see
        the "optimistic update no ID" example.
      </PageParagraph>
    </>
  )
}
