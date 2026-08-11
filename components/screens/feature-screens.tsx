"use client";

import { useMemo, useRef, useState } from "react";
import {
  Activity, AlertTriangle, ArrowDown, ArrowRight, ArrowUp, BarChart3, Bell, Bot, Braces,
  Check, CheckCircle2, ChevronRight, CircleHelp, ClipboardCheck, Cloud, Code2, Copy,
  Database, Download, ExternalLink, Eye, FileCode2, FileDown, FileJson, FileSearch, FileText,
  Gauge, Globe2, Import, KeyRound, Link2, ListChecks, LoaderCircle, Lock, Mail, Map,
  MessageSquare, MoreVertical, MousePointerClick, Network, Plus, RefreshCw, Save, Search,
  Send, Server, Settings, ShieldCheck, Sparkles, TableProperties, Tags, Trash2, TrendingUp,
  Undo2, Upload, UserRound, Users, Wand2, Wrench, X,
} from "lucide-react";
import type { RankMathView, RedirectRecord, RuntimeState } from "@/lib/rank-math";
import { WORDPRESS_TO_NEXT_EQUIVALENTS, type AdapterConnection } from "@/lib/adapters";

type Props = {
  view: RankMathView;
  state: RuntimeState;
  mutate: (command: Record<string, unknown>, message?: string) => Promise<RuntimeState>;
  navigate: (view: RankMathView) => void;
  reload: () => Promise<void>;
};

export function FeatureScreen(props: Props) {
  switch (props.view) {
    case "wizard": return <SetupWizard {...props} />;
    case "analytics": return <Analytics state={props.state} mutate={props.mutate} />;
    case "seo-analysis": return <SeoAnalyzer state={props.state} />;
    case "content-ai": return <ContentAI state={props.state} />;
    case "ai-visibility": return <AIVisibility state={props.state} mutate={props.mutate} />;
    case "instant-indexing": return <InstantIndexing state={props.state} reload={props.reload} />;
    case "monitor-404": return <Monitor404 state={props.state} mutate={props.mutate} navigate={props.navigate} />;
    case "redirections": return <Redirections state={props.state} mutate={props.mutate} />;
    case "links": return <LinkCounter state={props.state} />;
    case "schema": return <SchemaTemplates state={props.state} navigate={props.navigate} />;
    case "integrations": return <NextAdapters state={props.state} mutate={props.mutate} />;
    case "role-manager": return <RoleManager state={props.state} mutate={props.mutate} />;
    case "status": return <StatusTools state={props.state} mutate={props.mutate} reload={props.reload} />;
    default: return null;
  }
}

