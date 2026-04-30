<template>
  <div class="dashboard">
    <div class="filters">
      <input v-model="searchQuery" class="search" type="text" placeholder="Rechercher une formation…" />
      <select v-model="categoryFilter" class="select">
        <option value="">Toutes catégories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <div class="table">
      <div class="thead">
        <div class="th">Titre</div>
        <div class="th">Catégorie</div>
        <div class="th">Créé le</div>
        <div class="th">Publié</div>
        <div class="th">Actions</div>
      </div>
      <div v-if="filteredFormations.length === 0" class="empty">Aucune formation trouvée.</div>
      <div
        v-for="(f, i) in filteredFormations"
        :key="f.id"
        class="tr"
        :class="{ last: i === filteredFormations.length - 1 }"
      >
        <div class="td title-td">{{ f.title }}</div>
        <div class="td">{{ f.category || '—' }}</div>
        <div class="td">{{ formatDate(f.created_at) }}</div>
        <div class="td toggle-td">
          <button
            role="switch"
            :aria-checked="String(statusOf(f) === 'published')"
            class="toggle"
            :class="{ on: statusOf(f) === 'published' }"
            @click="togglePublish(f)"
          ><span class="thumb"></span></button>
          <span class="tlabel" :class="{ pub: statusOf(f) === 'published' }">
            {{ statusOf(f) === 'published' ? 'Publié' : 'Brouillon' }}
          </span>
        </div>
        <div class="td actions-td">
          <button class="btn-edit" @click="emit('trigger-event', { name: 'edit-formation', event: { id: f.id } })">Éditer</button>
          <button class="btn-icon" @click="emit('trigger-event', { name: 'settings-formation', event: { id: f.id } })">⚙</button>
        </div>
      </div>
    </div>

    <button class="btn-create" @click="emit('trigger-event', { name: 'create-formation', event: {} })">+ Créer une formation</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  content: { type: Object, required: true },
});

const emit = defineEmits(['trigger-event']);

const searchQuery = ref('');
const categoryFilter = ref('');
const localStatuses = ref({});

const formations = computed(() => props.content?.formations || []);

const categories = computed(() =>
  [...new Set(formations.value.map(f => f.category).filter(Boolean))]
);

function statusOf(f) {
  return localStatuses.value[f.id] ?? f.status;
}

const filteredFormations = computed(() => {
  let r = formations.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    r = r.filter(f => f.title?.toLowerCase().includes(q));
  }
  if (categoryFilter.value) {
    r = r.filter(f => f.category === categoryFilter.value);
  }
  return r;
});

function formatDate(val) {
  if (!val) return '—';
  const d = new Date(val);
  return isNaN(d) ? '—' : d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function togglePublish(f) {
  const next = statusOf(f) === 'published' ? 'draft' : 'published';
  localStatuses.value = { ...localStatuses.value, [f.id]: next };
  emit('trigger-event', { name: 'publish-change', event: { id: f.id, status: next } });
}
</script>

<style scoped>
.dashboard {
  --p: #7C3AED;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  color: #1f2937;
  background: #f9fafb;
  min-height: 100%;
  box-sizing: border-box;
}
.filters { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.search, .select {
  padding: 7px 12px;
  border: 1px solid rgba(0,0,0,.1);
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  background: #fff;
  outline: none;
}
.search { min-width: 200px; }
.search:focus { border-color: var(--p); }

.table { background: #fff; border: 1px solid rgba(0,0,0,.08); border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
.thead { display: grid; grid-template-columns: 2fr 1fr 1fr 140px 120px; padding: 9px 14px; background: #f9fafb; border-bottom: 1px solid rgba(0,0,0,.06); }
.th { font-size: 10px; text-transform: uppercase; letter-spacing: .07em; color: #9ca3af; font-weight: 600; }
.tr { display: grid; grid-template-columns: 2fr 1fr 1fr 140px 120px; padding: 10px 14px; align-items: center; border-bottom: 1px solid rgba(0,0,0,.05); }
.tr.last { border-bottom: none; }
.tr:hover { background: #fafafa; }
.td { color: #374151; overflow: hidden; padding-right: 8px; }
.title-td { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.toggle-td { display: flex; align-items: center; gap: 6px; }
.toggle { display: inline-flex; align-items: center; width: 34px; height: 18px; border-radius: 99px; background: #d1d5db; border: none; cursor: pointer; padding: 0 2px; transition: background .2s; flex-shrink: 0; }
.toggle.on { background: var(--p); }
.thumb { width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2); }
.toggle.on .thumb { transform: translateX(16px); }
.tlabel { font-size: 11px; font-weight: 600; color: #9ca3af; }
.tlabel.pub { color: var(--p); }

.actions-td { display: flex; align-items: center; justify-content: flex-end; gap: 5px; }
.btn-edit { border: 1px solid #3b82f6; color: #3b82f6; background: transparent; border-radius: 6px; font-size: 11px; padding: 4px 10px; cursor: pointer; font-family: inherit; }
.btn-icon { background: none; border: none; cursor: pointer; font-size: 14px; padding: 4px; border-radius: 5px; color: #9ca3af; }
.empty { padding: 40px; text-align: center; color: #9ca3af; }
.btn-create { background: var(--p); color: #fff; border: none; border-radius: 8px; padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
</style>
