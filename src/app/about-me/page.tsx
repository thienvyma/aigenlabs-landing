import type { Metadata } from "next";
import { AboutMeDeck } from "@/components/landing/AboutMeDeck";

export const metadata: Metadata = {
  title: "Huỳnh Vỹ & AigenLabs AI Business OS",
  description: "Hidden portfolio deck for Huỳnh Vỹ and AigenLabs AI Business OS.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AboutMePage() {
  return <AboutMeDeck />;
}
