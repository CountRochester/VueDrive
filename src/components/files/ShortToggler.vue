<script lang="ts"> 
  export default { 
    name: 'ShortToggler' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { FileSortPayload } from '../../api/types'

  const emit = defineEmits({
    'sort-change': (payload: FileSortPayload) => !!payload
  })

  const sort = reactive<FileSortPayload>({
    column: 'name',
    order: 'asc'
  })

  const toggle = () => {
    sort.order = sort.order === 'asc' ? 'desc' : 'asc'
    emit('sort-change', sort)
  }
</script>

<template>
  <button @click="toggle" class="rounded-button">
    <icon-arrow-up
      v-if="sort.order === 'asc'"
    />
    <icon-arrow-down v-else />
  </button>
</template>