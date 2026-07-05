import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import connectDb from "../config/db.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";
import Contact from "../models/Contact.js";

const testSchemas = async () => {
  try {
    console.log("🔄 Connecting to Database...");
    await connectDb();
    console.log("✅ Database connected successfully.");

    // Clean test records if any exist
    console.log("\n🧹 Cleaning existing test data...");
    await Blog.deleteMany({ slug: "test-slug-2026" });
    await Video.deleteMany({ youtubeId: "test-youtube-id" });
    await Contact.deleteMany({ email: "tester@srikode.test" });

    // 1. Create a Test Blog with Rich Content Blocks (Simulating blog-1.json structure)
    console.log("\n📝 Inserting Test Blog...");
    const testBlog = await Blog.create({
      slug: "test-slug-2026",
      title: "Test HTML & CSS Guide",
      excerpt: "This is a test blog post excerpt.",
      description: "SEO description for testing.",
      coverImage: "https://ik.imagekit.io/srikode/covers/test.jpg",
      category: "HTML & CSS",
      tags: ["HTML", "Test"],
      difficulty: "Beginner",
      author: {
        name: "Srikant Sahu",
        role: "Developer",
        avatar: "/authors/srikant.webp",
        bio: "Bio for tester"
      },
      seo: {
        title: "Test Blog SEO Title",
        description: "Test SEO Description",
        keywords: ["HTML", "Testing"]
      },
      content: [
        {
          type: "heading",
          level: 2,
          text: "Introduction to Test Blog"
        },
        {
          type: "paragraph",
          text: "This is a sample test paragraph containing information about HTML & CSS layouts."
        },
        {
          type: "callout",
          variant: "info",
          title: "Pro Tip",
          text: "Keep your code modular and reuse components."
        },
        {
          type: "list",
          style: "unordered",
          items: ["Understand HTML Tags", "Write Semantic CSS Classes", "Check Responsive Views"]
        },
        {
          type: "table",
          headers: ["Language", "Use"],
          rows: [
            ["HTML", "Structuring"],
            ["CSS", "Styling"]
          ]
        }
      ],
      tableOfContents: [
        { id: "intro", title: "Introduction to Test Blog" }
      ],
      faq: [
        { question: "Is this database test safe?", answer: "Yes, it is isolated." }
      ],
      isPublished: false,
      isFeatured: true
    });

    console.log("✅ Blog Inserted. Calculated Reading Time:", testBlog.readingTime);

    // 2. Create a Test Comment linked to the blog post
    console.log("\n💬 Inserting Guest Comment...");
    const testComment = await Comment.create({
      blogId: testBlog._id,
      name: "John Doe",
      email: "johndoe@test.com",
      text: "This is a fantastic test post!",
      isApproved: false
    });
    console.log(`✅ Comment Inserted linked to Blog ID: ${testComment.blogId}`);

    // 3. Create a Test Video
    console.log("\n🎥 Inserting Sync Cache Video...");
    const testVideo = await Video.create({
      youtubeId: "test-youtube-id",
      title: "Test How to build responsive forms",
      thumbnail: "https://picsum.photos/seed/form/640/360",
      duration: "10:15",
      publishedAt: new Date(),
      viewCount: "500K",
      description: "How to build responsive CSS forms guide.",
      isHidden: false
    });
    console.log(`✅ Video Inserted. Youtube ID: ${testVideo.youtubeId}`);

    // 4. Create a Test Contact Message
    console.log("\n✉️ Inserting Contact Message...");
    const testContact = await Contact.create({
      name: "Jane Smith",
      email: "tester@srikode.test",
      subject: "Feedback on website",
      message: "The website design is clean and responsive. Good job!"
    });
    console.log(`✅ Contact Message Inserted. Subject: ${testContact.subject}`);

    // 5. Verification Query
    console.log("\n🔍 Verification Query...");
    const queryBlog = await Blog.findOne({ slug: "test-slug-2026" }).populate("relatedPosts");
    console.log(`Fetched Blog: "${queryBlog.title}"`);
    console.log(`Blocks Count: ${queryBlog.content.length}`);
    console.log(`Calculated Reading Time: ${queryBlog.readingTime}`);

    const queryComments = await Comment.find({ blogId: queryBlog._id });
    console.log(`Found ${queryComments.length} comment(s) on this blog.`);

    // 🧹 Cleanup test records
    console.log("\n🧹 Cleaning up test data...");
    await Blog.deleteOne({ _id: testBlog._id });
    await Comment.deleteOne({ _id: testComment._id });
    await Video.deleteOne({ _id: testVideo._id });
    await Contact.deleteOne({ _id: testContact._id });
    console.log("✅ Cleanup completed.");

    console.log("\n🎉 ALL MODEL SCHEMAS VERIFIED SUCCESSFULLY! 🎉");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Database validation failed with error:", error);
    process.exit(1);
  }
};

testSchemas();