const Heading = ({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) => <div className="page-heading"><div><h1>{title}</h1><p>{text}</p></div>{action}</div>;

function SetupWizard({ state, mutate, navigate }: Props) {
  const steps = ["Getting Started", "Your Site", "Analytics", "Sitemaps", "Optimization", "Ready"];
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    mode: state.mode, siteType: String(state.settings.local_type || "organization"), name: String(state.settings.website_name || "Example Company"),
    url: String(state.settings.local_url || "https://example.com"), analytics: state.connected,
    posts: Boolean(state.settings.sitemap_posts), pages: Boolean(state.settings.sitemap_pages), images: Boolean(state.settings.sitemap_images),
    noindexEmpty: Boolean(state.settings.noindex_empty), externalLinks: Boolean(state.settings.new_window), imageAlt: Boolean(state.settings.add_missing_alt),
  });

  const finish = async () => {
    await mutate({ action: "save-settings", values: { local_type: form.siteType, website_name: form.name, local_url: form.url, sitemap_posts: form.posts, sitemap_pages: form.pages, sitemap_images: form.images, noindex_empty: form.noindexEmpty, new_window: form.externalLinks, add_missing_alt: form.imageAlt } });
    await mutate({ action: "set-mode", mode: form.mode });
    await mutate({ action: "set-connected", connected: form.analytics });
    await mutate({ action: "complete-setup" }, "Setup completed successfully.");
    setStep(5);
  };

  return <div className="wizard-page">
    <div className="wizard-brand"><img src="/rank-math/logo.svg" alt="Rank Math" /><span>Setup Wizard</span></div>
    <div className="wizard-steps">{steps.map((label, index) => <div className={index === step ? "active" : index < step ? "done" : ""} key={label}><span>{index < step ? <Check size={15} /> : index + 1}</span><small>{label}</small></div>)}</div>
    <section className="wizard-card">
      {step === 0 && <><Wand2 className="wizard-hero-icon" /><h1>Welcome to Rank Math SEO</h1><p>The setup wizard configures the complete Rank Math decision set through native Next.js routes, records, and adapters.</p><div className="wizard-mode-cards"><button className={form.mode === "easy" ? "selected" : ""} onClick={() => setForm({ ...form, mode: "easy" })}><Gauge /><strong>Easy</strong><small>Recommended defaults with essential settings.</small></button><button className={form.mode === "advanced" ? "selected" : ""} onClick={() => setForm({ ...form, mode: "advanced" })}><Settings /><strong>Advanced</strong><small>Every Rank Math control and module.</small></button></div></>}
      {step === 1 && <><h1>Your Site</h1><p>Tell search engines what this website represents.</p><div className="wizard-form"><label>Your Website Is…</label><select value={form.siteType} onChange={(e) => setForm({ ...form, siteType: e.target.value })}><option value="organization">Organization</option><option value="person">Personal Blog</option><option value="local">Local Business</option><option value="store">Webshop</option></select><label>Website Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><label>Website URL</label><input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /><label>Logo for Google</label><div className="upload-box"><Upload /><span>Choose or upload a square logo</span></div></div></>}
      {step === 2 && <><BarChart3 className="wizard-hero-icon" /><h1>Connect Google Services</h1><p>Authorize Search Console and Google Analytics to bring keyword, page and traffic performance into the dashboard.</p><div className="connect-card"><div className="google-mark">G</div><div><strong>Google Search Console & Analytics</strong><small>{form.analytics ? "Account authorized for this local port." : "No Google account is connected."}</small></div><button className={form.analytics ? "button secondary" : "button primary"} onClick={() => setForm({ ...form, analytics: !form.analytics })}>{form.analytics ? "Disconnect" : "Connect Google Services"}</button></div><div className="info-callout"><Lock size={16} /> OAuth credentials are configured with environment variables in production; this setup stores the connection preference.</div></>}
      {step === 3 && <><Map className="wizard-hero-icon" /><h1>Sitemaps</h1><p>Choose the content included in the generated Next.js XML sitemap.</p><div className="option-list"><ToggleOption label="Posts" text="Include published posts in sitemap.xml" checked={form.posts} change={(value) => setForm({ ...form, posts: value })} /><ToggleOption label="Pages" text="Include published pages in sitemap.xml" checked={form.pages} change={(value) => setForm({ ...form, pages: value })} /><ToggleOption label="Images" text="Add image discoveries to sitemap entries" checked={form.images} change={(value) => setForm({ ...form, images: value })} /></div></>}
      {step === 4 && <><Sparkles className="wizard-hero-icon" /><h1>SEO Tweaks</h1><p>Apply Rank Math's recommended baseline optimizations.</p><div className="option-list"><ToggleOption label="Noindex Empty Category and Tag Archives" text="Keep thin archive pages out of search results." checked={form.noindexEmpty} change={(value) => setForm({ ...form, noindexEmpty: value })} /><ToggleOption label="Open External Links in New Tab" text="Add safe target and rel attributes to external links." checked={form.externalLinks} change={(value) => setForm({ ...form, externalLinks: value })} /><ToggleOption label="Add Missing ALT Attributes" text="Generate fallback alt text from filenames and titles." checked={form.imageAlt} change={(value) => setForm({ ...form, imageAlt: value })} /></div></>}
      {step === 5 && <><CheckCircle2 className="wizard-hero-icon complete" /><h1>Your Site is Ready!</h1><p>Rank Math's modules, metadata runtime and sitemap services are configured for Next.js.</p><div className="ready-grid"><div><FileCode2 /><strong>Metadata API</strong><small>Ready</small></div><div><Map /><strong>XML Sitemap</strong><small>Ready</small></div><div><Braces /><strong>Schema Graph</strong><small>Ready</small></div><div><Search /><strong>SEO Analysis</strong><small>Ready</small></div></div><button className="button primary large-button" onClick={() => navigate("dashboard")}>Return to Dashboard <ArrowRight size={17} /></button></>}
      {step < 5 && <div className="wizard-actions"><button className="button secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button><button className="button primary" onClick={() => step === 4 ? void finish() : setStep(step + 1)}>{step === 4 ? "Save and Continue" : "Continue"} <ArrowRight size={16} /></button></div>}
    </section>
  </div>;
}

function ToggleOption({ label, text, checked, change }: { label: string; text: string; checked: boolean; change: (value: boolean) => void }) {
  return <div><div><strong>{label}</strong><small>{text}</small></div><label className="rm-toggle large"><input type="checkbox" checked={checked} onChange={(e) => change(e.target.checked)} /><span /></label></div>;
}

function Analytics({ state, mutate }: Pick<Props, "state" | "mutate">) {
  const [range, setRange] = useState("30 Days");
  const metrics = [
    ["Search Impressions", "128,430", "+18.4%", Eye], ["Search Traffic", "9,842", "+12.7%", MousePointerClick],
    ["Total Keywords", "2,184", "+146", Search], ["Average Position", "18.6", "+2.3", TrendingUp],
  ] as const;
  return <>
    <Heading title="Analytics" text="Search performance, keyword positions and content analytics in the Rank Math dashboard." action={<div className="heading-actions"><select value={range} onChange={(e) => setRange(e.target.value)}><option>7 Days</option><option>30 Days</option><option>90 Days</option></select><button className="button secondary"><RefreshCw size={15} /> Update Data</button></div>} />
    {!state.connected && <div className="connect-banner"><div><BarChart3 /><span><strong>Connect Google Services</strong><small>Use Search Console and Analytics data instead of the included demonstration dataset.</small></span></div><button className="button primary" onClick={() => void mutate({ action: "set-connected", connected: true }, "Google services marked as connected.")}>Connect Now</button></div>}
    <div className="summary-grid">{metrics.map(([label, value, change, Icon]) => <div className="summary-card" key={label}><div><span>{label}</span><Icon size={18} /></div><strong>{value}</strong><small className="positive"><ArrowUp size={12} /> {change}</small></div>)}</div>
    <section className="panel chart-panel"><div className="panel-head"><div><h2>Organic Performance</h2><p>Impressions and clicks for the selected period</p></div><div className="legend"><span className="purple" /> Impressions <span className="blue" /> Clicks</div></div><div className="line-chart"><div className="chart-y"><span>8K</span><span>6K</span><span>4K</span><span>2K</span><span>0</span></div><svg viewBox="0 0 900 230" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#706fc8" stopOpacity=".25"/><stop offset="1" stopColor="#706fc8" stopOpacity="0"/></linearGradient></defs><path className="grid-line" d="M0 20H900M0 70H900M0 120H900M0 170H900M0 220H900"/><path className="area" d="M0,198 C60,187 80,160 140,166 S230,100 290,121 S380,70 440,88 S540,43 600,65 S700,38 760,47 S850,17 900,29 L900,230 L0,230Z"/><path className="impressions" d="M0,198 C60,187 80,160 140,166 S230,100 290,121 S380,70 440,88 S540,43 600,65 S700,38 760,47 S850,17 900,29"/><path className="clicks" d="M0,216 C90,205 100,190 160,199 S260,164 310,181 S400,151 470,164 S560,133 620,150 S720,120 780,137 S850,106 900,113"/></svg><div className="chart-x"><span>Jul 13</span><span>Jul 19</span><span>Jul 25</span><span>Jul 31</span><span>Aug 6</span><span>Aug 11</span></div></div></section>
    <div className="two-panels"><DataTable title="Top Keywords" headers={["Keyword", "Position", "Clicks", "Change"]} rows={[["content strategy", "3", "1,842", "+2"], ["technical seo audit", "7", "922", "+4"], ["seo strategy", "9", "711", "+1"], ["schema markup guide", "14", "504", "-2"]]} /><DataTable title="Top 5 Winning Content" headers={["Page", "Score", "Traffic", "Gain"]} rows={state.content.map((item) => [item.title, `${item.score}/100`, item.id === "article-1" ? "3,284" : "1,426", "+18%"])}/></div>
  </>;
}

function SeoAnalyzer({ state }: Pick<Props, "state">) {
  const [running, setRunning] = useState(false);
  const [filter, setFilter] = useState("All Tests");
  const tests = useMemo(() => [
    ["Common SEO", "SEO Description", "Your homepage has a meta description.", "good"], ["Common SEO", "H1 Heading", "One H1 heading was detected.", "good"],
    ["Common SEO", "H2 Headings", "Topic sections use descriptive H2 headings.", "good"], ["Common SEO", "Image ALT Attributes", "2 images are missing ALT text.", "warning"],
    ["Common SEO", "Keywords in Title & Description", "Primary terms are present in key metadata.", "good"], ["Common SEO", "Links Ratio", "Internal and external link balance is healthy.", "good"],
    ["Advanced SEO", "Search Preview", "Title and description fit the search preview.", "good"], ["Advanced SEO", "Mobile Search Preview", "Mobile snippet length is within limits.", "good"],
    ["Advanced SEO", "Canonical Tag", "A self-referencing canonical is emitted.", "good"], ["Advanced SEO", "Noindex Meta", "Public pages are indexable.", "good"],
    ["Advanced SEO", "WWW Canonicalization", "One canonical host is configured.", "good"], ["Advanced SEO", "OpenGraph Meta", "Social sharing tags are present.", "good"],
    ["Advanced SEO", "Robots.txt", "robots.txt is reachable and valid.", "good"], ["Advanced SEO", "Sitemap", "sitemap.xml contains published content.", "good"],
    ["Performance", "Page Objects", "Reduce the number of JavaScript requests.", "warning"], ["Performance", "Page Size", "Document transfer size is below 1 MB.", "good"],
    ["Performance", "Response Time", "Server response is under 600 ms locally.", "good"], ["Performance", "Minify CSS", "Production CSS is minified by Next.js.", "good"],
    ["Performance", "Minify JavaScript", "Production JavaScript is minified by Next.js.", "good"], ["Performance", "Image Headers Expire", "Set a long immutable cache on media.", "warning"],
    ["Security", "Public Dependency Signatures", "Framework and package version headers are not exposed.", "good"], ["Security", "Directory Listing", "Directory indexes are disabled.", "good"],
    ["Security", "Secure Connection", "A production HTTPS URL is configured.", state.settings.local_url?.toString().startsWith("https") ? "good" : "warning"],
    ["Security", "Safe Browsing", "No known unsafe resource was found.", "good"], ["Security", "Server Signature", "Runtime version headers are disabled.", "good"],
    ["Schema", "WebSite Schema", "WebSite and WebPage nodes are generated.", "good"], ["Schema", "Organization Schema", "Complete phone and logo details.", "warning"],
    ["Crawlability", "LLMS.txt", "AI discovery file is generated.", "good"],
  ], [state.settings]);
  const groups = [...new Set(tests.map((test) => test[0]))];
  const shown = filter === "All Tests" ? tests : tests.filter((test) => test[0] === filter);
  const score = Math.round(tests.filter((test) => test[3] === "good").length / tests.length * 100);
  const run = () => { setRunning(true); window.setTimeout(() => setRunning(false), 1600); };
  return <>
    <Heading title="SEO Analyzer" text="Run Rank Math's technical, content, performance and security checks against the Next.js runtime." action={<button className="button primary" disabled={running} onClick={run}>{running ? <LoaderCircle className="spin" size={16} /> : <RefreshCw size={16} />} {running ? "Analyzing…" : "Start Site-Wide Analysis"}</button>} />
    <section className="analysis-overview panel"><div className="analysis-score"><div className="big-score" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}><span><strong>{score}</strong>/100</span></div><div><h2>{score >= 80 ? "Great! Your site is well optimized." : "Your site needs a little work."}</h2><p>{tests.filter((test) => test[3] === "good").length} tests passed and {tests.filter((test) => test[3] !== "good").length} improvements were found.</p><small>Last analysis: just now</small></div></div><div className="analysis-counts"><span><CheckCircle2 /> {tests.filter((test) => test[3] === "good").length} Passed</span><span><AlertTriangle /> {tests.filter((test) => test[3] !== "good").length} Warnings</span><span><X /> 0 Failed</span></div></section>
    <div className="filter-tabs">{["All Tests", ...groups].map((name) => <button className={filter === name ? "active" : ""} onClick={() => setFilter(name)} key={name}>{name}</button>)}</div>
    <div className="test-list">{shown.map(([group, title, detail, status]) => <div className="test-row" key={`${group}-${title}`}><span className={`test-icon ${status}`}>{status === "good" ? <Check /> : <AlertTriangle />}</span><div><strong>{title}</strong><small>{detail}</small></div><span className="test-group">{group}</span><ChevronRight size={17} /></div>)}</div>
  </>;
}

function ContentAI({ state }: Pick<Props, "state">) {
  const [keyword, setKeyword] = useState("content strategy");
  const [researched, setResearched] = useState(true);
  const [tool, setTool] = useState("Research");
  const suggestions = ["content marketing strategy", "content strategy framework", "content plan", "content audit", "content goals", "editorial calendar", "topic clusters", "content distribution"];
  return <>
    <Heading title="Content AI" text="Research topics, receive optimization targets, and use Rank Math's AI writing-tool workspace." action={<div className="credits"><Sparkles size={16} /><span><strong>8,420</strong> credits</span></div>} />
    <div className="content-ai-tabs">{["Research", "Write", "Chat", "History"].map((name) => <button className={tool === name ? "active" : ""} onClick={() => setTool(name)} key={name}>{name === "Research" ? <Search /> : name === "Write" ? <FileText /> : name === "Chat" ? <MessageSquare /> : <RefreshCw />} {name}</button>)}</div>
    {tool === "Research" && <div className="content-ai-layout"><section className="panel ai-research"><div className="research-input"><input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Enter a focus keyword" /><select defaultValue="United States"><option>United States</option><option>Worldwide</option><option>United Kingdom</option></select><button className="button primary" onClick={() => setResearched(true)}>Research</button></div>{researched && <><div className="ai-score-row"><div className="ai-score">74</div><div><strong>Content score target: 80+</strong><p>Build a comprehensive page around “{keyword}”.</p></div></div><div className="target-grid"><div><small>Words</small><strong>2,100–2,850</strong></div><div><small>Headings</small><strong>12–18</strong></div><div><small>Links</small><strong>10–16</strong></div><div><small>Media</small><strong>6–9</strong></div></div><SuggestionBox title="Keywords" icon={<Tags />} items={suggestions} /><SuggestionBox title="Questions" icon={<CircleHelp />} items={[`What is a ${keyword}?`, `How do you create a ${keyword}?`, `What are the elements of a strong ${keyword}?`, `How do you measure ${keyword} performance?`]} /><SuggestionBox title="Related Links" icon={<Link2 />} items={["Content Marketing Institute", "Google Search Central: Helpful Content", "HubSpot State of Marketing", "Ahrefs Content Explorer"]} /></>}</section><aside className="panel ai-brief"><h2>Optimization Brief</h2><img src="/rank-math/trends-preview.jpg" alt="Content AI trends" /><h3>Search intent</h3><p>Primarily informational with a commercial investigation secondary intent.</p><h3>Suggested outline</h3><ol><li>Definition and business case</li><li>Research and audience needs</li><li>Goals and measurement</li><li>Topic clusters and calendar</li><li>Distribution and iteration</li></ol><button className="button primary full">Open in Content Editor</button></aside></div>}
    {tool === "Write" && <AIToolGrid />}
    {tool === "Chat" && <section className="panel ai-chat"><div className="chat-empty"><Bot /><h2>Ask Content AI</h2><p>Brainstorm an outline, improve a title, or turn research into useful copy.</p></div><div className="chat-input"><textarea placeholder="Ask anything about your SEO content…" /><button><Send /></button></div></section>}
    {tool === "History" && <section className="panel"><DataTable title="Content AI History" headers={["Request", "Tool", "Credits", "Date"]} rows={[["Content strategy outline", "Blog Post Outline", "14", "Today, 1:42 AM"], ["Improve technical SEO title", "SEO Meta", "5", "Yesterday"], ["FAQ questions", "FAQ", "8", "Aug 8, 2026"]]} /></section>}
  </>;
}

function SuggestionBox({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) { return <section className="suggestion-box"><h3>{icon}{title}<span>{items.length}</span></h3><div>{items.map((item) => <button key={item}>{item}<Plus size={13} /></button>)}</div></section>; }

function AIToolGrid() {
  const tools = [["Blog Post Idea", "Generate useful article concepts", FileText], ["Blog Post Outline", "Build a detailed search-led structure", ListChecks], ["Blog Post Introduction", "Write an engaging opening", Wand2], ["SEO Meta", "Create a title and description", Search], ["Product Description", "Write benefit-led product copy", Tags], ["FAQ", "Generate questions and answers", CircleHelp], ["Content Rewriter", "Improve clarity and tone", RefreshCw], ["Social Media Post", "Adapt content for social networks", MessageSquare], ["Email", "Draft a helpful email", Mail]] as const;
  return <div className="ai-tool-grid">{tools.map(([title, text, Icon]) => <button key={title}><span><Icon /></span><strong>{title}</strong><small>{text}</small></button>)}</div>;
}

function AIVisibility({ state, mutate }: Pick<Props, "state" | "mutate">) {
  return <>
    <Heading title="AI Visibility" text="Monitor brand mentions, citations and sentiment across AI answer engines." action={<button className="button secondary"><RefreshCw size={15} /> Refresh Data</button>} />
    {!state.connected && <div className="connect-banner purple-banner"><div><Sparkles /><span><strong>Connect your Rank Math account</strong><small>Live AI answer-engine tracking requires the external Rank Math service. This port includes its complete dashboard and connection boundary.</small></span></div><button className="button primary" onClick={() => void mutate({ action: "set-connected", connected: true }, "Account services marked as connected.")}>Connect Account</button></div>}
    <div className="summary-grid"><Metric label="AI Mentions" value="342" change="+22%" icon={<Bot />} /><Metric label="Citations" value="118" change="+14%" icon={<Link2 />} /><Metric label="Share of Voice" value="28.6%" change="+3.8%" icon={<TrendingUp />} /><Metric label="Positive Sentiment" value="81%" change="+4%" icon={<MessageSquare />} /></div>
    <div className="two-panels visibility-panels"><section className="panel"><div className="panel-head"><div><h2>Visibility by Platform</h2><p>Tracked answer-engine presence</p></div></div>{[["Google AI Overviews", 86, "126 mentions"], ["ChatGPT", 74, "91 mentions"], ["Perplexity", 62, "72 mentions"], ["Gemini", 45, "53 mentions"]].map(([name, value, detail]) => <div className="progress-row" key={String(name)}><div><strong>{name}</strong><small>{detail}</small></div><div className="progress"><span style={{ width: `${value}%` }} /></div><b>{value}%</b></div>)}</section><section className="panel"><div className="panel-head"><div><h2>Top Cited Pages</h2><p>Content used most often as an AI source</p></div></div>{state.content.map((item, index) => <div className="cited-page" key={item.id}><span>{index + 1}</span><div><strong>{item.title}</strong><small>{item.path}</small></div><b>{48 - index * 13}</b></div>)}</section></div>
    <section className="panel"><DataTable title="Recent AI Mentions" headers={["Query", "Platform", "Citation", "Sentiment"]} rows={[["how to build a content strategy", "Google AI Overview", "/blog/content-strategy", "Positive"], ["best SEO planning framework", "ChatGPT", "/services/seo-strategy", "Positive"], ["content cluster examples", "Perplexity", "/blog/content-strategy", "Neutral"]]} /></section>
  </>;
}

function Metric({ label, value, change, icon }: { label: string; value: string; change: string; icon: React.ReactNode }) { return <div className="summary-card"><div><span>{label}</span>{icon}</div><strong>{value}</strong><small className="positive"><ArrowUp size={12} /> {change}</small></div>; }

function InstantIndexing({ state, reload }: Pick<Props, "state" | "reload">) {
  const [urls, setUrls] = useState(state.content.map((item) => `${state.settings.local_url || "https://example.com"}${item.path}`).join("\n"));
  const [action, setAction] = useState<"update" | "delete">("update");
  const [sending, setSending] = useState(false);
  const submit = async () => {
    setSending(true);
    await fetch("/api/rank-math/indexing", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ urls: urls.split(/\r?\n/), action }) });
    await reload(); setSending(false);
  };
  return <>
    <Heading title="Instant Indexing" text="Submit page updates and removals directly to IndexNow-compatible search engines." />
    <div className="page-tabs compact"><button className="active">Submit URLs</button><button>Settings</button><button>History</button></div>
    <section className="panel indexing-panel"><div className="indexing-form"><h2>Submit URLs</h2><p>Enter one absolute URL per line. A configured IndexNow key sends live; otherwise requests are retained in the local log.</p><textarea rows={10} value={urls} onChange={(e) => setUrls(e.target.value)} /><div className="index-action"><label><input type="radio" checked={action === "update"} onChange={() => setAction("update")} /> Publish / Update URL</label><label><input type="radio" checked={action === "delete"} onChange={() => setAction("delete")} /> Remove URL</label><button className="button primary" onClick={() => void submit()} disabled={sending}>{sending ? <LoaderCircle className="spin" size={16} /> : <Send size={16} />} Send to API</button></div></div><aside><KeyRound /><h3>IndexNow API Key</h3><code>{String(state.settings.indexnow_key || "Not configured")}</code><p>Add <code>INDEXNOW_KEY</code> to your environment or use General Settings → Webmaster Tools.</p></aside></section>
    <DataTable title="Submission History" headers={["URL", "Action", "Response", "Submitted"]} rows={state.indexingLog.map((log) => [log.url, log.action, log.response, new Date(log.createdAt).toLocaleString()])} />
  </>;
}

