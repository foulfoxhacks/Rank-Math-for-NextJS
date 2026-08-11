"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, Save } from "lucide-react";
import {
  GENERAL_PANELS, SITEMAP_PANELS, TITLES_PANELS, type RankMathView, type RuntimeState,
  type SettingField, type SettingsPanel,
} from "@/lib/rank-math";

type Props = {
  view: "general-settings" | "titles-meta" | "sitemap";
  state: RuntimeState;
  mutate: (command: Record<string, unknown>, message?: string) => Promise<RuntimeState>;
};

const details = {
  "general-settings": ["General Settings", "Configure site-wide behavior for links, breadcrumbs, images, webmaster tools, robots, 404s, redirections and integrations."],
  "titles-meta": ["Titles & Meta", "Control the search appearance, robots metadata, Schema defaults and social previews for every content type."],
  sitemap: ["Sitemap Settings", "Configure XML and HTML sitemap generation for content collections, taxonomies, authors and media."],
} as const;

export function SettingsScreen({ view, state, mutate }: Props) {
  const panels = view === "general-settings" ? GENERAL_PANELS : view === "titles-meta" ? TITLES_PANELS : SITEMAP_PANELS;
  const [activePanel, setActivePanel] = useState(panels[0].id);
  const [values, setValues] = useState(state.settings);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const panel = useMemo(() => panels.find((item) => item.id === activePanel) ?? panels[0], [activePanel, panels]);

  useEffect(() => { setActivePanel(panels[0].id); }, [view]);
  useEffect(() => { setValues(state.settings); setDirty(false); }, [state.updatedAt, state.settings]);

  const update = (id: string, value: RuntimeState["settings"][string]) => {
    setValues((current) => ({ ...current, [id]: value }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    await mutate({ action: "save-settings", values }, "Settings saved successfully.");
    setSaving(false);
    setDirty(false);
  };

  return <>
    <div className="page-heading"><div><h1>{details[view][0]}</h1><p>{details[view][1]}</p></div></div>
    <div className="settings-shell">
      <aside className="settings-tabs">
        {panels.map((item) => <button className={item.id === panel.id ? "active" : ""} key={item.id} onClick={() => setActivePanel(item.id)}>
          <span>{item.label}</span><ChevronRight size={15} />
        </button>)}
      </aside>
      <section className="settings-card">
        <div className="settings-card-head"><h2>{panel.label}</h2><p>{panel.description}</p></div>
        <div className="settings-fields">
          {panel.fields.map((field) => <SettingControl key={field.id} field={field} value={values[field.id] ?? field.defaultValue} update={update} />)}
        </div>
        <div className="save-bar">
          <span>{dirty ? "You have unsaved changes." : <><Check size={15} /> All changes saved</>}</span>
          <button className="button primary" disabled={saving || !dirty} onClick={() => void save()}><Save size={16} /> {saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </section>
    </div>
  </>;
}

function SettingControl({ field, value, update }: { field: SettingField; value: SettingField["defaultValue"]; update: (id: string, value: SettingField["defaultValue"]) => void }) {
  const id = `setting-${field.id}`;
  return <div className="setting-row">
    <div className="setting-copy"><label htmlFor={id}>{field.label}</label><p>{field.description}</p></div>
    <div className="setting-control">
      {field.type === "toggle" && <label className="rm-toggle large"><input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => update(field.id, e.target.checked)} /><span /></label>}
      {(field.type === "text" || field.type === "image") && <input id={id} type="text" value={String(value)} placeholder={field.placeholder} onChange={(e) => update(field.id, e.target.value)} />}
      {field.type === "number" && <input id={id} type="number" value={Number(value)} onChange={(e) => update(field.id, Number(e.target.value))} />}
      {(field.type === "textarea" || field.type === "code") && <textarea id={id} className={field.type === "code" ? "code-input" : ""} value={String(value)} rows={field.type === "code" ? 10 : 4} onChange={(e) => update(field.id, e.target.value)} />}
      {field.type === "select" && <select id={id} value={String(value)} onChange={(e) => update(field.id, e.target.value)}>{field.options?.map((option) => <option key={option}>{option}</option>)}</select>}
      {field.type === "multiselect" && <div className="checkbox-list">{field.options?.map((option) => {
        const selected = Array.isArray(value) && value.includes(option);
        return <label key={option}><input type="checkbox" checked={selected} onChange={() => update(field.id, selected ? (value as string[]).filter((item) => item !== option) : [...(Array.isArray(value) ? value : []), option])} /> {option}</label>;
      })}</div>}
      {field.type === "image" && String(value) && <div className="image-preview"><img src={String(value)} alt="Current selection" /></div>}
    </div>
  </div>;
}
