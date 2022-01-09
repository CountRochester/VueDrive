<script lang="ts"> 
  export default { 
    name: 'FileList' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts">
import { PropType, reactive, watch } from 'vue'
import { ApiFile } from '../../api/types'
import FileItem from './FileItem.vue'
import useItemsSelection from '../../composable/items-selection'

const props = defineProps({
  files: {
    type: Array as PropType<ApiFile[]>,
    default: () => [] as ApiFile[],
  },

  selected: {
    type: Array as PropType<ApiFile[]>,
    default: () => [] as ApiFile[],
  }
})

const emit = defineEmits({
  'select-change': (payload: Set<ApiFile>) => { return true }
})

const {
    selectOne,
    selectMultiple,
    isSelected,
    clearSelected
  } = useItemsSelection<ApiFile>(props.selected, emit)

</script>

<template>
  <div class="row" @click="clearSelected">
    <FileItem 
      v-for="(file, index) in files"
      :key="'file-' + file.id + '-' + index"
      :file="file"
      @click.exact.stop="selectOne(file)"
      @click.ctrl.exact.stop="selectMultiple(file)"
      :class="{ 'selected-file': isSelected(file) }"
    />
  </div>
</template>
