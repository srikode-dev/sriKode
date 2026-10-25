import SocialStats from "./SocialStats";
import MostPopular from "./MostPopular";
import FeaturedPost from "./FeaturedPost";
import CategoryList from "./CategoryList";
import AdBanner from "@/components/shared/AdBanner";

export default function Sidebar({ blogs = [], socialCard, sponsor }) {
  // Find posts marked as featured, or fallback to blogs sorted by likes
  const featuredPosts = (blogs || []).filter((b) => b.isFeatured);
  const fallbackFeatured = [...(blogs || [])].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  const featured = featuredPosts.length > 0 ? featuredPosts : fallbackFeatured;

  return (
    <aside className="flex flex-col gap-6">
      <SocialStats data={socialCard} />
      <MostPopular blogs={blogs} />
      <AdBanner slot="sidebar" customSponsor={sponsor} />
      <FeaturedPost blog={featured} blogs={featuredPosts} />
      <CategoryList blogs={blogs} />
    </aside>
  );
}
