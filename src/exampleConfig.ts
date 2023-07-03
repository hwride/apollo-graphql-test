import { ApolloDocsGettingStarted } from './examples/ApolloDocsGettingStarted.tsx'
import { Mutations } from './examples/Mutations.tsx'
import { MutationsManualCacheUpdate } from './examples/MutationsManualCacheUpdate.tsx'
import { MutationsOptimisticUpdate } from './examples/MutationsOptimisticUpdate.tsx'
import { MutationsOptimisticUpdateNoID } from './examples/MutationsOptimisticUpdateNoID.tsx'
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
  {
    id: 'mutations_manual_cache_update',
    label: 'Mutations - manual cache update',
    Component: MutationsManualCacheUpdate,
  },
  {
    id: 'mutations_optimisitc_update',
    label: 'Mutations - optimistic update',
    Component: MutationsOptimisticUpdate,
  },
  {
    id: 'mutations_optimisitc_update_no_id',
    label: 'Mutations - optimistic update no ID',
    Component: MutationsOptimisticUpdateNoID,
  },
]
