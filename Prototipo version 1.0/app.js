'use strict';

const STORAGE_KEY = 'studyquest-demo-v1';
const seedState = {
  userName: 'Kenia',
  xp: 320,
  level: 5,
  xpGoal: 500,
  coins: 120,
  streak: 3,
  activeView: 'inicio',
  activeInventoryFilter: 'Todos',
  activeMissionFilter: 'Todas',
  avatarStyle: 'Brujita clásica',
  avatarAccessory: 'Gorro estelar',
  subjects: [
    { id: 'math', name: 'Matemáticas', short: 'Matemáticas', icon: '♥', color: 'mint', progress: 80, region: 'Bosque de las Ciencias', missions: 8 },
    { id: 'web', name: 'Programación Web', short: 'Programación Web', icon: '⌘', color: 'purple', progress: 60, region: 'Fortaleza del Código', missions: 6 },
    { id: 'software', name: 'Ingeniería de Software', short: 'Ingeniería de Software', icon: '✦', color: 'blue', progress: 40, region: 'Montañas del Conocimiento', missions: 4 },
    { id: 'db', name: 'Administración de BD', short: 'Administración de BD', icon: '▤', color: 'gold', progress: 50, region: 'Cavernas de los Datos', missions: 5 },
    { id: 'history', name: 'Historia', short: 'Historia', icon: '▣', color: 'pink', progress: 30, region: 'Ruinas del Tiempo', missions: 3 },
    { id: 'english', name: 'Inglés', short: 'Inglés', icon: 'A', color: 'cyan', progress: 50, region: 'Islas de las Lenguas', missions: 4 }
  ],
  missions: [
    { id: 1, title: 'Ecuaciones y funciones', description: 'Resuelve 5 ejercicios de álgebra.', subject: 'math', xp: 100, dueDate: '2026-11-24', done: false, symbol: 'π' },
    { id: 2, title: 'Desarrolla tu web', description: 'Crea un pequeño proyecto con HTML y CSS.', subject: 'web', xp: 80, dueDate: '2026-11-25', done: false, symbol: '</>' },
    { id: 3, title: 'Consultas en SQL', description: 'Realiza 3 consultas básicas en la base de datos.', subject: 'db', xp: 70, dueDate: '2026-11-26', done: false, symbol: '▤' },
    { id: 4, title: 'Repasar requerimientos', description: 'Revisa los requisitos funcionales de StudyQuest.', subject: 'software', xp: 60, dueDate: '2026-11-27', done: true, symbol: '✧' },
    { id: 5, title: 'Vocabulario de aventura', description: 'Estudia 15 palabras nuevas en inglés.', subject: 'english', xp: 40, dueDate: '2026-11-28', done: false, symbol: 'A' }
  ],
  achievements: [
    { id: 'first', title: 'Primer paso', description: 'Completaste tu primera misión.', icon: '★', unlocked: true },
    { id: 'streak', title: 'Racha de fuego', description: 'Estudia 7 días seguidos.', icon: '♨', unlocked: true },
    { id: 'bugs', title: 'Cazabugs', description: 'Corrige 50 errores.', icon: '♟', unlocked: true },
    { id: 'books', title: 'Bibliotecario', description: 'Completa 10 misiones.', icon: '▤', unlocked: false },
    { id: 'level5', title: 'Nivel 5', description: 'Alcanza el nivel 5.', icon: '★', unlocked: true },
    { id: 'secret', title: '???', description: 'Sigue explorando...', icon: '♙', unlocked: false }
  ],
  inventory: [
    { id: 'hat', name: 'Gorro estelar', category: 'Ropa', emoji: '🧙', owned: true },
    { id: 'robe', name: 'Túnica violeta', category: 'Ropa', emoji: '🧥', owned: true },
    { id: 'wand', name: 'Varita lunar', category: 'Accesorios', emoji: '🪄', owned: true },
    { id: 'cat', name: 'Gatito astral', category: 'Mascotas', emoji: '🐈‍⬛', owned: true },
    { id: 'bag', name: 'Mochila arcana', category: 'Accesorios', emoji: '🎒', owned: true },
    { id: 'wings', name: 'Alas de hada', category: 'Accesorios', emoji: '🪽', owned: true },
    { id: 'potion', name: 'Poción de energía', category: 'Consumibles', emoji: '🧪', owned: true },
    { id: 'shadow', name: 'Sombra misteriosa', category: 'Mascotas', emoji: '♟', owned: false }
  ]
};

