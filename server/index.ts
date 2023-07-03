// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { delayHelper } from './utils.js'

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: ID
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    book(id: ID!): Book
  }

  interface MutationResponse {
      code: String!
      success: Boolean!
      message: String!
  }
  type AddBookMutationResponse implements MutationResponse {
      code: String!
      success: Boolean!
      message: String!
      book: Book
  }
  type UpdateBookMutationResponse implements MutationResponse {
      code: String!
      success: Boolean!
      message: String!
      book: Book
  }
  type ResetBooksMutationResponse implements MutationResponse {
      code: String!
      success: Boolean!
      message: String!
      books: [Book]
  }

  type Mutation {
      addBook(title: String, author: String, delayMs: Int): AddBookMutationResponse
      updateBook(id: ID!, title: String, author: String, delayMs: Int): AddBookMutationResponse
      resetBooks(delayMs: Int): ResetBooksMutationResponse
  }
`

const originalBooks = Object.freeze([
  {
    id: '1',
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    id: '2',
    title: 'City of Glass',
    author: 'Paul Auster',
  },
  {
    id: '3',
    title: 'The Final Empire',
    author: 'Brandon Sanderson',
  },
  {
    id: '4',
    title: 'Lord of the Rings',
    author: 'J. R. R. Tolkien',
  },
])
let books = JSON.parse(JSON.stringify(originalBooks))

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    book(parent, args) {
      return books.find((book) => book.id === args.id)
    },
  },
  Mutation: {
    async addBook(parent, args) {
      await delayHelper(args)

      const newBook = { id: `${books.length + 1}`, ...args }
      books.push(newBook)
      return {
        code: '200',
        success: true,
        message: 'Book successfully added',
        book: newBook,
      }
    },
    async updateBook(parent, args) {
      await delayHelper(args)

      const book = books.find((book) => book.id === args.id)
      if (book == null) {
        return {
          code: '404',
          success: false,
          message: 'Cannot find book with ID ' + args.id,
        }
      }

      if (args.title) book.title = args.title
      if (args.author) book.author = args.author
      return {
        code: '200',
        success: true,
        message: 'Book successfully updated',
        book,
      }
    },
    async resetBooks(parent, args) {
      await delayHelper(args)

      books = JSON.parse(JSON.stringify(originalBooks))
      return {
        code: '200',
        success: true,
        message: 'Books successfully reset',
        books,
      }
    },
  },
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore it's complaining about top level await, but it works
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
})

console.log(`🚀  Server ready at: ${url}`)
