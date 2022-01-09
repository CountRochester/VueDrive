<script lang="ts"> 
  export default { 
    name: 'UploaderControls' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts"> 
  import { computed, PropType, toRef } from 'vue'
  import useUploadStatistics from '../../../composable/upload-statistics'
  import { UploadItem } from '../types'

  const props = defineProps({
    items: {
      type: Array as PropType<UploadItem[]>,
      default: () => [] as UploadItem[]
    }
  })

  const emit = defineEmits({
    'cancel': () => true,
    'retry': () => true,
  })

  const items = toRef(props, 'items')

  const overallProgress = computed(() => {
    const { processingItemsCount, processingItemsProgress } = useUploadStatistics(items.value)

    if (processingItemsCount < 1) {
      return 0
    }

    return Math.round(processingItemsProgress / processingItemsCount)
  })

  const showButtons = computed(() => {
    const { completeItemsCount } = useUploadStatistics(items.value)
    return items.value.length !== completeItemsCount
  })

  const showCancelBtn = computed(() => {
    const { failedItemsCount } = useUploadStatistics(items.value)
    return items.value.length !== failedItemsCount
  })
</script>

<template>
  <div class="bg-light py-2 px-3 d-flex justify-content-between align-items-center border-bottom">
    <span class="text-secondary">{{ overallProgress }}% complete</span>
    <div v-if="showButtons">
      <a
        v-if="showCancelBtn"
        href="#"
        class="text-decoration-none"
        @click.prevent="$emit('cancel')"
      >
        CANCEL
      </a>
      <a
        v-else
        href="#"
        class="text-decoration-none"
        @click.prevent="$emit('retry')"
      >
        RETRY
      </a>
    </div>
  </div>
</template>