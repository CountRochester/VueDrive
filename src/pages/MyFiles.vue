<script lang="ts"> 
  export default { 
    name: 'MyFiles' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts">
import { ref, reactive, watchEffect, provide, Ref, onMounted, computed, toRef, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ActionBar from '../components/ActionBar.vue'
import FilesList from '../components/files/FilesList.vue'
import FoldersList from '../components/folders/FoldersList.vue'
import SearchForm from '../components/SearchForm.vue'
import RenameForm from '../components/files/RenameForm.vue'
import DropZone from '../components/uploader/file-chooser/DropZone.vue'
import UploaderPopup from '../components/uploader/popup/UploaderPopup.vue'
import SectionHeader from '../components/files/SectionHeader.vue'
import NewFolderForm from '../components/folders/NewFolderForm.vue'
import filesApi from '../api/files'
import foldersApi from '../api/folders'
import { addFileToStarred, addFolderToStarred } from '../api/starred'
import { ApiFile, ApiFolder, FileQuery, FileSortPayload, DeleteApiFunction, ServerError } from '../api/types'

const q = ref('')
const modal = reactive({
  rename: false,
  newFolder: false
})

const route = useRoute()
const router = useRouter()

const getPath = (folderId?: string): { folderPath: string, filePath: string } => {
  let folderPath = 'folders'
  let filePath = 'files'

  if (folderId !== undefined && +folderId > 0) {
    const basePath = `folder/${folderId}`
    folderPath = `${basePath}/${folderPath}`
    filePath = `${basePath}/${filePath}`
  }

  return { folderPath, filePath }
}

const fetchFoldersAndFiles = async (folderId: string, query?: FileQuery): Promise<{ folders: ApiFolder[], files: ApiFile[] }>  => {
  try {
    const { folderPath, filePath } = getPath(folderId)
    const apiQuery = { ...query, folderId }
    const { data: files } = await filesApi.index(apiQuery, filePath)
    const { data: folders } = await foldersApi.index(apiQuery, folderPath)
    return { folders, files }
  } catch (err) {
    if ((err as ServerError).response && (err as ServerError).response.status === 404) {
      router.push({
        name: 'error.404.resource',
        params: { resource: 'folder' },
      })
      return { folders: [], files: [] }
    } else {
      console.error(err)
      return { folders: [], files: [] }
    }
  }
}

const files = ref<ApiFile[]>([])
const folders = ref<ApiFolder[]>([])
const query = reactive<FileQuery>({
  _sort: 'name',
  _order: 'asc',
  q: '',
  // folderId: '0'
})
const folderId = ref('0')

const chosenFiles = ref<FileList|File[]>([])

const toast = reactive({
  show: false,
  message: ''
})

const handleSortChange = (payload: FileSortPayload) => {
  query._sort = payload.column
  query._order = payload.order
}

const selectedItems = ref<(ApiFile|ApiFolder)[]>([])

const handleSelectChange = (selectedFiles: Set<ApiFile>|ApiFile[]) => {
  selectedItems.value = [...selectedFiles]
}

provide('setSelectedItem', handleSelectChange)

const removeItem = async (item: ApiFile|ApiFolder, items: Ref<(ApiFile|ApiFolder)[]>, deleteApi: DeleteApiFunction) => {
  try {
    const response = await deleteApi(item.id)
    if (response.status === 200 || response.status === 204) {
      const index = items.value.findIndex(el => el.id === item.id)
      items.value.splice(index, 1)
    }
  } catch (err) {
    console.error(err)
  }
}

const handleRemove = () => {
  if (confirm('Are you sure?')) {
    selectedItems.value.forEach(item => {
      if ((item as ApiFile).mimeType) {
        removeItem(item, files, filesApi.delete)
      } else {
        removeItem(item, folders, foldersApi.delete)
      }
    })
    selectedItems.value.splice(0)
    toast.show = true
    toast.message = 'Selected item(s) successfully removed.'
  }
}

const handleUploadComplete = (file: ApiFile) => {
  files.value.push(file)
}

const handleDoubleClickFolder = (folder: ApiFolder) => {
  router.push({ name: 'folders', params: { folderId: folder.id } })
}

const renameFile = filesApi.update
const renameFolder = foldersApi.update

const handleRename = (items: (ApiFile|ApiFolder)[], newItem: ApiFile|ApiFolder) => {
  const entity = (newItem as ApiFile).mimeType ? 'File' : 'Folder'
  const oldItem = selectedItems.value[0]
  const index = items.findIndex(item => item.id === newItem.id)
  items.splice(index, 1, newItem)

  toast.show = true
  toast.message = `${entity} ${oldItem.name} renamed to ${newItem.name}`
}

const handleUpdateFile = (file: ApiFile) => {
  handleRename(files.value, file)
}

const handleUpdateFolder = (folder: ApiFolder) => {
  handleRename(folders.value, folder)
}

const isFile = computed<boolean>(() => {
  if (selectedItems.value.length !== 1) {
    return false
  }
  const selectedItem = selectedItems.value[0] as ApiFile
  return !!selectedItem.mimeType
})

const handleCreateFolder = (folder: ApiFolder) => {
  folders.value.push(folder)
  toast.show = true
  toast.message = `Folder ${folder.name} successfully created`
}

const addToStarred = (items: (ApiFile|ApiFolder)[]) => {
  return Promise.all(items.map(item => {
    if ((item as ApiFile).mimeType) {
      addFileToStarred(item)
    } else {
      addFolderToStarred(item)
    }
  }))
}

const addItemsToStarred = async () => {
  await addToStarred(selectedItems.value)
  selectedItems.value.splice(0)
  toast.show = true
  toast.message = 'Selected item(s) added to starred'
}

watchEffect(async () => {
  if (!Array.isArray(route.params.folderId)) {
    folderId.value = route.params.folderId || '0'
  }
  const { files: fetchedFiles, folders: fetchedFolders } = await fetchFoldersAndFiles(folderId.value, query)
  files.value = fetchedFiles
  folders.value = fetchedFolders
})

watch(query, (newQuery) => {
  if (!route.name) {
    return
  }
  router.push({ name: route.name, query: newQuery })
})

// watch(
//   () => query._order, 
//   async () => {
//     files.value = await fetchFiles(query)
//   },
//   { immediate: true }
// )

</script>

<template>
  <div class="container">
    <ActionBar
      :selected-count="selectedItems.length"
      @remove="handleRemove"
      @rename="modal.rename = true"
      @files-chosen="chosenFiles = $event"
      @create-folder="modal.newFolder = true"
      @starred="addItemsToStarred"
    />
    <DropZone
      :showMessage="!files.length && !folders.length"
      @files-dropped="chosenFiles = $event"
    >
      <SectionHeader
        v-if="folders.length"
        title="Folders"
        sort-toggler
        @sort-change="handleSortChange"
      />
      <FoldersList 
        :folders="folders"
        :selected="selectedItems"
        @select-change="handleSelectChange"
        @double-click="handleDoubleClickFolder"
      />
      <SectionHeader
        v-if="files.length"
        :sort-toggler="!folders.length"
        title="Files"
        @sort-change="handleSortChange"
      />
      <FilesList 
        :files="files"
        :selected="selectedItems"
        @select-change="handleSelectChange"
      />
    </DropZone>

    <teleport to="#search-form">
      <SearchForm v-model="query.q" />
    </teleport>

    <app-toast
      :show="toast.show"
      :message="toast.message"
      type="success"
      position="bottom-left"
      @hide="toast.show = false"
    />

    <app-modal
      title="Rename"
      :show="modal.rename && selectedItems.length === 1"
      @hide="modal.rename = false"
    >
      <RenameForm
        v-if="isFile"
        :data="selectedItems[0]"
        :submit="renameFile"
        @close="modal.rename = false"
        @updated="handleUpdateFile"
      />

      <RenameForm
        v-else
        :data="selectedItems[0]"
        :submit="renameFolder"
        @close="modal.rename = false"
        @updated="handleUpdateFolder"
      />
    </app-modal>

    <app-modal
      title="New Folder"
      :show="modal.newFolder"
      @hide="modal.newFolder = false"
    >
      <NewFolderForm
        :folder-id="folderId"
        @close="modal.newFolder = false"
        @folder-created="handleCreateFolder"
      />
    </app-modal>

    <UploaderPopup
      :files="chosenFiles"
      :folder-id="folderId"
      @upload-complete="handleUploadComplete"
    />

  </div>
</template>
