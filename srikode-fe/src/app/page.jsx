import HomeSection from "@/components/home";
import { getBlogs, getVideos } from "@/lib/api";

export const revalidate = 60; // Revalidate layout feeds every 60 seconds

export const metadata = {
  title: "SriKode — Learn Web Development with Practical Tutorials",
  description:
    "SriKode is a developer blog covering HTML, CSS, JavaScript, React, Next.js and modern full-stack web development through step-by-step tutorials.",
};

export default async function Home() {
  let dbBlogs = [];
  let dbVideos = [];
  try {
    const blogsRes = await getBlogs({ limit: 12 });
    dbBlogs = blogsRes.blogs || [];

    const videosRes = await getVideos();
    dbVideos = videosRes.videos?.slice(0, 3) || []; // Select top 3 videos for home listing
  } catch (error) {
    console.error("Failed to load home feeds during SSR: ", error);
  }

  return <HomeSection blogs={dbBlogs} videos={dbVideos} />;
}
