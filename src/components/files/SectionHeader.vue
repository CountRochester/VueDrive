<script lang="ts"> 
  export default { 
    name: 'SectionHeader' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts"> 
  import { PropType } from 'vue'
  import ShortToggler from './ShortToggler.vue'
  import { FileSortPayload } from '../../api/types'

  const props = defineProps({
    title: {
      type: String as PropType<string>,
      default: ''
    },

    sortToggler: {
      type: Boolean as PropType<boolean>,
      default: false
    },
  })

  const emit = defineEmits({
    'sort-change': (payload: FileSortPayload) => !!payload
  })

</script>

<template>
  <div class="d-flex justify-content-between align-items-center py-2">
    <h6 class="text-muted mb-0">{{ title }}</h6>
    <ShortToggler
      v-if="sortToggler"
      @sort-change="$emit('sort-change', $event)"
    />
  </div>
</template>
