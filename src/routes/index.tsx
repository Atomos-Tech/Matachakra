import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/votecast/Navbar";
import { Hero } from "@/components/votecast/Hero";
import { Timeline } from "@/components/votecast/Timeline";
import { Assistant } from "@/components/votecast/Assistant";
import { ResourceGrid } from "@/components/votecast/ResourceGrid";
import { Quiz } from "@/components/votecast/Quiz";
import { Footer } from "@/components/votecast/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Matachakra — Your civic AI co-pilot" },
      {
        name: "description",
        content:
          "Matachakra makes the election process simple. Explore an interactive timeline, chat with an AI assistant, and learn your voting rights in minutes.",
      },
      { property: "og:title", content: "Matachakra — Your civic AI co-pilot" },
      {
        property: "og:description",
        content:
          "Interactive timeline, AI assistant, and a clear guide to voter rights and required documents.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Timeline />
        <Assistant />
        <ResourceGrid />
        <Quiz />
      </main>
      <Footer />
    </div>
  );
}
