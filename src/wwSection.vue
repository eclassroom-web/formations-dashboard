<template>
  <div class="dashboard">
    <!-- ── Header: KPIs + view toggle ── -->
    <div class="header">
      <div class="kpi-row">
        <div class="kpi-card">
          <span class="kpi-value">{{ kpi.total }}</span>
          <span class="kpi-label">Total</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-value kpi-published">{{ kpi.published }}</span>
          <span class="kpi-label">Publiées</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-value">{{ kpi.draft }}</span>
          <span class="kpi-label">Brouillons</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-value">{{ kpi.archived }}</span>
          <span class="kpi-label">Archivées</span>
        </div>
      </div>

      <div class="view-toggle">
        <button class="view-btn" :class="{ active: viewMode === 'grid' }" @click="setView('grid')" title="Vue grille">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="1" y="1" width="6" height="6" rx="1.5"/>
            <rect x="9" y="1" width="6" height="6" rx="1.5"/>
            <rect x="1" y="9" width="6" height="6" rx="1.5"/>
            <rect x="9" y="9" width="6" height="6" rx="1.5"/>
          </svg>
        </button>
        <button class="view-btn" :class="{ active: viewMode === 'list' }" @click="setView('list')" title="Vue liste">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="1" y="2" width="14" height="2.5" rx="1.25"/>
            <rect x="1" y="6.75" width="14" height="2.5" rx="1.25"/>
            <rect x="1" y="11.5" width="14" height="2.5" rx="1.25"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- ── Filters ── -->
    <div class="filters-bar">
      <div class="tabs">
        <button
          v-for="tab in TABS"
          :key="tab.key"
          class="tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >{{ tab.label }}</button>
      </div>
      <div class="filters-right">
        <input
          v-model="searchQuery"
          class="search-input"
          type="text"
          placeholder="Rechercher une formation…"
        />
        <select v-model="categoryFilter" class="filter-select">
          <option value="">Toutes catégories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <select v-model="levelFilter" class="filter-select">
          <option value="">Tous niveaux</option>
          <option v-for="lvl in levels" :key="lvl" :value="lvl">{{ lvl }}</option>
        </select>
      </div>
    </div>

    <!-- ── Grid view ── -->
    <div v-if="viewMode === 'grid'" class="grid-view">
      <FormationCard
        v-for="formation in filteredFormations"
        :key="formation.id"
        :formation="withLocalStatus(formation)"
        @publish-change="onPublishChange"
        @preview="onPreview"
        @settings="onSettings"
        @delete="onDelete"
      />
      <EmptyState v-if="filteredFormations.length === 0" class="grid-empty" />
      <div class="create-card" @click="onCreateFormation">
        <span class="create-icon">+</span>
        <span class="create-label">Créer une formation</span>
      </div>
    </div>

    <!-- ── List view ── -->
    <div v-else class="list-view">
      <div class="list-header">
        <div class="list-col">Titre</div>
        <div class="list-col hide-mobile">Catégorie</div>
        <div class="list-col hide-mobile">Niveau</div>
        <div class="list-col hide-mobile">Créé le</div>
        <div class="list-col">Publié</div>
        <div class="list-col">Actions</div>
      </div>
      <FormationRow
        v-for="(formation, i) in filteredFormations"
        :key="formation.id"
        :formation="withLocalStatus(formation)"
        :isLast="i === filteredFormations.length - 1"
        @publish-change="onPublishChange"
        @edit="onEdit"
        @settings="onSettings"
      />
      <EmptyState v-if="filteredFormations.length === 0" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import FormationCard from './components/FormationCard.vue';
import FormationRow from './components/FormationRow.vue';
import EmptyState from './components/EmptyState.vue';

const props = defineProps({
  content: { type: Object, required: true },
});

const emit = defineEmits(['trigger-event']);

const TABS = [
  { key: 'all', label: 'Toutes' },
  { key: 'published', label: 'Publiées' },
  { key: 'draft', label: 'Brouillons' },
  { key: 'archived', label: 'Archivées' },
];

const viewMode = ref('grid');
const activeTab = ref('all');
const searchQuery = ref('');
const categoryFilter = ref('');
const levelFilter = ref('');
const localStatuses = ref({});

const formations = computed(() => props.content?.formations || []);

const categories = computed(() =>
  [...new Set(formations.value.map(f => f.category).filter(Boolean))]
);
const levels = computed(() =>
  [...new Set(formations.value.map(f => f.niveau || f.level).filter(Boolean))]
);

function effectiveStatus(f) {
  return localStatuses.value[f.id] ?? f.status;
}

const kpi = computed(() => ({
  total: formations.value.length,
  published: formations.value.filter(f => effectiveStatus(f) === 'published').length,
  draft: formations.value.filter(f => effectiveStatus(f) === 'draft').length,
  archived: formations.value.filter(f => effectiveStatus(f) === 'archived').length,
}));

