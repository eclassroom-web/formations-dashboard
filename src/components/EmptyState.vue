<template>
  <div class="empty-state">
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="14" width="56" height="40" rx="8" fill="#ede9fe"/>
      <rect x="18" y="24" width="24" height="4" rx="2" fill="#a78bfa"/>
      <rect x="18" y="31" width="36" height="3" rx="1.5" fill="#c4b5fd"/>
      <rect x="18" y="37" width="28" height="3" rx="1.5" fill="#c4b5fd"/>
      <circle cx="54" cy="52" r="12" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1.5"/>
      <path d="M54 46v6l3 3" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <p class="empty-text">Aucune formation trouvée</p>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 56px 24px;
}
.empty-text {
  font-size: 14px;
  font-weight: 500;
  color: #9ca3af;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
