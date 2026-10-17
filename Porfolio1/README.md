# Elion Krasniqi — Developer System Portfolio

Premium personal portfolio for **Elion Krasniqi**, Full Stack Developer (Ferizaj, Kosovo).

Internally named **THE DEVELOPER SYSTEM** — a custom dark technical interface built from zero with plain HTML, CSS, and modern JavaScript modules. No frameworks. No templates.

**Live goal:** GitHub → Vercel → production HTTPS site.

---

## Features

- Asymmetric hero with interactive **Developer Core** (Canvas particle network)
- Custom desktop cursor with contextual labels (`VIEW`, `OPEN`, `DOWNLOAD`)
- Interactive Developer Stack graph (linked technologies)
- Technical training timeline + education module
- Project case-study modal system (keyboard / ESC / focus restore)
- Functional terminal (`help`, `whoami`, `about`, `skills`, `projects`, `contact`, `clear`)
- Contact form with validation + `POST /api/contact` integration hook
- SEO (Open Graph, Person JSON-LD), accessibility, `prefers-reduced-motion`
- CV download integration point

---

## Technology stack

| Layer | Choice |
|-------|--------|
| Markup | Semantic HTML5 |
| Styles | CSS3 (design tokens, no Tailwind/Bootstrap) |
| Logic | ES modules (vanilla JS) |
| Motion | CSS + IntersectionObserver + `requestAnimationFrame` |
| Hosting | Static files on Vercel |
| Source | GitHub |

No runtime framework. No bundler required.

---

## Project structure

```
/
├── index.html
├── css/
│   ├── main.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── particles.js
│   ├── cursor.js
│   ├── navigation.js
│   ├── stack.js
│   ├── projects.js
│   ├── terminal.js
│   └── contact.js
├── assets/
│   ├── images/          # Production images only
│   ├── icons/favicon.svg
│   └── Elion_Krasniqi_CV.pdf   ← add your CV here
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Local development

Serve over HTTP (ES modules do not load from `file://`):

```bash
# Option A — Node
npx --yes serve -l 8080 .

# Option B — Python (if installed)
python -m http.server 8080
```

Open: [http://localhost:8080](http://localhost:8080)

---

## CV download

Place the real PDF at:

```
assets/Elion_Krasniqi_CV.pdf
```

All **Download CV** buttons already point to that path.

---

## Contact form / environment variables

The form validates client-side and calls `submitContact()` in `js/contact.js`.

Until a backend exists, messages are queued in `sessionStorage` and the UI states that clearly — it does **not** pretend an email was sent.

### Future backend

Wire a serverless route (Vercel / Node) to:

```
POST /api/contact
Content-Type: application/json

{ "name": "...", "email": "...", "message": "..." }
```

Compatible with Resend, SendGrid, or SMTP.

Copy `.env.example` → `.env` when you add keys. **Never commit `.env`.**

---

## Design tokens

| Token | Value |
|-------|--------|
| Void / base | `#050607` / `#0a0c0e` |
| Accent | `#3ecf8e` |
| Display | Syne |
| Body | Manrope |
| Mono | JetBrains Mono |

---

## GitHub

### First-time setup

```bash
git init
git add .
git commit -m "Initial production portfolio"
```

Create an empty repo on GitHub named `elion-krasniqi-portfolio`, then:

```bash
git branch -M main
git remote add origin https://github.com/ElionKrasniqi0/elion-krasniqi-portfolio.git
git push -u origin main
```

If you use SSH:

```bash
git remote add origin git@github.com:ElionKrasniqi0/elion-krasniqi-portfolio.git
git push -u origin main
```

With GitHub CLI (after `gh auth login`):

```bash
gh repo create elion-krasniqi-portfolio --public --source=. --remote=origin --push
```

---

## Vercel deployment

### Recommended: GitHub ↔ Vercel dashboard

1. Push this repo to GitHub (steps above).
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import `elion-krasniqi-portfolio`
4. Framework Preset: **Other** (static)
5. Build Command: leave empty
6. Output Directory: leave empty (or `.`)
7. Deploy

### CLI (optional)

```bash
npx vercel login
npx vercel          # preview
npx vercel --prod   # production
```

`vercel.json` sets security + long-cache headers for static assets. No framework build step.

---

## Production checklist

- [ ] Homepage loads over HTTPS
- [ ] Navigation / smooth scroll / active section
- [ ] Developer Core particles
- [ ] Project modals (open / ESC / prev-next)
- [ ] Terminal commands
- [ ] Contact validation + status message
- [ ] GitHub / LinkedIn / email links
- [ ] CV download (after PDF is added)
- [ ] Mobile layout (≤430px)
- [ ] No console errors

---

## Content policy

All biographical content is taken from the CV brief only. No invented employers, metrics, awards, or project claims.

---

## License

Personal portfolio © Elion Krasniqi. All rights reserved.