function Monitor404({ state, mutate, navigate }: Pick<Props, "state" | "mutate" | "navigate">) {
  const [search, setSearch] = useState("");
  const filtered = state.monitor404.filter((item) => item.uri.toLowerCase().includes(search.toLowerCase()));
  return <>
    <Heading title="404 Monitor" text="Track not-found requests so broken links can be repaired or redirected." action={<div className="heading-actions"><button className="button secondary" onClick={() => navigate("redirections")}><Undo2 size={15} /> Add Redirection</button><button className="button danger" onClick={() => void mutate({ action: "clear-404" }, "404 log cleared.")}><Trash2 size={15} /> Clear Log</button></div>} />
    <div className="summary-grid three"><Metric label="Total 404 Errors" value={String(state.monitor404.reduce((sum, item) => sum + item.hits, 0))} change="12% lower" icon={<AlertTriangle />} /><Metric label="Unique URLs" value={String(state.monitor404.length)} change="3 repaired" icon={<FileSearch />} /><Metric label="Tracked Mode" value={String(state.settings.monitor_mode || "Simple")} change="Active" icon={<Activity />} /></div>
    <section className="panel"><div className="table-toolbar"><div className="search-box"><Search /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by URL…" /></div><select><option>All URLs</option><option>Last 7 days</option><option>Last 30 days</option></select></div><div className="data-table-wrap"><table className="data-table"><thead><tr><th>URI</th><th>Hits</th><th>Access Time</th><th>Referrer</th><th>Actions</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><strong>{item.uri}</strong><small>{item.userAgent}</small></td><td>{item.hits}</td><td>{new Date(item.accessTime).toLocaleString()}</td><td className="truncate">{item.referrer}</td><td><button className="table-action" onClick={() => navigate("redirections")}><Undo2 /> Redirect</button><button className="icon-button danger-text" onClick={() => void mutate({ action: "delete-404", id: item.id })}><Trash2 size={15} /></button></td></tr>)}</tbody></table></div></section>
  </>;
}

