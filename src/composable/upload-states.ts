import { computed } from 'vue'
import { uploadStates, UploadItem } from '../components/uploader/types'

const useUploadStates = (item: UploadItem) => {
  const isCanceled = computed(() => item.state === uploadStates.CANCELED)
  const isUploading = computed(() => item.state === uploadStates.UPLOADING || item.state === uploadStates.WAITING)
  const isFailed = computed(() => item.state === uploadStates.FAILED)
  const isComplete = computed(() => item.state === uploadStates.COMPLETE)

  return {
    isCanceled,
    isUploading,
    isFailed,
    isComplete
  }
}

export default useUploadStates
