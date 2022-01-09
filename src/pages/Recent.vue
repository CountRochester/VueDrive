<script lang="ts"> 
  export default { 
    name: 'Recent' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts"> 
  import { ref, onMounted } from 'vue'
  import { recentFiles } from '../api/recent'
  import { ApiFile } from '../api/types'
  import FilesList from '../components/files/FilesList.vue'

  const getRecentFiles = async (): Promise<ApiFile[]> => {
    try {
      const { data } = await recentFiles()
      return data
    } catch (err) {
      console.log(err)
      return []
    }
  }

  const files = ref<ApiFile[]>([])
  const selectedItems = ref<ApiFile[]>([])

  const handleSelectChange = (selectedFiles: Set<ApiFile>|ApiFile[]) => {
    selectedItems.value = [...selectedFiles]
  }


  onMounted(async () => {
    files.value = await getRecentFiles()
  })
</script>

<template>
  <div class="container-fluid">
    <h5 class="pt-2 pb-3 border-bottom">Recent files</h5>
    <div class="pt-2">
      <FilesList 
        :files="files"
        :selected="selectedItems"
        @select-change="handleSelectChange"
      />
    </div>
  </div>
</template>