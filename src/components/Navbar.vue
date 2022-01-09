<script lang="ts"> 
  export default { 
    name: 'Navbar' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
// import SearchForm from './SearchForm.vue'

const q = ref('')

// watchEffect(() => console.log('q', q.value))

</script>

<template>
  <nav
    class="
      navbar navbar-light
      bg-white
      navbar-expand-lg
      border-bottom
      fixed-top
    "
  >
    <div class="container-fluid">
      <a class="navbar-brand" href="/"><strong>Vue</strong>Drive</a>
      <div id="search-form"></div>
    </div>
  </nav>
</template>
