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

const summaryItems = [
  {
    title: 'CLI surface',
    description: 'Use oas to run and benchmark a complete terminal agent.'
  },
  {
    title: 'Runtime API',
    description: 'Reuse sessions, permissions, tools, and hooks from TypeScript.'
  },
  {
    title: 'Provider layer',
    description: 'OpenAI, Gemini, Anthropic, and Codex-oriented workflows in one core.'
  }
];

const entryLinks = [
  {
    href: docsQuickstartUrl,
    label: 'Start here',
    title: 'Quickstart',
    description: 'Scaffold a project, run the CLI, and get to a working agent fast.',
    action: 'Open'
  },
  {
    href: docsApiUrl,
    label: 'For builders',
    title: 'API reference',
    description: 'Use the runtime directly when you need custom UX, policies, or infrastructure.',
    action: 'Browse'
  },
  {
    href: docsMigrationUrl,
    label: 'For migration',
    title: 'Coming from Claude Agent SDK?',
    description: 'Map the familiar concepts, then move to a runtime you can own end to end.',
    action: 'Compare'
  }
];

export default function HomePage() {
  return (
    <main className="home">
      <div className="home-shell">
        <header className="home-header">
          <Link className="brand-link" href="/">
            <span className="brand-mark" aria-hidden="true" />
            <span>Open Agent SDK</span>
          </Link>
          <nav className="home-nav" aria-label="Primary">
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

        <section className="home-hero">
          <p className="home-kicker">TypeScript runtime + first-party CLI</p>
          <h1>
            <span>Open Agent SDK</span>
            <span className="home-title-subtle">Runtime for building agent products.</span>
          </h1>
          <p className="home-lede">
            Start with <code>oas</code> when you want an end-to-end terminal agent.
            Drop to the SDK when you need your own UI, tool policies, or infrastructure.
          </p>
          <div className="home-actions">
            <Link className="button button-primary" href={docsQuickstartUrl}>
              Open docs
            </Link>
            <a className="button button-secondary" href={githubUrl} target="_blank" rel="noreferrer">
              View GitHub
            </a>
          </div>
          <div className="home-command" aria-label="Quickstart command">
            <span className="home-command-prefix">$</span>
            <code>npx open-agent-sdk@alpha init my-agent</code>
          </div>
        </section>

        <section className="home-summary" aria-label="Core capabilities">
          {summaryItems.map((item) => (
            <div className="home-summary-item" key={item.title}>
              <p className="home-summary-title">{item.title}</p>
              <p className="home-summary-copy">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="home-links" aria-label="Primary paths">
          {entryLinks.map((item) => (
            <Link className="home-link-row" href={item.href} key={item.title}>
              <div className="home-link-copy">
                <p className="home-link-label">{item.label}</p>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              <span className="home-link-action">{item.action}</span>
            </Link>
          ))}
        </section>

        <footer className="home-footer" aria-label="Site footer">
          <p>Built by OasAI Studio. MIT licensed.</p>
          <nav className="home-footer-nav" aria-label="Footer">
            <Link href={docsUrl}>Docs</Link>
            <a href={npmUrl} target="_blank" rel="noreferrer">npm</a>
            <a href={githubUrl} target="_blank" rel="noreferrer">GitHub</a>
          </nav>
        </footer>
      </div>
    </main>
  );
}
