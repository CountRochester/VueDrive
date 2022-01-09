<script lang="ts"> 
import { defineProps } from '@vue/runtime-core'
import { nextTick } from 'vue'
  export default { 
    name: 'NewFolderForm', // this method will resolve the error ：“Module ... has no default export.Vetur(1192)”
  } 
</script>

<script setup lang="ts">
  import { PropType, ref } from 'vue'
  import { ApiFolder, } from '../../api/types'
  import foldersApi from '../../api/folders'


  const props = defineProps({
    folderId: {
      type: [Number, String] as PropType<number|string>,
      default: 0
    }
  })

  const emit = defineEmits({
    'folder-created': (payload: ApiFolder) => true,
    close: () => true
  })

  const name = ref('Untitled folder')

  const handleSubmit = async () => {
    try {
      const { data } = await foldersApi.create({
        name: name.value,
        folderId: props.folderId
      })
      emit('folder-created', data)
      emit('close')
    } catch (err) {
      console.error(err)
    }
  }
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input
      v-model="name"
      v-highlight
      type="text" 
      class="form-control"
    >
    <div class="d-flex flex-row-reverse mt-3">
      <button class="btn btn-primary" type="submit">
        Create
      </button>
      <button class="btn btn-outline-secondary me-2" @click.prevent="$emit('close')">
        Cancel
      </button>
    </div>
  </form>
</template>