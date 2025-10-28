import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { TreeStoreItem } from '@/types/tree-store.ts'
import { TreeStore } from '../service/tree-store.service.ts'

describe('TreeStore', () => {
  let items: TreeStoreItem[]
  let service: TreeStore

  beforeEach(() => {
    items = [
      { id: 1, parent: null, name: 'Элемент 1' },
      { id: 2, parent: 1, name: 'Элемент 2' },
      { id: 3, parent: 1, name: 'Элемент 3' },
      { id: 4, parent: 2, name: 'Элемент 4' },
      { id: 5, parent: null, name: 'Элемент 5' },
    ]

    service = new TreeStore(items)
  })

  it('Сервис инициализируется корректно', () => {
    expect(service.getAll()).toHaveLength(5)
    expect(Object.keys(service._itemsMapById)).toContain('1')
    expect(service._itemsChildrenMap['1']).toHaveLength(2)
  })

  it('Возвращает элемент по id', () => {
    const item = service.getItem(3)
    expect(item?.name).toBe('Элемент 3')
  })

  it('Возвращает потомков по id', () => {
    const children = service.getChildren(1)
    expect(children?.map((i) => i.id)).toEqual([2, 3])
  })

  it('Возвращает всех потомков (рекурсивно)', () => {
    const allChildren = service.getAllChildren(1)
    expect(allChildren.map((i) => i.id).sort()).toEqual([2, 3, 4])
  })

  it('Возвращает массив id всех родителей до корня (+ собственный id)', () => {
    const parents = service.getAllParents(4)
    expect(parents.map((i) => i.id)).toEqual([4, 2, 1])
  })

  it('Добавляет новый элемент', () => {
    const newItem = { id: 6, parent: 1, name: 'Элемент 6' }

    service.addItem(newItem)

    expect(service.getItem(6)).toBeTruthy()
    expect(service.getChildren(1)?.map((i) => i.id)).toContain(6)
    expect(Object.keys(service._itemsChildrenMap)).toHaveLength(6)
    expect(service._itemsChildrenMap['1']).toContain(newItem)
  })

  it('Не добавляет элемент с существующим id', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    service.addItem({ id: 1, parent: null })

    expect(warnSpy).toHaveBeenCalled()
    expect(service.getAll().length).toBe(5)
    warnSpy.mockRestore()
  })

  it('Удаляет элемент и всех его потомков', () => {
    service.removeItem(2)

    const allIds = service.getAll()

    expect(allIds).toHaveLength(3)
    expect(service._itemsMapById['2']).toBeUndefined()
    expect(service._itemsChildrenMap['2']).toBeUndefined()
  })

  it('Обновляет указанный элемент по id', () => {
    service.updateItem({ id: 3, parent: 1, name: 'Обновленный элемент 3' })

    const updated = service.getItem(3)

    expect(updated?.name).toBe('Обновленный элемент 3')
    expect(service._itemsMapById['3']!.id).toBe(3)
    expect(service._itemsMapById['3']!.parent).toBe(1)
    expect(service._itemsMapById['3']!.name).toBe('Обновленный элемент 3')
    expect(service._itemsChildrenMap['1']).toContain(updated)
  })

  it('Не обновляет отсутствующий в массиве элемент', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    service.updateItem({ id: 999, parent: null })
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()

    expect(service._itemsMapById['999']).toBeUndefined()
    expect(service._itemsChildrenMap['999']).toBeUndefined()
  })
})
