import { createApp } from 'vue'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { RowGroupingModule } from 'ag-grid-enterprise'
import App from './App.vue'

ModuleRegistry.registerModules([AllCommunityModule, RowGroupingModule])

createApp(App).mount('#app')
