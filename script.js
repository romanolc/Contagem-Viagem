/* ============================================================
   CTRLSEC — script.js
   Countdown · Particles · Scroll Reveal · Parallax
   ============================================================ */

/* ── COUNTDOWN ── */
(function initCountdown() {
  // Target: 05 Aug 2026 00:00 Brasília (UTC-3)
  const target = new Date('2026-08-05T03:00:00Z').getTime();

  const wrap    = document.getElementById('countdownWrap');
  const arrived = document.getElementById('arrivedMsg');
  const dEl     = document.getElementById('days');
  const hEl     = document.getElementById('hours');
  const mEl     = document.getElementById('minutes');
  const sEl     = document.getElementById('seconds');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      wrap.style.display = 'none';
      arrived.classList.add('show');
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    dEl.textContent = pad(days);
    hEl.textContent = pad(hours);
    mEl.textContent = pad(mins);
    sEl.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ── NAV SCROLL ── */
(function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ── PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['rgba(0,200,255,', 'rgba(124,58,237,', 'rgba(6,182,212,'];

  function createParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2,
      r:  Math.random() * 1.5 + 0.5,
      a:  Math.random() * 0.5 + 0.1,
      c:  colors[Math.floor(Math.random() * colors.length)]
    };
  }

  for (let i = 0; i < 70; i++) particles.push(createParticle());

  function frame() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + p.a + ')';
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { Object.assign(p, createParticle(), { y: H + 10 }); }
    });
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ── TEAM CANVAS (ambient lines) ── */
(function initTeamCanvas() {
  const canvas = document.getElementById('teamCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(124,58,237,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      const offset = (t * 0.3 + i * 80) % H;
      ctx.moveTo(0, offset);
      for (let x = 0; x < W; x += 4) {
        ctx.lineTo(x, offset + Math.sin(x * 0.01 + t * 0.02 + i) * 30);
      }
      ctx.stroke();
    }
    t++;
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Also mark parent tl-item for dot animation
        const tl = entry.target.closest('.tl-item');
        if (tl) tl.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => observer.observe(el));
})();

/* ── PARALLAX ── */
(function initParallax() {
  const items = document.querySelectorAll('[data-parallax]');
  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    items.forEach(el => {
      const factor = parseFloat(el.dataset.parallax) || 0.1;
      const rect   = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${center * factor}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();

/* ── VLOG PROGRESS ANIMATION ── */
(function initVlogProgress() {
  const bar = document.querySelector('.vlog-progress');
  if (!bar) return;

  let progress = 0;
  const target  = 47; // percentage — frozen "loading" state

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const anim = setInterval(() => {
        progress += 0.5;
        if (progress >= target) { clearInterval(anim); return; }
        bar.style.width = progress + '%';
      }, 20);
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  const section = document.getElementById('vlog');
  if (section) observer.observe(section);
})();

/* ── HERO MOUSE PARALLAX ── */
(function initHeroMouseParallax() {
  const hero = document.querySelector('.hero');
  const img  = document.getElementById('heroImg');
  if (!hero || !img) return;

  hero.addEventListener('mousemove', e => {
    const rx = (e.clientX / window.innerWidth  - 0.5) * 6;
    const ry = (e.clientY / window.innerHeight - 0.5) * 4;
    img.style.transform = `scale(1.08) translate(${rx}px, ${ry}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    img.style.transform = '';
  });
})();

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
