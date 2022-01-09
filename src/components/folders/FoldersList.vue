<script lang="ts"> 
  export default { 
    name: 'FoldersList' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts">
import { PropType, reactive, watch } from 'vue'
import FolderItem from './FolderItem.vue'
import { ApiFolder } from '../../api/types'
import useItemsSelection from '../../composable/items-selection'

const props = defineProps({
  folders: {
    type: Array as PropType<ApiFolder[]>,
    default: () => [] as ApiFolder[],
  },

  selected: {
    type: Array as PropType<ApiFolder[]>,
    default: () => [] as ApiFolder[],
  }
})

const emit = defineEmits({
  'select-change': (payload: Set<ApiFolder>) => true,
  'double-click': (payload: ApiFolder) => true,
})

const {
    selectOne,
    selectMultiple,
    isSelected,
    clearSelected
  } = useItemsSelection<ApiFolder>(props.selected, emit)

</script>

<template>
  <div class="row" @click="clearSelected">
    <FolderItem 
      v-for="(folder, index) in folders"
      :key="'folder-' + folder.id + '-' + index"
      :folder="folder"
      :class="{ 'selected-folder': isSelected(folder) }"
      @click.exact.stop="selectOne(folder)"
      @click.ctrl.exact.stop="selectMultiple(folder)"
      @dblclick.stop="$emit('double-click', folder)"
    />
  </div>
</template>
