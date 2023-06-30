import { clsx } from 'clsx'
import { AnchorHTMLAttributes } from 'react'
import { ExternalLink } from 'react-feather'

export function Link({
  className,
  children,
  iconSize = 'text-md',
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  iconSize?: 'text-md' | 'text-lg'
}) {
  const iconSizeFinal = iconSize === 'text-md' ? 14 : 18
  return (
    <a
      className={clsx(
        className,
        'inline-flex items-center gap-1 text-blue-600 underline visited:text-purple-600 hover:text-blue-800'
      )}
      {...rest}
    >
      {children}
      {rest.target === '_blank' && <ExternalLink size={iconSizeFinal} />}
    </a>
  )
}
