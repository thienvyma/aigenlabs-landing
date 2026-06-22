"use client";

import { useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import type {
  AssetItem,
  BlogPost,
  BrandColorTokens,
  BrandLayoutTokens,
  BrandRadiusTokens,
  CmsData,
  CmsPage,
  CmsSection,
  CtaLink,
  ConversionCardsContent,
  EditableMedia,
  FaqContent,
  FloatingDockContact,
  FloatingDockContent,
  FooterColumn,
  HeroSectionContent,
  LocaleSettings,
  NavigationChild,
  PlatformFeaturesContent,
  ReleaseNotesContent,
  SecurityCardsContent,
  UseCaseTabsContent
} from "@/lib/types";
import { isSectionType, parseSectionContent, sectionLabels, sectionTypeOptions, type SectionType } from "@/cms/sections/schema";
import {
  createEditableMedia,
  createSectionTemplate,
  landingMediaPlaceholders
} from "@/cms/sections/templates";
import { blogPostPath, dateInputValue, estimateReadingMinutes, formatBlogDate, normalizeBlogSlug, sortBlogPosts } from "@/lib/blog";
import { fallbackDefaultLocale, getSupportedLocales } from "@/lib/i18n";
import { sortByOrder } from "@/lib/utils";

interface AdminStudioProps {
  initialData: CmsData;
  userEmail: string;
}

const tabs = ["Pages", "Content", "Blog", "SEO", "Brand", "Navigation", "Footer", "Assets"] as const;
type AdminTab = (typeof tabs)[number];

interface SelectOption {
  label: string;
  value: string;
}

const iconOptions = [
  { label: "Agent / bot", value: "bot" },
  { label: "Clock / automation", value: "clock" },
  { label: "Browser / globe", value: "globe" },
  { label: "Connector / plug", value: "plug" },
  { label: "Skill / puzzle", value: "puzzle" },
  { label: "Messages / channels", value: "messages" },
  { label: "Phone / pairing", value: "smartphone" },
  { label: "Users / teams", value: "users" },
  { label: "Shield / security", value: "shield" },
  { label: "Check / approval", value: "check" },
  { label: "Archive / audit", value: "archive" }
] as const;

const floatingDockIconOptions = [
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Messenger", value: "messenger" },
  { label: "Facebook", value: "facebook" },
  { label: "Zalo", value: "zalo" },
  { label: "Website", value: "website" },
  { label: "Chatbot", value: "chatbot" },
  { label: "Support", value: "support" }
] as const;

const floatingDockWebhookTriggerOptions = [
  { label: "When helper opens", value: "helper_open" },
  { label: "When a channel is clicked", value: "contact_click" },
  { label: "Both", value: "both" }
] as const;

const websiteUrlOptions = [
  { label: "Production domain", value: "https://www.aigenlabs.com" },
  { label: "Root domain", value: "https://aigenlabs.com" },
  { label: "Local preview", value: "http://localhost:3000" }
];

const cssTokenPresets: Record<string, SelectOption[]> = {
  navHeight: [
    { label: "Compact header - 56px", value: "56px" },
    { label: "Standard header - 64px", value: "64px" },
    { label: "Tall header - 72px", value: "72px" }
  ],
  containerWide: [
    { label: "Standard page width - 1200px", value: "1200px" },
    { label: "Wide page width - 1320px", value: "1320px" },
    { label: "Extra wide page width - 1440px", value: "1440px" }
  ],
  containerFeature: [
    { label: "Narrow feature width - 960px", value: "960px" },
    { label: "Standard feature width - 1100px", value: "1100px" },
    { label: "Wide feature width - 1200px", value: "1200px" }
  ],
  containerFaq: [
    { label: "Narrow text width - 720px", value: "720px" },
    { label: "Standard text width - 800px", value: "800px" },
    { label: "Wide text width - 920px", value: "920px" }
  ],
  sectionPaddingDesktop: [
    { label: "Tight section spacing - 72px", value: "72px" },
    { label: "Standard section spacing - 96px", value: "96px" },
    { label: "Airy section spacing - 120px", value: "120px" }
  ],
  sectionPaddingMobile: [
    { label: "Tight mobile spacing - 48px", value: "48px" },
    { label: "Standard mobile spacing - 64px", value: "64px" },
    { label: "Airy mobile spacing - 80px", value: "80px" }
  ],
  sm: [
    { label: "Sharp - 4px", value: "4px" },
    { label: "Soft - 8px", value: "8px" },
    { label: "Round - 12px", value: "12px" }
  ],
  md: [
    { label: "Soft - 8px", value: "8px" },
    { label: "Round - 12px", value: "12px" },
    { label: "Large - 16px", value: "16px" }
  ],
  lg: [
    { label: "Round - 12px", value: "12px" },
    { label: "Large - 16px", value: "16px" },
    { label: "Extra large - 20px", value: "20px" }
  ],
  xl: [
    { label: "Large - 16px", value: "16px" },
    { label: "Extra large - 24px", value: "24px" },
    { label: "Panel - 32px", value: "32px" }
  ],
  panel: [
    { label: "Soft panel - 24px", value: "24px" },
    { label: "Round panel - 32px", value: "32px" },
    { label: "Large panel - 42px", value: "42px" }
  ],
  pill: [
    { label: "Soft button - 12px", value: "12px" },
    { label: "Rounded button - 24px", value: "24px" },
    { label: "Full pill - 999px", value: "999px" }
  ]
};

function nowIso() {
  return new Date().toISOString();
}

function ensureWebsiteUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/\/+$/, "");
  return `https://${trimmed.replace(/^\/+/, "").replace(/\/+$/, "")}`;
}

function arraysFromLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function linesFromArray(value: string[]) {
  return value.join("\n");
}

function labelForSection(section: { id: string; name?: string; type: string }) {
  if (section.name) return section.name;
  return isSectionType(section.type) ? sectionLabels[section.type] : section.id;
}

function isHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function TextInput({
  label,
  value,
  onChange,
  help,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  type?: string;
}) {
  return (
    <label>
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      {help ? <span className="field-help">{help}</span> : null}
    </label>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
  help,
  rows = 4
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  rows?: number;
}) {
  return (
    <label>
      {label}
      <textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} />
      {help ? <span className="field-help">{help}</span> : null}
    </label>
  );
}

function ToggleInput({ label, checked, onChange, help }: { label: string; checked: boolean; onChange: (value: boolean) => void; help?: string }) {
  return (
    <label className="admin-checkbox">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>
        {label}
        {help ? <small>{help}</small> : null}
      </span>
    </label>
  );
}

function SelectInput<TValue extends string>({
  label,
  value,
  options,
  onChange,
  help
}: {
  label: string;
  value: TValue;
  options: Array<{ label: string; value: TValue }>;
  onChange: (value: TValue) => void;
  help?: string;
}) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value as TValue)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {help ? <span className="field-help">{help}</span> : null}
    </label>
  );
}

function optionsWithCurrent(options: SelectOption[], value: string): SelectOption[] {
  if (!value || options.some((option) => option.value === value)) return options;
  return [{ label: `Current: ${value}`, value }, ...options];
}