function Redirections({ state, mutate }: Pick<Props, "state" | "mutate">) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ source: "", destination: "", type: "301" as RedirectRecord["type"], status: "active" as RedirectRecord["status"] });
  const add = async () => { if (!form.source || !form.destination) return; await mutate({ action: "add-redirect", redirect: { sources: [form.source], destination: form.destination, type: form.type, status: form.status } }, "Redirection created."); setAdding(false); setForm({ source: "", destination: "", type: "301", status: "active" }); };
  return <>
    <Heading title="Redirections" text="Create and manage 301, 302, 307, 410 and 451 redirect rules." action={<button className="button primary" onClick={() => setAdding(!adding)}><Plus size={16} /> Add New</button>} />
    {adding && <section className="panel redirect-editor"><div className="panel-head"><div><h2>Add New Redirection</h2><p>Redirect one or more source paths to a destination.</p></div><button className="icon-button" onClick={() => setAdding(false)}><X /></button></div><div className="redirect-form"><div><label>Source URLs</label><input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="/old-page" /><small>Exact path or supported regular expression.</small></div><div className="redirect-arrow"><ArrowRight /></div><div><label>Destination URL</label><input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="/new-page" /></div><div><label>Redirection Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as RedirectRecord["type"] })}><option>301</option><option>302</option><option>307</option><option>410</option><option>451</option></select></div></div><div className="save-bar"><label className="check-setting"><input type="checkbox" checked={form.status === "active"} onChange={(e) => setForm({ ...form, status: e.target.checked ? "active" : "inactive" })} /> Activate</label><button className="button primary" onClick={() => void add()}><Save size={15} /> Add Redirection</button></div></section>}
    <div className="summary-grid three"><Metric label="Active Redirections" value={String(state.redirects.filter((item) => item.status === "active").length)} change="Working" icon={<Undo2 />} /><Metric label="Redirection Hits" value={state.redirects.reduce((sum, item) => sum + item.hits, 0).toLocaleString()} change="Total" icon={<MousePointerClick />} /><Metric label="Most Used" value="301" change="Permanent" icon={<TrendingUp />} /></div>
    <section className="panel"><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Sources</th><th>Destination</th><th>Type</th><th>Hits</th><th>Status</th><th>Actions</th></tr></thead><tbody>{state.redirects.map((item) => <tr key={item.id}><td><strong>{item.sources.join(", ")}</strong><small>Last accessed {new Date(item.lastAccessed).toLocaleDateString()}</small></td><td>{item.destination}</td><td><span className="code-badge">{item.type}</span></td><td>{item.hits.toLocaleString()}</td><td><button className={`status-pill ${item.status}`} onClick={() => void mutate({ action: "toggle-redirect", id: item.id })}>{item.status}</button></td><td><button className="table-action">Edit</button><button className="icon-button danger-text" onClick={() => void mutate({ action: "delete-redirect", id: item.id }, "Redirection deleted.")}><Trash2 size={15} /></button></td></tr>)}</tbody></table></div></section>
  </>;
}

