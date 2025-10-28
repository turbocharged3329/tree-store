<template>
  <div>
    <ag-grid-vue style="width: 100%; height: 500px" :rowData="rowData" :columnDefs="colDefs" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { TreeStoreItem } from '@/types/tree-store.ts'
import { TreeStore } from '@/service/tree-store.service.ts'
import { AgGridVue } from 'ag-grid-vue3'
import type { ValueGetterParams, ColDef } from 'ag-grid-community'

const items: TreeStoreItem[] = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]

const treeStore = reactive(new TreeStore(items))
const colDefs = ref<ColDef[]>([
  {
    headerName: '№ п/п',
    valueGetter: 'node.rowIndex + 1',
    width: 100,
    pinned: 'left',
  },
  {
    headerName: 'id',
    field: 'id',
    valueGetter: (params: ValueGetterParams) => String(params.data.id),
  },
  {
    headerName: 'Parent ID',
    field: 'parent',
  },
  {
    headerName: 'Наименование',
    field: 'name',
    flex: 1,
  },
])
const rowData = ref<TreeStoreItem[]>([])

onMounted(() => {
  rowData.value = treeStore.getAll().map((item) => {
    return {
      id: item.id,
      parent: item.parent,
      name: item.label || 'Без названия',
    }
  })
})
</script>
