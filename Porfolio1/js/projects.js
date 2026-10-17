/**
 * Project case-study system with accessible modal
 */

export const PROJECTS = [
  {
    id: "supermarket",
    name: "SuperMarket Management",
    category: "Operations System",
    description:
      "Backend-focused system for managing products, employees, and daily operations in a supermarket environment.",
    tech: ["C#", "SQL Server", "HTML", "CSS", "JavaScript"],
    features: [
      "Product management",
      "Employee management",
      "Daily operations workflows",
    ],
    architecture: "Database-driven management application with a C# backend and SQL Server data layer, paired with an HTML/CSS/JavaScript interface.",
    image: null,
    conceptual: true,
    conceptualLabel: "CONCEPTUAL UI · OPERATIONS GRID",
  },
  {
    id: "booklist",
    name: "BookList",
    category: "Catalog Application",
    description:
      "Web application for book cataloging, book management, and database integration.",
    tech: ["C#", "SQL Server", "HTML", "CSS", "JavaScript"],
    features: [
      "Book cataloging",
      "Book management",
      "Database integration",
    ],
    architecture: "CRUD-oriented catalog system built with C# and SQL Server, presented through a web interface.",
    image: null,
    conceptual: true,
    conceptualLabel: "CONCEPTUAL UI · CATALOG ROWS",
  },
  {
    id: "hikingstore",
    name: "HikingStore",
    category: "E-Commerce",
    description:
      "Full-stack e-commerce platform for outdoor products, including an admin dashboard and secure authentication.",
    tech: ["C#", "SQL Server", "HTML", "CSS", "JavaScript"],
    features: [
      "Outdoor product catalog",
      "Admin dashboard",
      "Secure authentication",
    ],
    architecture: "Full-stack commerce application with authenticated admin access and SQL Server persistence.",
    image: "assets/images/hikingstore-home.png",
    gallery: [
      "assets/images/hikingstore-home.png",
      "assets/images/hikingstore-shop.png",
      "assets/images/hikingstore-arrivals.png",
    ],
    conceptual: false,
  },
  {
    id: "furnicraft",
    name: "FurniCraft",
    category: "E-Commerce",
    description:
      "Furniture e-commerce application with shopping cart, checkout process, and inventory management.",
    tech: ["C#", "SQL Server", "HTML", "CSS", "JavaScript"],
    features: [
      "Shopping cart",
      "Checkout process",
      "Inventory management",
    ],
    architecture: "Commerce stack covering catalog browsing, cart/checkout flow, and inventory-backed product data.",
    image: "assets/images/furnicraft-home.png",
    gallery: [
      "assets/images/furnicraft-home.png",
      "assets/images/furnicraft-shop.png",
      "assets/images/furnicraft-cart.png",
      "assets/images/furnicraft-product.png",
    ],
    conceptual: false,
  },
  {
    id: "portfolio",
    name: "Portfolio Website",
    category: "Personal Site",
    description:
      "Personal developer portfolio showcasing projects, technical skills, and contact information.",
    tech: ["HTML", "CSS", "JavaScript"],
    features: [
      "Project presentation",
      "Technical skills overview",
      "Contact information",
    ],
    architecture: "Front-end portfolio built with semantic HTML, modern CSS, and interactive JavaScript modules.",
    image: null,
    conceptual: true,
    conceptualLabel: "CONCEPTUAL UI · PORTFOLIO LAYOUT",
  },
];

export function initProjects() {
  const modal = document.getElementById("project-modal");
  const dialog = modal?.querySelector(".modal__dialog");
  const content = document.getElementById("modal-content");
  const countEl = document.getElementById("modal-count");
  const prevBtn = document.getElementById("modal-prev");
  const nextBtn = document.getElementById("modal-next");
  const rows = document.querySelectorAll("[data-project]");

  let index = 0;
  let lastFocus = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function render(i) {
    const p = PROJECTS[i];
    if (!p || !content) return;
    index = i;
    if (countEl) countEl.textContent = `${pad(i + 1)} / ${pad(PROJECTS.length)}`;

    const media = p.conceptual
      ? `<div class="modal__media"><div class="modal__css-preview">${p.conceptualLabel}<br/><br/>Interface preview · not a live screenshot</div><p class="modal__media-note">Conceptual representation</p></div>`
      : `<div class="modal__media"><img src="${p.image}" alt="Preview of ${p.name}" loading="lazy" /><p class="modal__media-note">Project interface preview</p></div>`;

    content.innerHTML = `
      ${media}
      <p class="modal__category">${p.category}</p>
      <h3 class="modal__title" id="modal-title">${p.name}</h3>
      <p class="modal__desc">${p.description}</p>
      <div class="modal__grid">
        <div class="modal__block">
          <h4>TECHNOLOGY STACK</h4>
          <div class="modal__tech">${p.tech.map((t) => `<span>${t}</span>`).join("")}</div>
        </div>
        <div class="modal__block">
          <h4>KEY FUNCTIONALITY</h4>
          <ul class="modal__features">${p.features.map((f) => `<li>${f}</li>`).join("")}</ul>
        </div>
      </div>
      <div class="modal__block" style="margin-top:1.5rem">
        <h4>ARCHITECTURE</h4>
        <p class="modal__desc" style="margin:0">${p.architecture}</p>
      </div>
    `;
  }

  function open(i) {
    if (!modal || !dialog) return;
    lastFocus = document.activeElement;
    render(i);
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add("is-open");
        dialog.focus();
      });
    });
  }

  function close() {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      modal.hidden = true;
      lastFocus?.focus?.();
    }, 280);
  }

  rows.forEach((row) => {
    const id = row.dataset.project;
    const openProject = () => {
      const i = PROJECTS.findIndex((p) => p.id === id);
      if (i >= 0) open(i);
    };
    row.addEventListener("click", openProject);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProject();
      }
    });
  });

  modal?.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  prevBtn?.addEventListener("click", () => {
    open((index - 1 + PROJECTS.length) % PROJECTS.length);
  });
  nextBtn?.addEventListener("click", () => {
    open((index + 1) % PROJECTS.length);
  });

  document.addEventListener("keydown", (e) => {
    if (modal?.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") open((index - 1 + PROJECTS.length) % PROJECTS.length);
    if (e.key === "ArrowRight") open((index + 1) % PROJECTS.length);
  });

  return { open, close };
}
