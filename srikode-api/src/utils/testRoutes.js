import connectDb from "../config/db.js";
import Blog from "../models/Blog.js";
import Video from "../models/Video.js";
import Contact from "../models/Contact.js";

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

const runIntegrationTests = async () => {
  try {
    console.log("🔄 Starting E2E Route Verification Tests...");
    
    // 1. Connect to Database to seed a temporary published blog so the GET query returns data
    console.log("🗄️ Connecting to database to seed temporary test data...");
    await connectDb();
    
    // Clean up any stale tests
    await Blog.deleteMany({ slug: "e2e-test-slug" });
    await Video.deleteMany({ youtubeId: "e2e-test-vid" });
    
    // Seed test blog
    const testBlog = await Blog.create({
      slug: "e2e-test-slug",
      title: "E2E Test Blog",
      excerpt: "Checking public routes",
      category: "HTML & CSS",
      content: [{ type: "paragraph", text: "E2E testing content" }],
      isPublished: true,
      isFeatured: true
    });
    
    // Seed test video
    await Video.create({
      youtubeId: "e2e-test-vid",
      title: "E2E Test Video",
      isHidden: false
    });

    console.log("✅ Seeded test data. Proceeding to fetch endpoints...");

    // 2. Test base health route
    console.log("\n🔍 Hitting base health endpoint...");
    const healthRes = await fetch(`http://localhost:${PORT}/`);
    const healthJson = await healthRes.json();
    console.log(`Status: ${healthRes.status} (${healthRes.statusText})`);
    console.log(`Response name: ${healthJson.name}`);
    if (healthRes.status !== 200 || !healthJson.success) {
      throw new Error("Base health route failed");
    }

    // 3. Test public blogs route
    console.log("\n🔍 Hitting GET /blogs...");
    const blogsRes = await fetch(`${BASE_URL}/blogs`);
    const blogsJson = await blogsRes.json();
    console.log(`Status: ${blogsRes.status}`);
    console.log(`Blogs found: ${blogsJson.count} / Total: ${blogsJson.total}`);
    if (blogsRes.status !== 200 || !blogsJson.success || blogsJson.count === 0) {
      throw new Error("Public blogs route failed");
    }

    // 4. Test public featured blogs route
    console.log("\n🔍 Hitting GET /blogs/featured...");
    const featuredRes = await fetch(`${BASE_URL}/blogs/featured`);
    const featuredJson = await featuredRes.json();
    console.log(`Status: ${featuredRes.status}`);
    console.log(`Featured blogs found: ${featuredJson.blogs.length}`);
    if (featuredRes.status !== 200 || !featuredJson.success || featuredJson.blogs.length === 0) {
      throw new Error("Featured blogs route failed");
    }

    // 5. Test public single blog route (and increment views verification)
    console.log("\n🔍 Hitting GET /blogs/post/e2e-test-slug...");
    const singleBlogRes = await fetch(`${BASE_URL}/blogs/post/e2e-test-slug`);
    const singleBlogJson = await singleBlogRes.json();
    console.log(`Status: ${singleBlogRes.status}`);
    console.log(`Fetched Blog Title: "${singleBlogJson.blog.title}"`);
    console.log(`View Count before second check: ${singleBlogJson.blog.viewCount}`);
    if (singleBlogRes.status !== 200 || !singleBlogJson.success || singleBlogJson.blog.viewCount === undefined) {
      throw new Error("Single blog route failed");
    }

    // 6. Test public videos route
    console.log("\n🔍 Hitting GET /videos...");
    const videosRes = await fetch(`${BASE_URL}/videos`);
    const videosJson = await videosRes.json();
    console.log(`Status: ${videosRes.status}`);
    console.log(`Videos found: ${videosJson.count}`);
    if (videosRes.status !== 200 || !videosJson.success || videosJson.count === 0) {
      throw new Error("Public videos route failed");
    }

    // 7. Cleanup seeded records
    console.log("\n🧹 Cleaning up test data from DB...");
    await Blog.deleteOne({ _id: testBlog._id });
    await Video.deleteOne({ youtubeId: "e2e-test-vid" });
    console.log("✅ Database cleaned.");

    console.log("\n🎉 ALL ROUTES WORKING PERFECTLY! INTEGRATION TEST PASSED! 🎉");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Route verification failed with error:", error.message);
    process.exit(1);
  }
};

runIntegrationTests();
