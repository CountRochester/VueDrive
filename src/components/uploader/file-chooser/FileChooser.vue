<script lang="ts"> 
  export default { 
    name: 'FileChooser' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts"> 
  import { ref } from 'vue'

  const emit = defineEmits({
    'files-chosen': (payload: FileList) => true
  })

  const file = ref<HTMLInputElement>()

  const handleClick = () => {
    file.value?.click()
  }

  const handleFilesChoose = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files) {
      emit('files-chosen', target.files)
    }
  }
</script>

<template>
  <button
    class="btn btn-outline-primary"
    @click="handleClick"
  >
    <icon-upload /> Upload Files
  </button>

  <input
    ref="file"
    type="file"
    style="display: none;"
    multiple
    @change="handleFilesChoose"
  >
</template>