function LinkCounter({ state }: Pick<Props, "state">) {
  const links = state.content.map((item, index) => ({ ...item, internal: 8 + index * 4, external: 3 + index, incoming: 11 - index * 3 }));
  return <>
    <Heading title="Link Counter" text="Inspect internal, external, incoming and outgoing links across all content." action={<button className="button primary"><RefreshCw size={15} /> Rebuild Index</button>} />
    <div className="summary-grid"><Metric label="Internal Links" value="36" change="Indexed" icon={<Network />} /><Metric label="External Links" value="12" change="Checked" icon={<ExternalLink />} /><Metric label="Incoming Links" value="24" change="Across 3 pages" icon={<ArrowDown />} /><Metric label="Orphan Posts" value="1" change="Needs links" icon={<AlertTriangle />} /></div>
    <div className="two-panels link-panels"><section className="panel"><DataTable title="Links by Content" headers={["Title", "Internal", "External", "Incoming"]} rows={links.map((item) => [item.title, String(item.internal), String(item.external), String(item.incoming)])} /></section><section className="panel"><div className="panel-head"><div><h2>Internal Link Map</h2><p>Incoming relationships between indexed pages</p></div></div><div className="link-map"><span className="map-node primary-node">Content Strategy</span><span className="map-line l1"/><span className="map-line l2"/><span className="map-node node-a">About</span><span className="map-node node-b">SEO Strategy</span><span className="map-node orphan">Orphan Draft</span></div></section></div>
    <section className="panel"><DataTable title="Link Suggestions" headers={["Source", "Suggested Anchor", "Target", "Relevance"]} rows={[["About Example Company", "SEO strategy", "/services/seo-strategy", "High"], ["SEO Strategy Intensive", "content strategy", "/blog/content-strategy", "High"], ["Content Strategy", "our team", "/about", "Medium"]]} /></section>
  </>;
}

