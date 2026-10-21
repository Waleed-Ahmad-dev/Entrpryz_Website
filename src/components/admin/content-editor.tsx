"use client";

import React, { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { saveContent, uploadImage as uploadImageAction } from "@/app/admin/content/actions";
import {
  OPTIONAL_KEYS,
  SECTIONS,
  SECTION_BY_KEY,
  fieldKind,
  fieldLabel,
  itemTitle,
  pathKey,
  templateKeys,
  type FieldKind,
  type Path,
} from "./content-meta";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type Doc = { [key: string]: Json };

export type ImageUploader = (file: File) => Promise<{ path: string } | { error: string }>;

interface ContentEditorProps {
  initialContent: Doc;
  initialSha: string | null;
  canSave: boolean;
}

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const uploadViaAction: ImageUploader = async (file) => {
  // Fast client-side checks; the server re-checks everything.
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return { error: "Only JPG, PNG or WebP images are allowed." };
  }
  if (file.size > MAX_UPLOAD_BYTES) return { error: "Image must be 4 MB or smaller." };
  const form = new FormData();
  form.append("file", file);
  try {
    const result = await uploadImageAction(form);
    return result.ok ? { path: result.path } : { error: result.error };
  } catch {
    return { error: "Upload failed. Please try again." };
  }
};

// ---------- immutable path helpers ----------

function getAt(doc: Json, path: Path): Json | undefined {
  let cur: Json | undefined = doc;
  for (const key of path) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, Json>)[key as string];
  }
  return cur;
}

function setAt(doc: Doc, path: Path, value: Json | undefined): Doc {
  const root = structuredClone(doc);
  let cur: Record<string | number, Json> = root;
  for (let i = 0; i < path.length - 1; i++) {
    cur = cur[path[i]] as Record<string | number, Json>;
  }
  const last = path[path.length - 1];
  if (value === undefined && !Array.isArray(cur)) delete cur[last];
  else cur[last] = value as Json;
  return root;
}

function blankLike(value: Json): Json {
  if (typeof value === "string") return "";
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, blankLike(v)]));
  }
  return value;
}

// ---------- flattening for search / filters ----------

interface Leaf {
  path: Path;
  key: string;
  section: string;
  kind: FieldKind;
  label: string;
  crumbs: string[];
  value: string;
}

function collectLeaves(doc: Doc): Leaf[] {
  const out: Leaf[] = [];
  const walk = (value: Json | undefined, path: Path, crumbs: string[]) => {
    if (Array.isArray(value)) {
      value.forEach((item, i) => walk(item, [...path, i], [...crumbs, itemTitle(item, i)]));
      if (value.length === 0) return;
      return;
    }
    if (value && typeof value === "object") {
      const keys = new Set(Object.keys(value));
      const parent = path.slice(0, -1);
      if (typeof path[path.length - 1] === "number") templateKeys(parent)?.forEach((k) => keys.add(k));
      for (const k of keys) {
        walk((value as Record<string, Json>)[k] ?? "", [...path, k], [...crumbs, fieldLabel(k)]);
      }
      return;
    }
    if (typeof value === "string") {
      out.push({
        path,
        key: pathKey(path),
        section: String(path[0]),
        kind: fieldKind(path, value),
        label: crumbs[crumbs.length - 1] ?? "",
        crumbs,
        value,
      });
    }
  };
  for (const s of SECTIONS) walk(doc[s.key], [s.key], [s.label]);
  return out;
}

// ---------- component ----------

const KIND_FILTERS: { value: FieldKind | "all"; label: string }[] = [
  { value: "all", label: "All fields" },
  { value: "text", label: "Short text" },
  { value: "longtext", label: "Paragraphs" },
  { value: "image", label: "Images" },
  { value: "link", label: "Links" },
  { value: "email", label: "Emails" },
];

