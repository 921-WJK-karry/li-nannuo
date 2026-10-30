# AGENTS.md

Static classroom-practice site for 《高级网页设计》(学号 24002120324, 李南诺). Plain HTML/CSS/JS, no build, test, lint, or package manager at the repo root. Preview changes by opening the HTML file in a browser.

## Before executing any request

- Append (never overwrite) an entry to `LNN_prompt.md` containing the date, model name, and the prompt text.
- New CSS class names, IDs, and JS variable names must start with `LNN_`; use `--LNN_*` for CSS custom properties. Older pages predate this rule, so follow it for all new code only.

## Adding pages

- Every new `.html` file must be linked from root `index.html`.
- Course lesson: add an `<a class="lesson">` card inside `.grid`, then bump the zero-padded counter (`<span class="count">09 lessons</span>`).
- Page outside the course sequence: add a pill link to `.other-links`.
- Do not rename existing legacy classes (e.g. `.tab-item`, `.budge-*`) just to satisfy the `LNN_` rule.

## Layout and source of truth

- Root files are the active site: `index.html` (catalog), `flex-review.html/.css`, `svg图标.html/.css`, `iconfont-1..4.html`, the JS lesson pages, `ball.html`.
- `webprojectkarry/24002120324+李南诺/` is an older submitted copy with the same filenames but different styles. Edit it only when the task explicitly targets the project directory; root `index.html` already links to it.
- Root `dataType.html` is a stray copy; the catalog lesson card points to `font/dataType.html`. Check the actual `href` before editing either.
- `font/` is the Alibaba iconfont library. `cdn/` holds locally downloaded Font Awesome and Lucide assets; `skills/frontend-design/SKILL.md` is the design guidance for new pages.
- `.opencode/` is gitignored tooling, not part of the published site.

## Styling conventions

- Pages use `<html lang="zh-CN">`, UTF-8, Chinese UI copy, responsive CSS, visible keyboard focus, and `prefers-reduced-motion` handling.
- Root `index.html` is intentionally self-contained (inline CSS, no CDN). New lesson pages should stay native HTML/CSS/JS; when a library is required, download it into `cdn/` and reference it locally (see `iconfont-1.html` / `iconfont-2.html`) instead of hotlinking.
- Keep CSS inline where the page already does so; otherwise use the sibling `.css` file.
- SVG sprite icons use `<svg class="icon"><use xlink:href="#icon-..."></use></svg>` with `.icon { width:1em; height:1em; vertical-align:-0.15em; fill:currentColor; }`.

## Verification and git

- No automated checks exist. Verify by opening the changed page and following links from `index.html`.
- Commit/push only when explicitly asked. Two Gitee remotes exist: `origin` = `webprojectkarry`, `li-nan-g` = `li-nan-g`; confirm which one is intended. Commit messages are written in Chinese.
- Use the `gitee-commit-push` or `gitee-commit-push-li-nan-g` skill for the commit-and-push flow.
- The `web-frontend-course` skill may conflict with this file; trust `AGENTS.md`. Its `catalog-item` and `学习状态` references are stale (the real markup is `.lesson` and `.count`).