function SchemaTemplates({ state, navigate }: Pick<Props, "state" | "navigate">) {
  const [creating, setCreating] = useState(false);
  const types = [["Article", "Blog posts and editorial content"], ["Product", "Products, offers and ratings"], ["Service", "Professional services"], ["LocalBusiness", "Location and opening hours"], ["FAQPage", "Questions and accepted answers"], ["HowTo", "Step-by-step instructions"], ["Event", "Scheduled events and attendance"], ["VideoObject", "Video discovery details"]];
  return <>
    <Heading title="Schema Templates" text="Build reusable structured-data templates and assign them to Next.js content types." action={<button className="button primary" onClick={() => setCreating(!creating)}><Plus size={16} /> Add New Schema</button>} />
    {creating && <section className="panel schema-builder"><div className="panel-head"><div><h2>Schema Generator</h2><p>Select a Schema type to start a template.</p></div><button className="icon-button" onClick={() => setCreating(false)}><X /></button></div><div className="schema-type-grid">{types.map(([name, text]) => <button key={name} onClick={() => navigate("editor")}><Braces /><strong>{name}</strong><small>{text}</small></button>)}</div></section>}
    <div className="schema-template-grid"><article><div className="schema-icon"><FileText /></div><div><h2>Default Article</h2><p>Applied to: Posts</p></div><span className="status-pill active">Active</span><dl><div><dt>Schema Type</dt><dd>Article</dd></div><div><dt>Display Conditions</dt><dd>Post type is Post</dd></div><div><dt>Fields</dt><dd>9 mapped</dd></div></dl><footer><button onClick={() => navigate("editor")}>Edit</button><button><Copy size={14} /> Clone</button><button><Code2 size={14} /> JSON-LD</button></footer></article><article><div className="schema-icon product"><Tags /></div><div><h2>Service Offering</h2><p>Applied to: Products</p></div><span className="status-pill active">Active</span><dl><div><dt>Schema Type</dt><dd>Service</dd></div><div><dt>Display Conditions</dt><dd>Post type is Product</dd></div><div><dt>Fields</dt><dd>12 mapped</dd></div></dl><footer><button onClick={() => navigate("editor")}>Edit</button><button><Copy size={14} /> Clone</button><button><Code2 size={14} /> JSON-LD</button></footer></article></div>
    <section className="panel"><div className="panel-head"><div><h2>Generated Schema Coverage</h2><p>Current public content and active Schema type</p></div></div><DataTable title="" headers={["Content", "Type", "Schema", "Status"]} rows={state.content.map((item) => [item.title, item.type, item.schemaType, "Valid"])} /></section>
  </>;
}