export function ContentEditor({ initialContent, initialSha, canSave }: ContentEditorProps) {
  const uploadImage = canSave ? uploadViaAction : undefined;
  const [doc, setDoc] = useState<Doc>(initialContent);
  const [saved, setSaved] = useState<Doc>(initialContent);
  const [sha, setSha] = useState(initialSha);
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<string>("all");
  const [kind, setKind] = useState<FieldKind | "all">("all");
  const [changedOnly, setChangedOnly] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [isSaving, startSaving] = useTransition();

  const leaves = useMemo(() => collectLeaves(doc), [doc]);
  const changed = useMemo(() => {
    const set = new Set<string>();
    for (const leaf of leaves) if ((getAt(saved, leaf.path) ?? "") !== leaf.value) set.add(leaf.key);
    // Structural changes (added/removed/reordered items) also count.
    for (const s of SECTIONS) {
      if (JSON.stringify(doc[s.key]) !== JSON.stringify(saved[s.key])) set.add(s.key);
    }
    return set;
  }, [leaves, saved, doc]);
  const dirty = changed.size > 0;
  const changedSections = useMemo(
    () => new Set(SECTIONS.filter((s) => changed.has(s.key)).map((s) => s.key)),
    [changed]
  );

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const imageOptions = useMemo(
    () => Array.from(new Set(leaves.filter((l) => l.kind === "image" && l.value).map((l) => l.value))).sort(),
    [leaves]
  );

  const update = useCallback((path: Path, value: Json | undefined) => {
    setDoc((d) => setAt(d, path, value));
    setStatus(null);
  }, []);

  const searching = query.trim() !== "" || kind !== "all" || changedOnly;
  const q = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      searching
        ? leaves.filter(
            (l) =>
              (section === "all" || l.section === section) &&
              (kind === "all" || l.kind === kind) &&
              (!changedOnly || changed.has(l.key)) &&
              (!q ||
                l.value.toLowerCase().includes(q) ||
                l.crumbs.join(" ").toLowerCase().includes(q))
          )
        : [],
    [searching, leaves, section, kind, changedOnly, changed, q]
  );

  const handleSave = () => {
    if (!sha) return;
    setStatus(null);
    startSaving(async () => {
      const result = await saveContent({ content: doc, sha });
      if (result.ok) {
        setSha(result.sha);
        setSaved(doc);
        setErrors({});
        setStatus({
          tone: "ok",
          text: "Published. Vercel is redeploying — changes go live in about 1–2 minutes.",
        });
        return;
      }
      const messages: Record<typeof result.reason, string> = {
        unauthorized: "Your session expired. Sign in again (copy any unsaved text first).",
        invalid: "Some fields need fixing before publishing — see the highlighted fields.",
        conflict: "Content was changed elsewhere since you opened this page. Reload to get the latest, then re-apply your edits.",
        unconfigured: "Publishing isn't configured (GitHub settings missing).",
        failed: "Publishing failed. Please try again in a moment.",
      };
      setErrors(Object.fromEntries((result.issues ?? []).map((i) => [i.path, i.message])));
      setStatus({ tone: "error", text: messages[result.reason] });
    });
  };

  const jumpTo = (key: string) => {
    setQuery("");
    setKind("all");
    setChangedOnly(false);
    setSection(key.split(".")[0]);
    requestAnimationFrame(() =>
      document.getElementById(`field-${key}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
    );
  };

  const fieldProps = {
    doc,
    saved,
    errors,
    changed,
    update,
    imageOptions,
    previews,
    setPreviews,
    uploadImage,
  };

  const visibleSections = SECTIONS.filter((s) => section === "all" || s.key === section);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-24 lg:self-start space-y-1">
        <SidebarButton active={section === "all"} onClick={() => setSection("all")}>
          All sections
        </SidebarButton>
        {Array.from(new Set(SECTIONS.map((s) => s.group))).map((group) => (
          <div key={group} className="pt-3">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-text-secondary/70">
              {group}
            </p>
            {SECTIONS.filter((s) => s.group === group).map((s) => (
              <SidebarButton key={s.key} active={section === s.key} onClick={() => setSection(s.key)}>
                <span className="flex-1 text-left">{s.label}</span>
                {changedSections.has(s.key) && (
                  <span className="h-2 w-2 rounded-full bg-brand-orange" aria-label="Unsaved changes" />
                )}
              </SidebarButton>
            ))}
          </div>
        ))}
      </aside>

      <div className="space-y-6 min-w-0">
        {/* Toolbar */}
        <div className="sticky top-16 z-20 -mx-4 px-4 py-4 bg-background/95 backdrop-blur border-b border-surface-border space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="relative flex-1">
              <span className="sr-only">Search content</span>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search text, headings, image paths…"
                maxLength={200}
                className="w-full bg-surface-card border border-surface-border pl-9 pr-4 py-2.5 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none"
              />
            </label>
            <select
              aria-label="Filter by field type"
              value={kind}
              onChange={(e) => setKind(e.target.value as FieldKind | "all")}
              className="bg-surface-card border border-surface-border px-3 py-2.5 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none"
            >
              {KIND_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-xs text-text-secondary whitespace-nowrap">
              <input
                type="checkbox"
                checked={changedOnly}
                onChange={(e) => setChangedOnly(e.target.checked)}
                className="accent-[rgb(var(--brand-orange))]"
              />
              Changed only
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs text-text-secondary flex-1 min-w-[200px]">
              {dirty ? (
                <span className="text-brand-orange font-semibold">Unsaved changes</span>
              ) : (
                "All changes published"
              )}
              {searching && ` · ${results.length} matching field${results.length === 1 ? "" : "s"}`}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!dirty || isSaving}
              onClick={() => {
                if (window.confirm("Discard all unsaved changes?")) {
                  setDoc(saved);
                  setErrors({});
                  setStatus(null);
                }
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Discard</span>
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!dirty || isSaving || !canSave || !sha}
              onClick={handleSave}
            >
              <span>{isSaving ? "Publishing…" : "Publish Changes"}</span>
            </Button>
          </div>

          {status && (
            <p
              role="status"
              className={cn(
                "flex items-start gap-2 border px-3 py-2 text-xs",
                status.tone === "ok"
                  ? "border-emerald-500/40 text-emerald-400"
                  : "border-brand-orange/40 text-brand-orange"
              )}
            >
              {status.tone === "ok" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0" />
              )}
              <span>{status.text}</span>
            </p>
          )}

          {Object.keys(errors).length > 0 && (
            <ul className="max-h-32 overflow-auto text-xs space-y-1">
              {Object.entries(errors).map(([key, message]) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => jumpTo(key)}
                    className="text-left text-brand-orange hover:underline"
                  >
                    {describePath(key)}: {message}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {searching ? (
          <div className="space-y-4">
            {results.length === 0 && (
              <p className="text-sm text-text-secondary py-12 text-center">No fields match.</p>
            )}
            {results.slice(0, 200).map((leaf) => (
              <div key={leaf.key} className="border border-surface-border bg-surface-card p-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                  <span className="truncate">{leaf.crumbs.join(" › ")}</span>
                  <ViewOnSite anchor={SECTION_BY_KEY[leaf.section]?.anchor} />
                </div>
                <FieldEditor path={leaf.path} {...fieldProps} hideLabel />
              </div>
            ))}
            {results.length > 200 && (
              <p className="text-xs text-text-secondary text-center">
                Showing the first 200 matches — refine your search.
              </p>
            )}
          </div>
        ) : (
          visibleSections.map((s) => (
            <section
              key={s.key}
              className="border border-surface-border bg-surface-card"
              aria-labelledby={`section-${s.key}`}
            >
              <header className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
                <button
                  type="button"
                  onClick={() => setCollapsed((c) => ({ ...c, [s.key]: !c[s.key] }))}
                  className="flex items-center gap-2 flex-1 text-left"
                  aria-expanded={!collapsed[s.key]}
                >
                  <ChevronDown
                    className={cn("h-4 w-4 text-text-secondary transition-transform", collapsed[s.key] && "-rotate-90")}
                  />
                  <h2 id={`section-${s.key}`} className="text-sm font-display font-bold uppercase tracking-wider text-text-primary">
                    {s.label}
                  </h2>
                  {changedSections.has(s.key) && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-orange">
                      Edited
                    </span>
                  )}
                </button>
                <ViewOnSite anchor={s.anchor} />
              </header>
              {!collapsed[s.key] && (
                <div className="p-5">
                  <NodeEditor path={[s.key]} {...fieldProps} />
                </div>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
}

function describePath(key: string): string {
  if (!key) return "Content";
  const parts = key.split(".");
  const section = SECTION_BY_KEY[parts[0]]?.label ?? parts[0];
  return [section, ...parts.slice(1).map((p) => (/^\d+$/.test(p) ? `#${Number(p) + 1}` : fieldLabel(p)))].join(" › ");
}

function SidebarButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors",
        active
          ? "bg-brand-orange/10 text-brand-orange font-semibold"
          : "text-text-secondary hover:text-text-primary hover:bg-surface-card"
      )}
    >
      {children}
    </button>
  );
}

