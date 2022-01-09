<script lang="ts"> 
  export default {
    name: 'UploadControls' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts">
  import { PropType, ref } from 'vue'
  import ProgressRing from './ProgressRing.vue'
  import { UploadItem } from '../../types'
  import useUploadStates from '../../../../composable/upload-states'

  const props = defineProps({
    item: {
      type: Object as PropType<UploadItem>,
      default: () => ({}) as UploadItem
    }
  })

  const emit = defineEmits({
    cancel: () => true,
    retry: () => true,
    locate: () => true,
  })

  const hovered = ref<boolean>(false)

  const { isCanceled, isUploading, isFailed, isComplete } = useUploadStates(props.item)

</script>

<template>
  <div
    class="upload-controls"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <template v-if="!hovered">
      <ProgressRing
        v-if="isUploading"
        :progress="item.progress"
      />
      <div v-else class="upload-action">
        <div v-if="isCanceled" class="action-canceled">
          <icon-exclamation />
        </div>
        <div v-if="isComplete" class="action-complete">
          <icon-check />
        </div>
      </div>
    </template>
    
    <template v-else>
      <div class="upload-action">
        <div
          v-if="isUploading"
          class="action-cancel"
        >
          <button @click="$emit('cancel')">
            <icon-times />
          </button>
        </div>
        <div
          v-if="isCanceled || isFailed"
          class="action-canceled"
        >
          <button @click="$emit('retry')">
            <icon-clockwise />
          </button>
        </div>
        <div
          v-if="isComplete"
          class="action-locate"
        >
          <button @click="$emit('locate')">
            <icon-folder-open />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.upload-controls,
.upload-action,
.action-cancel,
.action-canceled,
.action-complete,
.action-locate {
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-controls {
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.upload-controls:hover {
  background-color: #d9d9d9;
  fill: white;
}

.upload-controls button {
  background: transparent;
  padding: 0;
  border: none;
}

.upload-action,
.upload-controls button {
  width: 32px;
  height: 32px;
}

.action-cancel,
.action-canceled,
.action-complete,
.action-locate {
  width: 70%;
  height: 70%;
  border-radius: 50%;
}

.action-cancel {
  background-color: #333;
}

.action-canceled {
  background-color: #dc3545;
}

.action-complete {
  background-color: #28a745;
}

.action-locate {
  position: relative;
  background-color: #d9d9d9;
}

.upload-action svg {
  width: 70%;
  height: 70%;
  color: #fff;
}
</style>