import type { TreeStoreItemId as Id, TreeStoreItem as Item } from '@/types/tree-store'

export class TreeStore {
  _items: Item[]
  _itemsMapById: Record<Id, Item>
  _itemsChildrenMap: Record<Id, Item[]>

  constructor(itemsArray: Item[]) {
    this._items = itemsArray
    this._itemsMapById = {}
    this._itemsChildrenMap = {}

    this.fillItemsMaps()
  }

  fillItemsMaps() {
    this._itemsMapById = {}
    this._itemsChildrenMap = {}

    this._items.forEach((item) => {
      const itemId = item.id
      const itemParentId = item.parent

      this._itemsMapById[itemId] = item

      if (!this._itemsChildrenMap[itemId]) {
        this._itemsChildrenMap[itemId] = []
      }

      if (itemParentId) {
        if (!this._itemsChildrenMap[itemParentId]) {
          this._itemsChildrenMap[itemParentId] = []
        }

        this._itemsChildrenMap[itemParentId].push(item)
      }
    })
  }

  getAll(): Item[] {
    return this._items
  }

  getItem(id: Id): Item | undefined {
    return this._itemsMapById[id]
  }

  getChildren(id: Id): Item[] | undefined {
    return this._itemsChildrenMap[id]
  }

  getAllChildren(id: Id): Item[] {
    const result: Item[] = []

    const getAllItemChildrenHelper = (parentId: Id | null) => {
      if (parentId !== null) {
        const children = this.getChildren(parentId)

        if (children && children.length) {
          for (const child of children) {
            result.push(child)
            getAllItemChildrenHelper(child.id)
          }
        }
      }
    }

    getAllItemChildrenHelper(id)

    return result
  }

  getAllParents(id: Id): Item[] {
    const result: Item[] = []
    let current = this.getItem(id)

    while (current) {
      result.push(current)
      current = current.parent ? this.getItem(current.parent) : undefined
    }

    return result
  }

  addItem(newItem: Item): void {
    const itemId = newItem.id
    const itemParentId = newItem.parent

    if (this.getItem(itemId)) {
      console.warn('Элемент с данным id  уже есть в списке')
      return
    }

    this._items.push(newItem)
    this._itemsMapById[itemId] = newItem
    this._itemsChildrenMap[itemId] = []

    if (itemParentId) {
      if (!this._itemsChildrenMap[itemParentId]) {
        this._itemsChildrenMap[itemParentId] = []
      }

      this._itemsChildrenMap[itemParentId].push(newItem)
    }
  }

  removeItem(id: Id): void {
    const idsToDelete = [id, ...this.getAllChildren(id).map((item) => item.id)]
    this._items = this._items.filter((item) => !idsToDelete.includes(item.id))

    this.fillItemsMaps()
  }

  updateItem(updatedItem: Item): void {
    const index = this._items.findIndex((item) => item.id === updatedItem.id)

    if (index === -1) {
      console.warn('Обновляемый элемент отсутствует в массиве')
      return
    }

    this._items.splice(index, 1, { ...updatedItem })

    this.fillItemsMaps()
  }
}
