/**
 * Interactive Developer Stack graph
 */

const SKILLS = {
  csharp: {
    title: "C#",
    desc: "Primary backend language for application logic, services, and .NET MVC systems.",
    chain: ["csharp", "dotnet", "sqlserver", "auth", "crud"],
  },
  dotnet: {
    title: ".NET MVC",
    desc: "Structured server-side architecture for dynamic web applications using the MVC pattern.",
    chain: ["csharp", "dotnet", "mvc", "rest", "html"],
  },
  rest: {
    title: "RESTful APIs",
    desc: "API-oriented communication between clients and backend services.",
    chain: ["rest", "csharp", "dotnet", "js", "auth"],
  },
  html: {
    title: "HTML5",
    desc: "Semantic structure for web interfaces and application views.",
    chain: ["html", "css", "js", "dotnet"],
  },
  css: {
    title: "CSS3",
    desc: "Visual system, layout, and responsive presentation for interface layers.",
    chain: ["css", "html", "js"],
  },
  js: {
    title: "JavaScript",
    desc: "Client-side interactivity and frontend behavior across web applications.",
    chain: ["js", "html", "css", "rest"],
  },
  sqlserver: {
    title: "SQL Server",
    desc: "Relational database platform used for persistent application data.",
    chain: ["sqlserver", "csharp", "crud", "dbdesign", "auth"],
  },
  mysql: {
    title: "MySQL",
    desc: "Relational database used in full-stack training and web application work.",
    chain: ["mysql", "dbdesign", "crud", "wordpress"],
  },
  git: {
    title: "Git",
    desc: "Version control for tracking changes and collaborating on codebases.",
    chain: ["git", "csharp", "js", "html"],
  },
  wordpress: {
    title: "WordPress",
    desc: "Content-oriented web platform used during full-stack training.",
    chain: ["wordpress", "html", "css", "js", "mysql"],
  },
  mvc: {
    title: "MVC",
    desc: "Architectural pattern separating models, views, and controllers for maintainable systems.",
    chain: ["mvc", "dotnet", "csharp", "html"],
  },
  auth: {
    title: "Authentication & Authorization",
    desc: "Access control for securing application features and protected resources.",
    chain: ["auth", "csharp", "dotnet", "sqlserver"],
  },
  crud: {
    title: "CRUD",
    desc: "Create, read, update, and delete operations over database-backed entities.",
    chain: ["crud", "sqlserver", "mysql", "csharp", "dbdesign"],
  },
  dbdesign: {
    title: "Database Design",
    desc: "Structuring relational schemas that support reliable application workflows.",
    chain: ["dbdesign", "sqlserver", "mysql", "crud"],
  },
};

const LABELS = {
  csharp: "C#",
  dotnet: ".NET MVC",
  rest: "RESTful APIs",
  html: "HTML5",
  css: "CSS3",
  js: "JavaScript",
  sqlserver: "SQL Server",
  mysql: "MySQL",
  git: "Git",
  wordpress: "WordPress",
  mvc: "MVC",
  auth: "Auth",
  crud: "CRUD",
  dbdesign: "DB Design",
};

export function initStack() {
  const root = document.getElementById("stack-system");
  if (!root) return;

  const nodes = root.querySelectorAll(".stack-node");
  const title = root.querySelector("[data-stack-title]");
  const desc = root.querySelector("[data-stack-desc]");
  const chain = root.querySelector("[data-stack-chain]");
  const status = root.querySelector("[data-stack-status]");

  function clear() {
    nodes.forEach((n) => {
      n.classList.remove("is-active", "is-related", "is-dimmed");
      n.setAttribute("aria-pressed", "false");
    });
    if (title) title.textContent = "Developer Stack";
    if (desc) {
      desc.textContent =
        "Click any technology to highlight related modules in the system graph.";
    }
    if (chain) chain.innerHTML = "";
    if (status) status.textContent = "SELECT A NODE";
  }

  function activate(id) {
    const skill = SKILLS[id];
    if (!skill) return;

    const related = new Set(skill.chain);
    nodes.forEach((n) => {
      const key = n.dataset.skill;
      const isActive = key === id;
      const isRelated = related.has(key);
      n.classList.toggle("is-active", isActive);
      n.classList.toggle("is-related", isRelated && !isActive);
      n.classList.toggle("is-dimmed", !isRelated);
      n.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (title) title.textContent = skill.title;
    if (desc) desc.textContent = skill.desc;
    if (status) status.textContent = "LINKED";
    if (chain) {
      chain.innerHTML = skill.chain
        .map((key, i) => {
          const arrow = i < skill.chain.length - 1 ? "<i>→</i>" : "";
          return `<span>${LABELS[key] || key}</span>${arrow}`;
        })
        .join("");
    }
  }

  nodes.forEach((node) => {
    node.addEventListener("click", () => {
      const id = node.dataset.skill;
      if (node.classList.contains("is-active")) clear();
      else activate(id);
    });
  });
}
