import Container from "@/components/shared/Container";
import { blogs } from "@/data/dummy-blog-data";
import { FeaturedHero, HeroSideCard } from ".";

function Hero() {
  const featuredBlog = blogs[0];
  const sideBlogs = blogs.slice(1, 4);

  return (
    <section className="py-10">
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <FeaturedHero blog={featuredBlog} />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-4">
            {sideBlogs.map((blog) => (
              <HeroSideCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;