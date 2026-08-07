# JVM Tools

**https://jvm.tools** - the independent, practical directory of Java Virtual Machine tools, guides and resources for working JVM developers.

The site is a **static multi-page hub** generated from data files by a tiny in-repo generator. No CMS, no framework, no build step beyond one command.

## What's here

| Section | Path | Pages |
|---|---|---|
| Home | / | 1 |
| Category hubs | /tools/<category>/ | 6 (JVM CLI, Profiling, Memory, Bytecode, Build, Testing) |
| Tool deep-dives | /tools/<category>/<tool>/ | 14, with real command examples |
| Guides | /guides/<slug>/ | 3 |
| Books | /books/ | 1 |

Every page ships: unique title + meta description, canonical, breadcrumbs, JSON-LD structured data (WebSite, ItemList, BreadcrumbList, TechArticle, FAQPage), dark mode, and Umami analytics.

## Local development (build the site)

Requires Bun (https://bun.sh).

    bun scripts/generate.ts

That regenerates the deployable site into ./site-public (index.html, tools/, guides/, books/, assets/, sitemap.xml, robots.txt, _headers, _redirects).

### Content lives in two data files

- **scripts/data.ts** - categories and the tool catalog (name, URL, description, license, kind). Add/update a tool here.
- **scripts/content.ts** - deep-dives and guides (intro, 'use when', sections with code blocks, FAQ). Add a page by adding an object here, then rebuild.
- **scripts/generate.ts** - the template + page renderers. Most people never touch this.

After editing data, run  bun scripts/generate.ts  and commit everything.

## Deployment

The **repo root is the deployed site** (that is how jvm.tools is currently served via Cloudflare).

- **GitHub Pages**: push the repo. The root index.html and folders are served directly. (To build into /docs instead: copy index.html, tools, guides, books, assets, sitemap.xml, robots.txt into docs/ and point Pages at docs/.)
- **Cloudflare Pages**: connect the repo. Either set Build command (less common) or, since the site is already generated at root, simply push the generated files (recommended).

> After the first real deploy, open https://jvm.tools/robots.txt and /sitemap.xml, then submit the sitemap in Google Search Console and Cloudflare.

## Maintenance & SEO playbook (the keep-it-growing bit)

The original page was a thin link-list that ranked #3 for 'jvm tools'. This rebuild exists so it can rank higher for that head term and win the long tail of 'jvm X' and '<tool> tutorial/how to/examples' queries. To keep compounding:

1. **Add deep-dives for the tools that win searches** - see the list in .plan. Each deep-dive targets <tool> tutorial/examples/how to.
2. **Keep commands correct.** Broken commands hurt trust and rankings. Verify anything you paste.
3. **Keep the 'Updated' stamps honest** and refresh pages when JDK/tool versions change. Freshness is a real ranking input.
4. **Add one genuinely useful page per week** (guide, comparison, or deep-dive). Consistency beats bursts.
5. **Earn backlinks**: get listed in awesome-jvm / tool roundups, cross-post the guides as dev.to articles linking back, mention it where Java devs gather.
6. **Run Google Search Console** to see which queries already rank #2-10 and double down on them.

## License

MIT. The content and page copy are original to this project; individual tool names and trademarks belong to their respective owners. The site is independent and not affiliated with Oracle or any listed vendor.


## Cloudflare Pages

This repo ships a `wrangler.toml` so Cloudflare Pages can build and serve it:

- Build command: `bun scripts/generate.ts`
- Output directory: `.` (repo root)
- `_headers` and `_redirects` are included (legacy `books.html` -> `/books/`, static-cache rules).

Attach the repo in the Cloudflare dashboard (Workers & Pages -> Create -> Pages -> connect Git).
If your project already sets its build config in the dashboard, mirror the values above there too.

## Local preview

    bun preview          # http://localhost:3000  (zero-dependency Bun server)

## Lead capture (call to action)

A CTA band (currently offering a JVM CLI cheat-sheet) renders on the homepage,
guides, and deep-dives. It is intentionally inert until you set a real destination:

- Edit `SIGNUP_URL` at the top of `scripts/generate.ts`:
  - set it to a Formspree/Buttondown/getform endpoint for a zero-backend newsletter, or
  - implement a Cloudflare Pages Function (`functions/api/subscribe.ts`) + KV for self-hosting.
- Until then the form shows a friendly "coming soon" and records nothing.
