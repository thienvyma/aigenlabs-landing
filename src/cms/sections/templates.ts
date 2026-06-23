import type { CmsSection, EditableMedia } from "@/lib/types";
import { sectionLabels, type SectionType } from "@/cms/sections/schema";

export const landingMediaPlaceholders = {
  heroCommandCenter: "/uploads/landing-media/current/hero-business-os-command-center.webp",
  useCasePrecision: "/uploads/landing-media/current/usecase-precision-workflow-map.webp",
  platformAgentHub: "/uploads/landing-media/current/platform-agent-hub-ai-agent.webp"
} as const;

export function newCmsId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function createEditableMedia(title: string, label: string, alt = `${title} media`, url = ""): EditableMedia {
  return {
    kind: "image",
    title,
    label,
    alt,
    url,
    poster: ""
  };
}

export function createSectionTemplate(type: SectionType, order: number): CmsSection {
  const id = newCmsId(type);
  const base = {
    id,
    type,
    name: sectionLabels[type],
    key: id,
    enabled: true,
    order
  };

  switch (type) {
    case "hero":
      return {
        ...base,
        content: {
          wordmark: "AigenLabs",
          headline: "Build, run, and manage AI agents for real work",
          subheadline: "Describe the page promise in one or two clear sentences.",
          chips: [{ label: "Fast setup", enabled: true }],
          primaryCta: { label: "Email us", href: "mailto:edu@aigenlabs.vn", enabled: true },
          secondaryCta: { label: "Call", href: "tel:+84981413456", enabled: true },
          preview: createEditableMedia(
            "AigenLabs workspace",
            "AigenLabs preview",
            "AigenLabs workspace preview",
            landingMediaPlaceholders.heroCommandCenter
          )
        }
      };
    case "useCaseTabs":
      return {
        ...base,
        content: {
          heading: "Built for every business need",
          tabs: [{
            label: "Research",
            title: "Turn questions into action",
            description: "Explain this use case.",
            mediaTitle: "Research workspace",
            media: createEditableMedia(
              "Research workspace",
              "Research",
              "Research workspace preview",
              landingMediaPlaceholders.useCasePrecision
            )
          }]
        }
      };
    case "platformFeatures":
      return {
        ...base,
        content: {
          eyebrow: "Platform",
          heading: "Everything you need in one place",
          description: "Summarize the platform value.",
          features: [{
            title: "Agent Hub",
            description: "Explain this feature.",
            icon: "bot",
            layout: "normal",
            badge: "",
            slides: ["Profiles", "Routing", "Controls"],
            media: createEditableMedia(
              "Agent Hub",
              "Platform preview",
              "Agent Hub feature preview",
              landingMediaPlaceholders.platformAgentHub
            )
          }]
        }
      };
    case "releaseNotes":
      return {
        ...base,
        content: {
          heading: "Từ setup đến vận hành trong từng bước rõ ràng",
          viewAllLabel: "Xem cách hoạt động",
          viewAllHref: "#releases",
          items: [{ version: "Bước 1", date: "Tên bước", bullets: ["Mô tả việc cần làm."] }]
        }
      };
    case "securityCards":
      return {
        ...base,
        content: {
          eyebrow: "Security",
          heading: "Stay in control",
          description: "Explain how teams keep control.",
          cards: [{ title: "Approvals", description: "Review sensitive actions before they run.", icon: "check" }],
          cta: { label: "Explore security controls", href: "#security", enabled: true },
          note: ""
        }
      };
    case "conversionCards":
      return {
        ...base,
        content: {
          eyebrow: "Business value",
          heading: "Turn AI into practical operations",
          description: "Use this section for pain points, benefits, offers, or a final CTA.",
          variant: "default",
          cards: [{
            title: "Clear workflow",
            description: "Describe the business outcome this card supports.",
            icon: "check",
            bullets: ["Input", "Output", "Approval"]
          }],
          cta: { label: "Đặt lịch tư vấn", href: "mailto:edu@aigenlabs.vn", enabled: true },
          note: ""
        }
      };
    case "faq":
      return {
        ...base,
        content: {
          heading: "FAQ",
          items: [{ question: "What can I edit?", answer: "You can edit pages, sections, SEO, navigation, footer, images, and brand tokens.", linkLabel: "", linkHref: "" }]
        }
      };
    case "floatingDock":
      return {
        ...base,
        content: {
          showHelper: true,
          showBackToTop: true,
          backToTopLabel: "Về đầu trang",
          helperLabel: "Hỗ trợ",
          helperTooltip: "Mở kênh hỗ trợ",
          helperIcon: "support",
          contacts: [
            { label: "Email", href: "mailto:edu@aigenlabs.vn", icon: "email", enabled: true },
            { label: "Điện thoại", href: "tel:+849****3456", icon: "phone", enabled: true }
          ],
          webhook: {
            enabled: false,
            url: "",
            eventName: "floating_helper",
            trigger: "helper_open"
          }
        }
      };
  }
}
