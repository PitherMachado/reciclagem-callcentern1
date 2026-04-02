const slides = [...document.querySelectorAll('.slide')];
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const restartBtn = document.getElementById('restartBtn');
const agenda = document.getElementById('agenda');
const agendaList = document.getElementById('agendaList');
const openAgendaBtns = [document.getElementById('openAgenda'), document.getElementById('heroAgenda'), document.getElementById('openAgendaFinal')].filter(Boolean);
const closeAgendaBtn = document.getElementById('closeAgenda');
const checklistModal = document.getElementById('checklistModal');
const openChecklistBtn = document.getElementById('openChecklist');
const closeChecklistBtn = document.getElementById('closeChecklist');
const nextDataBtns = [...document.querySelectorAll('[data-next]')];

let current = 0;

function renderAgenda() {
  agendaList.innerHTML = slides.map((slide, index) => `
    <button class="agenda-item ${index === current ? 'active' : ''}" data-index="${index}">
      ${String(index + 1).padStart(2, '0')} — ${slide.dataset.title}
      <small>${index === 0 ? 'Capa e direção do treinamento' : 'Conteúdo estratégico e operacional'}</small>
    </button>
  `).join('');

  agendaList.querySelectorAll('[data-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      goTo(Number(btn.dataset.index));
      toggleAgenda(false);
    });
  });
}

function updateUI() {
  slides.forEach((slide, index) => slide.classList.toggle('active', index === current));
  const pct = ((current + 1) / slides.length) * 100;
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  prevBtn.disabled = current === 0;
  nextBtn.textContent = current === slides.length - 1 ? 'Finalizar' : 'Próximo';
  renderAgenda();
}

function goTo(index) {
  current = Math.max(0, Math.min(index, slides.length - 1));
  updateUI();
}

function nextSlide() {
  if (current < slides.length - 1) {
    current += 1;
    updateUI();
  } else {
    goTo(0);
  }
}

function prevSlide() {
  if (current > 0) {
    current -= 1;
    updateUI();
  }
}

function toggleAgenda(force) {
  const shouldOpen = typeof force === 'boolean' ? force : !agenda.classList.contains('open');
  agenda.classList.toggle('open', shouldOpen);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);
restartBtn?.addEventListener('click', () => goTo(0));
nextDataBtns.forEach(btn => btn.addEventListener('click', nextSlide));
openAgendaBtns.forEach(btn => btn.addEventListener('click', () => toggleAgenda(true)));
closeAgendaBtn.addEventListener('click', () => toggleAgenda(false));
openChecklistBtn.addEventListener('click', () => checklistModal.showModal());
closeChecklistBtn.addEventListener('click', () => checklistModal.close());

window.addEventListener('keydown', (e) => {
  if (checklistModal.open) {
    if (e.key === 'Escape') checklistModal.close();
    return;
  }
  if (e.key === 'ArrowRight' || e.key === 'PageDown') nextSlide();
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevSlide();
  if (e.key.toLowerCase() === 'a') toggleAgenda();
  if (e.key === 'Escape') toggleAgenda(false);
});

checklistModal.addEventListener('click', (e) => {
  const rect = checklistModal.querySelector('.modal-card').getBoundingClientRect();
  const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
  if (!inside) checklistModal.close();
});

updateUI();
