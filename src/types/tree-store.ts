export type TreeStoreItemId = number | string;
export type TreeStoreItem = {
  id: TreeStoreItemId;
  parent: TreeStoreItemId;
} & { [key: PropertyKey]: unknown };
