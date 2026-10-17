/**
 * Developer Core — network particle / bubble engine
 */

const LABELS = ["data", "api", "mvc", "sql", "auth", "node", "crud", "ui"];

export function createParticleSystem(canvas, options = {}) {
  const ctx = canvas.getContext("2d", { alpha: true });
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let raf = 0;
  let running = false;
  let visible = true;
  let mouse = { x: 0, y: 0, active: false };
  let pulseT = 0;

  const state = {
    count: options.count ?? 42,
    connectionDist: options.connectionDist ?? 120,
  };

  function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function targetCount() {
    if (reducedMotion) return Math.min(14, state.count);
    if (isMobile()) return Math.min(22, Math.floor(state.count * 0.5));
    return state.count;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    syncParticles();
  }

  function makeParticle(i) {
    const depth = 0.35 + Math.random() * 0.65;
    return {
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25 * depth,
      vy: (Math.random() - 0.5) * 0.25 * depth,
      r: (2 + Math.random() * 5) * depth,
      depth,
      opacity: 0.25 + depth * 0.55,
      label: Math.random() > 0.82 ? LABELS[i % LABELS.length] : null,
      pulse: Math.random() * Math.PI * 2,
      homeX: 0,
      homeY: 0,
    };
  }

  function syncParticles() {
    const n = targetCount();
    while (particles.length < n) particles.push(makeParticle(particles.length));
    while (particles.length > n) particles.pop();
    particles.forEach((p) => {
      p.homeX = p.x;
      p.homeY = p.y;
      p.x = Math.min(Math.max(p.x, 0), width);
      p.y = Math.min(Math.max(p.y, 0), height);
    });
  }

  function onPointer(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  }

  function onLeave() {
    mouse.active = false;
  }

  function step() {
    if (!running) return;
    pulseT += 0.016;
    ctx.clearRect(0, 0, width, height);

    // soft core glow
    const g = ctx.createRadialGradient(width * 0.5, height * 0.5, 10, width * 0.5, height * 0.5, width * 0.42);
    g.addColorStop(0, "rgba(62, 207, 142, 0.08)");
    g.addColorStop(1, "rgba(62, 207, 142, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    const speed = reducedMotion ? 0.15 : 1;

    for (const p of particles) {
      if (!reducedMotion) {
        p.x += p.vx * speed;
        p.y += p.vy * speed;
        p.pulse += 0.02;

        // gentle boundary bounce
        if (p.x < p.r || p.x > width - p.r) p.vx *= -1;
        if (p.y < p.r || p.y > height - p.r) p.vy *= -1;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy) || 1;
          const influence = 140;
          if (dist < influence) {
            const force = (1 - dist / influence) * 0.08 * p.depth;
            // subtle repulsion near cursor, slight orbit farther
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          } else if (dist < influence * 1.8) {
            p.vx -= (dx / dist) * 0.01 * p.depth;
            p.vy -= (dy / dist) * 0.01 * p.depth;
          }
        }

        // dampen
        p.vx *= 0.992;
        p.vy *= 0.992;
        // keep drift alive
        p.vx += (Math.random() - 0.5) * 0.004;
        p.vy += (Math.random() - 0.5) * 0.004;
      }
    }

    // connections
    const maxDist = isMobile() ? state.connectionDist * 0.85 : state.connectionDist;
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxDist * ((a.depth + b.depth) / 2 + 0.4)) {
          const alpha = (1 - dist / maxDist) * 0.35 * Math.min(a.opacity, b.opacity);
          ctx.strokeStyle = `rgba(62, 207, 142, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // nodes
    for (const p of particles) {
      const pulse = 1 + Math.sin(p.pulse + pulseT) * 0.08;
      const r = p.r * pulse;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(94, 228, 168, ${p.opacity * 0.85})`;
      ctx.fill();

      if (p.depth > 0.7) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(62, 207, 142, ${0.15 * p.opacity})`;
        ctx.stroke();
      }

      if (p.label && !isMobile()) {
        ctx.font = "10px JetBrains Mono, monospace";
        ctx.fillStyle = `rgba(180, 188, 196, ${0.45 * p.opacity})`;
        ctx.fillText(p.label, p.x + r + 4, p.y + 3);
      }
    }

    // mouse link highlight
    if (mouse.active && !reducedMotion) {
      let nearest = null;
      let nearestDist = 90;
      for (const p of particles) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = p;
        }
      }
      if (nearest) {
        ctx.strokeStyle = "rgba(94, 228, 168, 0.35)";
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(nearest.x, nearest.y);
        ctx.stroke();
      }
    }

    raf = requestAnimationFrame(step);
  }

  function start() {
    if (running) return;
    running = true;
    resize();
    raf = requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function onVisibility() {
    visible = document.visibilityState === "visible";
    if (visible) start();
    else stop();
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas);

  canvas.addEventListener("pointermove", onPointer);
  canvas.addEventListener("pointerenter", onPointer);
  canvas.addEventListener("pointerleave", onLeave);
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("resize", resize);

  start();

  return {
    destroy() {
      stop();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerenter", onPointer);
      canvas.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    },
  };
}
