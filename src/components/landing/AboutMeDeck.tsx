"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  Database,
  Expand,
  Gauge,
  HeartHandshake,
  Plug,
  RefreshCcw,
  Rocket,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Workflow,
} from "lucide-react";

const founderImage = "/about-me/founder-character.png";

interface IconBadgeProps {
  children: ReactNode;
}

function IconBadge({ children }: IconBadgeProps) {
  return <span className="about-icon-badge">{children}</span>;
}

function HeroSlide() {
  return (
    <article className="about-slide about-hero-slide">
      <span className="about-slide-index">1</span>
      <div className="about-hero-copy">
        <div className="about-brand-lockup">
          <img src="/brand/aigenlabs-icon-primary.svg" alt="" aria-hidden="true" />
          <strong>AigenLabs</strong>
        </div>
        <span className="about-pill">AI BUSINESS OS</span>
        <h1>
          The AI Business OS
          <br />
          for Vietnamese
          <br />
          Enterprises
        </h1>
        <p>
          Hợp nhất dữ liệu, AI và quy trình để vận hành thông minh hơn, tăng
          trưởng nhanh hơn.
        </p>
        <div className="about-hero-actions">
          <a className="about-btn about-btn-brand" href="mailto:hello@aigenlabs.co">
            Liên hệ tư vấn <ArrowRight size={18} aria-hidden="true" />
          </a>
          <span className="about-meta">AigenLabs Co., Ltd. · Ho Chi Minh City, Vietnam</span>
        </div>
      </div>
      <div className="about-os-visual" aria-hidden="true">
        <IconBadge>
          <UsersRound size={24} />
        </IconBadge>
        <IconBadge>
          <Sparkles size={24} />
        </IconBadge>
        <IconBadge>
          <Workflow size={24} />
        </IconBadge>
        <IconBadge>
          <BarChart3 size={24} />
        </IconBadge>
        <div className="about-stack-layer layer-one" />
        <div className="about-stack-layer layer-two" />
        <div className="about-stack-layer layer-three" />
        <div className="about-stack-layer layer-four" />
        <div className="about-stack-layer layer-five" />
      </div>
    </article>
  );
}

