<script lang="ts"> 
  export default { 
    name: 'DropZone' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts"> 
  import { ref, PropType } from 'vue'
  import DropZoneMessage from './DropZoneMessage.vue'

  const emit = defineEmits({
    'files-dropped': (payload: FileList) => true
  })

  const props = defineProps({
    showMessage: {
      type: Boolean as PropType<boolean>,
      default: true
    }
  })

  const dragged = ref<boolean>(false)

  const handleDrop = (event: InputEvent) => {
    dragged.value = false
    if (event.dataTransfer && event.dataTransfer.files) {
      emit('files-dropped', event.dataTransfer.files)
    }
  }
</script>

<template>
  <div
    class="dropzone"
    :class="{ 'dragged-over': dragged }"
    @dragover.prevent="dragged = true"
    @dragleave.prevent="dragged = false"
    @drop.prevent="handleDrop"
  >
    <DropZoneMessage
      v-show="showMessage"
    />
    <slot />
  </div>
</template>

<style scoped>
.dropzone {
  min-height: 80vh;
  border: 2px solid #fff;
  background: #fff;
  padding: 0.3em;
}

.dragged-over {
  background: #e8f0fe;
  border: 2px solid #4285f4;
}
</style>
