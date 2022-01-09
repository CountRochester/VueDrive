<script lang="ts"> 
  export default {
    name: 'FolderItem', // this method will resolve the error ：“Module ... has no default export.Vetur(1192)”,
    inheritAttrs: false
  } 
</script>

<script setup lang="ts">
import { PropType } from 'vue'
import { ApiFolder } from '../../api/types'

const props = defineProps({
  folder: {
    type: Object as PropType<ApiFolder>,
    default: ():ApiFolder => ({} as ApiFolder),
  }
})

</script>

<template>
  <div 
    class="col-md-3"
  >
    <div class="card mb-4" v-bind="$attrs">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <icon-folder />
          <span class="file-name">{{ folder.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
