<script lang="ts"> 
  export default { 
    name: 'Drive' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts"> 
  import Sidebar from '../components/Sidebar.vue'
</script>

<template>
  <div class="container-fluid py-3">
    <div class="row">
      <div class="col-md-2">
        <Sidebar />
      </div>
      <div class="col-md-10">
        <router-view />
      </div>
    </div>
  </div>
</template>