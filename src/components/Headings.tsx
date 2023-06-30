import { HTMLAttributes } from 'react'

export function H2({
  className,
  children,
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={'mb-2 text-center text-lg font-bold' + (className ?? '')}>
      {children}
    </h2>
  )
}
export function H3({
  className,
  children,
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={'text-md mb-2 text-center font-bold' + (className ?? '')}>
      {children}
    </h3>
  )
}
