import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { tokensToCssVariables } from "@/design/tokens";
import { BlogBody } from "@/components/landing/BlogBody";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { getBlogPostBySlug, getCmsData, getPublishedBlogPosts } from "@/lib/cms";
import { blogPostPath, estimateReadingMinutes, formatBlogDate, sortBlogPosts } from "@/lib/blog";
import { getLocalizedSiteSettings } from "@/lib/i18n";
import { blogPostMetadata, jsonLdForBlogPost } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCmsData();
  const settings = getLocalizedSiteSettings(data.settings, data.settings.defaultLocale);
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return blogPostMetadata(settings, post);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const data = await getCmsData();
  const settings = getLocalizedSiteSettings(data.settings, data.settings.defaultLocale);
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = sortBlogPosts(await getPublishedBlogPosts())
    .filter((entry) => entry.id !== post.id)
    .slice(0, 3);
  const schema = jsonLdForBlogPost(settings, post);

  return (
    <div className="site-shell blog-shell" style={tokensToCssVariables(settings.brand.tokens)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteNav settings={settings} currentLocale={settings.defaultLocale} currentPath="/blog" />
      <main className="blog-article-main">
        <article className="blog-article">
          <header className="container-faq blog-article-header">
            <a className="blog-back-link" href="/blog">
              <ArrowLeft size={16} aria-hidden="true" />
              Blog
            </a>
            <div className="blog-article-meta">
              {post.category ? <span>{post.category}</span> : null}
              {post.publishedAt ? (
                <span>
                  <CalendarDays size={15} aria-hidden="true" />
                  {formatBlogDate(post.publishedAt)}
                </span>
              ) : null}
              <span>
                <Clock size={15} aria-hidden="true" />
                {estimateReadingMinutes(post.body)} phút đọc
              </span>
            </div>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <div className="blog-author">Bởi {post.authorName || settings.brand.name}</div>
          </header>

          {post.coverImage ? (
            <div className="container-feature blog-cover">
              <img src={post.coverImage} alt={post.coverAlt || post.title} />
            </div>
          ) : null}

          <div className="container-faq">
            <BlogBody body={post.body} />
          </div>
        </article>

        {relatedPosts.length > 0 ? (
          <section className="container-feature blog-related" aria-label="Related blog posts">
            <div className="blog-related-head">
              <span className="eyebrow">Đọc thêm</span>
              <h2>Bài viết liên quan</h2>
            </div>
            <div className="blog-grid blog-grid-compact">
              {relatedPosts.map((entry) => (
                <article key={entry.id} className="blog-card">
                  <div className="blog-card-content">
                    <div className="blog-card-meta">
                      {entry.category ? <span>{entry.category}</span> : null}
                      <span>{formatBlogDate(entry.publishedAt || entry.updatedAt)}</span>
                    </div>
                    <h3><a href={blogPostPath(entry)}>{entry.title}</a></h3>
                    <p>{entry.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