function BusinessOsSlide() {
  const left = [
    ["Dữ liệu hợp nhất", Database],
    ["Quy trình chuẩn hóa", Workflow],
    ["Ứng dụng & Hệ thống", Boxes],
    ["Con người & Vai trò", UsersRound],
  ] as const;
  const right = [
    ["Tự động hóa thông minh", Bot],
    ["Ra quyết định dựa trên AI", BrainCircuit],
    ["Trải nghiệm khách hàng", HeartHandshake],
    ["Tăng trưởng bền vững", Rocket],
  ] as const;

  return (
    <article className="about-slide about-os-slide">
      <span className="about-slide-index">2</span>
      <header className="about-slide-header">
        <h2>AI Business OS</h2>
        <p>Hợp nhất. Thông minh. Tăng trưởng.</p>
      </header>
      <div className="about-hub">
        <div className="about-hub-column">
          {left.map(([label, Icon]) => (
            <div className="about-hub-node" key={label}>
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="about-hub-center">
          <strong>AI</strong>
          <span>Business OS</span>
        </div>
        <div className="about-hub-column">
          {right.map(([label, Icon]) => (
            <div className="about-hub-node" key={label}>
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="about-feature-strip">
        <span>Bảo mật cấp doanh nghiệp</span>
        <span>Triển khai linh hoạt</span>
        <span>Đo lường & tối ưu liên tục</span>
      </div>
    </article>
  );
}

function ProblemSlide() {
  const problems = [
    ["Dữ liệu phân tán", "Không đồng nhất, khó khai thác"],
    ["Quy trình thủ công", "Tốn thời gian, dễ sai sót"],
    ["Thiếu góc nhìn tổng thể", "Khó ra quyết định kịp thời"],
    ["Chi phí vận hành cao", "Nguồn lực phân tán, kém hiệu quả"],
  ];
  const solutions = [
    ["Hợp nhất dữ liệu & hệ thống", "Một nguồn dữ liệu tin cậy"],
    ["Tự động hóa thông minh", "Giảm thời gian, tăng độ chính xác"],
    ["Dashboard & AI Insights", "Ra quyết định nhanh, chính xác"],
    ["Tối ưu chi phí vận hành", "Tăng năng suất, tối đa hiệu quả"],
  ];

  return (
    <article className="about-slide about-problem-slide">
      <span className="about-slide-index">3</span>
      <header className="about-slide-header">
        <h2>Vấn đề & Giải pháp</h2>
      </header>
      <div className="about-compare">
        <section className="about-compare-panel challenge">
          <h3>Thách thức</h3>
          {problems.map(([title, copy]) => (
            <div className="about-compare-row" key={title}>
              <span />
              <strong>{title}</strong>
              <p>{copy}</p>
            </div>
          ))}
        </section>
        <div className="about-compare-arrow">
          <ArrowRight size={28} aria-hidden="true" />
        </div>
        <section className="about-compare-panel solution">
          <h3>Giải pháp với AigenLabs</h3>
          {solutions.map(([title, copy]) => (
            <div className="about-compare-row" key={title}>
              <CheckCircle2 size={18} aria-hidden="true" />
              <strong>{title}</strong>
              <p>{copy}</p>
            </div>
          ))}
        </section>
      </div>
      <p className="about-slide-note">
        AigenLabs giúp doanh nghiệp chuyển đổi từ vận hành rời rạc sang tăng
        trưởng có hệ thống.
      </p>
    </article>
  );
}

function ProcessSlide() {
  const steps = [
    ["01", "Khảo sát & Đánh giá", "Hiểu rõ mô hình và nhu cầu doanh nghiệp", Search],
    ["02", "Thiết kế giải pháp & Lộ trình", "Xây dựng giải pháp phù hợp và khả thi", Settings2],
    ["03", "Triển khai & Tích hợp", "Kết nối hệ thống, đào tạo và chuyển giao", Plug],
    ["04", "Vận hành & Tối ưu", "Đồng hành vận hành, đo lường và cải tiến", RefreshCcw],
    ["05", "Mở rộng & Tăng trưởng", "Mở rộng năng lực, đổi mới và bứt phá", Rocket],
  ] as const;

  return (
    <article className="about-slide about-process-slide">
      <span className="about-slide-index">4</span>
      <header className="about-slide-header">
        <h2>Quy trình triển khai</h2>
        <p>Nhanh chóng. Linh hoạt. Hiệu quả.</p>
      </header>
      <div className="about-steps">
        {steps.map(([number, title, copy, Icon]) => (
          <section className="about-step" key={number}>
            <Icon size={24} aria-hidden="true" />
            <strong>{number}</strong>
            <h3>{title}</h3>
            <p>{copy}</p>
          </section>
        ))}
      </div>
      <div className="about-brand-callout">
        Phương pháp Agile - triển khai theo từng giai đoạn, tối ưu giá trị liên tục.
      </div>
    </article>
  );
}

function PlatformSlide() {
  const tabs = [
    "CRM & Sales",
    "Marketing Automation",
    "Service & Support",
    "Project & Workflow",
    "Finance & Operation",
    "People & Culture",
    "AI & Analytics",
  ];
  const metrics = [
    ["Doanh thu", "128.6B", "+24.5%"],
    ["Khách hàng mới", "2,345", "+18.2%"],
    ["Hiệu suất CSKH", "96.7%", "+12.1%"],
    ["Tự động hóa", "78%", "+15.3%"],
  ];

  return (
    <article className="about-slide about-platform-slide">
      <span className="about-slide-index">5</span>
      <header className="about-slide-header">
        <h2>Năng lực nền tảng</h2>
        <p>Một nền tảng toàn diện cho mọi phòng ban.</p>
      </header>
      <div className="about-platform-layout">
        <aside className="about-tabs">
          {tabs.map((tab, index) => (
            <span className={index === 0 ? "active" : undefined} key={tab}>
              {tab}
            </span>
          ))}
        </aside>
        <div className="about-dashboard">
          <div className="about-metrics">
            {metrics.map(([label, value, delta]) => (
              <section key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <em>{delta}</em>
              </section>
            ))}
          </div>
          <div className="about-chart-row">
            <div className="about-line-chart">
              <svg viewBox="0 0 360 190" aria-hidden="true">
                <polyline points="12,142 48,92 86,118 124,55 162,112 204,76 246,143 292,82 348,46" />
              </svg>
            </div>
            <div className="about-donut-wrap">
              <div className="about-donut" />
              <ul>
                <li>Website <b>40%</b></li>
                <li>Referral <b>25%</b></li>
                <li>Campaign <b>18%</b></li>
                <li>Other <b>10%</b></li>
              </ul>
            </div>
          </div>
          <div className="about-mini-stats">
            <span><b>12.6%</b>Tỷ lệ chuyển đổi</span>
            <span><b>2.8M</b>Giá trị đơn hàng TB</span>
            <span><b>85.4%</b>Tỷ lệ giữ chân KH</span>
            <span><b>72</b>NPS</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function FitSlide() {
  const industries = [
    "Bán lẻ & Thương mại",
    "Sản xuất",
    "Dịch vụ chuyên nghiệp",
    "Giáo dục",
    "Y tế",
    "Bất động sản",
    "Logistics",
  ];

  return (
    <article className="about-slide about-fit-slide">
      <span className="about-slide-index">6</span>
      <header className="about-slide-header">
        <h2>Phù hợp khách hàng</h2>
        <p>AigenLabs phù hợp với nhiều mô hình doanh nghiệp.</p>
      </header>
      <div className="about-fit-layout">
        <div className="about-matrix">
          <span className="axis-y">Quy mô doanh nghiệp</span>
          <span className="axis-x">Mức độ phức tạp quy trình</span>
          <section className="q1"><strong>Tối ưu & Tăng tốc</strong><p>Tối ưu quy trình phức tạp, tăng trưởng hiệu quả</p></section>
          <section className="q2"><strong>Chuyển đổi toàn diện</strong><p>Hợp nhất hệ thống, tái thiết quy trình và tăng trưởng bứt phá</p></section>
          <section className="q3"><strong>Khởi đầu số hóa</strong><p>Chuẩn hóa dữ liệu, quy trình và xây nền tảng số</p></section>
          <section className="q4"><strong>Tùy biến & Đột phá</strong><p>Giải pháp liền mạch theo đặc thù ngành nghề</p></section>
          <i className="point p1" />
          <i className="point p2" />
          <i className="point p3" />
          <i className="point p4" />
        </div>
        <aside className="about-industries">
          <h3>Ngành tiêu biểu</h3>
          {industries.map((industry) => (
            <span key={industry}>{industry}</span>
          ))}
        </aside>
      </div>
      <p className="about-slide-note">Linh hoạt theo ngành - Tối ưu theo quy mô - Đồng hành dài hạn.</p>
    </article>
  );
}

function FounderSlide() {
  return (
    <article className="about-slide about-founder-slide">
      <span className="about-slide-index">7</span>
      <div className="about-founder-portrait">
        <span />
        <img
          src={founderImage}
          alt="Nhân vật nam hoạt hình đại diện Huỳnh Vỹ"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
        />
      </div>
      <section className="about-founder-copy">
        <div className="about-founder-title">
          <h2>Người sáng lập</h2>
          <span>Về AigenLabs</span>
        </div>
        <h3>Huỳnh Vỹ</h3>
        <p className="role">Founder & CEO</p>
        <p>
          Với hơn 10 năm kinh nghiệm trong công nghệ và tư vấn chuyển đổi số,
          tôi tin rằng AI chỉ thực sự tạo ra giá trị khi được đặt đúng vào bối
          cảnh kinh doanh và quy trình vận hành của doanh nghiệp.
        </p>
        <p>
          AigenLabs ra đời với sứ mệnh trở thành hệ điều hành AI cho doanh
          nghiệp Việt, giúp họ vận hành thông minh hơn, ra quyết định nhanh hơn
          và tăng trưởng bền vững.
        </p>
      </section>
      <section className="about-founder-stats" aria-label="Founder highlights">
        <div><ShieldCheck size={26} aria-hidden="true" /><strong>10+ năm</strong><p>Kinh nghiệm công nghệ & tư vấn</p></div>
        <div><Rocket size={26} aria-hidden="true" /><strong>50+</strong><p>Dự án triển khai thành công</p></div>
        <div><UsersRound size={26} aria-hidden="true" /><strong>20+</strong><p>Khách hàng doanh nghiệp tin tưởng đồng hành</p></div>
        <div><HeartHandshake size={26} aria-hidden="true" /><strong>1 mục tiêu</strong><p>Giúp doanh nghiệp Việt bứt phá với AI</p></div>
      </section>
      <aside className="about-why-card">
        <h3>Vì sao chọn AigenLabs?</h3>
        <ul>
          <li>Hiểu doanh nghiệp Việt</li>
          <li>Giải pháp thực tiễn, dễ áp dụng</li>
          <li>Công nghệ AI tiên tiến, an toàn</li>
          <li>Đồng hành dài hạn, tạo giá trị thật</li>
        </ul>
        <blockquote>
          Chúng tôi không chỉ cung cấp phần mềm. Chúng tôi đồng hành để kiến tạo
          năng lực vận hành và tăng trưởng mới cho doanh nghiệp.
        </blockquote>
      </aside>
    </article>
  );
}

export function AboutMeDeck() {
  const slides = useMemo(
    () => [
      <HeroSlide key="hero" />,
      <BusinessOsSlide key="business-os" />,
      <ProblemSlide key="problem" />,
      <ProcessSlide key="process" />,
      <PlatformSlide key="platform" />,
      <FitSlide key="fit" />,
      <FounderSlide key="founder" />,
    ],
    [],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const progress = ((activeIndex + 1) / slides.length) * 100;

  useEffect(() => {
    const syncFromHash = () => {
      const match = window.location.hash.match(/^#slide-(\d+)$/);
      const hashIndex = match ? Number(match[1]) - 1 : 0;
      setActiveIndex(Math.max(0, Math.min(slides.length - 1, hashIndex)));
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
    };
  }, [slides.length]);

  const goToSlide = (index: number) => {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
    setActiveIndex(nextIndex);
    window.history.pushState(null, "", `#slide-${nextIndex + 1}`);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen?.();
      return;
    }
    void document.exitFullscreen?.();
  };

  return (
    <main className="about-me-page">
      <section className="about-me-shell" aria-label="AigenLabs about me presentation">
        <div className="about-topbar">
          <a className="about-logo" href="/" aria-label="AigenLabs home">
            <img src="/brand/aigenlabs-icon-primary.svg" alt="" aria-hidden="true" />
            <span>AigenLabs</span>
          </a>
          <div className="about-progress" aria-label="Deck progress">
            <strong>{activeIndex + 1} / {slides.length}</strong>
            <span><i style={{ width: `${progress}%` }} /></span>
          </div>
          <div className="about-actions" aria-label="Slide actions">
            <button
              type="button"
              className="about-btn about-btn-outline"
              onClick={() => goToSlide(activeIndex - 1)}
              disabled={activeIndex === 0}
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Back
            </button>
            <button
              type="button"
              className="about-btn about-btn-brand"
              onClick={() => goToSlide(activeIndex + 1)}
              disabled={activeIndex === slides.length - 1}
            >
              Next
              <ArrowRight size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="about-icon-button"
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
            >
              <Expand size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="about-slide-frame" aria-live="polite">
          {slides[activeIndex]}
        </div>

        <div className="about-slide-dots" aria-label="Slide navigation">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={index === activeIndex ? "active" : undefined}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex ? "step" : undefined}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
