import { reactive } from 'vue'
import { ApiFolder, ApiFile } from '../api/types'

const selectedItems = reactive(new Set<ApiFolder | ApiFile>())

type EmitType<T> = (eventName: 'select-change', payload: Set<T>) => void

const useItemsSelection = <T extends ApiFolder|ApiFile>(selected: (ApiFolder|ApiFile)[], emit: EmitType<T>) => {

  const selectOne = (item: T) => {
    selectedItems.clear()
    selectedItems.add(item)
    emit('select-change', selectedItems as ReturnType<() => Set<T>>)
  }

  const selectMultiple = (item: T) => {
    if (selectedItems.has(item)) {
      selectedItems.delete(item)
    } else {
      selectedItems.add(item)
    }
    
    emit('select-change', selectedItems as ReturnType<() => Set<T>>)
  }

  const isSelected = (item: T) => selectedItems.has(item) ||
    selected.length &&
    selected.some((el: ApiFile) => el.id === item.id && el.mimeType)

  const clearSelected = () => {
    selectedItems.clear()
    emit('select-change', selectedItems as ReturnType<() => Set<T>>)
  }

  return {
    selectOne,
    selectMultiple,
    isSelected,
    clearSelected
  }
}

export default useItemsSelection