const filteredFormations = computed(() => {
  let result = formations.value;

  if (activeTab.value !== 'all') {
    result = result.filter(f => effectiveStatus(f) === activeTab.value);
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(f => f.title?.toLowerCase().includes(q));
  }
  if (categoryFilter.value) {
    result = result.filter(f => f.category === categoryFilter.value);
  }
  if (levelFilter.value) {
    result = result.filter(f => (f.niveau || f.level) === levelFilter.value);
  }
  return result;
});

function withLocalStatus(formation) {
  const status = localStatuses.value[formation.id];
  return status ? { ...formation, status } : formation;
}

function setView(mode) {
  viewMode.value = mode;
  localStorage.setItem('ec_view_mode', mode);
}

function onPublishChange({ id, status }) {
  localStatuses.value = { ...localStatuses.value, [id]: status };
  emit('trigger-event', { name: 'publish-change', event: { id, status } });
}

function onPreview(id) {
  emit('trigger-event', { name: 'preview-formation', event: { id } });
}

function onSettings(id) {
  emit('trigger-event', { name: 'settings-formation', event: { id } });
}

function onDelete(id) {
  emit('trigger-event', { name: 'delete-formation', event: { id } });
}

function onEdit(id) {
  emit('trigger-event', { name: 'edit-formation', event: { id } });
}

function onCreateFormation() {
  emit('trigger-event', { name: 'create-formation', event: {} });
}

onMounted(() => {
  try {
    const saved = localStorage.getItem('ec_view_mode');
    if (saved === 'grid' || saved === 'list') viewMode.value = saved;
  } catch (_) {}
});
</script>

<style scoped>
.dashboard {
  --surface: #ffffff;
  --surface-2: #f9fafb;
  --color-text: #1f2937;
  --color-muted: #9ca3af;
  --color-primary: #7C3AED;
  --border: rgba(0, 0, 0, 0.08);

  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--color-text);
  background: var(--surface-2);
  min-height: 100%;
  box-sizing: border-box;
}

/* ── Header ── */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}
.kpi-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.kpi-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 12px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 76px;
}
.kpi-value {
  font-size: 24px;
  font-weight: 700;
  color: #E6EDF3;
  line-height: 1;
}
.kpi-published {
  color: var(--color-primary);
}
.kpi-label {
  font-size: 10px;
  color: #8B949E;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 500;
}

/* View toggle */
.view-toggle {
  display: flex;
  background: var(--surface);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  flex-shrink: 0;
  align-self: flex-start;
}
.view-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 7px 9px;
  border-radius: 6px;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s, color 0.12s;
}
.view-btn.active {
  background: var(--surface-2);
  color: var(--color-primary);
}

/* ── Filters ── */
.filters-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.tabs {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}
.tab {
  background: none;
  border: none;
  cursor: pointer;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-muted);
  transition: background 0.12s, color 0.12s;
  font-family: inherit;
  white-space: nowrap;
}
.tab.active {
  background: var(--surface);
  color: var(--color-primary);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.filters-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.search-input {
  padding: 7px 12px;
  border: 0.5px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: var(--color-text);
  background: var(--surface);
  outline: none;
  min-width: 170px;
  transition: border-color 0.15s;
}
.search-input:focus {
  border-color: var(--color-primary);
}
.filter-select {
  padding: 7px 10px;
  border: 0.5px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: var(--color-text);
  background: var(--surface);
  outline: none;
  cursor: pointer;
}

/* ── Grid ── */
.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  align-items: start;
}
.grid-empty {
  grid-column: 1 / -1;
}
.create-card {
  border: 1.5px dashed rgba(124, 58, 237, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  min-height: 190px;
  color: var(--color-primary);
  opacity: 0.65;
  transition: opacity 0.15s, border-color 0.15s, background 0.15s;
}
.create-card:hover {
  opacity: 1;
  border-color: var(--color-primary);
  background: rgba(124, 58, 237, 0.03);
}
.create-icon {
  font-size: 30px;
  font-weight: 200;
  line-height: 1;
}
.create-label {
  font-size: 13px;
  font-weight: 600;
}

/* ── List ── */
.list-view {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  overflow: hidden;
}
.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 120px 110px;
  padding: 9px 14px;
  background: rgba(255,255,255,0.03);
  border-bottom: 0.5px solid rgba(255,255,255,0.06);
}
.list-col {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8B949E;
  font-weight: 600;
  padding-right: 8px;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .kpi-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .grid-view {
    grid-template-columns: 1fr;
  }
  .list-header {
    grid-template-columns: 2fr 120px 110px;
  }
  .hide-mobile {
    display: none;
  }
}
</style>
