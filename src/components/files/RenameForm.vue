<script lang="ts"> 
  export default { 
    name: 'FileRenameForm', // this method will resolve the error ：“Module ... has no default export.Vetur(1192)”
  } 
</script>

<script setup lang="ts">
  import { PropType, ref } from 'vue'
  import { AxiosRequestConfig } from 'axios'
  import { ApiFile, ApiFolder, SingleFolderResponse, SingleFileResponse } from '../../api/types'

  type SubmitType = (payload: ApiFile|ApiFolder, id: string|number, config?: AxiosRequestConfig) => Promise<SingleFolderResponse|SingleFileResponse>

  const props = defineProps({
    data: {
      type: Object as PropType<ApiFile|ApiFolder>,
      default: ():ApiFile => ({} as ApiFile|ApiFolder),
      required: true
    },

    submit: {
      type: Function as PropType<SubmitType>,
      required: true
    }
  })

  const emit = defineEmits({
    'updated': (payload: ApiFile) => true,
    close: () => true
  })

  const name = ref(props.data.name)

  const handleSubmit = async () => {
    try {
      const file = props.data
      const { data } = await props.submit({ ...file, name: name.value }, file.id)
      emit('updated', data)
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
        Ok
      </button>
      <button class="btn btn-outline-secondary me-2" @click.prevent="$emit('close')">
        Cancel
      </button>
    </div>
  </form>
</template>