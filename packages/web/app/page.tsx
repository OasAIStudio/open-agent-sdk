import Link from 'next/link';

const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL ?? '/docs';
const githubUrl = 'https://github.com/OasAIStudio/open-agent-sdk';
const npmUrl = 'https://www.npmjs.com/package/open-agent-sdk';
const docsQuickstartUrl = `${docsUrl}/getting-started/quickstart/`;
const docsMigrationUrl = `${docsUrl}/migration/quick-migration/`;
const docsApiUrl = `${docsUrl}/api-reference/overview/`;

const navItems = [
  { href: docsUrl, label: 'Docs' },
  { href: '/blog', label: 'Blog' },
  { href: '/playground', label: 'Playground' },
  { href: githubUrl, label: 'GitHub', external: true }
];

export default function HomePage() {
  return (
    <main className="shell">
      <div className="aurora" aria-hidden="true" />
      <header className="topbar">
        <div className="brand">Open Agent SDK</div>
        <nav className="nav">
          {navItems.map((item) => (
            item.external ? (
              <a key={item.href} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            )
          ))}
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">Open-source agent sdk</p>
        <h1>Claude Agent SDK-style APIs, open-source flexibility.</h1>
        <p>
          Build production-grade AI agents in TypeScript with a Claude-like developer
          experience, aligned API patterns, and broader provider and plugin options.
        </p>
        <div className="hero-cta">
          <Link className="btn btn-primary" href={docsUrl}>
            Start with the docs
          </Link>
          <a className="btn btn-secondary" href={npmUrl} target="_blank" rel="noreferrer">
            Install open-agent-sdk
          </a>
        </div>
      </section>

      <section className="proof-strip" aria-label="Key proof points">
        <div>
          <strong>MIT licensed</strong>
          <p>Open codebase, transparent roadmap, zero black-box lock-in.</p>
        </div>
        <div>
          <strong>API-aligned with Claude Agent SDK</strong>
          <p>Keep familiar workflows while extending beyond a single provider.</p>
        </div>
        <div>
          <strong>Built for production control</strong>
          <p>Tools, sessions, permissions, hooks, and MCP integration included.</p>
        </div>
      </section>

      <section className="portal-grid" aria-label="Primary entries">
        <Link className="portal-card" href={docsUrl}>
          <h2>Docs</h2>
          <p>Install, quickstart, API reference, and migration guides.</p>
          <span>Read docs</span>
        </Link>
        <Link className="portal-card" href="/blog">
          <h2>Blog</h2>
          <p>Release notes, implementation decisions, and benchmark updates.</p>
          <span>See updates</span>
        </Link>
        <Link className="portal-card" href="/playground">
          <h2>Playground</h2>
          <p>Run agent workflows and validate tool behavior end-to-end.</p>
          <span>Try playground</span>
        </Link>
      </section>

      <section className="value-grid" aria-label="Why teams choose Open Agent SDK">
        <article>
          <h3>Use familiar API patterns</h3>
          <p>
            Implement with Claude Agent SDK-style primitives so teams can adopt fast
            without relearning the core model.
          </p>
        </article>
        <article>
          <h3>Keep provider optionality</h3>
          <p>
            Work across OpenAI, Gemini, and Anthropic providers without rewriting your
            runtime architecture.
          </p>
        </article>
        <article>
          <h3>Extend without framework fights</h3>
          <p>
            Add custom tools, hooks, and integrations with a strict TypeScript API
            surface designed for long-term maintainability.
          </p>
        </article>
      </section>

      <section className="segment-grid" aria-label="Choose your path">
        <article className="segment-card">
          <p className="segment-label">Path 1</p>
          <h3>New to agent runtimes</h3>
          <p>Start with quickstart and ship your first tool-enabled workflow today.</p>
          <a href={docsQuickstartUrl}>Open quickstart</a>
        </article>
        <article className="segment-card">
          <p className="segment-label">Path 2</p>
          <h3>Migrating from Claude Agent SDK</h3>
          <p>Map concepts and move existing flows with minimal API friction.</p>
          <a href={docsMigrationUrl}>See migration guide</a>
        </article>
        <article className="segment-card">
          <p className="segment-label">Path 3</p>
          <h3>Evaluating for production</h3>
          <p>Review API surface, control primitives, and extension points.</p>
          <a href={docsApiUrl}>Browse API reference</a>
        </article>
      </section>

      <section className="objection-grid" aria-label="Common objections">
        <article>
          <h3>Why not just use Claude Agent SDK directly?</h3>
          <p>
            Use Open Agent SDK when you want Claude-style APIs plus multi-provider and
            plugin-style extensibility in one open-source runtime.
          </p>
        </article>
        <article>
          <h3>Is this too heavy for our team?</h3>
          <p>
            Start with one-shot prompts, then add sessions, permissions, and tools as
            your workflows mature.
          </p>
        </article>
        <article>
          <h3>What if requirements change later?</h3>
          <p>
            The core is MIT-licensed and TypeScript-first, so you can customize,
            audit, and evolve without black-box constraints.
          </p>
        </article>
      </section>

      <section className="final-cta" aria-label="Final call to action">
        <h2>Build now. Migrate safely. Stay open.</h2>
        <p>
          Ship with Claude Agent SDK-style APIs while keeping the flexibility to
          choose providers and extensions as your product evolves.
        </p>
        <div className="hero-cta">
          <Link className="btn btn-primary" href={docsUrl}>
            Start with the docs
          </Link>
          <a className="btn btn-secondary" href={githubUrl} target="_blank" rel="noreferrer">
            Star on GitHub
          </a>
        </div>
      </section>
    </main>
  );
}
