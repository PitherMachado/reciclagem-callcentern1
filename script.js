
const slides = Array.from(document.querySelectorAll('.slide'));
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const agenda = document.getElementById('agenda');
const agendaList = document.getElementById('agendaList');
const openAgenda = document.getElementById('openAgenda');
const closeAgenda = document.getElementById('closeAgenda');

let index = 0;

function renderAgenda(){
  agendaList.innerHTML = '';
  slides.forEach((slide, i) => {
    const btn = document.createElement('button');
    btn.className = 'agenda-item' + (i === index ? ' active' : '');
    btn.innerHTML = `<strong>${String(i + 1).padStart(2,'0')} • ${slide.dataset.title}</strong><small>Slide ${i + 1} de ${slides.length}</small>`;
    btn.addEventListener('click', () => {
      goTo(i);
      agenda.classList.remove('open');
    });
    agendaList.appendChild(btn);
  });
}

function updateUI(){
  slides.forEach((slide, i) => {
    slide.classList.remove('active', 'prev');
    if(i === index) slide.classList.add('active');
    if(i < index) slide.classList.add('prev');
  });

  const pct = ((index + 1) / slides.length) * 100;
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === slides.length - 1;
  renderAgenda();
}

function goTo(i){
  index = Math.max(0, Math.min(slides.length - 1, i));
  updateUI();
}

prevBtn.addEventListener('click', () => goTo(index - 1));
nextBtn.addEventListener('click', () => goTo(index + 1));
openAgenda.addEventListener('click', () => agenda.classList.add('open'));
closeAgenda.addEventListener('click', () => agenda.classList.remove('open'));

document.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowRight') goTo(index + 1);
  if(e.key === 'ArrowLeft') goTo(index - 1);
  if(e.key === 'Escape') agenda.classList.remove('open');
});

updateUI();

/* Nanoteia 3D sutil */
const canvas = document.getElementById('webCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let w = 0;
let h = 0;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas(){
  const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const total = Math.max(28, Math.min(58, Math.floor(w / 28)));
  particles = Array.from({length: total}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random() * 1 + .2,
    vx: (Math.random() - .5) * .14,
    vy: (Math.random() - .5) * .14,
  }));
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function draw(){
  ctx.clearRect(0, 0, w, h);

  for(const p of particles){
    p.x += p.vx * p.z;
    p.y += p.vy * p.z;

    if(p.x < -20) p.x = w + 20;
    if(p.x > w + 20) p.x = -20;
    if(p.y < -20) p.y = h + 20;
    if(p.y > h + 20) p.y = -20;
  }

  for(let i = 0; i < particles.length; i++){
    for(let j = i + 1; j < particles.length; j++){
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if(dist < 170){
        const alpha = (1 - dist / 170) * 0.22;
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, `rgba(123, 104, 220, ${alpha})`);
        grad.addColorStop(1, `rgba(116, 46, 160, ${alpha * 0.92})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  for(const p of particles){
    const r = 1.8 * p.z;
    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10);
    glow.addColorStop(0, 'rgba(170, 182, 255, .28)');
    glow.addColorStop(1, 'rgba(170, 182, 255, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(206, 214, 236, .34)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  if(!prefersReduced) requestAnimationFrame(draw);
}

if(prefersReduced){
  draw();
} else {
  requestAnimationFrame(draw);
}
