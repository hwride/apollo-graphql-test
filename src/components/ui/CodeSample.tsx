import { clsx } from 'clsx'
import {
  PrismLight as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from 'react-syntax-highlighter'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism'

SyntaxHighlighter.registerLanguage('jsx', jsx)

export function CodeSample({ children, ...overrides }: SyntaxHighlighterProps) {
  // wrapLongLines helps with mobile view.
  return (
    <SyntaxHighlighter style={prism} {...overrides}>
      {children}
    </SyntaxHighlighter>
  )
}

export function CenteredCodeSample({
  className,
  ...rest
}: SyntaxHighlighterProps) {
  return (
    <div className={clsx('max-w-full m-auto w-fit', className)}>
      <CodeSample {...rest} />
    </div>
  )
}