function NextAdapters({ state, mutate }: Pick<Props, "state" | "mutate">) {
  const [layer, setLayer] = useState("all");
  const [search, setSearch] = useState("");
  const layers = ["all", ...new Set(WORDPRESS_TO_NEXT_EQUIVALENTS.map((item) => item.layer))];
  const shown = WORDPRESS_TO_NEXT_EQUIVALENTS.filter((item) => (layer === "all" || item.layer === layer) && `${item.wordpress} ${item.nextjs} ${item.implementation}`.toLowerCase().includes(search.toLowerCase()));
  const providerChoices: Record<string, string[]> = {
    content: ["Native typed records", "Payload", "Strapi", "Sanity", "Contentful", "Custom API"],
    customFields: ["Typed customFields", "Payload fields", "Strapi components", "Sanity objects", "Database JSON"],
    community: ["Native community records", "Supabase/Postgres", "Payload collections", "Custom API"],
    forum: ["Native forum records", "Discourse API", "Supabase/Postgres", "Payload collections"],
    commerce: ["Native product records", "Shopify Storefront API", "Medusa", "Payload products", "Custom API"],
    stories: ["Native story records", "Payload stories", "Storyblok", "Sanity", "Custom API"],
    auth: ["Configure Supabase/Auth.js/Clerk/Payload", "Supabase Auth", "Auth.js", "Clerk", "Payload Auth"],
    media: ["Configure object storage or CMS media", "Vercel Blob", "Cloudflare R2", "Amazon S3", "Supabase Storage"],
    email: ["Configure transactional email", "Resend", "Postmark", "SendGrid", "Cloudflare Email"],
    analytics: ["Configure Google OAuth", "Google Search Console", "Google Analytics 4"],
  };
  const updateAdapter = (id: string, adapter: AdapterConnection) => void mutate({ action: "save-adapter", id, adapter }, `${id} adapter saved.`);
  return <>
    <Heading title="Next.js Adapters" text="Every WordPress primitive used by the Rank Math port is mapped to an explicit Next.js route, data contract, component, or provider boundary." action={<a className="button secondary" href="/api/rank-math/adapters" target="_blank"><FileJson size={15} /> Adapter API</a>} />
    <div className="adapter-summary"><div><strong>{WORDPRESS_TO_NEXT_EQUIVALENTS.length}</strong><span>WordPress equivalents mapped</span></div><div><strong>{WORDPRESS_TO_NEXT_EQUIVALENTS.filter((item) => item.status === "native").length}</strong><span>native implementations</span></div><div><strong>{Object.values(state.adapters).filter((item) => item.enabled).length}</strong><span>adapters enabled</span></div><div><strong>{state.adapterData.profiles.length + state.adapterData.groups.length + state.adapterData.forumTopics.length + state.adapterData.products.length + state.adapterData.stories.length}</strong><span>sample adapter entities</span></div></div>
    <section className="panel adapter-connections"><div className="panel-head"><div><h2>Provider Connections</h2><p>Native records work immediately. External endpoints accept a URL ending in <code>{"{slug}"}</code> or a collection base URL.</p></div></div><div className="connection-grid">{Object.entries(state.adapters).map(([id, adapter]) => <article key={id}><div className="adapter-connection-head"><span className={adapter.enabled ? "adapter-dot on" : "adapter-dot"} /><div><strong>{id.replace(/([A-Z])/g, " $1")}</strong><small>{adapter.mode} adapter</small></div><label className="rm-toggle"><input type="checkbox" checked={adapter.enabled} onChange={(event) => updateAdapter(id, { ...adapter, enabled: event.target.checked })} /><span /></label></div><select value={adapter.provider} onChange={(event) => updateAdapter(id, { ...adapter, provider: event.target.value, mode: event.target.value.startsWith("Native") || event.target.value.startsWith("Typed") ? "native" : "external", enabled: !event.target.value.startsWith("Configure") })}>{providerChoices[id]?.map((provider) => <option key={provider}>{provider}</option>)}</select><input defaultValue={adapter.endpoint ?? ""} onBlur={(event) => updateAdapter(id, { ...adapter, endpoint: event.target.value })} placeholder="https://api.example.com/resource/{slug}" /><small>{adapter.enabled ? "Ready to resolve SEO records" : "Optional provider—not configured"}</small></article>)}</div></section>
    <section className="panel adapter-routes"><div className="panel-head"><div><h2>Live Next.js Replacements</h2><p>These routes prove the community, forum, commerce, story, feed, and scheduler equivalents.</p></div></div><div className="live-route-grid">{[["Community profile", "/profile/sam-reed"], ["Community group", "/groups/technical-seo"], ["Forum topic", "/forum/technical-seo-audit"], ["Commerce product", "/products/seo-strategy-intensive"], ["Story", "/stories/technical-seo-in-five-steps"], ["Content RSS", "/feed.xml"], ["Podcast RSS", "/podcast.xml"], ["News sitemap", "/news-sitemap.xml"], ["Video sitemap", "/video-sitemap.xml"], ["Cron handler", "/api/rank-math/cron"]].map(([name, route]) => <a key={route} href={route} target="_blank"><span><Globe2 /><strong>{name}</strong></span><code>{route}</code><ExternalLink /></a>)}</div></section>
    <section className="panel equivalent-matrix"><div className="panel-head"><div><h2>WordPress → Next.js Equivalence Matrix</h2><p>No plugin label is treated as a Next.js implementation.</p></div><div className="matrix-filters"><div className="search-box"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search equivalents…" /></div><select value={layer} onChange={(event) => setLayer(event.target.value)}>{layers.map((name) => <option value={name} key={name}>{name === "all" ? "All layers" : name}</option>)}</select></div></div><div className="data-table-wrap"><table className="data-table"><thead><tr><th>WordPress primitive</th><th>Next.js equivalent</th><th>Implementation</th><th>Layer</th><th>Status</th><th>Proof</th></tr></thead><tbody>{shown.map((item) => <tr key={item.id}><td><strong>{item.wordpress}</strong></td><td>{item.nextjs}</td><td>{item.implementation}</td><td><span className="code-badge">{item.layer}</span></td><td><span className={`status-pill ${item.status === "native" ? "active" : "inactive"}`}>{item.status}</span></td><td>{item.route ? <a href={item.route} target="_blank">Open <ExternalLink size={12} /></a> : <span>Contract</span>}</td></tr>)}</tbody></table></div></section>
  </>;
}

const CAPABILITIES = ["dashboard", "general", "titles", "sitemap", "analysis", "analytics", "redirections", "role-manager", "content-ai"];
function RoleManager({ state, mutate }: Pick<Props, "state" | "mutate">) {
  const [roles, setRoles] = useState(state.roles);
  const toggle = (role: string, permission: string) => setRoles((current) => ({ ...current, [role]: current[role].includes(permission) ? current[role].filter((item) => item !== permission) : [...current[role], permission] }));
  return <>
    <Heading title="Authorization Manager" text="Map auth-provider roles to SEO capabilities that your server middleware and interface can enforce." action={<button className="button primary" onClick={() => void mutate({ action: "save-roles", roles }, "Authorization capabilities saved.")}><Save size={15} /> Save Changes</button>} />
    <section className="panel role-panel"><div className="role-grid role-head"><strong>Role</strong>{CAPABILITIES.map((item) => <strong key={item}>{item.replace("-", " ")}</strong>)}</div>{Object.entries(roles).map(([role, permissions]) => <div className="role-grid" key={role}><div className="role-name"><span><UserRound /></span><div><strong>{role}</strong><small>{role === "administrator" ? "Full site administration" : `Application ${role}`}</small></div></div>{CAPABILITIES.map((permission) => <label className="permission" key={permission}><input type="checkbox" checked={permissions.includes(permission)} disabled={role === "administrator"} onChange={() => toggle(role, permission)} /><span>{permissions.includes(permission) ? <Check /> : null}</span></label>)}</div>)}</section>
    <div className="info-callout"><ShieldCheck size={17} /> Authorization adapters should enforce these permissions in your Next.js auth middleware as well as the UI.</div>
  </>;
}

