<template>
  <div class="card">
    <!-- Cover -->
    <div class="card-cover">
      <img v-if="formation.cover_image" :src="formation.cover_image" class="cover-img" alt="" />
      <div v-else class="cover-gradient" :style="{ background: categoryGradient }"></div>
      <span class="category-pill">{{ formation.category || 'Autre' }}</span>
    </div>

    <!-- Body -->
    <div class="card-body">
      <h3 class="card-title">{{ formation.title }}</h3>
      <div class="card-meta">
        <span class="level-badge">{{ formation.niveau || formation.level || '—' }}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <div class="footer-left">
        <PublishToggle
          :checked="formation.status === 'published'"
          :formationId="formation.id"
          @change="$emit('publish-change', $event)"
        />
        <span class="publish-label" :class="{ published: formation.status === 'published' }">
          {{ formation.status === 'published' ? 'Publié' : 'Brouillon' }}
        </span>
      </div>
      <div class="footer-right">
        <button class="icon-btn" title="Aperçu" @click="$emit('preview', formation.id)">👁</button>
        <button class="icon-btn" title="Paramètres" @click="$emit('settings', formation.id)">⚙</button>
        <button class="icon-btn" title="Supprimer" @click="confirmDelete">🗑</button>
      </div>
    </div>

    <!-- Inline delete confirmation -->
    <div v-if="showDeleteConfirm" class="delete-confirm">
      <span class="confirm-text">Confirmer ?</span>
      <button class="confirm-btn yes" @click="doDelete">Oui</button>
      <button class="confirm-btn no" @click="showDeleteConfirm = false">Annuler</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import PublishToggle from './PublishToggle.vue';

const props = defineProps({
  formation: { type: Object, required: true },
});

const emit = defineEmits(['publish-change', 'preview', 'settings', 'delete']);

const showDeleteConfirm = ref(false);

const GRADIENTS = {
  Trading: 'linear-gradient(135deg, #1e1b4b, #4338ca)',
  Autre: 'linear-gradient(135deg, #064e3b, #059669)',
  Marketing: 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
};

const categoryGradient = computed(() =>
  GRADIENTS[props.formation.category] || 'linear-gradient(135deg, #2d1b4e, #7C3AED)'
);

function confirmDelete() {
  showDeleteConfirm.value = true;
}

function doDelete() {
  showDeleteConfirm.value = false;
  emit('delete', props.formation.id);
}
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: box-shadow 0.15s;
}
.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.06);
}

.card-cover {
  position: relative;
  width: 100%;
  padding-top: 52%;
  overflow: hidden;
}
.cover-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover-gradient {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.category-pill {
  position: absolute;
  bottom: 8px;
  left: 10px;
  font-size: 10px;
  background: rgba(0,0,0,0.35);
  color: #fff;
  text-transform: uppercase;
  padding: 3px 7px;
  border-radius: 4px;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.card-body {
  padding: 12px 14px 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.card-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e1b4b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.level-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  background: #f3f4f6;
  border: 0.5px solid rgba(0,0,0,0.08);
  color: #374151;
  display: inline-block;
}

.card-footer {
  padding: 9px 14px;
  border-top: 0.5px solid rgba(0,0,0,0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.footer-left {
  display: flex;
  align-items: center;
  gap: 7px;
}
.publish-label {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
}
.publish-label.published {
  color: #7C3AED;
}
.footer-right {
  display: flex;
  gap: 2px;
}
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 5px;
  border-radius: 6px;
  transition: background 0.12s;
  line-height: 1;
}
.icon-btn:hover {
  background: #f3f4f6;
}

.delete-confirm {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid rgba(0,0,0,0.1);
  padding: 9px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
}
.confirm-text {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  flex: 1;
}
.confirm-btn {
  padding: 4px 12px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
}
.confirm-btn.yes {
  background: #ef4444;
  color: #fff;
}
.confirm-btn.no {
  background: #f3f4f6;
  color: #374151;
}
</style>
