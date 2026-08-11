"use client";

import { useState } from "react";
import {
  BarChart3, Bot, Braces, CircleHelp, Eye, FileText, Gauge, Image, Link2, Map,
  MessageSquare, MousePointerClick, Package, Podcast, Search, Settings, ShieldCheck,
  Sparkles, Store, Undo2, Users, Video, Wand2,
} from "lucide-react";
import { MODULES, type RankMathView, type RuntimeState } from "@/lib/rank-math";

type Props = {
  state: RuntimeState;
  mutate: (command: Record<string, unknown>, message?: string) => Promise<RuntimeState>;
  navigate: (view: RankMathView) => void;
};

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  sparkles: Sparkles, "content-ai": Bot, "404": Search, acf: Package, "search-console": BarChart3,
  comments: MessageSquare, images: Image, "instant-indexing": MousePointerClick, link: Link2,
  "local-seo": Store, post: FileText, podcast: Podcast, redirection: Undo2, schema: Braces,
  "role-manager": ShieldCheck, analyzer: Gauge, sitemap: Map, video: Video, users: Users,
  woocommerce: Store, cart: Store, stories: Eye, performance: Gauge,
};

export function DashboardScreen({ state, mutate, navigate }: Props) {
  const [tab, setTab] = useState<"modules" | "help">("modules");
  return <>
    <div className="page-heading dashboard-heading">
      <div><h1>Dashboard</h1><p>Welcome to Rank Math. Choose the modules you need and configure your SEO workflow.</p></div>
      <div className="mode-switch" aria-label="Rank Math mode">
        <span>Mode</span>
        <button className={state.mode === "easy" ? "active" : ""} onClick={() => void mutate({ action: "set-mode", mode: "easy" }, "Easy Mode activated.")}>Easy</button>
        <button className={state.mode === "advanced" ? "active" : ""} onClick={() => void mutate({ action: "set-mode", mode: "advanced" }, "Advanced Mode activated.")}>Advanced</button>
      </div>
    </div>

    <div className="page-tabs">
      <button className={tab === "modules" ? "active" : ""} onClick={() => setTab("modules")}>Modules</button>
      <button className={tab === "help" ? "active" : ""} onClick={() => setTab("help")}>Help</button>
      <button onClick={() => navigate("wizard")}>Setup Wizard</button>
      <div className="connection-inline">
        <span className={state.connected ? "connection on" : "connection"} />
        {state.connected ? "Rank Math account connected" : "Account services disconnected"}
      </div>
    </div>

    {tab === "modules" ? <div className="module-grid">
      {MODULES.filter((module) => state.mode === "advanced" || !module.pro && !module.dependency).map((module) => {
        const Icon = iconMap[module.icon] ?? Settings;
        const active = Boolean(state.modules[module.id]);
        return <article className={`module-card ${active ? "is-active" : ""}`} key={module.id}>
          <div className="module-top">
            <div className={`module-icon icon-${module.id}`}><Icon size={29} /></div>
            <div className="module-title"><h2>{module.title}</h2><div className="badges">{module.beta && <span className="badge beta">BETA</span>}{module.pro && <span className="badge pro">PRO</span>}{module.native && <span className="badge native">NEXT</span>}</div></div>
            <label className="rm-toggle" title={`${active ? "Disable" : "Enable"} ${module.title}`}>
              <input type="checkbox" checked={active} disabled={Boolean(module.dependency)} onChange={(event) => void mutate({ action: "toggle-module", id: module.id, active: event.target.checked }, `${module.title} ${event.target.checked ? "enabled" : "disabled"}.`)} />
              <span />
            </label>
          </div>
          <p>{module.desc}</p>
          {module.wordpressSource && <div className="equivalent"><strong>{module.wordpressSource}</strong><span>→ {module.nextEquivalent}</span></div>}
          {module.dependency && <div className="dependency">Requires: {module.dependency}</div>}
          <div className="module-footer">
            <a href="#module-docs" onClick={(event) => event.preventDefault()}><CircleHelp size={14} /> Documentation</a>
            {module.settingsView && active && <button onClick={() => navigate(module.settingsView!)}>Settings</button>}
          </div>
        </article>;
      })}
    </div> : <HelpPanel navigate={navigate} />}
  </>;
}

function HelpPanel({ navigate }: { navigate: (view: RankMathView) => void }) {
  const cards = [
    ["Setup Wizard", "Configure the essential SEO, sitemap and optimization defaults.", Wand2, "wizard"],
    ["SEO Analyzer", "Run the complete technical and on-page test suite.", Gauge, "seo-analysis"],
    ["Content Editor", "See Rank Math's live score, snippet editor and schema controls.", FileText, "editor"],
    ["System Status", "Inspect runtime state, import/export settings and database tools.", Settings, "status"],
  ] as const;
  return <div className="help-grid">{cards.map(([title, text, Icon, view]) => <button key={title} onClick={() => navigate(view)}>
    <Icon /><span><strong>{title}</strong><small>{text}</small></span>
  </button>)}</div>;
}
