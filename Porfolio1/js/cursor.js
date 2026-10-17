/**
 * Custom desktop cursor with hover / project label states
 */

export function initCursor() {
  const el = document.getElementById("cursor");
  if (!el) return { destroy() {} };

  const labelEl = el.querySelector(".cursor__label");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!finePointer || reduced) {
    el.remove();
    return { destroy() {} };
  }

  document.body.classList.add("has-custom-cursor");

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let rx = x;
  let ry = y;
  let raf = 0;
  let active = false;

  function render() {
    rx += (x - rx) * 0.28;
    ry += (y - ry) * 0.28;
    el.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    raf = requestAnimationFrame(render);
  }

  function onMove(e) {
    x = e.clientX;
    y = e.clientY;
    if (!active) {
      active = true;
      el.classList.add("is-active");
    }
  }

  function setState(target) {
    const interactive = target.closest(
      "a, button, [role='button'], input, textarea, .stack-node, .project-row, .contact__copy, .terminal__form"
    );
    const cursorLabel = target.closest("[data-cursor]")?.getAttribute("data-cursor");

    el.classList.toggle("is-hover", Boolean(interactive) && !cursorLabel);
    el.classList.toggle("is-label", Boolean(cursorLabel));
    if (labelEl) labelEl.textContent = cursorLabel || "";
  }

  function onOver(e) {
    setState(e.target);
  }

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseover", onOver);
  raf = requestAnimationFrame(render);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.body.classList.remove("has-custom-cursor");
    },
  };
}
