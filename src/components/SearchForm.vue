<script lang="ts"> 
  export default { 
    name: 'SearchForm' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts">
import { PropType } from 'vue'

defineProps({
  modelValue: {
    type: String as PropType<string>,
    default: ''
  }
})

const emit = defineEmits({
  'update:modelValue': (payload: string) => { return true }
})

const handleEnterKey = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleEscKey = () => {
  emit('update:modelValue', '')
}

</script>

<template>
  <form class="form-inline mt-2 mt-md-0">
    <input
      class="form-control"
      type="text"
      placeholder="Search in Drive"
      aria-label="Search"
      :value="modelValue"
      @keydown.enter.prevent="handleEnterKey"
      @keydown.esc="handleEscKey"
    />
  </form>
</template>