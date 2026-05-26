(function(){
      const footer = document.getElementById('animated-footer');
      if(!footer) return;
      const sheen = footer.querySelector('.footer-sheen');
      let rafId = null, sheenId = null;
      function clamp(n, min, max){ return Math.max(min, Math.min(n, max)); }
      function update(){
        rafId = null;
        const doc = document.documentElement;
        const scrollY = window.scrollY || doc.scrollTop || 0;
        const winH = window.innerHeight;
        const docH = Math.max(doc.scrollHeight, doc.offsetHeight, doc.clientHeight);
        const footerTop = footer.getBoundingClientRect().top + scrollY;
        const rampStart = docH - (winH * 1.35);
        const dist = Math.min(scrollY, footerTop) - rampStart;
        const den = Math.max(1, (docH - rampStart));
        const t = clamp(dist / (den * 0.5), 0, 1);
        footer.style.setProperty('--glow-intensity', t.toFixed(3));
        if (t > 0.95 && sheen && !sheenId){
          sheen.style.opacity = .25;
          let x = -40;
          function run(){
            x += 1.2; sheen.style.transform = `translateX(${x}%)`;
            if (x < 140) { sheenId = requestAnimationFrame(run); }
            else { sheen.style.opacity = 0; sheen.style.transform = 'translateX(-40%)'; cancelAnimationFrame(sheenId); sheenId = null; }
          }
          sheenId = requestAnimationFrame(run);
        }
      }
      function onScroll(){ if(rafId) return; rafId = requestAnimationFrame(update); }
      window.addEventListener('scroll', onScroll, {passive:true});
      window.addEventListener('resize', onScroll);
      document.addEventListener('DOMContentLoaded', update);
      update();
    })();