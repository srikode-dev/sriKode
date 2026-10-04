import SocialStats from "./SocialStats";
import MostPopular from "./MostPopular";
import FeaturedPost from "./FeaturedPost";
import CategoryList from "./CategoryList";
import AdBanner from "@/components/shared/AdBanner";

export default function Sidebar({ blogs, socialCard }) {
  // Pick a featured post — the one with most likes
  const featured = [...blogs].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];

  return (
    <aside className="flex flex-col gap-6">
      <SocialStats data={socialCard} />
      <MostPopular blogs={blogs} />
      <AdBanner slot="sidebar" />
      <FeaturedPost blog={featured} />
      <CategoryList blogs={blogs} />
    </aside>
  );
}
