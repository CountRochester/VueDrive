<script lang="ts"> 
  export default { 
    name: 'PopupControls' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts"> 
  import { ref } from 'vue'

  const emit = defineEmits({
    'toggle': () => true,
    'close': () => true,
  })

  const open = ref<boolean>(true)
</script>

<template>
  <div class="popup-controls">
    <button
      class="rounded-button me-2"
      @click="open = !open, $emit('toggle')"
    >
      <icon-chevron-down v-if="open" />
      <icon-chevron-up v-else />
    </button>
    <button
      class="rounded-button"
      @click="$emit('close')"
    >
      <icon-times />
    </button>
  </div>
</template>

<style scoped>
.rounded-button svg {
  fill: #f7f7f7;
}

.rounded-button {
  background: #212529;
}

.rounded-button:hover {
  background: #31363b;
}
</style>