function ChoiceTextInput({
  label,
  value,
  options,
  onChange,
  help,
  customLabel = "Custom value"
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  help?: string;
  customLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [customMode, setCustomMode] = useState(false);
  const selectableOptions = options.filter((option) => !option.label.startsWith("Current: "));
  const known = value === "" || selectableOptions.some((option) => option.value === value);
  const selectValue = customMode || !known ? "__custom" : value;

  function handleSelect(nextValue: string) {
    if (nextValue === "__custom") {
      setCustomMode(true);
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }
    setCustomMode(false);
    onChange(nextValue);
  }

  function handleInput(nextValue: string) {
    const nextKnown = nextValue === "" || selectableOptions.some((option) => option.value === nextValue);
    setCustomMode(nextValue !== "" && !nextKnown);
    onChange(nextValue);
  }

  return (
    <label>
      {label}
      <span className="choice-field">
        <select value={selectValue} onChange={(event) => handleSelect(event.target.value)}>
          <option value="">Choose...</option>
          {selectableOptions.map((option) => (
            <option key={`${label}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
          <option value="__custom">{customLabel}</option>
        </select>
        <input ref={inputRef} value={value} onChange={(event) => handleInput(event.target.value)} />
      </span>
      {help ? <span className="field-help">{help}</span> : null}
    </label>
  );
}

function LinkInput({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: SelectOption[] }) {
  return (
    <ChoiceTextInput
      label={label}
      value={value}
      options={optionsWithCurrent(options, value)}
      onChange={onChange}
      customLabel="Custom or external link"
      help="Choose an existing page/section when possible. Use custom for mailto, tel, Messenger, Zalo, or external URLs."
    />
  );
}

function WebsiteUrlInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <ChoiceTextInput
      label={label}
      value={value}
      options={optionsWithCurrent(websiteUrlOptions, value)}
      onChange={(nextValue) => onChange(ensureWebsiteUrl(nextValue))}
      customLabel="Custom domain"
      help="Used for canonical URLs, sitemap URLs, robots, and social metadata. The admin adds https:// when needed."
    />
  );
}

function AssetUrlInput({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: SelectOption[] }) {
  return (
    <ChoiceTextInput
      label={label}
      value={value}
      options={optionsWithCurrent(options, value)}
      onChange={onChange}
      customLabel="Custom media URL"
      help="Choose an uploaded asset when possible."
    />
  );
}

function CssTokenInput({ label, value, onChange, tokenKey }: { label: string; value: string; onChange: (value: string) => void; tokenKey: string }) {
  return (
    <ChoiceTextInput
      label={label}
      value={value}
      options={optionsWithCurrent(cssTokenPresets[tokenKey] ?? [], value)}
      onChange={onChange}
      customLabel="Custom CSS value"
      help="Prefer a preset. Custom values should include a CSS unit such as px."
    />
  );
}

function toDateInputValue(value: string) {
  const match = value.match(/^(\d{4})[./-](\d{2})[./-](\d{2})$/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : "";
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      {label}
      <input type="date" value={toDateInputValue(value)} onChange={(event) => onChange(event.target.value.replace(/-/g, "."))} />
      <span className="field-help">Saved as YYYY.MM.DD for the public release card.</span>
    </label>
  );
}

function IsoDateInput({ label, value, onChange, help }: { label: string; value?: string; onChange: (value: string) => void; help?: string }) {
  return (
    <label>
      {label}
      <input
        type="date"
        value={dateInputValue(value)}
        onChange={(event) => onChange(event.target.value ? new Date(`${event.target.value}T00:00:00.000Z`).toISOString() : "")}
      />
      {help ? <span className="field-help">{help}</span> : null}
    </label>
  );
}

function createBlogPostTemplate(): BlogPost {
  const now = nowIso();
  const id = `blog-${Date.now()}`;
  const slug = `bai-viet-moi-${Date.now()}`;
  const title = "Bài viết mới";
  const excerpt = "Tóm tắt ngắn gọn vấn đề, góc nhìn và giá trị chính của bài viết.";
  return {
    id,
    slug,
    locale: "vi",
    status: "draft",
    title,
    excerpt,
    category: "AI Agent",
    authorName: "AigenLabs",
    coverImage: "",
    coverAlt: "",
    body: [
      "## Vấn đề",
      "Viết bối cảnh, đối tượng đọc và vấn đề cụ thể.",
      "",
      "## Cách tiếp cận",
      "- Ý chính thứ nhất.",
      "- Ý chính thứ hai.",
      "",
      "## Kết luận",
      "Tóm tắt insight và bước tiếp theo."
    ].join("\n"),
    seo: {
      title,
      description: excerpt,
      canonicalPath: blogPostPath(slug),
      robotsIndex: true,
      robotsFollow: true,
      ogTitle: title,
      ogDescription: excerpt,
      ogImage: "",
      twitterCard: "summary_large_image",
      keywords: ["AI Agent", "workflow", "AigenLabs"]
    },
    createdAt: now,
    updatedAt: now
  };
}

function CtaFields({ title, value, onChange, linkOptions }: { title: string; value: CtaLink; onChange: (value: CtaLink) => void; linkOptions: SelectOption[] }) {
  const cta = { enabled: true, ...value };
  return (
    <div className="nested-editor">
      <h4>{title}</h4>
      <div className="admin-form-grid">
        <TextInput label="Button text" value={cta.label} onChange={(label) => onChange({ ...cta, label })} />
        <LinkInput label="Button link" value={cta.href} onChange={(href) => onChange({ ...cta, href })} options={linkOptions} />
        <ToggleInput label="Show this button" checked={cta.enabled !== false} onChange={(enabled) => onChange({ ...cta, enabled })} />
      </div>
    </div>
  );
}

function MediaFields({ title, value, onChange, assetOptions, posterOptions }: { title: string; value: EditableMedia; onChange: (value: EditableMedia) => void; assetOptions: SelectOption[]; posterOptions: SelectOption[] }) {
  return (
    <div className="nested-editor">
      <h4>{title}</h4>
      <div className="admin-form-grid">
        <SelectInput<EditableMedia["kind"]>
          label="Media type"
          value={value.kind}
          options={[
            { label: "Uploaded image", value: "image" },
            { label: "Video URL", value: "video" }
          ]}
          onChange={(kind) => onChange({ ...value, kind })}
        />
        <TextInput label="Media title" value={value.title} onChange={(mediaTitle) => onChange({ ...value, title: mediaTitle })} />
        <TextInput label="Small media label" value={value.label} onChange={(label) => onChange({ ...value, label })} />
        <AssetUrlInput label="Image or video URL" value={value.url} onChange={(url) => onChange({ ...value, url })} options={assetOptions} />
        <TextInput label="Alt text" value={value.alt} onChange={(alt) => onChange({ ...value, alt })} />
        <AssetUrlInput label="Video poster URL" value={value.poster ?? ""} onChange={(poster) => onChange({ ...value, poster })} options={posterOptions} />
      </div>
    </div>
  );
}

function EditableList<TItem>({
  label,
  items,
  addLabel,
  createItem,
  onChange,
  renderItem
}: {
  label: string;
  items: TItem[];
  addLabel: string;
  createItem: () => TItem;
  onChange: (items: TItem[]) => void;
  renderItem: (item: TItem, index: number, onItemChange: (item: TItem) => void) => ReactNode;
}) {
  function updateItem(index: number, item: TItem) {
    onChange(items.map((entry, itemIndex) => (itemIndex === index ? item : entry)));
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="nested-editor">
      <div className="nested-editor-head">
        <h4>{label}</h4>
        <button type="button" className="admin-secondary" onClick={() => onChange([...items, createItem()])}>
          {addLabel}
        </button>
      </div>
      <div className="editor-list">
        {items.map((item, index) => (
          <article key={index} className="editor-list-item">
            <div className="editor-list-toolbar">
              <strong>{label} {index + 1}</strong>
              <div>
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0}>
                  Up
                </button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1}>
                  Down
                </button>
                <button type="button" className="danger" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>
                  Remove
                </button>
              </div>
            </div>
            {renderItem(item, index, (nextItem) => updateItem(index, nextItem))}
          </article>
        ))}
      </div>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      {label}
      <span className="color-field">
        {isHexColor(value) ? <input aria-label={`${label} color picker`} type="color" value={value} onChange={(event) => onChange(event.target.value)} /> : null}
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      </span>
    </label>
  );
}

export function AdminStudio({ initialData, userEmail }: AdminStudioProps) {
  const [data, setData] = useState<CmsData>(initialData);
  const [activeTab, setActiveTab] = useState<AdminTab>("Pages");
  const [selectedSectionId, setSelectedSectionId] = useState(initialData.pages[0]?.sections[0]?.id ?? "");
  const [selectedBlogPostId, setSelectedBlogPostId] = useState(initialData.blogPosts?.[0]?.id ?? "");
  const [selectedSettingsLocale, setSelectedSettingsLocale] = useState(initialData.settings.defaultLocale || fallbackDefaultLocale);
  const [pendingSectionType, setPendingSectionType] = useState<SectionType>("hero");
  const [status, setStatus] = useState("");
  const [uploadAlt, setUploadAlt] = useState("");
  const [replacingAssetId, setReplacingAssetId] = useState("");

  const selectedPage = data.pages[0];
  const blogPosts = data.blogPosts ?? [];
  const supportedLocales = useMemo(() => getSupportedLocales(data.settings), [data.settings]);
  const selectedLocaleSettings = supportedLocales.find((locale) => locale.code === selectedSettingsLocale) ?? supportedLocales[0];
  const linkOptions = useMemo(() => {
    const options: SelectOption[] = [
      { label: "Admin login", value: "/admin" },
      { label: "Blog index", value: "/blog" },
      { label: "Policy page", value: "/policy" },
      { label: "Policy data deletion", value: "/policy#data-deletion" },
      { label: "Email AigenLabs", value: "mailto:edu@aigenlabs.vn" },
      { label: "Phone AigenLabs", value: "tel:+84981413456" },
      { label: "Zalo AigenLabs", value: "https://zalo.me/84981413456" }
    ];

    for (const page of data.pages) {
      options.push({ label: `Page: ${page.title} [${page.locale}] (${page.path})`, value: page.path });
      for (const section of sortByOrder(page.sections)) {
        const sectionLabel = labelForSection(section);
        const href = page.path === "/" ? `/#${section.id}` : `${page.path}#${section.id}`;
        options.push({ label: `${page.path === "/" ? "Home" : page.title} [${page.locale}]: ${sectionLabel}`, value: href });
      }
    }

    for (const post of blogPosts) {
      options.push({ label: `Blog: ${post.title} (${post.status})`, value: blogPostPath(post) });
    }

    return Array.from(new Map(options.map((option) => [option.value, option])).values());
  }, [blogPosts, data.pages]);
  const mediaAssetOptions = useMemo(
    () => data.assets
      .filter((asset) => asset.kind === "image" || asset.kind === "video")
      .map((asset) => ({ label: `${asset.fileName}${asset.alt ? ` - ${asset.alt}` : ""}`, value: asset.url })),
    [data.assets]
  );
  const imageAssetOptions = useMemo(
    () => data.assets
      .filter((asset) => asset.kind === "image")
      .map((asset) => ({ label: `${asset.fileName}${asset.alt ? ` - ${asset.alt}` : ""}`, value: asset.url })),
    [data.assets]
  );
  const orderedSections = selectedPage ? sortByOrder(selectedPage.sections) : [];
  const selectedSection = orderedSections.find((section) => section.id === selectedSectionId) ?? orderedSections[0];
  const orderedBlogPosts = useMemo(() => sortBlogPosts(blogPosts), [blogPosts]);
  const selectedBlogPost = orderedBlogPosts.find((post) => post.id === selectedBlogPostId) ?? orderedBlogPosts[0];

  function syncData(next: CmsData, message = "Unsaved changes. Click Save changes when ready.") {
    setData(next);
    setStatus(message);
  }

  function updateSelectedPage(updater: (page: CmsPage) => CmsPage) {
    if (!selectedPage) return;
    syncData({
      ...data,
      pages: data.pages.map((page) => {
        if (page.id !== selectedPage.id) return page;
        const next = updater(page);
        return { ...next, updatedAt: nowIso(), publishedAt: next.status === "published" ? next.publishedAt ?? nowIso() : next.publishedAt };
      })
    });
  }

  function updateSelectedSection(updater: (section: CmsSection) => CmsSection) {
    updateSelectedPage((page) => ({
      ...page,
      sections: page.sections.map((section) => (section.id === selectedSection?.id ? updater(section) : section))
    }));
  }

  function updateSectionContent<TContent extends object>(patch: Partial<TContent>) {
    updateSelectedSection((section) => ({
      ...section,
      content: { ...(section.content as TContent), ...patch } as Record<string, unknown>
    }));
  }

  function updateBlogPost(postId: string, updater: (post: BlogPost) => BlogPost, message = "Blog changes are unsaved. Click Save changes when ready.") {
    const now = nowIso();
    syncData({
      ...data,
      blogPosts: blogPosts.map((post) => (post.id === postId ? { ...updater(post), updatedAt: now } : post))
    }, message);
  }

  function addBlogPost() {
    const post = createBlogPostTemplate();
    syncData({ ...data, blogPosts: [post, ...blogPosts] }, "New draft blog post created. Edit it and click Save changes.");
    setSelectedBlogPostId(post.id);
    setActiveTab("Blog");
  }

  function deleteBlogPost(postId: string) {
    const post = blogPosts.find((entry) => entry.id === postId);
    if (!post) return;
    const confirmed = window.confirm(`Delete blog post "${post.title}"? This is saved only after you click Save changes.`);
    if (!confirmed) return;
    const nextPosts = blogPosts.filter((entry) => entry.id !== postId);
    syncData({ ...data, blogPosts: nextPosts }, "Blog post removed from draft CMS data. Click Save changes to delete it from the live CMS.");
    setSelectedBlogPostId(nextPosts[0]?.id ?? "");
  }

  function updateBlogSlug(post: BlogPost, value: string) {
    const slug = normalizeBlogSlug(value);
    updateBlogPost(post.id, (current) => ({
      ...current,
      slug,
      seo: {
        ...current.seo,
        canonicalPath: blogPostPath(slug)
      }
    }));
  }

  function updateSettings(settings: CmsData["settings"]) {
    syncData({ ...data, settings });
  }

  function syncDefaultLocaleFields(settings: CmsData["settings"], locales: LocaleSettings[]) {
    const defaultLocale = locales.find((locale) => locale.code === settings.defaultLocale);
    return {
      ...settings,
      supportedLocales: locales,
      navigation: defaultLocale?.navigation ?? settings.navigation,
      footer: defaultLocale?.footer ?? settings.footer
    };
  }

  function updateLocaleSettings(localeCode: string, patch: Partial<LocaleSettings>) {
    const locales = getSupportedLocales(data.settings);
    const nextLocales = locales.map((locale) => (locale.code === localeCode ? { ...locale, ...patch } : locale));
    updateSettings(syncDefaultLocaleFields(data.settings, nextLocales));
  }

  function updateLocaleNavigation(navigation: LocaleSettings["navigation"]) {
    if (!selectedLocaleSettings) return;
    updateLocaleSettings(selectedLocaleSettings.code, { navigation });
  }

  function updateLocaleFooter(footer: LocaleSettings["footer"]) {
    if (!selectedLocaleSettings) return;
    updateLocaleSettings(selectedLocaleSettings.code, { footer });
  }

  function renderLocaleScopePicker(help: string) {
    if (!selectedLocaleSettings) return null;
    return (
      <div className="admin-form-grid locale-scope">
        <SelectInput
          label="Editing language"
          value={selectedLocaleSettings.code}
          options={supportedLocales.map((locale) => ({ label: `${locale.nativeLabel} (${locale.code})`, value: locale.code }))}
          onChange={setSelectedSettingsLocale}
          help={help}
        />
      </div>
    );
  }

  async function save() {
    setStatus("Saving changes...");
    const response = await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      setStatus("Save failed. Please review the fields and try again.");
      return;
    }
    const body = (await response.json()) as { data: CmsData };
    syncData(body.data, "Saved. The live site has been updated.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("alt", uploadAlt);
    setStatus("Uploading asset...");
    const response = await fetch("/api/admin/upload", { method: "POST", body: form });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus(body?.error || "Upload failed. Please try a smaller JPG, PNG, WebP, MP4, WebM, or PDF file.");
      return;
    }
    const body = (await response.json()) as { asset: AssetItem };
    syncData({ ...data, assets: [body.asset, ...data.assets] }, "Asset uploaded. You can now use its URL in a section.");
    setUploadAlt("");
    event.target.value = "";
  }

  async function replaceAssetFile(asset: AssetItem, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("alt", asset.alt);
    form.append("caption", asset.caption ?? "");
    setReplacingAssetId(asset.id);
    setStatus("Replacing asset and updating landing references...");
    try {
      const response = await fetch(`/api/admin/assets/${encodeURIComponent(asset.id)}/replace`, { method: "POST", body: form });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus(body?.error || "Replace failed. Please try a smaller JPG, PNG, WebP, MP4, WebM, or PDF file.");
        return;
      }
      const body = (await response.json()) as { data: CmsData; warning?: string };
      syncData(body.data, body.warning ? `Asset replaced, but cleanup warning: ${body.warning}` : "Asset replaced. Existing landing references now use the new file.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Replace failed. Please check the server and try again.");
    } finally {
      setReplacingAssetId("");
      event.target.value = "";
    }
  }

  function moveSection(sectionId: string, direction: -1 | 1) {
    if (!selectedPage) return;
    const ordered = sortByOrder(selectedPage.sections);
    const index = ordered.findIndex((section) => section.id === sectionId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= ordered.length) return;
    const next = [...ordered];
    [next[index].order, next[target].order] = [next[target].order, next[index].order];
    updateSelectedPage((page) => ({ ...page, sections: page.sections.map((section) => next.find((entry) => entry.id === section.id) ?? section) }));
  }

  function renderPagePicker() {
    return (
      <aside className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h2>Home</h2>
            <p className="panel-note">Only the homepage route is enabled in this production scope.</p>
          </div>
        </div>
        <div className="admin-list">
          {selectedPage ? (
            <button
              key={selectedPage.id}
              type="button"
              className="active"
              onClick={() => setSelectedSectionId(selectedPage.sections[0]?.id ?? "")}
            >
              <strong>{selectedPage.title}</strong>
              <span>{selectedPage.locale} - {selectedPage.path} - {selectedPage.status}</span>
            </button>
          ) : null}
        </div>
      </aside>
    );
  }

  function renderPagesTab() {
    if (!selectedPage) return null;
    return (
      <div className="admin-grid-two">
        {renderPagePicker()}
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>Home details</h2>
              <p className="panel-note">Edit the single public landing route. Supporting pages have been removed from this scope.</p>
            </div>
            <div className="admin-actions-inline">
              <a className="admin-secondary" href="/" target="_blank" rel="noreferrer">
                Open live page
              </a>
            </div>
          </div>
          <div className="admin-form-grid">
            <TextInput label="Page name in admin" value={selectedPage.title} onChange={(title) => updateSelectedPage((page) => ({ ...page, title }))} />
            <label>
              Public URL
              <input value="/" readOnly />
              <span className="field-help">Only the homepage route is enabled.</span>
            </label>
            <label>
              Publishing state
              <input value="Published on website" readOnly />
            </label>
            <label>
              Language
              <input value="English (en)" readOnly />
            </label>
          </div>
        </section>
      </div>
    );
  }

  function renderHeroEditor(content: HeroSectionContent) {
    return (
      <>
        <div className="admin-form-grid">
          <TextInput label="Large brand word" value={content.wordmark} onChange={(wordmark) => updateSectionContent<HeroSectionContent>({ wordmark })} />
          <TextInput label="Headline" value={content.headline} onChange={(headline) => updateSectionContent<HeroSectionContent>({ headline })} />
          <TextAreaInput label="Supporting text" value={content.subheadline} onChange={(subheadline) => updateSectionContent<HeroSectionContent>({ subheadline })} />
        </div>
        <EditableList
          label="Trust chip"
          addLabel="Add chip"
          items={content.chips}
          createItem={() => ({ label: "New chip", enabled: true })}
          onChange={(chips) => updateSectionContent<HeroSectionContent>({ chips })}
          renderItem={(chip, _index, onItemChange) => (
            <div className="admin-form-grid">
              <TextInput label="Text" value={chip.label} onChange={(label) => onItemChange({ ...chip, label })} />
              <ToggleInput label="Show chip" checked={chip.enabled} onChange={(enabled) => onItemChange({ ...chip, enabled })} />
            </div>
          )}
        />
        <CtaFields title="Primary button" value={content.primaryCta} onChange={(primaryCta) => updateSectionContent<HeroSectionContent>({ primaryCta })} linkOptions={linkOptions} />
        <CtaFields title="Secondary button" value={content.secondaryCta} onChange={(secondaryCta) => updateSectionContent<HeroSectionContent>({ secondaryCta })} linkOptions={linkOptions} />
        <MediaFields title="Hero media" value={content.preview} onChange={(preview) => updateSectionContent<HeroSectionContent>({ preview })} assetOptions={mediaAssetOptions} posterOptions={imageAssetOptions} />
      </>
    );
  }

  function renderUseCaseEditor(content: UseCaseTabsContent) {
    return (
      <>
        <TextInput label="Section heading" value={content.heading} onChange={(heading) => updateSectionContent<UseCaseTabsContent>({ heading })} />
        <EditableList
          label="Tab"
          addLabel="Add tab"
          items={content.tabs}
          createItem={() => ({
            label: "New tab",
            title: "New use case",
            description: "Explain this use case.",
            mediaTitle: "Workspace preview",
            media: createEditableMedia(
              "Workspace preview",
              "New tab",
              "Workspace preview",
              landingMediaPlaceholders.useCasePrecision
            )
          })}
          onChange={(tabs) => updateSectionContent<UseCaseTabsContent>({ tabs })}
          renderItem={(tab, _index, onItemChange) => (
            <>
              <div className="admin-form-grid">
                <TextInput label="Tab label" value={tab.label} onChange={(label) => onItemChange({ ...tab, label })} />
                <TextInput label="Title" value={tab.title} onChange={(title) => onItemChange({ ...tab, title })} />
                <TextAreaInput label="Description" value={tab.description} onChange={(description) => onItemChange({ ...tab, description })} />
                <TextInput label="Preview title" value={tab.mediaTitle} onChange={(mediaTitle) => onItemChange({ ...tab, mediaTitle })} />
              </div>
              <MediaFields
                title="Tab media"
                value={tab.media ?? createEditableMedia(tab.mediaTitle, tab.label, `${tab.mediaTitle} preview`, landingMediaPlaceholders.useCasePrecision)}
                onChange={(media) => onItemChange({ ...tab, media })}
                assetOptions={mediaAssetOptions}
                posterOptions={imageAssetOptions}
              />
            </>
          )}
        />
      </>
    );
  }

  function renderPlatformEditor(content: PlatformFeaturesContent) {
    return (
      <>
        <div className="admin-form-grid">
          <TextInput label="Small label" value={content.eyebrow} onChange={(eyebrow) => updateSectionContent<PlatformFeaturesContent>({ eyebrow })} />
          <TextInput label="Heading" value={content.heading} onChange={(heading) => updateSectionContent<PlatformFeaturesContent>({ heading })} />
          <TextAreaInput label="Description" value={content.description} onChange={(description) => updateSectionContent<PlatformFeaturesContent>({ description })} />
        </div>
        <EditableList
          label="Feature"
          addLabel="Add feature"
          items={content.features}
          createItem={() => ({
            title: "New feature",
            description: "Explain this feature.",
            icon: "bot",
            layout: "normal" as const,
            badge: "",
            slides: ["Item one"],
            media: createEditableMedia(
              "New feature",
              "Feature preview",
              "Feature media",
              landingMediaPlaceholders.platformAgentHub
            )
          })}
          onChange={(features) => updateSectionContent<PlatformFeaturesContent>({ features })}
          renderItem={(feature, _index, onItemChange) => (
            <>
              <div className="admin-form-grid">
                <TextInput label="Title" value={feature.title} onChange={(title) => onItemChange({ ...feature, title })} />
                <SelectInput label="Icon" value={feature.icon} options={optionsWithCurrent([...iconOptions], feature.icon)} onChange={(icon) => onItemChange({ ...feature, icon })} />
                <TextInput label="Badge" value={feature.badge ?? ""} onChange={(badge) => onItemChange({ ...feature, badge })} />
                <SelectInput<"normal" | "reverse">
                  label="Layout"
                  value={feature.layout}
                  options={[
                    { label: "Text left, media right", value: "normal" },
                    { label: "Media left, text right", value: "reverse" }
                  ]}
                  onChange={(layout) => onItemChange({ ...feature, layout })}
                />
                <TextAreaInput label="Description" value={feature.description} onChange={(description) => onItemChange({ ...feature, description })} />
                <TextAreaInput label="Preview bullets" value={linesFromArray(feature.slides)} onChange={(value) => onItemChange({ ...feature, slides: arraysFromLines(value) })} />
              </div>
              <MediaFields
                title="Feature media"
                value={feature.media ?? createEditableMedia(feature.title, "Feature preview", `${feature.title} media`, landingMediaPlaceholders.platformAgentHub)}
                onChange={(media) => onItemChange({ ...feature, media })}
                assetOptions={mediaAssetOptions}
                posterOptions={imageAssetOptions}
              />
            </>
          )}
        />
      </>
    );
  }

  function renderReleaseEditor(content: ReleaseNotesContent) {
    return (
      <>
        <div className="admin-form-grid">
          <TextInput label="Heading" value={content.heading} onChange={(heading) => updateSectionContent<ReleaseNotesContent>({ heading })} />
          <TextInput label="View all text" value={content.viewAllLabel} onChange={(viewAllLabel) => updateSectionContent<ReleaseNotesContent>({ viewAllLabel })} />
          <LinkInput label="View all link" value={content.viewAllHref} onChange={(viewAllHref) => updateSectionContent<ReleaseNotesContent>({ viewAllHref })} options={linkOptions} />
        </div>
        <EditableList
          label="Setup step"
          addLabel="Add step"
          items={content.items}
          createItem={() => ({ version: "Bước 1", date: "Tên bước", bullets: ["Mô tả việc cần làm."] })}
          onChange={(items) => updateSectionContent<ReleaseNotesContent>({ items })}
          renderItem={(item, _index, onItemChange) => (
            <div className="admin-form-grid">
              <TextInput label="Step label" value={item.version} onChange={(version) => onItemChange({ ...item, version })} />
              <TextInput label="Step title" value={item.date} onChange={(date) => onItemChange({ ...item, date })} />
              <TextAreaInput label="Step bullets" value={linesFromArray(item.bullets)} onChange={(value) => onItemChange({ ...item, bullets: arraysFromLines(value) })} />
            </div>
          )}
        />
      </>
    );
  }

  function renderSecurityEditor(content: SecurityCardsContent) {
    return (
      <>
        <div className="admin-form-grid">
          <TextInput label="Small label" value={content.eyebrow} onChange={(eyebrow) => updateSectionContent<SecurityCardsContent>({ eyebrow })} />
          <TextInput label="Heading" value={content.heading} onChange={(heading) => updateSectionContent<SecurityCardsContent>({ heading })} />
          <TextAreaInput label="Description" value={content.description} onChange={(description) => updateSectionContent<SecurityCardsContent>({ description })} />
          <TextAreaInput label="Note" value={content.note} onChange={(note) => updateSectionContent<SecurityCardsContent>({ note })} />
        </div>
        <EditableList
          label="Security card"
          addLabel="Add card"
          items={content.cards}
          createItem={() => ({ title: "New card", description: "Explain this control.", icon: "shield" })}
          onChange={(cards) => updateSectionContent<SecurityCardsContent>({ cards })}
          renderItem={(card, _index, onItemChange) => (
            <div className="admin-form-grid">
              <TextInput label="Title" value={card.title} onChange={(title) => onItemChange({ ...card, title })} />
              <SelectInput label="Icon" value={card.icon} options={optionsWithCurrent([...iconOptions], card.icon)} onChange={(icon) => onItemChange({ ...card, icon })} />
              <TextAreaInput label="Description" value={card.description} onChange={(description) => onItemChange({ ...card, description })} />
            </div>
          )}
        />
        <CtaFields title="Section button" value={content.cta} onChange={(cta) => updateSectionContent<SecurityCardsContent>({ cta })} linkOptions={linkOptions} />
      </>
    );
  }

  function renderConversionCardsEditor(content: ConversionCardsContent) {
    const sectionCta = content.cta ?? { label: "", href: "", enabled: false };
    const isPricingVariant = (content.variant ?? "default") === "pricing";
    return (
      <>
        <div className="admin-form-grid">
          <TextInput label="Small label" value={content.eyebrow} onChange={(eyebrow) => updateSectionContent<ConversionCardsContent>({ eyebrow })} />
          <TextInput label="Heading" value={content.heading} onChange={(heading) => updateSectionContent<ConversionCardsContent>({ heading })} />
          <TextAreaInput label="Description" value={content.description} onChange={(description) => updateSectionContent<ConversionCardsContent>({ description })} />
          <SelectInput
            label="Visual variant"
            value={content.variant ?? "default"}
            options={[
              { label: "Default", value: "default" },
              { label: "Soft", value: "soft" },
              { label: "Pricing", value: "pricing" },
              { label: "CTA", value: "cta" }
            ]}
            onChange={(variant) => updateSectionContent<ConversionCardsContent>({ variant })}
          />
          <TextAreaInput label="Optional note" value={content.note ?? ""} onChange={(note) => updateSectionContent<ConversionCardsContent>({ note })} />
        </div>
        <EditableList
          label="Conversion card"
          addLabel="Add card"
          items={content.cards}
          createItem={() => ({
            title: "New card",
            description: "Explain the value.",
            icon: "check",
            price: isPricingVariant ? "Liên hệ" : undefined,
            badge: isPricingVariant ? "" : "",
            bullets: []
          })}
          onChange={(cards) => updateSectionContent<ConversionCardsContent>({ cards })}
          renderItem={(card, _index, onItemChange) => {
            const cardCta = card.cta ?? { label: "", href: "", enabled: false };
            return (
              <>
                <div className="admin-form-grid">
                  <TextInput label="Title" value={card.title} onChange={(title) => onItemChange({ ...card, title })} />
                  {isPricingVariant ? (
                    <TextInput label="Price" value={card.price ?? card.badge ?? ""} onChange={(price) => onItemChange({ ...card, price, badge: "" })} />
                  ) : (
                    <TextInput label="Badge" value={card.badge ?? ""} onChange={(badge) => onItemChange({ ...card, badge })} />
                  )}
                  <SelectInput label="Icon" value={card.icon} options={optionsWithCurrent([...iconOptions], card.icon)} onChange={(icon) => onItemChange({ ...card, icon })} />
                  <TextAreaInput label="Description" value={card.description} onChange={(description) => onItemChange({ ...card, description })} />
                  <TextAreaInput label="Bullets, one per line" value={linesFromArray(card.bullets ?? [])} onChange={(value) => onItemChange({ ...card, bullets: arraysFromLines(value) })} />
                </div>
                <CtaFields title="Optional card button" value={cardCta} onChange={(cta) => onItemChange({ ...card, cta })} linkOptions={linkOptions} />
              </>
            );
          }}
        />
        <CtaFields title="Section button" value={sectionCta} onChange={(cta) => updateSectionContent<ConversionCardsContent>({ cta })} linkOptions={linkOptions} />
      </>
    );
  }

  function renderFaqEditor(content: FaqContent) {
    return (
      <>
        <TextInput label="Heading" value={content.heading} onChange={(heading) => updateSectionContent<FaqContent>({ heading })} />
        <EditableList
          label="Question"
          addLabel="Add question"
          items={content.items}
          createItem={() => ({ question: "New question", answer: "Write a clear answer.", linkLabel: "", linkHref: "" })}
          onChange={(items) => updateSectionContent<FaqContent>({ items })}
          renderItem={(item, _index, onItemChange) => (
            <div className="admin-form-grid">
              <TextInput label="Question" value={item.question} onChange={(question) => onItemChange({ ...item, question })} />
              <TextAreaInput label="Answer" value={item.answer} onChange={(answer) => onItemChange({ ...item, answer })} />
              <TextInput label="Optional link text" value={item.linkLabel} onChange={(linkLabel) => onItemChange({ ...item, linkLabel })} />
              <LinkInput label="Optional link URL" value={item.linkHref} onChange={(linkHref) => onItemChange({ ...item, linkHref })} options={linkOptions} />
            </div>
          )}
        />
      </>
    );
  }

  function renderFloatingDockEditor(content: FloatingDockContent) {
    return (
      <>
        <div className="nested-editor">
          <h4>Helper button</h4>
          <div className="admin-form-grid">
            <ToggleInput label="Show floating helper" checked={content.showBackToTop} onChange={(showBackToTop) => updateSectionContent<FloatingDockContent>({ showBackToTop })} />
            <TextInput label="Helper label" value={content.helperLabel} onChange={(helperLabel) => updateSectionContent<FloatingDockContent>({ helperLabel })} />
            <TextInput label="Helper tooltip" value={content.helperTooltip} onChange={(helperTooltip) => updateSectionContent<FloatingDockContent>({ helperTooltip })} />
            <SelectInput
              label="Helper icon"
              value={content.helperIcon}
              options={optionsWithCurrent([...floatingDockIconOptions], content.helperIcon)}
              onChange={(helperIcon) => updateSectionContent<FloatingDockContent>({ helperIcon })}
            />
          </div>
        </div>
        <EditableList<FloatingDockContact>
          label="Contact channel"
          addLabel="Add contact"
          items={content.contacts}
          createItem={() => ({ label: "Messenger", href: "", icon: "messenger", enabled: false })}
          onChange={(contacts) => updateSectionContent<FloatingDockContent>({ contacts })}
          renderItem={(contact, _index, onItemChange) => (
            <div className="admin-form-grid">
              <TextInput label="Tooltip label" value={contact.label} onChange={(label) => onItemChange({ ...contact, label })} />
              <SelectInput
                label="Platform logo"
                value={contact.icon}
                options={optionsWithCurrent([...floatingDockIconOptions], contact.icon)}
                onChange={(icon) => onItemChange({ ...contact, icon })}
              />
              <LinkInput label="Contact link" value={contact.href} onChange={(href) => onItemChange({ ...contact, href })} options={linkOptions} />
              <ToggleInput label="Show this contact" checked={contact.enabled !== false} onChange={(enabled) => onItemChange({ ...contact, enabled })} />
            </div>
          )}
        />
        <div className="nested-editor">
          <h4>Webhook for future chatbot</h4>
          <div className="admin-form-grid">
            <ToggleInput
              label="Enable helper webhook"
              checked={content.webhook.enabled}
              onChange={(enabled) => updateSectionContent<FloatingDockContent>({ webhook: { ...content.webhook, enabled } })}
              help="Keep disabled until a reviewed chatbot/webhook endpoint is ready."
            />
            <TextInput
              label="Webhook URL"
              value={content.webhook.url}
              onChange={(url) => updateSectionContent<FloatingDockContent>({ webhook: { ...content.webhook, url } })}
              help="Can be a same-origin API route or an external webhook endpoint."
            />
            <SelectInput
              label="Webhook trigger"
              value={content.webhook.trigger}
              options={[...floatingDockWebhookTriggerOptions]}
              onChange={(trigger) => updateSectionContent<FloatingDockContent>({ webhook: { ...content.webhook, trigger } })}
            />
            <TextInput
              label="Event name"
              value={content.webhook.eventName}
              onChange={(eventName) => updateSectionContent<FloatingDockContent>({ webhook: { ...content.webhook, eventName } })}
            />
          </div>
        </div>
      </>
    );
  }

  function renderSectionEditor() {
    if (!selectedSection) return null;
    switch (selectedSection.type) {
      case "hero":
        return renderHeroEditor(parseSectionContent("hero", selectedSection.content));
      case "useCaseTabs":
        return renderUseCaseEditor(parseSectionContent("useCaseTabs", selectedSection.content));
      case "platformFeatures":
        return renderPlatformEditor(parseSectionContent("platformFeatures", selectedSection.content));
      case "releaseNotes":
        return renderReleaseEditor(parseSectionContent("releaseNotes", selectedSection.content));
      case "securityCards":
        return renderSecurityEditor(parseSectionContent("securityCards", selectedSection.content));
      case "conversionCards":
        return renderConversionCardsEditor(parseSectionContent("conversionCards", selectedSection.content));
      case "faq":
        return renderFaqEditor(parseSectionContent("faq", selectedSection.content));
      case "floatingDock":
        return renderFloatingDockEditor(parseSectionContent("floatingDock", selectedSection.content));
      default:
        return <p className="panel-note">This section type is not available in the visual editor.</p>;
    }
  }

  function renderContentTab() {
    if (!selectedPage || !selectedSection) return null;
    return (
      <div className="admin-grid-two">
        <aside className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>Sections</h2>
              <p className="panel-note">{selectedPage.title}</p>
            </div>
          </div>
          <div className="section-add-row">
            <select value={pendingSectionType} onChange={(event) => setPendingSectionType(event.target.value as SectionType)}>
              {sectionTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {sectionLabels[type]}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="admin-secondary"
              onClick={() => {
                const section = createSectionTemplate(pendingSectionType, selectedPage.sections.length + 1);
                updateSelectedPage((page) => ({ ...page, sections: [...page.sections, section] }));
                setSelectedSectionId(section.id);
              }}
            >
              Add
            </button>
          </div>
          <div className="admin-list">
            {orderedSections.map((section, index) => (
              <button
                key={section.id}
                type="button"
                className={section.id === selectedSection.id ? "active" : ""}
                onClick={() => setSelectedSectionId(section.id)}
              >
                <strong>{labelForSection(section)}</strong>
                <span>{section.enabled ? "Visible" : "Hidden"} - position {index + 1}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>{labelForSection(selectedSection)}</h2>
              <p className="panel-note">Edit copy, links, lists, and media for this section.</p>
            </div>
            <div className="admin-actions-inline">
              <button type="button" className="admin-secondary" onClick={() => moveSection(selectedSection.id, -1)}>
                Move up
              </button>
              <button type="button" className="admin-secondary" onClick={() => moveSection(selectedSection.id, 1)}>
                Move down
              </button>
              <button type="button" className="admin-secondary" onClick={() => updateSelectedSection((section) => ({ ...section, enabled: !section.enabled }))}>
                {selectedSection.enabled ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="admin-form-grid section-basics">
            <TextInput label="Section label in admin" value={selectedSection.name} onChange={(name) => updateSelectedSection((section) => ({ ...section, name }))} />
          </div>
          {renderSectionEditor()}
        </section>
      </div>
    );
  }

  function renderBlogTab() {
    return (
      <div className="admin-grid-two">
        <aside className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>Blog posts</h2>
              <p className="panel-note">Create, publish, draft, archive, or delete SEO articles.</p>
            </div>
            <button type="button" className="admin-secondary" onClick={addBlogPost}>
              New post
            </button>
          </div>
          <div className="admin-list">
            {orderedBlogPosts.length > 0 ? orderedBlogPosts.map((post) => (
              <button
                key={post.id}
                type="button"
                className={selectedBlogPost?.id === post.id ? "active" : ""}
                onClick={() => setSelectedBlogPostId(post.id)}
              >
                <strong>{post.title}</strong>
                <span>{post.status} - {blogPostPath(post)}</span>
              </button>
            )) : (
              <button type="button" onClick={addBlogPost}>
                <strong>Create the first blog post</strong>
                <span>No posts yet</span>
              </button>
            )}
          </div>
        </aside>

        <section className="admin-panel">
          {selectedBlogPost ? (
            <>
              <div className="admin-panel-head">
                <div>
                  <h2>{selectedBlogPost.title}</h2>
                  <p className="panel-note">
                    {selectedBlogPost.status} - {estimateReadingMinutes(selectedBlogPost.body)} min read
                    {selectedBlogPost.publishedAt ? ` - published ${formatBlogDate(selectedBlogPost.publishedAt)}` : ""}
                  </p>
                </div>
                <div className="admin-actions-inline blog-post-actions">
                  <a className="admin-secondary" href={blogPostPath(selectedBlogPost)} target="_blank" rel="noreferrer">
                    Open
                  </a>
                  <button
                    type="button"
                    className="admin-secondary"
                    onClick={() => updateBlogPost(selectedBlogPost.id, (post) => ({
                      ...post,
                      status: post.status === "published" ? "draft" : "published",
                      publishedAt: post.status === "published" ? post.publishedAt : post.publishedAt ?? nowIso(),
                      seo: { ...post.seo, robotsIndex: post.status !== "published" }
                    }), selectedBlogPost.status === "published" ? "Post moved to draft. Click Save changes." : "Post marked published. Click Save changes.")}
                  >
                    {selectedBlogPost.status === "published" ? "Move to draft" : "Publish"}
                  </button>
                  <button type="button" className="admin-secondary danger" onClick={() => deleteBlogPost(selectedBlogPost.id)}>
                    Delete
                  </button>
                </div>
              </div>

              <div className="nested-editor">
                <h4>Publishing</h4>
                <div className="admin-form-grid">
                  <SelectInput<BlogPost["status"]>
                    label="Status"
                    value={selectedBlogPost.status}
                    options={[
                      { label: "Draft - hidden from public site", value: "draft" },
                      { label: "Published - visible and indexable if robots allow", value: "published" },
                      { label: "Archived - hidden from public site", value: "archived" }
                    ]}
                    onChange={(status) => updateBlogPost(selectedBlogPost.id, (post) => ({
                      ...post,
                      status,
                      publishedAt: status === "published" ? post.publishedAt ?? nowIso() : post.publishedAt
                    }))}
                  />
                  <IsoDateInput
                    label="Published date"
                    value={selectedBlogPost.publishedAt}
                    onChange={(publishedAt) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, publishedAt: publishedAt || undefined }))}
                    help="Used for article schema and public date."
                  />
                  <label>
                    Public URL
                    <input value={blogPostPath(selectedBlogPost)} readOnly />
                    <span className="field-help">Only published posts are public.</span>
                  </label>
                </div>
              </div>

              <div className="nested-editor">
                <h4>Article content</h4>
                <div className="admin-form-grid">
                  <TextInput
                    label="Title"
                    value={selectedBlogPost.title}
                    onChange={(title) => updateBlogPost(selectedBlogPost.id, (post) => ({
                      ...post,
                      title,
                      seo: {
                        ...post.seo,
                        title: post.seo.title === post.title ? title : post.seo.title,
                        ogTitle: post.seo.ogTitle === post.title ? title : post.seo.ogTitle
                      }
                    }))}
                  />
                  <TextInput label="Slug" value={selectedBlogPost.slug} onChange={(slug) => updateBlogSlug(selectedBlogPost, slug)} />
                  <TextInput label="Category" value={selectedBlogPost.category} onChange={(category) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, category }))} />
                  <TextInput label="Author" value={selectedBlogPost.authorName} onChange={(authorName) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, authorName }))} />
                  <TextAreaInput
                    label="Excerpt"
                    value={selectedBlogPost.excerpt}
                    rows={3}
                    onChange={(excerpt) => updateBlogPost(selectedBlogPost.id, (post) => ({
                      ...post,
                      excerpt,
                      seo: {
                        ...post.seo,
                        description: post.seo.description === post.excerpt ? excerpt : post.seo.description,
                        ogDescription: post.seo.ogDescription === post.excerpt ? excerpt : post.seo.ogDescription
                      }
                    }))}
                  />
                  <AssetUrlInput label="Cover image" value={selectedBlogPost.coverImage} onChange={(coverImage) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, coverImage }))} options={imageAssetOptions} />
                  <TextInput label="Cover alt text" value={selectedBlogPost.coverAlt} onChange={(coverAlt) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, coverAlt }))} />
                </div>
                <TextAreaInput
                  label="Body"
                  value={selectedBlogPost.body}
                  rows={18}
                  onChange={(body) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, body }))}
                  help="Use ## for section headings, ### for subheadings, and - for bullet lines. Blank lines split paragraphs."
                />
              </div>

              <div className="nested-editor">
                <h4>SEO and social</h4>
                <div className="admin-form-grid">
                  <TextInput label="SEO title" value={selectedBlogPost.seo.title} onChange={(title) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, seo: { ...post.seo, title } }))} />
                  <label>
                    Canonical path
                    <input value={selectedBlogPost.seo.canonicalPath} readOnly />
                    <span className="field-help">Canonical follows the blog slug.</span>
                  </label>
                  <TextAreaInput label="Meta description" value={selectedBlogPost.seo.description} rows={3} onChange={(description) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, seo: { ...post.seo, description } }))} />
                  <TextAreaInput label="Keywords, one per line" value={linesFromArray(selectedBlogPost.seo.keywords)} rows={3} onChange={(value) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, seo: { ...post.seo, keywords: arraysFromLines(value) } }))} />
                  <TextInput label="Social title" value={selectedBlogPost.seo.ogTitle} onChange={(ogTitle) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, seo: { ...post.seo, ogTitle } }))} />
                  <AssetUrlInput label="Social image" value={selectedBlogPost.seo.ogImage} onChange={(ogImage) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, seo: { ...post.seo, ogImage } }))} options={imageAssetOptions} />
                  <TextAreaInput label="Social description" value={selectedBlogPost.seo.ogDescription} rows={3} onChange={(ogDescription) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, seo: { ...post.seo, ogDescription } }))} />
                  <SelectInput
                    label="Twitter card"
                    value={selectedBlogPost.seo.twitterCard}
                    options={[
                      { label: "Large image card", value: "summary_large_image" },
                      { label: "Compact summary", value: "summary" }
                    ]}
                    onChange={(twitterCard) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, seo: { ...post.seo, twitterCard } }))}
                  />
                  <ToggleInput label="Allow this post in search results" checked={selectedBlogPost.seo.robotsIndex} onChange={(robotsIndex) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, seo: { ...post.seo, robotsIndex } }))} />
                  <ToggleInput label="Allow search engines to follow links" checked={selectedBlogPost.seo.robotsFollow} onChange={(robotsFollow) => updateBlogPost(selectedBlogPost.id, (post) => ({ ...post, seo: { ...post.seo, robotsFollow } }))} />
                </div>
              </div>
            </>
          ) : (
            <div className="blog-admin-empty">
              <h2>No blog posts yet</h2>
              <p className="panel-note">Create a post to start publishing SEO content from the CMS.</p>
              <button type="button" className="admin-save" onClick={addBlogPost}>
                Create first post
              </button>
            </div>
          )}
        </section>
      </div>
    );
  }

  function renderSeoTab() {
    if (!selectedPage) return null;
    const seo = selectedPage.seo;
    return (
      <div className="admin-grid-two">
        {renderPagePicker()}
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <h2>SEO and social sharing</h2>
              <p className="panel-note">These fields control search previews, social cards, canonical URL, robots, and schema output.</p>
            </div>
          </div>
          <div className="admin-form-grid">
            <TextInput label="SEO title" value={seo.title} onChange={(title) => updateSelectedPage((page) => ({ ...page, seo: { ...page.seo, title } }))} />
            <label>
              Canonical path
              <input value="/" readOnly />
              <span className="field-help">Only the homepage route is enabled.</span>
            </label>
            <TextAreaInput label="Meta description" value={seo.description} rows={3} onChange={(description) => updateSelectedPage((page) => ({ ...page, seo: { ...page.seo, description } }))} />
            <TextAreaInput label="Keywords, one per line" value={linesFromArray(seo.keywords)} rows={3} onChange={(value) => updateSelectedPage((page) => ({ ...page, seo: { ...page.seo, keywords: arraysFromLines(value) } }))} />
            <TextInput label="Social title" value={seo.ogTitle} onChange={(ogTitle) => updateSelectedPage((page) => ({ ...page, seo: { ...page.seo, ogTitle } }))} />
            <AssetUrlInput label="Social image" value={seo.ogImage} onChange={(ogImage) => updateSelectedPage((page) => ({ ...page, seo: { ...page.seo, ogImage } }))} options={imageAssetOptions} />
            <TextAreaInput label="Social description" value={seo.ogDescription} rows={3} onChange={(ogDescription) => updateSelectedPage((page) => ({ ...page, seo: { ...page.seo, ogDescription } }))} />
            <SelectInput
              label="Twitter card"
              value={seo.twitterCard}
              options={[
                { label: "Large image card", value: "summary_large_image" },
                { label: "Compact summary", value: "summary" }
              ]}
              onChange={(twitterCard) => updateSelectedPage((page) => ({ ...page, seo: { ...page.seo, twitterCard } }))}
            />
          </div>
          <div className="nested-editor">
            <h4>Search engine rules</h4>
            <div className="admin-form-grid">
              <ToggleInput label="Allow this page in search results" checked={seo.robotsIndex} onChange={(robotsIndex) => updateSelectedPage((page) => ({ ...page, seo: { ...page.seo, robotsIndex } }))} />
              <ToggleInput label="Allow search engines to follow links" checked={seo.robotsFollow} onChange={(robotsFollow) => updateSelectedPage((page) => ({ ...page, seo: { ...page.seo, robotsFollow } }))} />
            </div>
          </div>
          <div className="nested-editor">
            <h4>Structured data</h4>
            <div className="admin-form-grid">
              <ToggleInput label="Organization schema" checked={seo.schemas.organization} onChange={(organization) => updateSelectedPage((page) => ({ ...page, seo: { ...page.seo, schemas: { ...page.seo.schemas, organization } } }))} />
              <ToggleInput label="Website schema" checked={seo.schemas.website} onChange={(website) => updateSelectedPage((page) => ({ ...page, seo: { ...page.seo, schemas: { ...page.seo.schemas, website } } }))} />
              <ToggleInput label="Software application schema" checked={seo.schemas.softwareApplication} onChange={(softwareApplication) => updateSelectedPage((page) => ({ ...page, seo: { ...page.seo, schemas: { ...page.seo.schemas, softwareApplication } } }))} />
              <ToggleInput label="FAQ schema" checked={seo.schemas.faq} onChange={(faq) => updateSelectedPage((page) => ({ ...page, seo: { ...page.seo, schemas: { ...page.seo.schemas, faq } } }))} />
            </div>
          </div>
        </section>
      </div>
    );
  }

  function renderBrandTab() {
    const settings = data.settings;
    const brand = settings.brand;
    const colorFields: Array<[keyof BrandColorTokens, string]> = [
      ["background", "Page background"],
      ["surface", "Card background"],
      ["surfaceMuted", "Soft section background"],
      ["border", "Border"],
      ["borderStrong", "Strong border"],
      ["text", "Main text"],
      ["textMuted", "Muted text"],
      ["textLight", "Light text"],
      ["brand", "Brand color"],
      ["brandDark", "Brand dark"],
      ["brandLight", "Brand light"],
      ["brandSoft", "Soft brand background"],
      ["darkCta", "Dark button"],
      ["darkCtaHover", "Dark button hover"],
      ["warning", "Warning"],
      ["danger", "Danger"]
    ];
    const layoutFields: Array<[keyof BrandLayoutTokens, string]> = [
      ["navHeight", "Navigation height"],
      ["containerWide", "Wide content width"],
      ["containerFeature", "Feature content width"],
      ["containerFaq", "Narrow content width"],
      ["sectionPaddingDesktop", "Desktop section spacing"],
      ["sectionPaddingMobile", "Mobile section spacing"]
    ];
    const radiusFields: Array<[keyof BrandRadiusTokens, string]> = [
      ["sm", "Small corner"],
      ["md", "Medium corner"],
      ["lg", "Large corner"],
      ["xl", "Extra large corner"],
      ["panel", "Panel corner"],
      ["pill", "Pill button corner"]
    ];

    return (
      <section className="admin-panel admin-wide-panel">
        <div className="admin-panel-head">
          <div>
            <h2>Brand system</h2>
            <p className="panel-note">Update the shared tokens that drive colors, spacing, logo text, and corner radius across the whole website.</p>
          </div>
        </div>
        <div className="admin-form-grid">
          <TextInput label="Site name" value={settings.siteName} onChange={(siteName) => updateSettings({ ...settings, siteName })} />
          <WebsiteUrlInput label="Website URL" value={settings.siteUrl} onChange={(siteUrl) => updateSettings({ ...settings, siteUrl })} />
          <label>
            Default language
            <input value="Vietnamese (vi)" readOnly />
            <span className="field-help">The CMS manages the Vietnamese homepage; /policy is a static public route.</span>
          </label>
          <ColorInput label="Browser theme color" value={settings.themeColor} onChange={(themeColor) => updateSettings({ ...settings, themeColor })} />
          <TextInput label="Brand name" value={brand.name} onChange={(name) => updateSettings({ ...settings, brand: { ...brand, name } })} />
          <TextInput label="Tagline" value={brand.tagline} onChange={(tagline) => updateSettings({ ...settings, brand: { ...brand, tagline } })} />
          <TextInput label="Logo text" value={brand.logoText} onChange={(logoText) => updateSettings({ ...settings, brand: { ...brand, logoText } })} />
          <AssetUrlInput label="Logo image" value={brand.logoUrl} onChange={(logoUrl) => updateSettings({ ...settings, brand: { ...brand, logoUrl } })} options={imageAssetOptions} />
          <AssetUrlInput label="Favicon image" value={brand.faviconUrl} onChange={(faviconUrl) => updateSettings({ ...settings, brand: { ...brand, faviconUrl } })} options={imageAssetOptions} />
        </div>
        <div className="nested-editor">
          <h4>Color tokens</h4>
          <div className="admin-form-grid">
            {colorFields.map(([key, label]) => (
              <ColorInput
                key={key}
                label={label}
                value={brand.tokens.color[key]}
                onChange={(value) => updateSettings({ ...settings, brand: { ...brand, tokens: { ...brand.tokens, color: { ...brand.tokens.color, [key]: value } } } })}
              />
            ))}
          </div>
        </div>
        <div className="nested-editor">
          <h4>Layout tokens</h4>
          <div className="admin-form-grid">
            {layoutFields.map(([key, label]) => (
              <CssTokenInput
                key={key}
                label={label}
                value={brand.tokens.layout[key]}
                tokenKey={key}
                onChange={(value) => updateSettings({ ...settings, brand: { ...brand, tokens: { ...brand.tokens, layout: { ...brand.tokens.layout, [key]: value } } } })}
              />
            ))}
          </div>
        </div>
        <div className="nested-editor">
          <h4>Corner radius tokens</h4>
          <div className="admin-form-grid">
            {radiusFields.map(([key, label]) => (
              <CssTokenInput
                key={key}
                label={label}
                value={brand.tokens.radius[key]}
                tokenKey={key}
                onChange={(value) => updateSettings({ ...settings, brand: { ...brand, tokens: { ...brand.tokens, radius: { ...brand.tokens.radius, [key]: value } } } })}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  function renderNavigationTab() {
    if (!selectedLocaleSettings) return null;
    const navigation = selectedLocaleSettings.navigation;
    return (
      <section className="admin-panel admin-wide-panel">
        <div className="admin-panel-head">
          <div>
            <h2>Navigation</h2>
            <p className="panel-note">Manage the top menu, dropdown links, language label, and header buttons for each public language.</p>
          </div>
        </div>
        {renderLocaleScopePicker("Navigation labels and links are saved for the English public route.")}
        <div className="admin-form-grid">
          <TextInput label="Language label" value={navigation.languageLabel} onChange={(languageLabel) => updateLocaleNavigation({ ...navigation, languageLabel })} />
        </div>
        <EditableList
          label="Menu item"
          addLabel="Add menu item"
          items={navigation.items}
          createItem={() => ({ label: "New link", href: "/", kind: "link" as const, badge: "", children: [] })}
          onChange={(items) => updateLocaleNavigation({ ...navigation, items })}
          renderItem={(item, _index, onItemChange) => (
            <>
              <div className="admin-form-grid">
                <TextInput label="Label" value={item.label} onChange={(label) => onItemChange({ ...item, label })} />
                <LinkInput label="Link" value={item.href} onChange={(href) => onItemChange({ ...item, href })} options={linkOptions} />
                <TextInput label="Badge" value={item.badge ?? ""} onChange={(badge) => onItemChange({ ...item, badge })} />
                <ToggleInput label="Use dropdown menu" checked={item.kind === "dropdown"} onChange={(checked) => onItemChange({ ...item, kind: checked ? "dropdown" : "link", children: checked ? item.children ?? [] : item.children })} />
              </div>
              {item.kind === "dropdown" ? (
                <EditableList
                  label="Dropdown link"
                  addLabel="Add dropdown link"
                  items={item.children ?? []}
                  createItem={() => ({ label: "New link", href: "/" })}
                  onChange={(children: NavigationChild[]) => onItemChange({ ...item, children })}
                  renderItem={(child, _childIndex, onChildChange) => (
                    <div className="admin-form-grid">
                      <TextInput label="Label" value={child.label} onChange={(label) => onChildChange({ ...child, label })} />
                      <LinkInput label="Link" value={child.href} onChange={(href) => onChildChange({ ...child, href })} options={linkOptions} />
                    </div>
                  )}
                />
              ) : null}
            </>
          )}
        />
        <CtaFields title="Secondary header button" value={navigation.secondaryCta} onChange={(secondaryCta) => updateLocaleNavigation({ ...navigation, secondaryCta })} linkOptions={linkOptions} />
        <CtaFields title="Sign-in link" value={navigation.signIn} onChange={(signIn) => updateLocaleNavigation({ ...navigation, signIn })} linkOptions={linkOptions} />
        <CtaFields title="Primary header button" value={navigation.primaryCta} onChange={(primaryCta) => updateLocaleNavigation({ ...navigation, primaryCta })} linkOptions={linkOptions} />
      </section>
    );
  }

  function renderFooterTab() {
    if (!selectedLocaleSettings) return null;
    const footer = selectedLocaleSettings.footer;
    return (
      <section className="admin-panel admin-wide-panel">
        <div className="admin-panel-head">
          <div>
            <h2>Footer</h2>
            <p className="panel-note">Edit footer columns, links, and copyright text for each public language.</p>
          </div>
        </div>
        {renderLocaleScopePicker("Footer labels and links are saved for the English public route.")}
        <EditableList
          label="Footer column"
          addLabel="Add column"
          items={footer.columns}
          createItem={() => ({ title: "New column", links: [{ label: "New link", href: "/" }] })}
          onChange={(columns: FooterColumn[]) => updateLocaleFooter({ ...footer, columns })}
          renderItem={(column, _index, onColumnChange) => (
            <>
              <TextInput label="Column title" value={column.title} onChange={(title) => onColumnChange({ ...column, title })} />
              <EditableList
                label="Footer link"
                addLabel="Add link"
                items={column.links}
                createItem={() => ({ label: "New link", href: "/" })}
                onChange={(links) => onColumnChange({ ...column, links })}
                renderItem={(link, _linkIndex, onLinkChange) => (
                  <div className="admin-form-grid">
                    <TextInput label="Label" value={link.label} onChange={(label) => onLinkChange({ ...link, label })} />
                    <LinkInput label="Link" value={link.href} onChange={(href) => onLinkChange({ ...link, href })} options={linkOptions} />
                  </div>
                )}
              />
            </>
          )}
        />
        <TextInput label="Copyright" value={footer.copyright} onChange={(copyright) => updateLocaleFooter({ ...footer, copyright })} />
      </section>
    );
  }

  function updateAsset(assetId: string, patch: Partial<AssetItem>) {
    syncData({
      ...data,
      assets: data.assets.map((asset) => (asset.id === assetId ? { ...asset, ...patch, updatedAt: nowIso() } : asset))
    });
  }

  function renderAssetsTab() {
    return (
      <section className="admin-panel admin-wide-panel">
        <div className="admin-panel-head">
          <div>
            <h2>Assets</h2>
            <p className="panel-note">Upload media once, then paste the URL into any section image or social image field.</p>
          </div>
        </div>
        <div className="asset-upload">
          <TextInput label="Alt text for new upload" value={uploadAlt} onChange={setUploadAlt} />
          <label className="asset-file">
            Choose file
            <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,application/pdf" onChange={upload} />
          </label>
        </div>
        <div className="asset-grid">
          {data.assets.map((asset) => (
            <article key={asset.id} className="asset-card">
              {asset.kind === "image" ? <img src={asset.url} alt={asset.alt} /> : <div className="asset-preview-empty">{asset.kind}</div>}
              <p className="asset-meta">
                {asset.kind.toUpperCase()} - {asset.mimeType}
                {asset.width && asset.height ? ` - ${asset.width}x${asset.height}` : ""}
              </p>
              <label>
                URL
                <input value={asset.url} readOnly />
              </label>
              <button type="button" className="admin-secondary" onClick={() => void navigator.clipboard.writeText(asset.url)}>
                Copy URL
              </button>
              <label className="asset-file asset-replace">
                {replacingAssetId === asset.id ? "Replacing..." : "Replace file"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,application/pdf"
                  disabled={replacingAssetId === asset.id}
                  onChange={(event) => void replaceAssetFile(asset, event)}
                />
              </label>
              <TextInput label="Alt text" value={asset.alt} onChange={(alt) => updateAsset(asset.id, { alt })} />
              <TextInput label="Caption" value={asset.caption ?? ""} onChange={(caption) => updateAsset(asset.id, { caption })} />
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <main className="admin-studio">
      <header className="admin-topbar">
        <div>
          <span className="eyebrow">AigenLabs CMS</span>
          <h1>Content Studio</h1>
          <p className="panel-note">Edit landing content, blog posts, SEO, branding, navigation, footer, and media from one visual workspace.</p>
        </div>
        <div className="admin-user">
          <span>{userEmail}</span>
          <a href="/" target="_blank" rel="noreferrer" className="admin-secondary">View site</a>
          <button type="button" className="admin-secondary" onClick={logout}>Logout</button>
          <button type="button" className="admin-save" onClick={() => void save()}>Save changes</button>
        </div>
      </header>
      <nav className="admin-tabs" aria-label="Admin sections">
        {tabs.map((tab) => (
          <button key={tab} type="button" className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </nav>
      {status ? <div className="admin-status">{status}</div> : null}
      {activeTab === "Pages" ? renderPagesTab() : null}
      {activeTab === "Content" ? renderContentTab() : null}
      {activeTab === "Blog" ? renderBlogTab() : null}
      {activeTab === "SEO" ? renderSeoTab() : null}
      {activeTab === "Brand" ? renderBrandTab() : null}
      {activeTab === "Navigation" ? renderNavigationTab() : null}
      {activeTab === "Footer" ? renderFooterTab() : null}
      {activeTab === "Assets" ? renderAssetsTab() : null}
    </main>
  );
}
