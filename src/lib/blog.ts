import type { BlogPost } from "@/lib/types";

export function normalizeBlogSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function blogPostPath(postOrSlug: BlogPost | string): string {
  const slug = typeof postOrSlug === "string" ? postOrSlug : postOrSlug.slug;
  return `/blog/${slug}`;
}

export function estimateReadingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function sortBlogPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    const aDate = Date.parse(a.publishedAt || a.updatedAt || a.createdAt);
    const bDate = Date.parse(b.publishedAt || b.updatedAt || b.createdAt);
    return bDate - aDate;
  });
}

export function formatBlogDate(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

export function dateInputValue(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}
