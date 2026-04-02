
(function(){
  const btn = document.getElementById('toTop');
  if(!btn) return;
  const update = () => {
    btn.style.opacity = window.scrollY > 320 ? '1' : '.0';
    btn.style.pointerEvents = window.scrollY > 320 ? 'auto' : 'none';
  };
  update();
  window.addEventListener('scroll', update, {passive:true});
  btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
})();