let state = loadState();
let currentMissionFilter = state.activeMissionFilter || 'Todas';
let currentInventoryFilter = state.activeInventoryFilter || 'Todos';
let currentSearch = '';

const pageContent = document.getElementById('pageContent');
const toastRegion = document.getElementById('toastRegion');
const modalBackdrop = document.getElementById('modalBackdrop');
const missionForm = document.getElementById('missionForm');

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...structuredClone(seedState), ...JSON.parse(stored) };
  } catch (error) {
    console.warn('No fue posible recuperar los datos guardados; se utilizarán los datos demo.', error);
  }
  return structuredClone(seedState);
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (error) { console.warn('No fue posible guardar los datos en este navegador.', error); }
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
}
function xpPercent() { return Math.min(100, Math.round((state.xp / state.xpGoal) * 100)); }
function subjectById(id) { return state.subjects.find(subject => subject.id === id) || { name: 'General', short: 'General', icon: '✦', progress: 0, region: 'Nueva región' }; }
function formatDate(dateString) {
  if (!dateString) return 'Sin fecha límite';
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(date);
}
function toast(message) {
  const node = document.createElement('div');
  node.className = 'toast';
  node.textContent = message;
  toastRegion.appendChild(node);
  window.setTimeout(() => node.remove(), 3300);
}
function setView(view) {
  const allowed = ['inicio','misiones','materias','personaje','logros','mapa','inventario','ajustes'];
  state.activeView = allowed.includes(view) ? view : 'inicio';
  saveState();
  render();
  document.getElementById('profileDropdown').hidden = true;
  document.getElementById('profileTrigger').setAttribute('aria-expanded', 'false');
  document.getElementById('sidebar').classList.remove('open');
  pageContent.focus({ preventScroll: true });
}
function updateShell() {
  document.getElementById('topUserName').textContent = state.userName;
  document.querySelectorAll('[data-view]').forEach(button => {
    if (button.classList.contains('nav-link')) button.classList.toggle('active', button.dataset.view === state.activeView);
  });
}
function progressBar(percent) {
  return `<div class="progress-track"><div class="progress-fill" style="width:${Math.max(0,Math.min(100,percent))}%"></div></div>`;
}
function renderMissionCard(mission, compact = false) {
  const subject = subjectById(mission.subject);
  return `<article class="mission-card ${mission.done ? 'is-done' : ''}">
    <div class="mission-symbol">${escapeHTML(mission.symbol || subject.icon || '✦')}</div>
    <div class="mission-details"><h3>${escapeHTML(mission.title)}</h3><p>${escapeHTML(mission.description || 'Una nueva aventura te espera.')}</p><div class="mission-meta"><span class="subject-chip">${escapeHTML(subject.short)}</span>${mission.done ? '<span class="pill">✓ Completada</span>' : ''}</div></div>
    <div class="mission-reward"><span>✦ +${mission.xp} XP</span><button class="complete-button" data-complete="${mission.id}" ${mission.done ? 'disabled' : ''}>${mission.done ? 'Completada' : 'Completar'}</button></div>
  </article>`;
}
function renderDashboard() {
  const activeMissions = state.missions.filter(m => !m.done).slice(0,3);
  const achievements = state.achievements.slice(0,6);
  const subjectProgress = state.subjects.slice(0,3);
  const ownedItems = state.inventory.filter(item => item.owned).slice(0,8);
  return `<section class="dashboard-grid" aria-label="Panel principal">
    <section class="hero-banner">
      <div class="hero-copy"><h1>¡Hola, ${escapeHTML(state.userName)}!</h1><p>Tu esfuerzo de hoy construye a la gran aventurera que serás mañana.</p></div>
      <div class="hero-progress"><div class="hero-progress-top"><strong>✧ Nivel ${state.level}</strong><span>${state.xp} / ${state.xpGoal} XP</span></div>${progressBar(xpPercent())}</div>
    </section>
    <section class="avatar-card"><div class="avatar-card-inner"><img class="avatar-art" src="assets/avatar-witch.png" alt="Avatar mágico de StudyQuest"><div class="avatar-info"><h2>${escapeHTML(state.userName)}</h2><p>La Gran Aventurera</p><div class="level">Nivel ${state.level}</div>${progressBar(xpPercent())}<small>${state.xp} / ${state.xpGoal} XP</small><button class="avatar-edit" data-view="personaje">⚒ Personalizar</button></div></div></section>
    <section class="panel panel-pad missions-panel"><div class="panel-title-row"><h2 class="panel-title"><span class="title-icon">✦</span>Misiones de hoy</h2><button class="text-link" data-view="misiones">Ver todas ›</button></div><div class="mission-list">${activeMissions.length ? activeMissions.map(m=>renderMissionCard(m,true)).join('') : '<div class="empty-state">¡Has completado todas tus misiones! ✨</div>'}</div><div style="margin-top:10px"><button class="button button-ghost" data-action="new-mission">＋ Nueva misión</button></div></section>
    <div class="middle-stack">
      <section class="panel panel-pad"><div class="panel-title-row"><h2 class="panel-title">Tu progreso general</h2></div><div class="subject-progress-list">${subjectProgress.map(subject=>`<div class="subject-progress-item"><div class="subject-progress-head"><strong>${escapeHTML(subject.icon)} ${escapeHTML(subject.short)}</strong><span>${subject.progress}%</span></div>${progressBar(subject.progress)}</div>`).join('')}</div></section>
      <section class="panel panel-pad streak-panel"><div class="panel-title-row"><h2 class="panel-title"><span class="title-icon">♨</span>Racha de estudio</h2></div><div class="streak-count"><span>🔥</span>${state.streak} días</div><div class="week-days">${['L','M','M','J','V','S','D'].map((d,i)=>`<div class="week-day ${i < state.streak ? 'done' : ''}"><span>${d}</span><i>${i < state.streak ? '🔥' : ''}</i></div>`).join('')}</div></section>
    </div>
    <section class="panel panel-pad achievements-panel"><div class="panel-title-row"><h2 class="panel-title"><span class="title-icon">🔥</span>Logros</h2><button class="text-link" data-view="logros">Ver todos ›</button></div><div class="achievement-grid">${achievements.map(a=>`<article class="achievement-card ${a.unlocked?'':'locked'}"><div class="achievement-icon">${a.unlocked?escapeHTML(a.icon):'♙'}</div><h3>${escapeHTML(a.title)}</h3><p>${escapeHTML(a.description)}</p></article>`).join('')}</div></section>
    <section class="panel panel-pad map-panel"><div class="panel-title-row"><div><h2 class="panel-title"><span class="title-icon">✦</span>Explora el mundo del conocimiento</h2><p class="muted" style="margin:5px 0 0;font-size:10px">Cada materia es una nueva región por descubrir.</p></div><button class="button button-ghost map-cta" data-view="mapa">Ver mapa completo</button></div><div class="map-art"><div class="map-map-cta"><span>✧</span> Cada materia es una región por descubrir</div></div></section>
    <section class="panel panel-pad inventory-panel"><div class="panel-title-row"><h2 class="panel-title"><span class="title-icon">♧</span>Tu inventario</h2><button class="text-link" data-view="inventario">Ver todos ›</button></div><div class="inventory-tabs"><button class="inventory-tab active" data-open-inventory="Todos">Todos</button><button class="inventory-tab" data-open-inventory="Ropa">Ropa</button><button class="inventory-tab" data-open-inventory="Accesorios">Accesorios</button><button class="inventory-tab" data-open-inventory="Mascotas">Mascotas</button></div><div class="item-grid">${ownedItems.map(item=>`<div class="inventory-item" title="${escapeHTML(item.name)}">${escapeHTML(item.emoji)}</div>`).join('')}</div></section>
    <section class="motto-card"><p><span>✧</span> No es solo estudiar...<br>es una aventura. <span>✦</span></p></section>
  </section>`;
}
function renderMissions() {
  const filters = ['Todas','Pendientes','Completadas'];
  const filtered = state.missions.filter(m => {
    const statusMatch = currentMissionFilter === 'Todas' || (currentMissionFilter === 'Pendientes' ? !m.done : m.done);
    const subject = subjectById(m.subject);
    const searchMatch = !currentSearch || `${m.title} ${m.description} ${subject.name}`.toLowerCase().includes(currentSearch.toLowerCase());
    return statusMatch && searchMatch;
  });
  return `<div class="page-heading"><div><p class="eyebrow">TU TABLERO DE AVENTURAS</p><h1>Libro de misiones</h1><p>Cada tarea completada es una nueva oportunidad para ganar experiencia.</p></div><button class="button button-primary" data-action="new-mission">＋ Crear misión</button></div>
    <div class="page-grid"><section class="panel panel-pad"><div class="toolbar">${filters.map(f=>`<button class="filter-button ${currentMissionFilter===f?'active':''}" data-mission-filter="${f}">${f}</button>`).join('')}<span class="muted" style="margin-left:auto;font-size:10px">${filtered.length} misiones</span></div><div class="mission-table">${filtered.length ? filtered.map(m=>{const s=subjectById(m.subject);return `<article class="mission-row"><div class="mission-symbol">${escapeHTML(m.symbol||s.icon)}</div><div><h3>${escapeHTML(m.title)}</h3><p>${escapeHTML(m.description)} · ${escapeHTML(s.name)}</p></div><span class="due">${formatDate(m.dueDate)}</span><button class="complete-button" data-complete="${m.id}" ${m.done?'disabled':''}>${m.done?'✓ Lista':`+${m.xp} XP`}</button></article>`}).join(''):'<div class="empty-state">No encontramos misiones con esos filtros.</div>'}</div></section><aside class="side-info"><section class="panel panel-pad"><h2 class="panel-title">Resumen de misiones</h2><div class="info-stat"><span>Pendientes</span><strong>${state.missions.filter(m=>!m.done).length}</strong></div><div class="info-stat"><span>Completadas</span><strong>${state.missions.filter(m=>m.done).length}</strong></div><div class="info-stat"><span>XP disponible</span><strong>✦ ${state.missions.filter(m=>!m.done).reduce((n,m)=>n+m.xp,0)}</strong></div></section><section class="panel panel-pad"><h2 class="panel-title">Consejo de aventura</h2><p class="muted" style="font-size:11px;line-height:1.6">Divide los trabajos grandes en misiones pequeñas. Cada avance cuenta, incluso cuando la tarea parece enorme.</p></section></aside></div>`;
}
function renderSubjects() {
  const subjectCards = state.subjects.map(s=>`<article class="subject-card"><div class="subject-card-top"><div class="subject-emblem">${escapeHTML(s.icon)}</div><div><h3>${escapeHTML(s.name)}</h3><p>${escapeHTML(s.region)}</p></div></div>${progressBar(s.progress)}<div class="subject-card-foot"><span>${s.missions} misiones registradas</span><strong>${s.progress}%</strong></div></article>`).join('');
  return `<div class="page-heading"><div><p class="eyebrow">TUS ÁREAS DE CONOCIMIENTO</p><h1>Materias</h1><p>Explora tus regiones y consulta el progreso de cada asignatura.</p></div><button class="button button-primary" data-action="add-subject">＋ Agregar materia</button></div><div class="subject-grid">${subjectCards}</div>`;
}
function renderCharacter() {
  const styles = ['Brujita clásica','Exploradora','Hechicera lunar','Aventurera'];
  const accessories = ['Gorro estelar','Corona lunar','Lentes mágicos','Sin accesorio'];
  return `<div class="page-heading"><div><p class="eyebrow">TU REPRESENTANTE EN ESTE MUNDO</p><h1>Mi personaje</h1><p>Personaliza tu avatar y dale identidad a tu aventura.</p></div><span class="pill">Nivel ${state.level} · ${state.xp} XP</span></div><div class="character-layout"><section class="character-showcase"><img src="assets/avatar-witch.png" alt="Vista previa del personaje"><div class="character-name">${escapeHTML(state.userName)}</div><span class="pill">${escapeHTML(state.avatarStyle)} · ${escapeHTML(state.avatarAccessory)}</span></section><section class="panel customizer"><h3>Nombre del personaje</h3><div class="setting-row" style="margin-bottom:18px"><div><h3>Identidad</h3><p>Este nombre aparece en tu aventura.</p></div><input type="text" id="characterName" value="${escapeHTML(state.userName)}" maxlength="22" aria-label="Nombre del personaje"></div><h3>Estilo del personaje</h3><div class="choice-group">${styles.map(s=>`<button class="choice ${state.avatarStyle===s?'selected':''}" data-avatar-style="${s}">${s}</button>`).join('')}</div><h3>Accesorios</h3><div class="choice-group">${accessories.map(s=>`<button class="choice ${state.avatarAccessory===s?'selected':''}" data-avatar-accessory="${s}">${s}</button>`).join('')}</div><button class="button button-primary" id="saveCharacter">✦ Guardar personalización</button><p class="muted" style="font-size:10px;line-height:1.5;margin-top:14px">En esta versión demo las opciones modifican los datos del perfil. La vista previa ilustrada es temporal; más adelante conectaremos las capas gráficas del editor de avatares.</p></section></div>`;
}
function renderAchievements() {
  return `<div class="page-heading"><div><p class="eyebrow">RECONOCIMIENTOS DE TU VIAJE</p><h1>Galería de logros</h1><p>Los pequeños triunfos también merecen celebrarse.</p></div><span class="pill">${state.achievements.filter(a=>a.unlocked).length} / ${state.achievements.length} desbloqueados</span></div><div class="achievement-page-grid">${state.achievements.map(a=>`<article class="achievement-large ${a.unlocked?'':'locked'}"><div class="achievement-icon">${a.unlocked?escapeHTML(a.icon):'♙'}</div><h3>${escapeHTML(a.title)}</h3><p>${escapeHTML(a.description)}</p><p style="margin-top:9px;color:${a.unlocked?'#a8f2d8':'#8590bb'}">${a.unlocked?'✓ Desbloqueado':'🔒 Por descubrir'}</p></article>`).join('')}</div>`;
}
function renderMap() {
  return `<div class="page-heading"><div><p class="eyebrow">CADA MATERIA ES UN DESTINO</p><h1>Mapa del conocimiento</h1><p>Explora las regiones que representan tus materias.</p></div><span class="pill">✦ ${state.subjects.length} regiones</span></div><section class="map-full" role="img" aria-label="Mapa fantástico de las regiones de StudyQuest"></section><div class="subject-grid" style="margin-top:14px">${state.subjects.map(s=>`<article class="subject-card"><div class="subject-card-top"><div class="subject-emblem">${escapeHTML(s.icon)}</div><div><h3>${escapeHTML(s.region)}</h3><p>${escapeHTML(s.name)}</p></div></div>${progressBar(s.progress)}<div class="subject-card-foot"><span>${s.missions} misiones registradas</span><strong>${s.progress}%</strong></div></article>`).join('')}</div>`;
}
function renderInventory() {
  const filters = ['Todos','Ropa','Accesorios','Mascotas','Consumibles'];
  const items = state.inventory.filter(item => (currentInventoryFilter==='Todos'||item.category===currentInventoryFilter) && (!currentSearch || item.name.toLowerCase().includes(currentSearch.toLowerCase())));
  return `<div class="page-heading"><div><p class="eyebrow">OBJETOS QUE HAS REUNIDO</p><h1>Inventario</h1><p>Guarda tus objetos, atuendos y compañeros de aventura.</p></div><span class="pill">${state.inventory.filter(i=>i.owned).length} objetos</span></div><section class="panel panel-pad"><div class="toolbar">${filters.map(f=>`<button class="filter-button ${currentInventoryFilter===f?'active':''}" data-inventory-filter="${f}">${f}</button>`).join('')}</div><div class="inventory-page-grid">${items.map(item=>`<article class="inventory-large"><span class="item-emoji">${escapeHTML(item.emoji)}</span><strong>${escapeHTML(item.name)}</strong><small>${item.owned?'En tu inventario':'Aún bloqueado'} · ${escapeHTML(item.category)}</small></article>`).join('')}</div></section>`;
}
function renderSettings() {
  return `<div class="page-heading"><div><p class="eyebrow">AJUSTA TU EXPERIENCIA</p><h1>Configuración</h1><p>Administra tus preferencias de StudyQuest.</p></div></div><section class="panel panel-pad settings-list"><div class="setting-row"><div><h3>Nombre visible</h3><p>Cómo aparecerás dentro de StudyQuest.</p></div><input type="text" id="settingsName" value="${escapeHTML(state.userName)}" maxlength="22"></div><div class="setting-row"><div><h3>Notificaciones de misiones</h3><p>Mostrar avisos dentro de esta demostración.</p></div><input type="checkbox" checked disabled aria-label="Notificaciones activadas"></div><div class="setting-row"><div><h3>Guardar progreso</h3><p>Los cambios se guardan localmente en este navegador.</p></div><span class="pill">Activado</span></div><div><button class="button button-primary" id="saveSettings">Guardar cambios</button> <button class="button button-ghost" id="resetSettings">Restablecer datos demo</button></div><p class="muted" style="font-size:10px;line-height:1.5">Nota: este prototipo todavía no tiene cuentas reales ni sincronización entre dispositivos. Los datos quedan guardados en el almacenamiento local del navegador.</p></section>`;
}
function render() {
  updateShell();
  const views = {
    inicio: renderDashboard,
    misiones: renderMissions,
    materias: renderSubjects,
    personaje: renderCharacter,
    logros: renderAchievements,
    mapa: renderMap,
    inventario: renderInventory,
    ajustes: renderSettings
  };
  pageContent.innerHTML = (views[state.activeView] || renderDashboard)();
}

