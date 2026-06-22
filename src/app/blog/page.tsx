import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { tokensToCssVariables } from "@/design/tokens";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { getCmsData, getPublishedBlogPosts } from "@/lib/cms";
import { blogPostPath, estimateReadingMinutes, formatBlogDate, sortBlogPosts } from "@/lib/blog";
import { getLocalizedSiteSettings } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCmsData();
  const settings = getLocalizedSiteSettings(data.settings, data.settings.defaultLocale);
  const canonical = absoluteUrl(settings, "/blog");
  return {
    title: "Blog AigenLabs - AI Agent, workflow và Business OS",
    description:
      "Bài viết chuyên sâu từ AigenLabs về AI Agent, workflow, connector, vận hành Business OS và ứng dụng AI an toàn trong doanh nghiệp.",
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: settings.siteName,
      title: "Blog AigenLabs",
      description: "Kiến thức AI Agent, workflow, vận hành và tự động hóa doanh nghiệp.",
      images: settings.brand.faviconUrl ? [{ url: absoluteUrl(settings, settings.brand.faviconUrl) }] : []
    },
    twitter: {
      card: "summary",
      title: "Blog AigenLabs",
      description: "Kiến thức AI Agent, workflow, vận hành và tự động hóa doanh nghiệp."
    }
  };
}

export default async function BlogIndexPage() {
  const data = await getCmsData();
  const settings = getLocalizedSiteSettings(data.settings, data.settings.defaultLocale);
  const posts = sortBlogPosts(await getPublishedBlogPosts());

  return (
    <div className="site-shell blog-shell" style={tokensToCssVariables(settings.brand.tokens)}>
      <SiteNav settings={settings} currentLocale={settings.defaultLocale} currentPath="/blog" />
      <main className="blog-index-main">
        <section className="blog-hero">
          <div className="container-feature blog-hero-inner">
            <span className="eyebrow">AigenLabs blog</span>
            <h1>Góc nhìn thực tế về AI Agent và workflow doanh nghiệp</h1>
            <p>
              Các bài viết giúp founder, operator và team vận hành hiểu cách chọn use case,
              thiết kế approval, kết nối dữ liệu và đo hiệu quả AI Agent một cách an toàn.
            </p>
          </div>
        </section>

        <section className="container-feature blog-list-section" aria-label="Published blog posts">
          {posts.length > 0 ? (
            <div className="blog-grid">
              {posts.map((post) => (
                <article key={post.id} className="blog-card">
                  {post.coverImage ? (
                    <a className="blog-card-media" href={blogPostPath(post)} aria-label={post.title}>
                      <img src={post.coverImage} alt={post.coverAlt || post.title} />
                    </a>
                  ) : null}
                  <div className="blog-card-content">
                    <div className="blog-card-meta">
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
                    <h2><a href={blogPostPath(post)}>{post.title}</a></h2>
                    <p>{post.excerpt}</p>
                    <a className="blog-read-link" href={blogPostPath(post)}>
                      Đọc bài viết
                      <ArrowRight size={16} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="blog-empty">
              <span className="eyebrow">Chưa xuất bản</span>
              <h2>Blog đang chờ bài viết đầu tiên</h2>
              <p>Admin có thể tạo bài trong CMS, chuyển trạng thái sang Published và bài sẽ xuất hiện tại đây.</p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
