import { useEffect, useState } from 'react'

function getBreakpoint() {
  if (window.matchMedia('(min-width: 640px)').matches) {
    return 'sm'
  } else if (window.matchMedia('(min-width: 768px)').matches) {
    return 'md'
  } else if (window.matchMedia('(min-width: 1024px)').matches) {
    return 'lg'
  } else if (window.matchMedia('(min-width: 1280px)').matches) {
    return 'xl'
  } else if (window.matchMedia('(min-width: 1536px)').matches) {
    return '2xl'
  } else {
    return 'xs'
  }
}

export function useBreakpoint(cb?: (bp: string) => void) {
  const [breakpoint, setBreakpoint] = useState<string>(getBreakpoint)

  useEffect(() => {
    const checkBreakpoint = () => {
      const breakpoint = getBreakpoint()
      setBreakpoint(breakpoint)
      if (cb) cb(breakpoint)
    }

    window.addEventListener('resize', checkBreakpoint)
    checkBreakpoint()

    return () => window.removeEventListener('resize', checkBreakpoint)
  }, [cb])

  return breakpoint
}
