"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import type { PlatformFeaturesContent } from "@/lib/types";
import { CmsMediaFrame } from "@/components/landing/CmsMediaFrame";
import { IconGlyph } from "@/components/landing/IconGlyph";
import { cx } from "@/lib/utils";

type PlatformFeature = PlatformFeaturesContent["features"][number];

interface PlatformFeaturesSectionProps {
  id: string;
  content: PlatformFeaturesContent;
}

interface FeatureMediaProps {
  title: string;
  media?: PlatformFeature["media"];
}

function FeatureMedia({ title, media }: FeatureMediaProps) {
  return (
    <CmsMediaFrame
      media={media}
      fallbackTitle={media?.title || title}
      fallbackLabel={media?.label || "Platform"}
      compact
    />
  );
}

function FeatureCopy({ feature }: { feature: PlatformFeature }) {
  return (
    <div className="platform-showcase-copy">
      <div className="platform-feature-label">
        <span className="feature-icon">
          <IconGlyph name={feature.icon} />
        </span>
        <span>{feature.title}</span>
      </div>
      <h3>
        {feature.title}
        {feature.badge ? <span>{feature.badge}</span> : null}
      </h3>
      <p>{feature.description}</p>
      {feature.slides.length ? (
        <div className="platform-showcase-steps">
          {feature.slides.slice(0, 3).map((slide) => (
            <span key={slide}>{slide}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PlatformSlide({ feature }: { feature: PlatformFeature }) {
  return (
    <>
      <FeatureCopy feature={feature} />
      <div className="platform-showcase-media">
        <div className="platform-media-stage">
          <FeatureMedia title={feature.title} media={feature.media} />
        </div>
      </div>
    </>
  );
}

function stackLayerStyle(rawOffset: number): CSSProperties {
  const depth = Math.max(-1, Math.min(rawOffset, 3));
  const metrics =
    depth < 0
      ? {
          y: "-76px",
          hoverY: "-76px",
          scale: "0.965",
          hoverScale: "0.965",
          opacity: "0",
          hoverOpacity: "0",
          blur: "2px",
          zIndex: 0
        }
      : depth === 0
        ? {
            y: "0px",
            hoverY: "0px",
            scale: "1",
            hoverScale: "1",
            opacity: "1",
            hoverOpacity: "1",
            blur: "0px",
            zIndex: 40
          }
        : depth === 1
          ? {
              y: "32px",
              hoverY: "44px",
              scale: "0.973",
              hoverScale: "0.975",
              opacity: "0.82",
              hoverOpacity: "0.94",
              blur: "0px",
              zIndex: 30
            }
          : depth === 2
            ? {
                y: "62px",
                hoverY: "82px",
                scale: "0.946",
                hoverScale: "0.95",
                opacity: "0.5",
                hoverOpacity: "0.72",
                blur: "0px",
                zIndex: 20
              }
            : {
                y: "96px",
                hoverY: "112px",
                scale: "0.92",
                hoverScale: "0.92",
                opacity: "0",
                hoverOpacity: "0",
                blur: "1px",
                zIndex: 0
              };

  return {
    "--stack-y": metrics.y,
    "--stack-hover-y": metrics.hoverY,
    "--stack-scale": metrics.scale,
    "--stack-hover-scale": metrics.hoverScale,
    "--stack-opacity": metrics.opacity,
    "--stack-hover-opacity": metrics.hoverOpacity,
    "--stack-blur": metrics.blur,
    "--stack-z-index": metrics.zIndex
  } as CSSProperties;
}

export function PlatformFeaturesSection({ id, content }: PlatformFeaturesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [motionDirection, setMotionDirection] = useState<1 | -1>(1);
  const [stackPointerReady, setStackPointerReady] = useState(false);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const wheelLockRef = useRef(0);
  const stackPointerIntentRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastDocumentScrollAtRef = useRef(0);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const features = content.features;
  const activeFeature = features[activeIndex] ?? features[0];
  const previousFeature = previousIndex === null ? null : features[previousIndex] ?? null;

  const activateFeature = useCallback(
    (nextIndex: number, direction?: 1 | -1) => {
      if (nextIndex === activeIndex || nextIndex < 0 || nextIndex >= features.length) return;
      setMotionDirection(direction ?? (nextIndex > activeIndex ? 1 : -1));
      setPreviousIndex(activeIndex);
      setActiveIndex(nextIndex);

      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      transitionTimerRef.current = setTimeout(() => {
        setPreviousIndex(null);
      }, 760);
    },
    [activeIndex, features.length]
  );

  const markStackPointerIntent = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    stackPointerIntentRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: Date.now()
    };
    setStackPointerReady(true);
  }, []);

  const clearStackPointerIntent = useCallback(() => {
    stackPointerIntentRef.current = null;
    setStackPointerReady(false);
  }, []);

  useEffect(() => {
    chipRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  }, [activeIndex]);

  useEffect(() => {
    const node = stackRef.current;
    if (!node || features.length < 2) return undefined;
    const stackNode = node;

    function handleWheel(event: WheelEvent) {
      if (event.ctrlKey || Math.abs(event.deltaY) < 12 || Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
        return;
      }

      const stackBounds = stackNode.getBoundingClientRect();
      const isPointerInsideStack =
        event.clientX >= stackBounds.left &&
        event.clientX <= stackBounds.right &&
        event.clientY >= stackBounds.top &&
        event.clientY <= stackBounds.bottom;

      if (!isPointerInsideStack) return;

      const now = Date.now();
      const pointerIntent = stackPointerIntentRef.current;
      const hasStackPointerIntent = Boolean(
        pointerIntent &&
          pointerIntent.time >= lastDocumentScrollAtRef.current &&
          now - pointerIntent.time < 8000 &&
          Math.hypot(pointerIntent.x - event.clientX, pointerIntent.y - event.clientY) <= 28
      );

      if (!hasStackPointerIntent) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = activeIndex + direction;
      const canMoveWithinStack = nextIndex >= 0 && nextIndex < features.length;
      if (!canMoveWithinStack) return;

      event.preventDefault();
      event.stopPropagation();

      if (now - wheelLockRef.current < 680) return;

      wheelLockRef.current = now;
      activateFeature(nextIndex, direction);
    }

    stackNode.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      stackNode.removeEventListener("wheel", handleWheel);
    };
  }, [activateFeature, activeIndex, features.length]);

  useEffect(() => {
    function resetPointerIntentAfterPageScroll() {
      lastDocumentScrollAtRef.current = Date.now();
      stackPointerIntentRef.current = null;
      setStackPointerReady(false);
    }

    window.addEventListener("scroll", resetPointerIntentAfterPageScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", resetPointerIntentAfterPageScroll);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  if (!activeFeature) return null;

  function moveFeature(direction: 1 | -1) {
    activateFeature(activeIndex + direction, direction);
  }

  return (
    <section id={id} className="platform section-anchor section-pad">
      <div className="container-feature">
        <div className="section-intro">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 id={`${id}-heading`} className="section-heading">
            {content.heading}
          </h2>
          <p className="section-copy">{content.description}</p>
        </div>
        <div className="platform-chip-rail-scroll" role="tablist" aria-label={content.heading}>
          <div className="platform-chip-rail">
            {features.map((feature, index) => (
              <button
                key={feature.title}
                ref={(node) => {
                  chipRefs.current[index] = node;
                }}
                id={`${id}-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-controls={`${id}-panel`}
                className={cx("platform-chip", activeIndex === index && "platform-chip-active")}
                onClick={() => activateFeature(index)}
              >
                {feature.title}
              </button>
            ))}
          </div>
        </div>
        <article
          id={`${id}-panel`}
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`${id}-tab-${activeIndex}`}
          className={cx(
            "platform-showcase",
            previousFeature && "platform-showcase-transitioning",
            motionDirection === -1 && "platform-showcase-reverse"
          )}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
              event.preventDefault();
              moveFeature(1);
            }
            if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
              event.preventDefault();
              moveFeature(-1);
            }
          }}
        >
          <div
            ref={stackRef}
            className={cx("platform-real-stack", stackPointerReady && "platform-real-stack-pointer-ready")}
            onPointerMove={markStackPointerIntent}
            onPointerLeave={clearStackPointerIntent}
          >
            {features.map((feature, index) => {
              const rawOffset = index - activeIndex;
              const depth = rawOffset < 0 ? "before" : rawOffset > 2 ? "hidden" : String(rawOffset);
              return (
                <div
                  key={feature.title}
                  className={cx(
                    "platform-stack-card",
                    rawOffset === 0 && "platform-stack-card-active",
                    rawOffset < 0 && "platform-stack-card-before",
                    rawOffset > 2 && "platform-stack-card-hidden"
                  )}
                  data-depth={depth}
                  style={stackLayerStyle(rawOffset)}
                  aria-hidden={rawOffset !== 0}
                >
                  <PlatformSlide feature={feature} />
                </div>
              );
            })}
          </div>
          {features.length > 1 ? <p className="platform-scroll-hint">↕ Cuộn chuột trên thẻ để chuyển đổi</p> : null}
          {features.length > 1 ? (
            <div className="platform-showcase-controls" aria-label="Platform feature slides">
              {features.map((feature, index) => (
                <button
                  key={feature.title}
                  type="button"
                  className={cx(index === activeIndex && "active")}
                  aria-label={`Show ${feature.title}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => activateFeature(index)}
                />
              ))}
            </div>
          ) : null}
        </article>
      </div>
    </section>
  );
}
