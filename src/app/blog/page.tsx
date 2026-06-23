import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { tokensToCssVariables } from "@/design/tokens";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { getCmsData, getPublishedBlogPosts } from "@/lib/cms";
import { blogPostPath, estimateReadingMinutes, formatBlogDate, sortBlogPosts } from "@/lib/blog";
import { getLocalizedSiteSettings } from "@/lib/i18n";
import type { BlogPost } from "@/lib/types";
import { absoluteUrl } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const postsPerPage = 6;

interface BlogIndexPageProps {
  searchParams?: Promise<{ page?: string | string[] }>;
}

function firstSearchValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function pageHref(page: number) {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}

function BlogPostMeta({ post }: { post: BlogPost }) {
  return (
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
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="blog-card">
      {post.coverImage ? (
        <a className="blog-card-media" href={blogPostPath(post)} aria-label={post.title}>
          <img src={post.coverImage} alt={post.coverAlt || post.title} />
        </a>
      ) : null}
      <div className="blog-card-content">
        <BlogPostMeta post={post} />
        <h2><a href={blogPostPath(post)}>{post.title}</a></h2>
        <p>{post.excerpt}</p>
        <a className="blog-read-link" href={blogPostPath(post)}>
          Đọc bài viết
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCmsData();
  const settings = getLocalizedSiteSettings(data.settings, data.settings.defaultLocale);
  const publishedPosts = sortBlogPosts((data.blogPosts ?? []).filter((post) => post.status === "published"));
  const socialImage = publishedPosts[0]?.seo.ogImage || publishedPosts[0]?.coverImage || settings.brand.faviconUrl || "";
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
      images: socialImage ? [{ url: absoluteUrl(settings, socialImage) }] : []
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title: "Blog AigenLabs",
      description: "Kiến thức AI Agent, workflow, vận hành và tự động hóa doanh nghiệp.",
      images: socialImage ? [absoluteUrl(settings, socialImage)] : []
    }
  };
}

export default async function BlogIndexPage({ searchParams }: BlogIndexPageProps) {
  const data = await getCmsData();
  const settings = getLocalizedSiteSettings(data.settings, data.settings.defaultLocale);
  const posts = sortBlogPosts(await getPublishedBlogPosts());
  const latestPost = posts[0];
  const archivePosts = posts.slice(1);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const requestedPage = Number.parseInt(firstSearchValue(resolvedSearchParams.page) ?? "1", 10);
  const totalPages = Math.max(1, Math.ceil(archivePosts.length / postsPerPage));
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), totalPages) : 1;
  const pagedPosts = archivePosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);
  const recentPosts = posts.slice(0, 4);
  const categories = Array.from(
    posts.reduce((map, post) => {
      if (!post.category) return map;
      map.set(post.category, (map.get(post.category) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  );

  return (
    <div className="site-shell blog-shell" style={tokensToCssVariables(settings.brand.tokens)}>
      <SiteNav settings={settings} currentLocale={settings.defaultLocale} />
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
            <div className="blog-index-layout">
              <div className="blog-index-feed">
                {latestPost ? (
                  <article className="blog-featured-card">
                    {latestPost.coverImage ? (
                      <a className="blog-featured-media" href={blogPostPath(latestPost)} aria-label={latestPost.title}>
                        <img src={latestPost.coverImage} alt={latestPost.coverAlt || latestPost.title} />
                      </a>
                    ) : null}
                    <div className="blog-featured-content">
                      <span className="eyebrow">Bài mới nhất</span>
                      <BlogPostMeta post={latestPost} />
                      <h2><a href={blogPostPath(latestPost)}>{latestPost.title}</a></h2>
                      <p>{latestPost.excerpt}</p>
                      <a className="blog-read-link" href={blogPostPath(latestPost)}>
                        Đọc bài viết
                        <ArrowRight size={16} aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                ) : null}

                <div className="blog-section-heading">
                  <span className="eyebrow">Thư viện bài viết</span>
                  <h2>{archivePosts.length > 0 ? "Tất cả bài viết" : "Bài viết tiếp theo sẽ xuất hiện tại đây"}</h2>
                </div>

                {archivePosts.length > 0 ? (
                  <>
                    <div className="blog-grid blog-grid-feed">
                      {pagedPosts.map((post) => <BlogCard key={post.id} post={post} />)}
                    </div>
                    {totalPages > 1 ? (
                      <nav className="blog-pagination" aria-label="Blog pagination">
                        <a className={currentPage <= 1 ? "disabled" : undefined} href={pageHref(currentPage - 1)} aria-disabled={currentPage <= 1}>
                          Trước
                        </a>
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                          <a key={page} className={page === currentPage ? "active" : undefined} href={pageHref(page)} aria-current={page === currentPage ? "page" : undefined}>
                            {page}
                          </a>
                        ))}
                        <a className={currentPage >= totalPages ? "disabled" : undefined} href={pageHref(currentPage + 1)} aria-disabled={currentPage >= totalPages}>
                          Sau
                        </a>
                      </nav>
                    ) : null}
                  </>
                ) : (
                  <div className="blog-empty blog-empty-compact">
                    <p>CMS đã có bài đầu tiên. Khi xuất bản thêm bài, danh sách này sẽ tự chia trang sau mỗi {postsPerPage} bài.</p>
                  </div>
                )}
              </div>

              <aside className="blog-sidebar" aria-label="Blog overview">
                <section className="blog-sidebar-panel">
                  <h2>Bài mới</h2>
                  <div className="blog-recent-list">
                    {recentPosts.map((post) => (
                      <a key={post.id} href={blogPostPath(post)}>
                        <strong>{post.title}</strong>
                        <span>{formatBlogDate(post.publishedAt || post.updatedAt)}</span>
                      </a>
                    ))}
                  </div>
                </section>

                {categories.length > 0 ? (
                  <section className="blog-sidebar-panel">
                    <h2>Chủ đề</h2>
                    <div className="blog-category-list">
                      {categories.map(([category, count]) => (
                        <span key={category}>
                          {category}
                          <strong>{count}</strong>
                        </span>
                      ))}
                    </div>
                  </section>
                ) : null}
              </aside>
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
