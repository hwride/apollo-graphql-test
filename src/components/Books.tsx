export function Books({ booksData }: { booksData: any }) {
  return (
    <div className="mx-auto mb-2 w-fit min-w-[300px]">
      <h2 className="font-bold">Books</h2>
      {booksData != null && (
        <ul className="list-decimal pl-4">
          {booksData.books.map((book: any) => {
            return (
              <li key={book.id}>
                {book.title} by {book.author}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