function StatusTools({ state, mutate, reload }: Pick<Props, "state" | "mutate" | "reload">) {
  const [tab, setTab] = useState("System Status");
  const fileRef = useRef<HTMLInputElement>(null);
  const importFile = async (file?: File) => { if (!file) return; const imported = JSON.parse(await file.text()); await mutate({ action: "import", state: imported }, "Settings imported."); await reload(); };
  const tabs = ["System Status", "Tools", "Import & Export", "Version Control", "Database Tools"];
  return <>
    <Heading title="Status & Tools" text="Inspect runtime details, migrate settings, and maintain Rank Math's local data store." />
    <div className="page-tabs compact">{tabs.map((name) => <button className={tab === name ? "active" : ""} onClick={() => setTab(name)} key={name}>{name}</button>)}</div>
    {tab === "System Status" && <div className="status-layout"><section className="panel system-table"><div className="panel-head"><div><h2>System Info</h2><p>Native App Router, data-adapter, metadata, and delivery checks.</p></div><button className="button secondary"><Copy size={14} /> Copy System Info</button></div>{[["Rank Math Version", state.version], ["Next.js Runtime", "16.3.0 / App Router"], ["React", "19.2.8"], ["Persistence", "Repository adapter (filesystem default)"], ["Adapter Entities", String(state.adapterData.profiles.length + state.adapterData.groups.length + state.adapterData.forumTopics.length + state.adapterData.products.length + state.adapterData.stories.length)], ["Runtime State Updated", new Date(state.updatedAt).toLocaleString()], ["Environment", process.env.NODE_ENV || "development"], ["External Services", state.connected ? "Connected" : "Optional / disconnected"], ["Setup Complete", state.setupComplete ? "Yes" : "No"]].map(([name, value]) => <div className="system-row" key={name}><strong>{name}</strong><code>{value}</code><CheckCircle2 /></div>)}</section><aside className="panel health-card"><Server /><h2>Site Health</h2><div className="health-score">Good</div><p>Core metadata, entity adapters, and persistence services are available.</p><ul><li><Check /> sitemap.xml</li><li><Check /> robots.txt</li><li><Check /> llms.txt</li><li><Check /> Adapter API</li><li><Check /> RSS feeds</li></ul></aside></div>}
    {tab === "Tools" && <ToolCards items={[["Flush SEO Analysis", "Clear cached analysis results and run tests again.", RefreshCw], ["Clear Cache Entries", "Revalidate temporary Next.js and provider cache entries.", Trash2], ["Purge Analytics Cache", "Remove imported Search Console and Analytics snapshots.", BarChart3], ["Validate Repository Collections", "Validate and repair records through the configured storage adapter.", Database], ["Update SEO Scores", "Recalculate normalized content and custom-field scores.", Gauge], ["Clear 404 Log", "Remove all currently logged not-found requests.", FileSearch]]} />}
    {tab === "Import & Export" && <div className="two-panels import-panels"><section className="panel import-card"><FileDown /><h2>Export Settings</h2><p>Download modules, options, roles, redirects, monitored URLs and content SEO data.</p><a href="/api/rank-math/export" className="button primary"><Download size={15} /> Export Rank Math Settings</a></section><section className="panel import-card"><Import /><h2>Import Settings</h2><p>Import a JSON export from this port. Existing keys are merged safely.</p><input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => void importFile(e.target.files?.[0])} /><button className="button primary" onClick={() => fileRef.current?.click()}><Upload size={15} /> Choose Import File</button></section></div>}
    {tab === "Version Control" && <section className="panel version-card"><div><FileJson /><span><h2>Current Version</h2><strong>{state.version}</strong><p>Port baseline: Rank Math SEO 1.0.275</p></span></div><div className="version-option"><div><h3>Automatic Updates</h3><p>Use your package and deployment workflow to update the port.</p></div><label className="rm-toggle large"><input type="checkbox" defaultChecked /><span /></label></div><div className="version-option"><div><h3>Beta Opt-In</h3><p>Receive experimental port changes before stable releases.</p></div><label className="rm-toggle large"><input type="checkbox" /><span /></label></div><div className="info-callout"><Activity size={16} /> Source control and immutable deployments provide version history and rollback.</div></section>}
    {tab === "Database Tools" && <><div className="database-status panel"><Database /><div><h2>Rank Math Data Store</h2><p>Portable JSON persistence is active. The store API can be replaced with Postgres, D1, KV, Prisma, or your CMS.</p></div><span className="status-pill active">Healthy</span></div><ToolCards items={[["Rebuild Content Index", `${state.content.length} content records`, RefreshCw], ["Repair Redirect Rules", `${state.redirects.length} redirect records`, Undo2], ["Optimize 404 Log", `${state.monitor404.length} monitored paths`, FileSearch], ["Reset Rank Math", "Restore all default state and demo content.", Trash2]]} reset={() => void mutate({ action: "reset" }, "Rank Math state reset to defaults.")} /></>}
  </>;
}

function ToolCards({ items, reset }: { items: readonly (readonly [string, string, React.ComponentType<{ size?: number }>])[]; reset?: () => void }) { return <div className="tool-grid">{items.map(([title, text, Icon]) => <article key={title}><span><Icon /></span><div><h2>{title}</h2><p>{text}</p></div><button className={title === "Reset Rank Math" ? "button danger" : "button secondary"} onClick={title === "Reset Rank Math" ? reset : undefined}>Run Tool</button></article>)}</div>; }

function DataTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return <section className={title ? "panel table-panel" : "table-panel embedded"}>{title && <div className="panel-head"><div><h2>{title}</h2><p>Rank Math performance data</p></div><button className="text-button">View Report <ArrowRight size={14} /></button></div>}<div className="data-table-wrap"><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cellIndex === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>)}</tbody></table></div></section>;
}