function completeMission(id) {
  const mission = state.missions.find(m => String(m.id) === String(id));
  if (!mission || mission.done) return;
  mission.done = true;
  state.xp += mission.xp;
  state.coins += Math.max(5, Math.round(mission.xp / 10));
  const subject = subjectById(mission.subject);
  subject.progress = Math.min(100, subject.progress + 5);
  subject.missions += 1;
  while (state.xp >= state.xpGoal) {
    state.xp -= state.xpGoal;
    state.level += 1;
    state.xpGoal = Math.round(state.xpGoal * 1.2 / 10) * 10;
    toast(`¡Subiste al nivel ${state.level}! ✨`);
  }
  if (state.missions.filter(m=>m.done).length >= 1) state.achievements.find(a=>a.id==='first').unlocked = true;
  if (state.missions.filter(m=>m.done).length >= 10) state.achievements.find(a=>a.id==='books').unlocked = true;
  if (state.level >= 5) state.achievements.find(a=>a.id==='level5').unlocked = true;
  saveState();
  render();
  toast(`¡Misión completada! +${mission.xp} XP y monedas añadidas a tu bolsa.`);
}
function openMissionModal() {
  const select = missionForm.elements.subject;
  select.innerHTML = state.subjects.map(s=>`<option value="${escapeHTML(s.id)}">${escapeHTML(s.name)}</option>`).join('');
  modalBackdrop.hidden = false;
  missionForm.elements.title.focus();
}
function closeMissionModal() { modalBackdrop.hidden = true; missionForm.reset(); }
function handleCreateMission(event) {
  event.preventDefault();
  const form = new FormData(missionForm);
  const title = String(form.get('title') || '').trim();
  if (!title) { toast('Escribe un nombre para tu misión.'); return; }
  state.missions.unshift({
    id: Date.now(), title,
    description: String(form.get('description') || '').trim(),
    subject: String(form.get('subject')),
    xp: Number(form.get('xp')) || 50,
    dueDate: String(form.get('dueDate') || ''),
    done: false,
    symbol: '✦'
  });
  saveState(); closeMissionModal(); setView('misiones'); toast('¡Nueva misión añadida a tu libro!');
}
function resetDemo() {
  state = structuredClone(seedState);
  currentMissionFilter = 'Todas'; currentInventoryFilter = 'Todos'; currentSearch = '';
  saveState();
  document.getElementById('globalSearch').value = '';
  setView('inicio');
  toast('Los datos de demostración se han restablecido.');
}

