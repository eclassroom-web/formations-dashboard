<template>
  <button
    role="switch"
    :aria-checked="String(localChecked)"
    class="toggle-track"
    :class="{ on: localChecked }"
    @click="toggle"
  >
    <span class="toggle-thumb"></span>
  </button>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  checked: { type: Boolean, default: false },
  formationId: { type: [String, Number], required: true },
});

const emit = defineEmits(['change']);

const localChecked = ref(props.checked);

watch(() => props.checked, (val) => {
  localChecked.value = val;
});

function toggle() {
  localChecked.value = !localChecked.value;
  emit('change', { id: props.formationId, status: localChecked.value ? 'published' : 'draft' });
}
</script>

<style scoped>
.toggle-track {
  display: inline-flex;
  align-items: center;
  width: 34px;
  height: 18px;
  border-radius: 99px;
  background: #d1d5db;
  border: none;
  cursor: pointer;
  padding: 0 2px;
  transition: background 0.2s;
  flex-shrink: 0;
}
.toggle-track.on {
  background: #7C3AED;
}
.toggle-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.toggle-track.on .toggle-thumb {
  transform: translateX(16px);
}
</style>
