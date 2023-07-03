import { clsx } from 'clsx'
import { ReactNode } from 'react'

export function PageParagraph({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <p className={clsx(className, 'mx-auto mb-2 max-w-[80ch]')}>{children}</p>
  )
}
