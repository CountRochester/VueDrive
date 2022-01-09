import { computed } from 'vue'
import { uploadStates, UploadItem } from '../components/uploader/types'

const useUploadStatistics = (items: UploadItem[]) => {
  const uploadingItemsCount = computed(() => items
    .filter(item => item.state === uploadStates.UPLOADING || item.state === uploadStates.WAITING)
    .length).value

  const failedItemsCount = computed(() => items
    .filter(item => item.state === uploadStates.FAILED || item.state === uploadStates.CANCELED)
    .length).value

  const completeItemsCount = computed(() => items
    .filter(item => item.state === uploadStates.COMPLETE).length).value

  const processingItems = computed(() => items
    .filter(item => item.state !== uploadStates.FAILED && item.state !== uploadStates.CANCELED))

  const processingItemsCount = processingItems.value.length
  const processingItemsProgress = processingItems.value.reduce((total, item) => total + item.progress, 0)

  return {
    uploadingItemsCount,
    completeItemsCount,
    failedItemsCount,
    processingItems,
    processingItemsCount,
    processingItemsProgress
  }
}

export default useUploadStatistics
