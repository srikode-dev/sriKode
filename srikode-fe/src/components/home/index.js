import Container from "@/components/shared/Container";
import { Hero } from "./hero";
import BlogGrid from "./blog/BlogGrid";
import Sidebar from "./sidebar/Sidebar";
import LatestVideos from "./LatestVideos";
import NewsletterCTA from "./NewsletterCTA";

export default function HomeSection({ blogs = [], videos = [] }) {
  return (
    <>
      {/* ── Hero ── */}
      <Hero blogs={blogs} />

      {/* ── Blog Grid + Sidebar ── */}
      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
            {/* Main — Recent Posts Grid */}
            <BlogGrid blogs={blogs} />

            {/* Right — Sticky Sidebar */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <Sidebar blogs={blogs} />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Latest Videos ── */}
      <LatestVideos videos={videos} />

      {/* ── Newsletter CTA ── */}
      <NewsletterCTA />
    </>
  );
}