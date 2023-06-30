import { useEffect, useState } from 'react'
import { ConfigEntry, componentConfig } from './exampleConfig.ts'
import { EmptyExample } from './examples/EmptyExample.tsx'

export function useSelectedExample() {
  const [selectedExample, setSelectedExample] = useState<
    ConfigEntry | undefined
  >(getExampleFromQueryParams)
  const SelectedExampleComponent: React.FC =
    selectedExample?.Component ?? EmptyExample

  // Query params
  const { setIdQueryParamToExample } = useExampleQueryParams(setSelectedExample)

  const setSelectedExampleHelper = (example?: ConfigEntry) => {
    setIdQueryParamToExample(example)
    setSelectedExample(example)
  }

  return {
    selectedExample,
    setSelectedExample: setSelectedExampleHelper,
    SelectedExampleComponent,
  }
}

/**
 * Get the current example from query params.
 */
function getExampleFromQueryParams() {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  return id ? componentConfig.find((example) => example.id === id) : undefined
}

/**
 * Helper for example ID query param changes. Listens for changes and updates
 * selected examples, and provides helper to set the query param.
 */
function useExampleQueryParams(
  onSelectedExampleChange: (example: ConfigEntry | undefined) => void
) {
  // Listen for changes in query params with the forward/back buttons.
  useEffect(() => {
    const popstateListener = () =>
      onSelectedExampleChange(getExampleFromQueryParams())
    window.addEventListener('popstate', popstateListener)
    return () => window.removeEventListener('popstate', popstateListener)
  }, [onSelectedExampleChange])

  return {
    setIdQueryParamToExample: (example?: ConfigEntry) => {
      const urlParams = new URLSearchParams(window.location.search)
      if (example) {
        urlParams.set('id', example.id)
      } else {
        urlParams.delete('id')
      }
      window.history.pushState({}, '', '?' + urlParams.toString())
    },
  }
}
