let userXp = 320;
const maxXp = 500;
let activeCodeTab = 'html';
let isWireframe = false;

// Archivos de código limpio para la función de vista de código
const CODE_FILES = {
  html: `<!-- ARCHIVO ACCESIBLE index.html -->\n<!DOCTYPE html>\n<html lang="es">\n  <!-- Estructura con Semantic HTML, ARIA landmarks y JSON-LD SEO -->\n</html>`,
  css: `/* styles.css con soporte para movimiento reducido */\n@media (prefers-reduced-motion: reduce) {\n  * { animation: none !important; transition: none !important; }\n}`,
  js: `// script.js con gestión de estados ARIA\nfunction updateProgress(xp) {\n  const el = document.getElementById('xpProgressBar');\n  if (el) el.setAttribute('aria-valuenow', xp);\n}`
};

window.onload = function() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  updateCodeBlock();
};

function gainXp(amount) {
  userXp += amount;
  if (userXp >= maxXp) {
    userXp = maxXp;
    showToast("🎉 ¡Felicidades! Nivel Máximo Alcanzado");
  } else {
    showToast(`✨ +${amount} XP ganados por interactuar`);
  }
  
  const pct = (userXp / maxXp) * 100;
  const xpBar = document.getElementById('xpBar');
  const xpText = document.getElementById('xpText');
  const xpProgressBar = document.getElementById('xpProgressBar');

  if (xpBar) xpBar.style.width = pct + '%';
  if (xpText) xpText.innerText = `${userXp} / ${maxXp} XP`;
  if (xpProgressBar) xpProgressBar.setAttribute('aria-valuenow', userXp);
}

function toggleMode() {
  isWireframe = !isWireframe;
  const app = document.getElementById('main-content');
  const wfBanner = document.getElementById('wfBanner');

  if (isWireframe) {
    app.classList.add('wireframe-mode');
    wfBanner.classList.remove('hidden');
    showToast("📐 Modo Blueprint activado");
  } else {
    app.classList.remove('wireframe-mode');
    wfBanner.classList.add('hidden');
    showToast("🎨 Modo Color activado");
  }
}

function clickAction(actionName) {
  showToast(`🎯 Acción: "${actionName}"`);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  toastMsg.innerText = msg;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 2600);
}

function switchMainView(view) {
  const prev = document.getElementById('previewContainer');
  const code = document.getElementById('codeContainer');
  const btnApp = document.getElementById('btnViewApp');
  const btnCode = document.getElementById('btnViewCode');

  if (view === 'preview') {
    prev.classList.remove('hidden');
    code.classList.add('hidden');
    btnApp.setAttribute('aria-pressed', 'true');
    btnCode.setAttribute('aria-pressed', 'false');
  } else {
    prev.classList.add('hidden');
    code.classList.remove('hidden');
    btnApp.setAttribute('aria-pressed', 'false');
    btnCode.setAttribute('aria-pressed', 'true');
  }
}

function switchCodeTab(tab) {
  activeCodeTab = tab;
  ['Html', 'Css', 'Js'].forEach(t => {
    const btn = document.getElementById('tab' + t);
    const isCurrent = t.toLowerCase() === tab;
    btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    btn.className = isCurrent 
      ? 'px-3 py-1.5 text-xs font-bold text-indigo-400 border-b-2 border-indigo-500 transition'
      : 'px-3 py-1.5 text-xs font-bold text-slate-400 border-b-2 border-transparent hover:text-slate-200 transition';
  });
  updateCodeBlock();
}

function updateCodeBlock() {
  const block = document.getElementById('codeBlock');
  if (block) {
    block.textContent = CODE_FILES[activeCodeTab];
  }
}

function openModal(type) {
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');

  if (type === 'techStack') {
    content.innerHTML = `
      <div class="space-y-3">
        <h3 id="modalTitle" class="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
          <i data-lucide="cpu" class="w-5 h-5 text-indigo-400" aria-hidden="true"></i>
          Arquitectura de StudyQuest
        </h3>
        <p class="text-xs text-slate-300 leading-relaxed">
          Sistema web responsive optimizado para accesibilidad (WCAG 2.1 AA) y SEO estático/dinámico.
        </p>
        <div class="flex flex-wrap gap-1.5 text-[11px]">
          <span class="bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">Semantic HTML5</span>
          <span class="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">ARIA Roles</span>
          <span class="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">JSON-LD Schema</span>
        </div>
        <button onclick="closeModal()" class="w-full py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl mt-2">Cerrar Detalle</button>
      </div>
    `;
  } else if (type === 'questDetails') {
    content.innerHTML = `
      <div class="space-y-3">
        <h3 id="modalTitle" class="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
          <i data-lucide="swords" class="w-5 h-5 text-purple-400" aria-hidden="true"></i>
          Misiones y Regiones Activas
        </h3>
        <p class="text-xs text-slate-300">
          Cada mapa agrupa tus materias. Al completar tareas recibes XP para subir de nivel en el dashboard.
        </p>
        <button onclick="closeModal()" class="w-full py-2 bg-slate-800 text-slate-200 font-bold text-xs rounded-xl">Entendido</button>
      </div>
    `;
  }

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  overlay.classList.remove('hidden');
}

function openServiceDetail(title, desc) {
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <div class="space-y-3">
      <span class="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-500/30">SERVICIO DIRECTO</span>
      <h3 id="modalTitle" class="font-heading font-bold text-base text-slate-100">${title}</h3>
      <p class="text-xs text-slate-300 leading-relaxed">${desc}</p>
      <button onclick="clickAction('Solicitar: ${title}'); closeModal();" class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition">
        Contactar por Servicio
      </button>
    </div>
  `;
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  overlay.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

function setActiveNav(btn) {
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.remove('text-indigo-400');
    b.classList.add('text-slate-400');
  });
  btn.classList.remove('text-slate-400');
  btn.classList.add('text-indigo-400');
}