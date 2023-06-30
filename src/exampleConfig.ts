import {Queries} from "./examples/Queries.tsx";


export type ConfigEntry = { id: string; label: string; Component: React.FC }
export const componentConfig: ConfigEntry[] = [
  {
    id: 'queries',
    label: 'Queries',
    Component: Queries,
  },
]