// Navegación de la aplicación.
document.addEventListener('click', event => {
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) { event.preventDefault(); setView(viewButton.dataset.view); return; }
  const completeButton = event.target.closest('[data-complete]');
  if (completeButton) { completeMission(completeButton.dataset.complete); return; }
  const dashboardInventory = event.target.closest('[data-open-inventory]');
  if (dashboardInventory) { currentInventoryFilter = dashboardInventory.dataset.openInventory; setView('inventario'); return; }
  const actionButton = event.target.closest('[data-action]');
  if (actionButton) {
    if (actionButton.dataset.action === 'new-mission') openMissionModal();
    if (actionButton.dataset.action === 'add-subject') toast('La creación de materias se habilitará en la siguiente iteración.');
    return;
  }
  const missionFilter = event.target.closest('[data-mission-filter]');
  if (missionFilter) { currentMissionFilter = missionFilter.dataset.missionFilter; state.activeMissionFilter=currentMissionFilter; saveState(); render(); return; }
  const inventoryFilter = event.target.closest('[data-inventory-filter]');
  if (inventoryFilter) { currentInventoryFilter=inventoryFilter.dataset.inventoryFilter; state.activeInventoryFilter=currentInventoryFilter; saveState(); render(); return; }
  const styleChoice = event.target.closest('[data-avatar-style]');
  if (styleChoice) { state.avatarStyle=styleChoice.dataset.avatarStyle; render(); return; }
  const accessoryChoice = event.target.closest('[data-avatar-accessory]');
  if (accessoryChoice) { state.avatarAccessory=accessoryChoice.dataset.avatarAccessory; render(); return; }
});

