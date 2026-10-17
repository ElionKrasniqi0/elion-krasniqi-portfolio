/**
 * Navigation, scroll progress, section spy, magnetic buttons
 */

export function initNavigation() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  const mobile = document.getElementById("nav-mobile");
  const progress = document.getElementById("scroll-progress");
  const links = document.querySelectorAll("[data-section-link]");
  const sections = document.querySelectorAll("[data-section]");

  function closeMobile() {
    if (!mobile || !toggle) return;
    mobile.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  function openMobile() {
    if (!mobile || !toggle) return;
    mobile.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  toggle?.addEventListener("click", () => {
    if (mobile?.hidden) openMobile();
    else closeMobile();
  });

  links.forEach((link) => {
    link.addEventListener("click", () => closeMobile());
  });

  function onScroll() {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
    if (progress) progress.style.width = `${pct}%`;
    nav?.classList.toggle("is-scrolled", scrollTop > 20);

    let current = "home";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (scrollTop >= top) current = section.dataset.section;
    });

    links.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.sectionLink === current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Magnetic buttons
  const magnets = document.querySelectorAll("[data-magnetic]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!reduced && fine) {
    magnets.forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  // Hero coordinates
  const cx = document.querySelector("[data-coord-x]");
  const cy = document.querySelector("[data-coord-y]");
  if (cx && cy && fine) {
    window.addEventListener(
      "pointermove",
      (e) => {
        cx.textContent = (e.clientX / window.innerWidth).toFixed(3);
        cy.textContent = (e.clientY / window.innerHeight).toFixed(3);
      },
      { passive: true }
    );
  }

  return { closeMobile };
}

export function initReveals() {
  const nodes = document.querySelectorAll("[data-reveal]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    nodes.forEach((n) => n.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach((n) => io.observe(n));
}
