"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, BarChart3, Bot, Braces, ChevronDown, CircleHelp, FilePenLine, Gauge,
  Globe2, LayoutDashboard, Link2, ListTree, LoaderCircle, Map, Menu, MousePointerClick,
  Network, RefreshCw, Search, Settings, ShieldCheck, Sparkles, Tags, Undo2, Wand2, Wrench, X,
} from "lucide-react";
import type { RankMathView, RuntimeState } from "@/lib/rank-math";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { SettingsScreen } from "@/components/screens/settings-screen";
import { EditorScreen } from "@/components/screens/editor-screen";
import { FeatureScreen } from "@/components/screens/feature-screens";

const NAVIGATION: { section?: string; items: { id: RankMathView; label: string; icon: React.ComponentType<{ size?: number }> }[] }[] = [
  { items: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "seo-analysis", label: "SEO Analyzer", icon: Gauge },
    { id: "content-ai", label: "Content AI", icon: Sparkles },
    { id: "ai-visibility", label: "AI Visibility", icon: Bot },
  ] },
  { section: "SEO Settings", items: [
    { id: "general-settings", label: "General Settings", icon: Settings },
    { id: "titles-meta", label: "Titles & Meta", icon: Tags },
    { id: "sitemap", label: "Sitemap Settings", icon: Map },
    { id: "instant-indexing", label: "Instant Indexing", icon: ZapIcon },
  ] },
  { section: "Content & Links", items: [
    { id: "editor", label: "Content Editor", icon: FilePenLine },
    { id: "monitor-404", label: "404 Monitor", icon: Search },
    { id: "redirections", label: "Redirections", icon: Undo2 },
    { id: "links", label: "Link Counter", icon: Link2 },
    { id: "schema", label: "Schema Templates", icon: Braces },
  ] },
  { section: "System", items: [
    { id: "integrations", label: "Next.js Adapters", icon: Network },
    { id: "role-manager", label: "Authorization Manager", icon: ShieldCheck },
    { id: "status", label: "Status & Tools", icon: Wrench },
    { id: "wizard", label: "Setup Wizard", icon: Wand2 },
  ] },
];

function ZapIcon({ size = 18 }: { size?: number }) {
  return <MousePointerClick size={size} />;
}

const VIEW_TITLES: Record<RankMathView, string> = {
  dashboard: "Dashboard", wizard: "Setup Wizard", analytics: "Analytics", "seo-analysis": "SEO Analyzer",
  "content-ai": "Content AI", "ai-visibility": "AI Visibility", "general-settings": "General Settings",
  "titles-meta": "Titles & Meta", sitemap: "Sitemap Settings", "instant-indexing": "Instant Indexing",
  "monitor-404": "404 Monitor", redirections: "Redirections", links: "Link Counter", schema: "Schema Templates",
  "role-manager": "Authorization Manager", status: "Status & Tools", editor: "Content Editor",
  integrations: "Next.js Adapters",
};

export function RankMathApp() {
  const [view, setView] = useState<RankMathView>("dashboard");
  const [state, setState] = useState<RuntimeState | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const loadState = async () => {
    const response = await fetch("/api/rank-math/state", { cache: "no-store" });
    setState(await response.json());
  };

  useEffect(() => { void loadState(); }, []);

  const mutate = async (command: Record<string, unknown>, message?: string) => {
    const response = await fetch("/api/rank-math/state", {
      method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(command),
    });
    if (!response.ok) throw new Error((await response.json()).error || "The change could not be saved.");
    const nextState = await response.json() as RuntimeState;
    setState(nextState);
    if (message) {
      setNotice(message);
      window.setTimeout(() => setNotice(""), 3200);
    }
    return nextState;
  };

  const activeModuleCount = useMemo(() => state ? Object.values(state.modules).filter(Boolean).length : 0, [state]);

  const navigate = (next: RankMathView) => {
    setView(next);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!state) return <div className="rm-loader"><LoaderCircle className="spin" /><span>Loading Rank Math SEO…</span></div>;

  return (
    <div className="rm-app">
      <aside className={`wp-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X /></button>
        <div className="wp-brand"><Globe2 size={22} /><strong>Next.js Admin</strong></div>
        <nav aria-label="Rank Math navigation">
          {NAVIGATION.map((group, index) => <div className="nav-group" key={index}>
            {group.section && <div className="nav-section">{group.section}</div>}
            {group.items.map((item) => {
              const Icon = item.icon;
              return <button className={view === item.id ? "active" : ""} key={item.id} onClick={() => navigate(item.id)}>
                <Icon size={18} /><span>{item.label}</span>
              </button>;
            })}
          </div>)}
        </nav>
        <div className="sidebar-foot"><Activity size={15} /> {activeModuleCount} modules active</div>
      </aside>

      <div className="rm-workspace">
        <header className="wp-adminbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu /></button>
          <span>Rank Math SEO for Next.js</span>
          <div className="adminbar-right"><CircleHelp size={16} /> Help <span className="avatar">SB</span></div>
        </header>

        <div className="rankmath-header">
          <button className="rm-logo" onClick={() => navigate("dashboard")}>
            <img src="/rank-math/logo.svg" alt="Rank Math" />
          </button>
          <div className="header-title"><span>{VIEW_TITLES[view]}</span><small>Rank Math SEO</small></div>
          <div className="header-actions">
            <a href="/api/rank-math/export" className="button secondary">Export</a>
            <button className="icon-button" onClick={() => void loadState()} title="Refresh"><RefreshCw size={17} /></button>
            <button className="account-button"><span className={state.connected ? "connection on" : "connection"} /> {state.connected ? "Connected" : "Connect"} <ChevronDown size={14} /></button>
          </div>
        </div>

        <main className="rm-main">
          {notice && <div className="rm-notice success">{notice}</div>}
          {view === "dashboard" && <DashboardScreen state={state} mutate={mutate} navigate={navigate} />}
          {(view === "general-settings" || view === "titles-meta" || view === "sitemap") &&
            <SettingsScreen view={view} state={state} mutate={mutate} />}
          {view === "editor" && <EditorScreen state={state} mutate={mutate} />}
          {!(["dashboard", "general-settings", "titles-meta", "sitemap", "editor"] as RankMathView[]).includes(view) &&
            <FeatureScreen view={view} state={state} mutate={mutate} navigate={navigate} reload={loadState} />}
        </main>
        <footer className="rm-footer">Rank Math SEO 1.0.275 Next.js port <span>•</span> GPL-3.0 <span>•</span> Powered by a native Next.js runtime</footer>
      </div>
      {sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
    </div>
  );
}
