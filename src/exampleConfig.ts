import { ApolloDocsGettingStarted } from './examples/ApolloDocsGettingStarted.tsx'
import { Queries } from './examples/Queries.tsx'

export type ConfigEntry = { id: string; label: string; Component: React.FC }
export const componentConfig: ConfigEntry[] = [
  {
    id: 'apollo_getting_started',
    label: 'Apollo getting started',
    Component: ApolloDocsGettingStarted,
  },
  {
    id: 'queries',
    label: 'Queries',
    Component: Queries,
  },
]
