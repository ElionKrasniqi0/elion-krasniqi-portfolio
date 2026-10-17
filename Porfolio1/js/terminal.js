/**
 * Lightweight interactive terminal
 */

const COMMANDS = {
  help: () =>
    [
      "Available commands:",
      "  help      — list commands",
      "  whoami    — identity",
      "  about     — short profile",
      "  skills    — stack overview",
      "  projects  — project list",
      "  contact   — contact channels",
      "  clear     — clear terminal",
    ].join("\n"),
  whoami: () => "Full Stack Developer",
  about: () =>
    "Elion Krasniqi — Full Stack Developer based in Ferizaj, Kosovo. Builds web applications with C#, .NET MVC, SQL, HTML, CSS, and JavaScript.",
  skills: () =>
    "Backend: C#, .NET MVC, RESTful APIs\nFrontend: HTML5, CSS3, JavaScript\nDatabases: SQL Server, MySQL\nConcepts: Git, WordPress, MVC, Auth, CRUD, Database Design",
  projects: () =>
    "01 SuperMarket Management\n02 BookList\n03 HikingStore\n04 FurniCraft\n05 Portfolio Website\n\nTip: open the Projects section to inspect case files.",
  contact: () =>
    "Email: elionkrasniqi0@gmail.com\nGitHub: https://github.com/ElionKrasniqi0\nLinkedIn: https://www.linkedin.com/in/elionkrasniqi/\nLocation: Ferizaj, Kosovo",
  clear: null,
};

export function initTerminal() {
  const form = document.getElementById("terminal-form");
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");
  if (!form || !input || !output) return;

  function line(html, className = "") {
    const div = document.createElement("div");
    div.className = `terminal__line ${className}`.trim();
    div.innerHTML = html;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function run(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    line(`<span class="terminal__prompt">elion@developer-system:~$</span> ${escapeHtml(raw)}`);

    if (cmd === "clear") {
      output.innerHTML = "";
      return;
    }

    const handler = COMMANDS[cmd];
    if (!handler) {
      line(`Command not found: ${escapeHtml(cmd)}. Type help.`, "terminal__line--err");
      return;
    }

    const result = handler();
    result.split("\n").forEach((row) => {
      line(escapeHtml(row), "terminal__line--out");
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    run(input.value);
    input.value = "";
  });

  // Focus terminal when clicking the app chrome
  document.getElementById("terminal-app")?.addEventListener("click", () => {
    input.focus();
  });
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
