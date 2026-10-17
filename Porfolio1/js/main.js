/**
 * THE DEVELOPER SYSTEM — bootstrap
 */

import { createParticleSystem } from "./particles.js";
import { initCursor } from "./cursor.js";
import { initNavigation, initReveals } from "./navigation.js";
import { initProjects } from "./projects.js";
import { initTerminal } from "./terminal.js";
import { initContact } from "./contact.js";
import { initStack } from "./stack.js";

const LOADER_MESSAGES = [
  "Booting developer environment…",
  "Linking stack modules…",
  "Hydrating project case files…",
  "Calibrating interface…",
  "System ready.",
];

function initLoader() {
  const loader = document.getElementById("loader");
  const fill = loader?.querySelector(".loader__fill");
  const status = loader?.querySelector("[data-loader-status]");
  const clock = loader?.querySelector("[data-loader-clock]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const started = performance.now();
  let raf = 0;

  function tickClock() {
    if (!clock) return;
    const t = new Date();
    clock.textContent = t.toLocaleTimeString("en-GB", { hour12: false });
  }

  tickClock();
  const clockIv = setInterval(tickClock, 1000);

  return new Promise((resolve) => {
    if (!loader) {
      clearInterval(clockIv);
      resolve();
      return;
    }

    if (reduced) {
      if (fill) fill.style.width = "100%";
      if (status) status.textContent = "System ready.";
      loader.classList.add("is-done");
      clearInterval(clockIv);
      resolve();
      return;
    }

    const duration = 1400;
    const step = (now) => {
      const p = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      if (fill) fill.style.width = `${Math.round(eased * 100)}%`;
      const msgIndex = Math.min(
        LOADER_MESSAGES.length - 1,
        Math.floor(p * LOADER_MESSAGES.length)
      );
      if (status) status.textContent = LOADER_MESSAGES[msgIndex];

      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        loader.classList.add("is-done");
        clearInterval(clockIv);
        setTimeout(resolve, 420);
      }
    };

    raf = requestAnimationFrame(step);

    // Never block content access
    setTimeout(() => {
      cancelAnimationFrame(raf);
      loader.classList.add("is-done");
      clearInterval(clockIv);
      resolve();
    }, 2800);
  });
}

function initCoreCodeTicker() {
  const el = document.querySelector("[data-core-code]");
  if (!el) return;
  const lines = [
    "sys.link(nodes) → active",
    "auth.verify(session) → ok",
    "db.query(entities) → ready",
    "mvc.route(request) → view",
    "api.emit(payload) → 200",
  ];
  let i = 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;
  setInterval(() => {
    i = (i + 1) % lines.length;
    el.textContent = lines[i];
  }, 2800);
}

async function boot() {
  await initLoader();
  document.body.classList.add("is-ready");

  initNavigation();
  initReveals();
  initCursor();
  initStack();
  initProjects();
  initTerminal();
  initContact();
  initCoreCodeTicker();

  const canvas = document.getElementById("core-canvas");
  if (canvas) {
    createParticleSystem(canvas, { count: 48, connectionDist: 128 });
  }

  // Mark hero reveals if already in view after loader
  document.querySelectorAll(".hero [data-reveal]").forEach((el) => {
    el.classList.add("is-visible");
  });
}

boot().catch((err) => {
  console.error("Developer System boot error:", err);
  document.getElementById("loader")?.classList.add("is-done");
  document.body.classList.add("is-ready");
});
