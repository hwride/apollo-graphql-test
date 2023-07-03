import { gql } from '@apollo/client';

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
  mutation AddBook($title: String!, $author: String!, $delayMs: Int) {
    addBook(title: $title, author: $author, delayMs: $delayMs) {
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
  mutation ResetBooks($delayMs: Int) {
    resetBooks(delayMs: $delayMs) {
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