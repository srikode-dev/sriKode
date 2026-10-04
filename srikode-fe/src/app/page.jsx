import HomeSection from "@/components/home";
import { getBlogs, getVideos, getCmsConfig } from "@/lib/api";

export const revalidate = 60; // Revalidate layout feeds every 60 seconds

export const metadata = {
  title: "SriKode — Learn Web Development with Practical Tutorials",
  description:
    "SriKode is a developer blog covering HTML, CSS, JavaScript, React, Next.js and modern full-stack web development through step-by-step tutorials.",
};

export default async function Home() {
  let dbBlogs = [];
  let dbVideos = [];
  let cmsConfig = null;

  try {
    const [blogsRes, videosRes, cmsRes] = await Promise.allSettled([
      getBlogs({ limit: 12 }),
      getVideos(),
      getCmsConfig(),
    ]);

    if (blogsRes.status === "fulfilled") {
      dbBlogs = blogsRes.value?.blogs || [];
    }
    if (videosRes.status === "fulfilled") {
      dbVideos = videosRes.value?.videos?.slice(0, 3) || [];
    }
    if (cmsRes.status === "fulfilled") {
      cmsConfig = cmsRes.value;
    }
  } catch (error) {
    console.error("Failed to load home feeds during SSR: ", error);
  }

  return <HomeSection blogs={dbBlogs} videos={dbVideos} cmsConfig={cmsConfig} />;
}