function ViewOnSite({ anchor }: { anchor?: string }) {
  if (anchor === undefined) return null;
  return (
    <a
      href={`/${anchor}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary hover:text-brand-orange whitespace-nowrap"
    >
      View on site <ExternalLink className="h-3 w-3" />
    </a>
  );
}

// ---------- recursive editors ----------

interface FieldProps {
  path: Path;
  doc: Doc;
  saved: Doc;
  errors: Record<string, string>;
  changed: Set<string>;
  update: (path: Path, value: Json | undefined) => void;
  imageOptions: string[];
  previews: Record<string, string>;
  setPreviews: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  uploadImage?: ImageUploader;
  hideLabel?: boolean;
}

function NodeEditor(props: FieldProps) {
  const value = getAt(props.doc, props.path);
  if (Array.isArray(value)) return <ArrayEditor {...props} items={value} />;
  if (value && typeof value === "object") {
    const keys = new Set(Object.keys(value));
    const parent = props.path.slice(0, -1);
    if (typeof props.path[props.path.length - 1] === "number") templateKeys(parent)?.forEach((k) => keys.add(k));
    return (
      <div className="space-y-5">
        {Array.from(keys).map((k) => {
          const child = (value as Record<string, Json>)[k];
          const childPath = [...props.path, k];
          if (child && typeof child === "object") {
            return (
              <fieldset key={k} className="border border-surface-border p-4 space-y-4">
                <legend className="px-2 text-[11px] font-bold uppercase tracking-widest text-text-secondary">
                  {fieldLabel(k)}
                </legend>
                <NodeEditor {...props} path={childPath} />
              </fieldset>
            );
          }
          return <FieldEditor key={k} {...props} path={childPath} />;
        })}
      </div>
    );
  }
  return <FieldEditor {...props} />;
}

function ArrayEditor(props: FieldProps & { items: Json[] }) {
  const { path, items, update } = props;
  const isStrings = items.every((i) => typeof i === "string");
  // Nav anchors are fixed by the schema; only labels are editable.
  const fixedLength = path[0] === "navigation";

  const move = (from: number, to: number) => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    update(path, next);
  };
  const remove = (index: number) => {
    if (!window.confirm(`Remove "${itemTitle(items[index], index)}"?`)) return;
    update(path, items.filter((_, i) => i !== index));
  };
  const add = () => {
    const template = items[0];
    update(path, [...items, template === undefined ? "" : blankLike(template)]);
  };

  const controls = (index: number) =>
    !fixedLength && (
      <div className="flex items-center gap-1 shrink-0">
        <IconButton label="Move up" disabled={index === 0} onClick={() => move(index, index - 1)}>
          <ArrowUp className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton label="Move down" disabled={index === items.length - 1} onClick={() => move(index, index + 1)}>
          <ArrowDown className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton label="Remove" disabled={items.length <= 1} onClick={() => remove(index)}>
          <Trash2 className="h-3.5 w-3.5" />
        </IconButton>
      </div>
    );

  return (
    <div className="space-y-3">
      {items.map((item, i) =>
        isStrings ? (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">
              <FieldEditor {...props} path={[...path, i]} hideLabel />
            </div>
            {controls(i)}
          </div>
        ) : (
          <details key={i} className="group border border-surface-border bg-background" open={items.length <= 3}>
            <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer list-none">
              <ChevronDown className="h-4 w-4 text-text-secondary transition-transform -rotate-90 group-open:rotate-0" />
              <span className="flex-1 text-sm font-semibold text-text-primary truncate">{itemTitle(item, i)}</span>
              {controls(i)}
            </summary>
            <div className="px-4 pb-4 pt-1">
              <NodeEditor {...props} path={[...path, i]} />
            </div>
          </details>
        )
      )}
      {!fixedLength && (
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-3.5 w-3.5" />
          <span>Add {isStrings ? "item" : fieldLabel(String(path[path.length - 1])).replace(/s$/, "")}</span>
        </Button>
      )}
    </div>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="p-1.5 rounded text-text-secondary hover:text-brand-orange hover:bg-surface-card disabled:opacity-30 disabled:pointer-events-none"
    >
      {children}
    </button>
  );
}

const inputClass =
  "w-full bg-background border border-surface-border px-3 py-2 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none";

function FieldEditor({ path, doc, saved, errors, changed, update, hideLabel, ...rest }: FieldProps) {
  const key = pathKey(path);
  const raw = getAt(doc, path);
  const value = typeof raw === "string" ? raw : "";
  const original = getAt(saved, path);
  const last = path[path.length - 1];
  const kind = fieldKind(path, value);
  const error = errors[key];
  const isChanged = changed.has(key);
  const optional = typeof last === "string" && OPTIONAL_KEYS.has(last);
  const readOnly = path[0] === "navigation" && last === "href";
  const id = `field-${key}`;

  const onChange = (next: string) => update(path, optional && next === "" ? undefined : next);

  return (
    <div className="space-y-1.5">
      {!hideLabel && (
        <div className="flex items-center gap-2">
          <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            {typeof last === "number" ? `Item ${last + 1}` : fieldLabel(last)}
          </label>
          {optional && <span className="text-[10px] text-text-secondary/70">optional</span>}
          {isChanged && (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" aria-label="Changed" />
              <button
                type="button"
                onClick={() => update(path, typeof original === "string" ? original : undefined)}
                className="text-[10px] uppercase tracking-wider text-text-secondary hover:text-brand-orange"
              >
                Revert
              </button>
            </>
          )}
        </div>
      )}

      {kind === "image" ? (
        <ImageField id={id} path={path} value={value} onChange={onChange} {...rest} />
      ) : kind === "longtext" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.min(8, Math.max(3, Math.ceil(value.length / 90)))}
          maxLength={2000}
          aria-invalid={!!error}
          className={cn(inputClass, "resize-y leading-relaxed", error && "border-brand-orange")}
        />
      ) : (
        <input
          id={id}
          type={kind === "email" ? "email" : "text"}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          maxLength={kind === "link" ? 500 : 400}
          spellCheck={kind === "text"}
          aria-invalid={!!error}
          className={cn(inputClass, readOnly && "opacity-60", error && "border-brand-orange")}
        />
      )}
      {error && (
        <p role="alert" className="text-xs text-brand-orange">
          {error}
        </p>
      )}
    </div>
  );
}

function ImageField({
  id,
  path,
  value,
  onChange,
  imageOptions,
  previews,
  setPreviews,
  uploadImage,
}: {
  id: string;
  path: Path;
  value: string;
  onChange: (v: string) => void;
  imageOptions: string[];
  previews: Record<string, string>;
  setPreviews: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  uploadImage?: ImageUploader;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
  const preview = previews[value] ?? value;

  useEffect(() => setBroken(false), [preview]);

  const onFile = async (file: File | undefined) => {
    if (!file || !uploadImage) return;
    setUploading(true);
    setUploadError(null);
    const result = await uploadImage(file);
    setUploading(false);
    if ("error" in result) {
      setUploadError(result.error);
      return;
    }
    // Newly committed images aren't served until the next deploy: preview locally.
    const local = URL.createObjectURL(file);
    setPreviews((p) => ({ ...p, [result.path]: local }));
    onChange(result.path);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-40 aspect-video shrink-0 border border-surface-border bg-background flex items-center justify-center overflow-hidden">
        {value && !broken ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview, may be a local blob URL
          <img src={preview} alt="" className="h-full w-full object-cover" onError={() => setBroken(true)} />
        ) : (
          <span className="text-[10px] text-text-secondary text-center px-2">
            {value ? "Available after next deploy" : "No image"}
          </span>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <input
          id={id}
          list={`${id}-options`}
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          maxLength={200}
          placeholder="/images/…"
          spellCheck={false}
          className={cn(inputClass, "font-mono text-xs")}
        />
        <datalist id={`${id}-options`}>
          {imageOptions.map((o) => (
            <option key={o} value={o} />
          ))}
        </datalist>
        {uploadImage && (
          <label
            className={cn(
              "inline-flex items-center gap-2 cursor-pointer text-[11px] font-bold uppercase tracking-widest border border-surface-border px-3 py-2 rounded-md text-text-secondary hover:border-brand-orange hover:text-brand-orange",
              uploading && "opacity-60 pointer-events-none"
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            {uploading ? "Uploading…" : "Upload new image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => {
                onFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
        )}
        {uploadError && <p className="text-xs text-brand-orange">{uploadError}</p>}
        <p className="text-[10px] text-text-secondary">
          {String(path[0]) === "images" ? "Shown across the site." : "JPG, PNG or WebP, up to 4 MB."}
        </p>
      </div>
    </div>
  );
}
