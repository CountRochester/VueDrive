<script lang="ts"> 
  export default { 
    name: 'UploaderPopup' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts">
  import { PropType, ref, watch, computed } from 'vue'
  import PopupControls from './PopupControls.vue'
  import UploadItem from './item/UploadItem.vue'
  import UploaderControls from './UploaderControls.vue'
  import { uploadStates, UploadItem as UploadItemType } from '../types'
  import { getRandomId } from '../../../common/helpers'
  import { ApiFile } from '../../../api/types'
  import useUploadStatistics from '../../../composable/upload-statistics'
  

  const getUploadItems = (files: FileList|File[], folderId: string|number):UploadItemType[] => Array.from(files)
    .map(file => ({
      id: getRandomId(),
      file,
      progress: 0,
      state: uploadStates.WAITING,
      response: null,
      folderId
    }))

  const props = defineProps({
    files: {
      type: Object as PropType<FileList|File[]>,
      default: () => [] as File[]
    },

    folderId: {
      type: [String, Number] as PropType<string|number>,
      default: 0
    }
  })

  const emit = defineEmits({
    'upload-complete': (payload: ApiFile) => true
  })

  const items = ref<UploadItemType[]>([])

  const showPopupBody = ref<boolean>(true)

  const uploadingStatus = computed(() => {
    const { uploadingItemsCount, completeItemsCount, failedItemsCount } = useUploadStatistics(items.value)
    if (uploadingItemsCount > 0) {
      return `Uploading ${uploadingItemsCount} items`
    } else if (completeItemsCount > 0) {
      return `${completeItemsCount} uploads complete`
    } else if (failedItemsCount > 0) {
      return `${failedItemsCount} uploads failed`
    }
    return ''
  })

  const handleClose = () => {
    const { uploadingItemsCount } = useUploadStatistics(items.value)

    if (!uploadingItemsCount) {
      items.value.splice(0)
      return
    }

    if (confirm('Cancel all uploads')) {
      cancelUploading()
      items.value.splice(0)
    }
  }

  const handleItemChange = (item: UploadItemType) => {
    if (item.state === uploadStates.COMPLETE && item.response) {
      emit('upload-complete', item.response)
      const index = items.value.findIndex(el => el.id === item.id)
      items.value.splice(index, 1, item)
    }
  }

  const cancelUploading = () => {
    items.value.map(item => {
      if (item.state === uploadStates.WAITING || item.state === uploadStates.UPLOADING) {
        item.state = uploadStates.CANCELED
        item.progress = 0
      }
      return item
    })
  }

  const reuploadCanceledItems = () => {
    items.value.map(item => {
      if (item.state === uploadStates.CANCELED) {
        item.state = uploadStates.WAITING
      }
      return item
    })
  }

  watch(() => props.files, (newFiles: FileList|File[]) => {
    items.value.unshift(...getUploadItems(newFiles, props.folderId))
  })
</script>

<template>
  <div
    v-if="items.length"
    class="card shadow uploader-popup"
  >
    <div class="card-header bg-dark py-3">
      <div class="d-flex justify-content-between align-items-center">
        <span class="text-light">{{ uploadingStatus }}</span>
        <PopupControls
          @toggle="showPopupBody = !showPopupBody"
          @close="handleClose"
        />
      </div>
    </div>

    <div class="upload-items" v-show="showPopupBody">
      <UploaderControls
        :items="items"
        @cancel="cancelUploading"
        @retry="reuploadCanceledItems"
      />
      <ul class="list-group list-group-flush">
        <UploadItem
          v-for="item in items"
          :key="'item-' + item.id"
          :item="item"
          @change="handleItemChange"
        />
      </ul>
    </div>
  </div>
</template>

<style scoped>
.uploader-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  z-index: 999;
}
</style>
