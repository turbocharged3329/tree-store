export type TreeStoreItemId = number | string
export type TreeStoreItem = {
  id: TreeStoreItemId
  parent: TreeStoreItemId | null
} & { [key: PropertyKey]: unknown }
