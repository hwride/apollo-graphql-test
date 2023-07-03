import { clsx } from 'clsx'
import { ReactNode } from 'react'
import { H3Inline } from './Headings.tsx'

const pClasses = 'mx-auto mb-2 max-w-[80ch]'

export function PageParagraph({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return <p className={clsx(className, pClasses)}>{children}</p>
}

/**
 * Page paragraph with an h3 heading.
 */
export function H3PageParagraph({
  heading,
  children,
  className,
}: {
  heading: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={clsx(className, pClasses)}>
      <H3Inline>{heading}</H3Inline>:{' '}
      <p className={clsx(className, 'inline')}>{children}</p>
    </div>
  )
}
