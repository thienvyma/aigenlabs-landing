"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Phone,
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
const demoCtaHref =
  "mailto:edu@aigenlabs.vn?subject=Xem%20demo%2030%20phut%20AigenLabs%20Business%20OS";
const workflowConsultHref = "tel:+849****3456";

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
          Tập hợp dữ liệu, AI và quy trình để vận hành thông minh hơn.
        </p>
        <div className="about-hero-actions">
          <a className="about-btn about-btn-brand" href={demoCtaHref}>
            Xem demo 30 phút <ArrowRight size={18} aria-hidden="true" />
          </a>
          <a className="about-btn about-btn-outline" href={workflowConsultHref}>
            <Phone size={18} aria-hidden="true" /> Tư vấn workflow
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
    ["Tập trung Dữ liệu", Database],
    ["Chuẩn hoá Quy trình", Workflow],
  ] as const;
  const right = [
    ["Tự động tác vụ lặp lại", Bot],
    ["Ai làm việc & Bạn phê duyệt", BrainCircuit],
  ] as const;

  return (
    <article className="about-slide about-os-slide">
      <span className="about-slide-index">2</span>
      <header className="about-slide-header">
        <h2>AI Business OS</h2>
        <p>Vận hành gọn . ra quyêt định nhanh. Tăng trưởng có kiểm soát.</p>
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
    ["Dữ liệu phân tán", "Sales,marketing,khách hàng và vận hành không kết nối với nhau"],
    ["Quy trình chưa chuẩn hoá", "Nhiều việc phụ thuộc vào con người , khó theo dõi và khó bàn giao"],
    ["Thiếu góc nhìn điều hành", "Chủ doanh nghiệp khó biết vấn đề đang nằm ở đâu và ưu tiên việc gì"],
    ["Vận hành tốn nguồn lực", "Nguồn lực phân tán, kém hiệu quả"],
  ];
  const solutions = [
    ["Chuẩn hoá dữ liệu & hệ thống", "Một nguồn dữ liệu tin cậy"],
    ["Tự động Và tự động hoá quy trình", "Biến công việc lặp lại thành workflow rõ ràng , dễ theo dõi và tối ưu"],
    ["Dashboard & AI Insights", "Ra quyết định nhanh, chính xác"],
    ["Tăng hiệu suất vận hành", "Giảm thao tác thủ công , giảm sai sót và tăng năng suất đội ngũ"],
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
    ["01", "Khảo sát hiện trạng", "Hiểu rõ workflow và nhu cầu ưu tiên", Search],
    ["02", "Thiết kế Lộ trình", "xác dịnh bài toán trọng tâm , phạm vi và kế hoạch triển khai ", Settings2],
    ["03", "Triển khai & Tích hợp", "Kết nối dữ liệu và workflow trên Aigenlabs", Plug],
    ["04", "Vận hành & Tối ưu", "Đồng hành vận hành, đo lường và cải tiến", RefreshCcw],
    ["05", "Mở rộng quy mô", "nhân rộng worrkflow hiệu quả và mở rộng Ai agent theo phòng ban", Rocket],
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
        Triển khai theo từng giai đoạn, đo lường nhanh và cải tiến liên tục.
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
          <section className="q1"><strong>Tối ưu & Tăng tốc</strong><p>Tối ưu quy trình phức tạp, tăng trưởng hiệu quả</p></section>
          <section className="q2"><strong>Chuyển đổi toàn diện</strong><p>Chuẩn hoá quy trình rõ ràng và cải thiện tăng trưởng hiệu quả</p></section>
          <section className="q3"><strong>Khởi đầu số hóa</strong><p>Chuẩn hóa dữ liệu, quy trình và xây nền tảng nhân sự Ai Agent</p></section>
          <section className="q4"><strong>Tùy biến theo doanh nghiệp</strong><p>Giải pháp liền mạch theo đặc thù ngành nghề</p></section>
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
        <p className="role">Founder / Builder</p>
        <p>
          Tôi xây dựng AigenLabs với mục tiêu cố gắng hướng tới gần nhất mô hình one persion one business bằng cách kết hợp AI Agent: AI chỉ tạo ra giá trị khi được đặt vào đúng workflow, có dữ
          liệu rõ ràng, vai trò cụ thể và kiểm duyệt của con người.
        </p>
      </section>
      <section className="about-founder-stats" aria-label="Founder highlights">
        <div><ShieldCheck size={26} aria-hidden="true" /><strong>Data-first</strong><p>Khảo sát tập hợp dữ liệu</p></div>
        <div><Rocket size={26} aria-hidden="true" /><strong>Workflow thật</strong><p>Bắt đầu từ quy trình thật của doanh nghiệp</p></div>
        <div><UsersRound size={26} aria-hidden="true" /><strong>Human-in-loop</strong><p>Con người giữ quyền duyệt ở bước quan trọng</p></div>
        <div><HeartHandshake size={26} aria-hidden="true" /><strong>Thực dụng</strong><p>Ưu tiên kết quả kiểm chứng được thay vì tin tuyệt đối vào AI</p></div>
      </section>
      <aside className="about-why-card">
        <h3>Liên hệ AigenLabs</h3>
        <ul>
          <li>SĐT : 0981413456</li>
          <li>Địa chỉ : Khu phố 5 , Phường Tân Thành , Tp Hồ Chí Minh</li>
          <li>Email : Edu@aigenlabs.vn</li>
          <li>Website : Aigenlabs.vn </li>
        </ul>
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
      <FitSlide key="fit" />,
      <FounderSlide key="founder" />,
    ],
    [],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<"forward" | "back">("forward");
  const slideInteractionRef = useRef<HTMLDivElement | null>(null);
  const wheelLockRef = useRef(false);
  const progress = ((activeIndex + 1) / slides.length) * 100;
  const isFirstSlide = activeIndex === 0;
  const isLastSlide = activeIndex === slides.length - 1;

  useEffect(() => {
    const syncFromHash = () => {
      const match = window.location.hash.match(/^#slide-(\d+)$/);
      const hashIndex = match ? Number(match[1]) - 1 : 0;
      const nextIndex = Math.max(0, Math.min(slides.length - 1, hashIndex));
      setActiveIndex((currentIndex) => {
        if (nextIndex !== currentIndex) {
          setTransitionDirection(nextIndex > currentIndex ? "forward" : "back");
        }
        return nextIndex;
      });
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
    };
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
    if (nextIndex === activeIndex) {
      return;
    }

    setTransitionDirection(nextIndex > activeIndex ? "forward" : "back");
    setActiveIndex(nextIndex);
    window.history.pushState(null, "", `#slide-${nextIndex + 1}`);
  }, [activeIndex, slides.length]);

  const handleSlideWheel = useCallback((event: WheelEvent) => {
    const slideInteraction = slideInteractionRef.current;
    const interactionBounds = slideInteraction?.getBoundingClientRect();
    const isInsideInteraction = interactionBounds
      ? event.clientX >= interactionBounds.left
        && event.clientX <= interactionBounds.right
        && event.clientY >= interactionBounds.top
        && event.clientY <= interactionBounds.bottom
      : false;

    if (!isInsideInteraction) {
      return;
    }

    if (wheelLockRef.current || Math.abs(event.deltaY) < 24) {
      return;
    }

    const nextIndex = event.deltaY > 0 ? activeIndex + 1 : activeIndex - 1;
    if (nextIndex < 0 || nextIndex >= slides.length) {
      return;
    }

    event.preventDefault();
    wheelLockRef.current = true;
    goToSlide(nextIndex);
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 520);
  }, [activeIndex, goToSlide, slides.length]);

  useEffect(() => {
    const slideInteraction = slideInteractionRef.current;
    if (!slideInteraction) {
      return undefined;
    }

    slideInteraction.addEventListener("wheel", handleSlideWheel, { passive: false });
    return () => {
      slideInteraction.removeEventListener("wheel", handleSlideWheel);
    };
  }, [handleSlideWheel]);

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
              className="about-icon-button"
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
            >
              <Expand size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="about-slide-frame" aria-live="polite">
          <div
            ref={slideInteractionRef}
            key={activeIndex}
            className={`about-slide-interaction is-${transitionDirection}`}
          >
            {slides[activeIndex]}
            <div className="about-scroll-hint" aria-hidden="true">
              {isLastSlide ? "Cuộn lên để quay lại" : "Cuộn để chuyển slide"}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="about-slide-arrow about-slide-arrow-prev"
          onClick={() => goToSlide(activeIndex - 1)}
          disabled={isFirstSlide}
          aria-label="Slide trước"
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="about-slide-arrow about-slide-arrow-next"
          onClick={() => goToSlide(activeIndex + 1)}
          disabled={isLastSlide}
          aria-label="Slide tiếp theo"
        >
          <ArrowRight size={22} aria-hidden="true" />
        </button>

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
