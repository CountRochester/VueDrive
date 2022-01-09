<script lang="ts"> 
  export default {
    name: 'UploadItem' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts">
  import { PropType, computed, reactive, onMounted, ref, watch, inject } from 'vue'
  import UploadControls from './UploadControls.vue'
  import { UploadItem, uploadStates } from '../../types'
  import { ProgressEvent, ApiFile } from '../../../../api/types'
  import { getIconFileType } from '../../../../composable/icon-file-type'
  import useUploadStates from '../../../../composable/upload-states'
  import api from '../../../../api/files'
  import axios from 'axios'

  const source = ref(axios.CancelToken.source())

  const props = defineProps({
    item: {
      type: Object as PropType<UploadItem>,
      default: () => ({}) as UploadItem
    }
  })

  const emit = defineEmits({
    change: (payload: UploadItem) => true
  })
  
  const createFormData = (upload: UploadItem) => {
    const formData = new FormData()
    formData.append('file', upload.file)
    formData.append('folderId', String(upload.folderId))
    return formData
  }

  const startUpload = async (upload: UploadItem) => {
    try {
      upload.state = uploadStates.UPLOADING
      const { data } = await api.create(createFormData(upload), {
        onUploadProgress: (progressEvent: ProgressEvent) => {
          if (progressEvent.lengthComputable) {
            upload.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          }
        },
        cancelToken: source.value.token
      })
      upload.state = uploadStates.COMPLETE
      upload.response = data
    } catch (err) {
      if (!axios.isCancel(err)) {
        upload.state = uploadStates.FAILED
      }
      upload.progress = 0
      console.error(err)
    }
  }

  const iconFileType = computed(() => getIconFileType(props.item.file.type))
  const uploadItemClasses = computed(() => ({
    'upload-item': true,
    'failed': isCanceled.value,
  }))

  const uploadItem = reactive(props.item)
  const { isCanceled } = useUploadStates(uploadItem)


  const handleCancel = () => {
    uploadItem.state = uploadStates.CANCELED
  }

  const handleRetry = () => {
    source.value = axios.CancelToken.source()
    startUpload(uploadItem)
  }

  const setSelectedItem = inject('setSelectedItem') as (selectedFiles: Set<ApiFile>|ApiFile[]) => void
  const handleLocate = () => {
    if (uploadItem.response) {
      setSelectedItem([uploadItem.response])
    }
  }

  watch(() => [uploadItem.progress, uploadItem.state], () => {
    if (uploadItem.state === uploadStates.CANCELED) {
      source.value.cancel('Cancelled by user')
    } else if (uploadItem.state === uploadStates.WAITING) {
      handleRetry()
    }
    emit('change', uploadItem)
  })

  onMounted(() => {
    startUpload(uploadItem)
  })

</script>

<template>
  <li
    class="list-group-item d-flex justify-content-between align-items-center"
  >
    <p :class="uploadItemClasses">
      <component :is="iconFileType" />
      <span>{{ item.file.name }}</span>
    </p>
    <span class="failed-text" v-show="isCanceled">Upload canceled</span>
    <UploadControls
      :item="item"
      @cancel="handleCancel"
      @retry="handleRetry"
      @locate="handleLocate"
    />
  </li>
</template>

<style scoped>
.upload-item {
  line-height: 2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.upload-item,
.failed-text {
  color: #6c757d;
}

.upload-item span,
.failed-text {
  font-size: 12px;
}

.upload-item span {
  margin-left: 6px;
}

.failed {
  width: 140px;
  color: #212529;
}
</style>