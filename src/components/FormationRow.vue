<template>
  <div class="row" :class="{ 'no-border': isLast }">
    <div class="cell titre-cell">
      <span class="titre-text">{{ formation.title }}</span>
    </div>
    <div class="cell cat-cell hide-mobile">{{ formation.category || '—' }}</div>
    <div class="cell niveau-cell hide-mobile">
      <span class="level-badge">{{ formation.niveau || formation.level || '—' }}</span>
    </div>
    <div class="cell date-cell hide-mobile">{{ formattedDate }}</div>
    <div class="cell toggle-cell">
      <PublishToggle
        :checked="formation.status === 'published'"
        :formationId="formation.id"
        @change="$emit('publish-change', $event)"
      />
      <span class="toggle-label" :class="{ published: formation.status === 'published' }">
        {{ formation.status === 'published' ? 'Publié' : 'Brouillon' }}
      </span>
    </div>
    <div class="cell actions-cell">
      <button class="edit-btn" @click="$emit('edit', formation.id)">Éditer</button>
      <button class="icon-btn" @click="$emit('settings', formation.id)" title="Paramètres">⚙</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import PublishToggle from './PublishToggle.vue';

const props = defineProps({
  formation: { type: Object, required: true },
  isLast: { type: Boolean, default: false },
});

defineEmits(['publish-change', 'edit', 'settings']);

const formattedDate = computed(() => {
  if (!props.formation.created_at) return '—';
  const d = new Date(props.formation.created_at);
  return isNaN(d) ? '—' : d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
});
</script>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 120px 110px;
  padding: 11px 14px;
  align-items: center;
  border-bottom: 0.5px solid rgba(255,255,255,0.06);
  transition: background 0.12s;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: transparent;
}
.row.no-border {
  border-bottom: none;
}
.row:hover {
  background: rgba(255,255,255,0.05);
}

.cell {
  font-size: 13px;
  color: #8B949E;
  overflow: hidden;
  padding-right: 8px;
}
.titre-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.titre-text {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #E6EDF3;
}
.level-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  white-space: nowrap;
  display: inline-block;
  color: #C9D1D9;
}

.toggle-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}
.toggle-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary, #9ca3af);
}
.toggle-label.published {
  color: #7C3AED;
}

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
}
.edit-btn {
  border: 0.5px solid #3b82f6;
  color: #3b82f6;
  background: transparent;
  border-radius: 6px;
  font-size: 11px;
  padding: 4px 10px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.12s;
}
.edit-btn:hover {
  background: rgba(59,130,246,0.1);
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  border-radius: 5px;
  transition: background 0.12s;
  line-height: 1;
  color: var(--color-text-secondary, inherit);
}
.icon-btn:hover {
  background: rgba(255,255,255,0.06);
}

@media (max-width: 640px) {
  .row {
    grid-template-columns: 2fr 120px 110px;
  }
  .hide-mobile {
    display: none;
  }
}
</style>
