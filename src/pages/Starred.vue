<script lang="ts"> 
  export default { 
    name: 'Starred' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang='ts'>
  import { reactive, ref, onMounted, Ref } from 'vue'
  import SectionHeader from '../components/files/SectionHeader.vue'
  import FilesList from '../components/files/FilesList.vue'
  import FoldersList from '../components/folders/FoldersList.vue'
  import { starredFiles, starredFolders, removeFileFromStarred, removeFolderFromStarred } from '../api/starred'
  import { ApiFile, ApiFolder,DeleteFromStarredFunction } from '../api/types'

  const fetchStarredFoldersAndFiles = async (): Promise<{ files: ApiFile[], folders: ApiFolder[] }> => {
    try {
      const { data: files } = await starredFiles()
      const { data: folders } = await starredFolders()
      return { files, folders }
    } catch (err) {
      console.error(err)
      return {
        files: [],
        folders: []
      }
    }
  }

  const toast = reactive({
    show: false,
    message: '',
  })

  const files = ref<ApiFile[]>([])
  const folders = ref<ApiFolder[]>([])

  const selectedItems = ref<(ApiFile|ApiFolder)[]>([])

  const handleSelectChange = (selectedFiles: Set<ApiFile>|ApiFile[]) => {
    selectedItems.value = [...selectedFiles]
  }

  const removeFromStarred = async (item: ApiFile|ApiFolder, 
    items: Ref<(ApiFile|ApiFolder)[]>, deleteApi: DeleteFromStarredFunction) => {
    try {
      const response = await deleteApi(item)
      if (response.status === 200 || response.status === 204) {
        const index = items.value.findIndex(el => el.id === item.id)
        items.value.splice(index, 1)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const removeItemsFromStarred = async () => {
    await Promise.all(selectedItems.value.map(item => {
      if ((item as ApiFile).mimeType) {
        return removeFromStarred(item, files, removeFileFromStarred)
      }
      return removeFromStarred(item, folders, removeFolderFromStarred)
    }))
    selectedItems.value.splice(0)
    toast.show = true
    toast.message = 'Selected item(s) removed from starred'
  }

  onMounted(async () => {
    const { files: fetchedFiles, folders: fetchedFolders } = await fetchStarredFoldersAndFiles()
    files.value = fetchedFiles
    folders.value = fetchedFolders
  })

</script>

<template>
  <div class="container-fluid">
    <div
      class="
        pt-2
        pb-3
        border-bottom
        d-flex
        justify-content-between
        align-items-center
      "
    >
      <span class="h5 mb-0">Starred</span>
      <a
        v-if="selectedItems.length"
        href="#"
        class="rounded-button"
        title="Remove from starred"
        @click.prevent="removeItemsFromStarred"
      >
        <icon-star />
      </a>
    </div>
    <div class="pt-3">
      <SectionHeader title="Folders" />
      <FoldersList 
        :folders="folders"
        :selected="selectedItems"
        @select-change="handleSelectChange"
        @double-click="$router.push({ name: 'folders', params: { folderId: $event.id } })"
      />
      
      <SectionHeader title="Files" />
      <FilesList 
        :files="files"
        :selected="selectedItems"
        @select-change="handleSelectChange"
      />
    </div>
    <app-toast
      :show="toast.show"
      :message="toast.message"
      type="success"
      position="bottom-left"
      @hide="toast.show = false"
    />
  </div>
</template>
