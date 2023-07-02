import { ApolloDocsGettingStarted } from './examples/ApolloDocsGettingStarted.tsx'
import { Mutations } from './examples/Mutations.tsx'
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
  {
    id: 'mutations',
    label: 'Mutations',
    Component: Mutations,
  },
]
