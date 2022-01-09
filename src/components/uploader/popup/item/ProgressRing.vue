<script lang="ts"> 
  export default {
    name: 'ProgressRing' // this method will resolve the error ：“Module ... has no default export.Vetur(1192)” 
  } 
</script>

<script setup lang="ts">
  import { PropType, computed } from 'vue'

  const props = defineProps({
    radius: {
      type: Number as PropType<number>,
      default: 16
    },

    strokeWidth: {
      type: Number as PropType<number>,
      default: 3
    },

    progress: {
      type: Number as PropType<number>,
      default: 0
    }
  })

  const circleRadius = computed(() => {
    return props.radius  - props.strokeWidth * 2
  })

  const circumference = computed(() => circleRadius.value * 2 * Math.PI)

  const strokeDashoffset = computed(() => circumference.value - (props.progress / 100) * circumference.value)
</script>

<template>
  <svg :height="radius * 2" :width="radius * 2">
    <circle
      stroke="#ccc" 
      :stroke-width="strokeWidth" 
      fill="transparent" 
      :cx="radius" 
      :cy="radius" 
      :r="circleRadius"
    />

    <circle
      class="progress-ring"
      stroke="#3881ff" 
      :stroke-width="strokeWidth" 
      fill="transparent" 
      :cx="radius" 
      :cy="radius" 
      :r="circleRadius"
      :stroke-dasharray="`${circumference} ${circumference}`"
      :stroke-dashoffset="strokeDashoffset"
    />
  </svg>
</template>

<style scoped>
.progress-ring {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
</style>