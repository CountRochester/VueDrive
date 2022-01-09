<template>
  <transition :name="direction">
    <div class="my-toast" :class="toastType + ' ' + toastPosition" v-show="show">
      <div class="toast-icon">
        <component :is="toastIcon"></component>
      </div>
      <div class="toast-content">
        <div class="toast-title">{{ toastTitle }}</div>
        <div class="toast-message">{{ message }}</div>
      </div>
      <button
        class="toast-button"
        @click="$emit('hide')"
      >
        &times;
      </button>
    </div>
  </transition>
</template>

<script>
import IconError from './IconError.vue'
import IconSuccess from './IconSuccess.vue'
import IconWarning from './IconWarning.vue'

export default {
  components: {
    IconError,
    IconSuccess,
    IconWarning
  },

  emits: ['hide'],

  props: {
    title: {
      type: String,
      default: ''
    },

    message: {
      type: String,
      default: ''
    },

    show: {
      type: Boolean,
      default: false
    },

    type: {
      type: String,
      default: 'success',
      validator: value => {
        return ['success', 'warning', 'error'].includes(value)
      }
    },

    position: {
      type: String,
      default: 'bottom-right',
      validator: value => {
        return ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(value)
      }
    },
  },

  data () {
    return {
      timeout: null
    }
  },

  computed: {
    validType () {
      return ['success', 'warning', 'error'].includes(this.type)
        ? this.type
        : 'error'
    },

    toastPosition () {
      return ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(this.position)
        ? this.position
        : 'bottom-right'
    },

    direction () {
      return this.toastPosition.includes('right') ? 'rtl' : 'ltr'
    },

    toastTitle () {
      return this.title || this.validType[0].toUpperCase() + this.validType.slice(1)
    },

    toastType () {
      return `toast-${this.validType}`
    },

    toastIcon () {
      console.log('this.validType', this.validType)
      return `icon-${this.validType}`
    },
  },

  watch: {
    show (value) {
      if (!value) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        return 
      }
      this.timeout = setTimeout(() => {
        this.$emit('hide')
      }, 3000)
    }
  },

  beforeUnmount () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }
}
</script>

<style scoped>
.my-toast {
  position: absolute;
  width: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  box-shadow: 1px 5px 10px -5px #00000032;
}

.my-toast::before {
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  width: 4px;
  height: 100%;
}

.toast-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  padding: 7px;
}

.toast-icon svg {
  transform: scale(1.5);
}

.toast-success .toast-icon svg {
  fill: #ecfdf5;
}

.toast-success {
  background: #ecfdf5;
}

.toast-success::before,
.toast-success .toast-icon {
  background: #34d399;
}

.toast-warning .toast-icon svg {
  fill: #fffbeb
}

.toast-warning {
  background: #fffbeb;
}

.toast-warning::before,
.toast-warning .toast-icon {
  background: #f59e0b;
}

.toast-error .toast-icon svg {
  fill: #fef2f2
}

.toast-error {
  background: #fef2f2;
}

.toast-error::before,
.toast-error .toast-icon {
  background: #ef4444;
}

.toast-content {
  flex-grow: 1;
  margin: 0 1rem;
}

.toast-title {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.toast-message {
  font-size: 14px;
  color: #6b7280;
}

.toast-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5em;
  height: 1.5em;
  border: none;
  padding: 0;
  color: #9ca3af;
  opacity: 0.7;
  background: transparent;
  cursor: pointer;
  font-size: 2.0em;
}

.toast-button:hover {
  opacity: 1;
}

.bottom-left {
  position: fixed;
  left: 20px;
  bottom: 20px;
}

.bottom-right {
  position: fixed;
  right: 20px;
  bottom: 20px;
}

.top-left {
  position: fixed;
  left: 20px;
  top: 20px;
}

.top-right {
  position: fixed;
  right: 20px;
  top: 20px;
}

.rtl-enter-active, 
.rtl-leave-active,
.ltr-enter-active, 
.ltr-leave-active  {
  transition: all 0.5s ease-in-out;
}

.rtl-leave-to,
.ltr-leave-to {
  opacity: 0;
}

.rtl-enter-from, 
.rtl-leave-to {
  transform: translateX(100%);
}

.ltr-enter-from, 
.ltr-leave-to {
  transform: translateX(-100%);
}

</style>