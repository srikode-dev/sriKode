import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      "heading",
      "paragraph",
      "code",
      "image",
      "callout",
      "tip",
      "warning",
      "quote",
      "list",
      "table",
      "video",
      "divider"
    ]
  },
  level: Number,       // For heading (2, 3, 4)
  text: String,        // For heading, paragraph, callout, tip, warning, quote
  language: String,    // For code (e.g. javascript, css, html, jsx)
  filename: String,    // For code
  code: String,        // For code
  src: String,         // For image
  alt: String,         // For image
  caption: String,     // For image
  variant: String,     // For callout (info, success, warning, danger)
  style: String,       // For list (ordered, unordered)
  items: [String],     // For list
  headers: [String],   // For table
  rows: [[String]],    // For table (array of array of strings)
  url: String          // For video
}, { _id: false });

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const tableOfContentsSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true }
}, { _id: false });

const blogSchema = new mongoose.Schema({
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true,
    trim: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  excerpt: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true 
  }, // SEO meta description
  coverImage: { 
    type: String 
  },
  category: { 
    type: String, 
    required: true,
    trim: true
  },
  tags: { 
    type: [String], 
    default: [] 
  },
  difficulty: { 
    type: String, 
    enum: ["Beginner", "Intermediate", "Advanced"], 
    default: "Beginner" 
  },
  
  author: {
    name: { type: String, default: "Srikant Sahu" },
    role: { type: String, default: "Full Stack Developer" },
    avatar: { type: String, default: "/authors/srikant.webp" },
    bio: { type: String, default: "MERN & Next.js Developer" }
  },

  seo: {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    keywords: { type: [String], default: [] }
  },

  content: { 
    type: [contentBlockSchema], 
    default: [] 
  },
  tableOfContents: { 
    type: [tableOfContentsSchema], 
    default: [] 
  },
  faq: { 
    type: [faqSchema], 
    default: [] 
  },
  relatedPosts: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Blog" 
  }],

  githubUrl: {
    type: String,
    trim: true,
    default: ""
  },
  liveUrl: {
    type: String,
    trim: true,
    default: ""
  },
  videoUrl: {
    type: String,
    trim: true,
    default: ""
  },

  isPublished: { 
    type: Boolean, 
    default: false 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  viewCount: { 
    type: Number, 
    default: 0 
  },
  readingTime: { 
    type: String, 
    default: "1 min" 
  }
}, {
  timestamps: true
});

blogSchema.pre("save", function() {
  if (this.isModified("content")) {
    let wordCount = 0;
    this.content.forEach(block => {
      if (["paragraph", "heading", "quote", "callout", "tip", "warning"].includes(block.type) && block.text) {
        wordCount += block.text.trim().split(/\s+/).filter(Boolean).length;
      } else if (block.type === "list" && Array.isArray(block.items)) {
        block.items.forEach(item => {
          wordCount += item.trim().split(/\s+/).filter(Boolean).length;
        });
      }
    });
    
    // Assume average reading speed of 200 words per minute
    const minutes = Math.max(1, Math.round(wordCount / 200));
    this.readingTime = `${minutes} min`;
  }
});

// Performance Indexing
blogSchema.index({ isPublished: 1, createdAt: -1 }); // Optimizes main blog feed
blogSchema.index({ category: 1 }); // Optimizes category filtering

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
