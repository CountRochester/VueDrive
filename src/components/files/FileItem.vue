<script lang="ts"> 
  export default { 
    name: 'FileItem' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { ApiFile } from '../../api/types'
import { iconTypes, IconType, MimeType } from '../../files/types'
import { getIconFileType } from '../../composable/icon-file-type'
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png']


const props = defineProps({
  file: {
    type: Object as PropType<ApiFile>,
    default: ():ApiFile => ({} as ApiFile),
  }
})

const iconFileType = computed(() => getIconFileType(props.file.mimeType))

const isValidImage = computed((): boolean => {
  return !!props.file.mimeType && imageMimeTypes.includes(props.file.mimeType) && !!props.file.url
})
</script>

<template>
  <div 
    class="col-md-3"
  >
    <div class="card mb-4">
      <img v-if="isValidImage" class="file-thumb" :src="file.url" />
      <div v-else class="card-body text-center py-5">
        <component :is="iconFileType" height="4em" width="4em" />
      </div>

      <div class="card-footer">
        <div class="d-flex align-items-center">
          <component :is="iconFileType" />
          <span class="file-name">{{ file.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
