import { gql } from '@apollo/client'

export const GET_BOOK = gql`
  query GetBook($bookId: ID!) {
    book(id: $bookId) {
      id
      title
      author
    }
  }
`
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

export const SET_SERVER_DELAY = gql`
  mutation SetServerDelay($delayMs: Int!) {
    setServerDelay(delayMs: $delayMs) {
      success
    }
  }
`