missionForm.addEventListener('submit', handleCreateMission);
document.getElementById('modalClose').addEventListener('click', closeMissionModal);
document.getElementById('cancelMission').addEventListener('click', closeMissionModal);
modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeMissionModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modalBackdrop.hidden) closeMissionModal(); });

document.getElementById('profileTrigger').addEventListener('click', () => {
  const dropdown = document.getElementById('profileDropdown');
  dropdown.hidden = !dropdown.hidden;
  document.getElementById('profileTrigger').setAttribute('aria-expanded', String(!dropdown.hidden));
});
document.getElementById('resetDemo').addEventListener('click', resetDemo);
document.getElementById('notificationButton').addEventListener('click', () => toast('No tienes nuevas notificaciones. ¡Sigue con tu aventura!'));
document.getElementById('mobileMenu').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

document.getElementById('globalSearch').addEventListener('input', event => {
  currentSearch = event.target.value.trim();
  if (state.activeView !== 'misiones' && state.activeView !== 'inventario') setView('misiones');
  else render();
});

pageContent.addEventListener('click', event => {
  if (event.target.id === 'saveCharacter') {
    const input = document.getElementById('characterName');
    const name = input.value.trim();
    if (!name) { toast('El personaje necesita un nombre.'); return; }
    state.userName = name;
    saveState(); render(); toast('¡Tu personaje ha sido actualizado!');
  }
  if (event.target.id === 'saveSettings') {
    const input = document.getElementById('settingsName');
    const name = input.value.trim();
    if (!name) { toast('Escribe un nombre válido.'); return; }
    state.userName = name; saveState(); render(); toast('Configuración guardada.');
  }
  if (event.target.id === 'resetSettings') resetDemo();
});

// Atajo sencillo de búsqueda.
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    document.getElementById('globalSearch').focus();
  }
});

render();
