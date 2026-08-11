"use client";

import { useMemo, useState } from "react";
import {
  Braces, Check, ChevronDown, Code2, Eye, Focus, Globe2, Link2, ListChecks,
  Save, Search, Settings2, Share2, Sparkles, X,
} from "lucide-react";
import { analyzeContent, type AssessmentStatus, type ContentDraft } from "@/lib/seo/analyze";
import type { ContentRecord, RuntimeState } from "@/lib/rank-math";

type Props = {
  state: RuntimeState;
  mutate: (command: Record<string, unknown>, message?: string) => Promise<RuntimeState>;
};

type PanelTab = "general" | "advanced" | "schema" | "social";

function toDraft(content: ContentRecord): ContentDraft {
  return {
    title: content.title, seoTitle: content.seoTitle, slug: content.path, description: content.description,
    content: content.content, focusKeyword: content.focusKeyword, canonical: content.canonical,
    schemaType: content.schemaType, noindex: content.noindex, nofollow: content.nofollow,
    socialTitle: "", socialDescription: "",
  };
}

export function EditorScreen({ state, mutate }: Props) {
  const [selectedId, setSelectedId] = useState(state.content[0]?.id ?? "");
  const selected = state.content.find((item) => item.id === selectedId) ?? state.content[0];
  const [draft, setDraft] = useState<ContentDraft>(() => toDraft(selected));
  const [customFields, setCustomFields] = useState<Record<string, string>>(() => selected.customFields ?? { audience: "Product and marketing teams", summary: selected.description });
  const [tab, setTab] = useState<PanelTab>("general");
  const [snippetOpen, setSnippetOpen] = useState(false);
  const [saved, setSaved] = useState(true);
  const analysis = useMemo(() => analyzeContent({ ...draft, customFields }), [draft, customFields]);

  const update = <K extends keyof ContentDraft>(key: K, value: ContentDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const selectContent = (id: string) => {
    const content = state.content.find((item) => item.id === id);
    if (!content) return;
    setSelectedId(id); setDraft(toDraft(content)); setCustomFields(content.customFields ?? { summary: content.description }); setSaved(true);
  };

  const save = async () => {
    const content: ContentRecord = { ...selected, title: draft.title, path: draft.slug, seoTitle: draft.seoTitle,
      description: draft.description, focusKeyword: draft.focusKeyword, score: analysis.score,
      schemaType: draft.schemaType, canonical: draft.canonical, content: draft.content,
      noindex: draft.noindex, nofollow: draft.nofollow, customFields };
    await mutate({ action: "save-content", content }, "Content SEO data saved.");
    setSaved(true);
  };

  return <>
    <div className="page-heading editor-heading"><div><h1>Content Editor</h1><p>Native React editorial workspace with Rank Math analysis, metadata, Schema, social, and custom-field adapters.</p></div>
      <div className="editor-actions">
        <select value={selectedId} onChange={(e) => selectContent(e.target.value)}>{state.content.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select>
        <button className="button secondary"><Eye size={16} /> Preview</button>
        <button className="button primary" disabled={saved} onClick={() => void save()}><Save size={16} /> {saved ? "Saved" : "Update"}</button>
      </div>
    </div>

    <div className="editor-shell">
      <section className="content-canvas">
        <div className="block-toolbar"><button>+</button><span>Paragraph</span><button><strong>B</strong></button><button><em>I</em></button><button><Link2 size={15} /></button><button>⋮</button></div>
        <input className="post-title-input" value={draft.title} onChange={(e) => update("title", e.target.value)} aria-label="Post title" />
        <textarea className="post-content-input" value={draft.content} onChange={(e) => update("content", e.target.value)} aria-label="Post content" />
        <section className="custom-field-editor"><div><h2>Typed Custom Fields</h2><p>Next.js replacement for ACF/postmeta. These values participate in SEO analysis and can map into Schema.</p></div>{Object.entries(customFields).map(([key, value]) => <label key={key}><span>{key}</span><input value={value} onChange={(event) => { setCustomFields((current) => ({ ...current, [key]: event.target.value })); setSaved(false); }} /></label>)}</section>
        <div className="block-footer"><span>{analysis.metrics.words} words</span><span>{analysis.metrics.readingMinutes} min read</span><span>{analysis.metrics.internalLinks + analysis.metrics.externalLinks} links</span></div>
      </section>

      <aside className="rankmath-metabox">
        <div className="metabox-head"><img src="/rank-math/menu-icon.svg" alt="" /><strong>Rank Math SEO</strong><ScoreRing score={analysis.score} small /><ChevronDown size={17} /></div>
        <div className="metabox-tabs">
          <button className={tab === "general" ? "active" : ""} onClick={() => setTab("general")}><Focus size={16} /> General</button>
          <button className={tab === "advanced" ? "active" : ""} onClick={() => setTab("advanced")}><Settings2 size={16} /> Advanced</button>
          <button className={tab === "schema" ? "active" : ""} onClick={() => setTab("schema")}><Braces size={16} /> Schema</button>
          <button className={tab === "social" ? "active" : ""} onClick={() => setTab("social")}><Share2 size={16} /> Social</button>
        </div>

        {tab === "general" && <div className="metabox-body">
          <label className="focus-label">Focus Keyword <Sparkles size={14} /></label>
          <div className="keyword-input"><span>{draft.focusKeyword || "Add focus keyword"}</span>{draft.focusKeyword && <button onClick={() => update("focusKeyword", "")}><X size={13} /></button>}</div>
          <input className="keyword-add" value={draft.focusKeyword} onChange={(e) => update("focusKeyword", e.target.value)} placeholder="Type a keyword…" />
          <div className="snippet-preview">
            <div className="snippet-label"><span><Globe2 size={15} /> Search Preview</span><button onClick={() => setSnippetOpen(!snippetOpen)}>Edit Snippet</button></div>
            <div className="google-url">example.com › {draft.slug.replace(/^\//, "").replaceAll("/", " › ")}</div>
            <div className="google-title">{draft.seoTitle || draft.title}</div>
            <div className="google-description">{draft.description || "Add a meta description to control how this page appears in search."}</div>
          </div>
          {snippetOpen && <div className="snippet-editor">
            <label>SEO Title <span>{draft.seoTitle.length} / 60</span></label><input value={draft.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} />
            <label>Permalink <span>{draft.slug.length} / 75</span></label><input value={draft.slug} onChange={(e) => update("slug", e.target.value)} />
            <label>Description <span>{draft.description.length} / 160</span></label><textarea rows={4} value={draft.description} onChange={(e) => update("description", e.target.value)} />
          </div>}
          <AssessmentList title="Basic SEO" items={analysis.assessments.filter((item) => ["keyword-title", "keyword-description", "keyword-url", "keyword-intro", "content-length"].includes(item.id))} />
          <AssessmentList title="Additional" items={analysis.assessments.filter((item) => item.group === "seo" && !["keyword-title", "keyword-description", "keyword-url", "keyword-intro", "content-length"].includes(item.id))} />
          <AssessmentList title="Title Readability" items={analysis.assessments.filter((item) => item.group === "readability").slice(0, 3)} />
          <AssessmentList title="Content Readability" items={analysis.assessments.filter((item) => item.group === "readability").slice(3)} />
        </div>}

        {tab === "advanced" && <div className="metabox-body form-stack">
          <h3>Robots Meta</h3>
          <label className="check-setting"><input type="checkbox" checked={draft.noindex} onChange={(e) => update("noindex", e.target.checked)} /> No Index <small>Prevent this page from appearing in search.</small></label>
          <label className="check-setting"><input type="checkbox" checked={draft.nofollow} onChange={(e) => update("nofollow", e.target.checked)} /> No Follow <small>Prevent crawlers from following links on this page.</small></label>
          <label>Canonical URL</label><input value={draft.canonical} onChange={(e) => update("canonical", e.target.value)} />
          <label>Breadcrumb Title</label><input value={draft.title} onChange={(e) => update("title", e.target.value)} />
          <h3>Advanced Robots Meta</h3><input value="max-snippet:-1, max-image-preview:large" readOnly />
        </div>}

        {tab === "schema" && <div className="metabox-body schema-editor">
          <div className="schema-hero"><Braces /><div><h3>Schema Generator</h3><p>Choose structured data for this content.</p></div></div>
          {["Article", "BlogPosting", "NewsArticle", "Product", "Service", "HowTo", "FAQPage", "Event", "VideoObject", "WebPage"].map((name) => <label className={draft.schemaType === name ? "schema-choice active" : "schema-choice"} key={name}><input type="radio" name="schema" checked={draft.schemaType === name} onChange={() => update("schemaType", name)} /><Braces size={17} /><span><strong>{name}</strong><small>Schema.org/{name}</small></span>{draft.schemaType === name && <Check size={16} />}</label>)}
          <button className="button secondary full"><Code2 size={15} /> Validate with Schema Markup Validator</button>
        </div>}

        {tab === "social" && <div className="metabox-body">
          <div className="social-tabs"><button className="active"><Share2 size={15} /> Facebook</button><button><Globe2 size={15} /> X / Twitter</button></div>
          <div className="social-card-preview"><div className="social-image">1200 × 630</div><div><strong>{draft.socialTitle || draft.seoTitle || draft.title}</strong><p>{draft.socialDescription || draft.description}</p><small>EXAMPLE.COM</small></div></div>
          <div className="form-stack"><label>Social Title</label><input value={draft.socialTitle} onChange={(e) => update("socialTitle", e.target.value)} placeholder={draft.seoTitle} /><label>Social Description</label><textarea rows={4} value={draft.socialDescription} onChange={(e) => update("socialDescription", e.target.value)} placeholder={draft.description} /><label>Social Image URL</label><input defaultValue="/rank-math/social-placeholder.jpg" /></div>
        </div>}
      </aside>
    </div>
  </>;
}

function ScoreRing({ score, small = false }: { score: number; small?: boolean }) {
  const color = score >= 80 ? "#79c979" : score >= 50 ? "#f0b849" : "#e66b67";
  return <div className={`score-ring ${small ? "small" : ""}`} style={{ "--score": `${score * 3.6}deg`, "--score-color": color } as React.CSSProperties}><span>{score}</span></div>;
}

function AssessmentList({ title, items }: { title: string; items: { id: string; title: string; detail: string; status: AssessmentStatus }[] }) {
  const [open, setOpen] = useState(true);
  return <section className="assessment-group"><button className="assessment-head" onClick={() => setOpen(!open)}><span><ListChecks size={16} /> {title}</span><ChevronDown size={15} className={open ? "open" : ""} /></button>{open && <div className="assessment-items">{items.map((item) => <div className={`assessment ${item.status}`} key={item.id}><span className="status-dot">{item.status === "good" ? "✓" : item.status === "improvement" ? "!" : "×"}</span><div><strong>{item.title}</strong><small>{item.detail}</small></div></div>)}</div>}</section>;
}
