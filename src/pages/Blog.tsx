
import { useState } from "react";
import { useBlogPosts } from "@/hooks/blog";
import { useToast } from "@/hooks/use-toast";
import FeaturedPostSection from "@/components/blog/content/FeaturedPostSection";
import RecentPostsSection from "@/components/blog/content/RecentPostsSection";
import BlogCategories from "@/components/blog/BlogCategories";
import BlogNewsletter from "@/components/blog/BlogNewsletter";
import BlogHero from "@/components/blog/hero/BlogHero";
import { BlogPost } from "@/types/blog";

const Blog = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    paginatedPosts: posts,
    featuredPost,
    isLoading,
    loadingPage,
    categories,
    tags,
    activeCategory,
    activeTags,
    currentPage,
    totalPages,
    setActiveCategory,
    handleTagToggle,
    handlePageChange,
    handleSearchSubmit,
    clearFilters
  } = useBlogPosts();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchSubmit(e);
  };

  return (
    <div className="min-h-screen bg-galaxy-dark">
      <BlogHero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchSubmit={handleSearch}
      />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <FeaturedPostSection
              featuredPost={featuredPost}
              isLoading={isLoading}
              activeTags={activeTags}
              allTags={tags}
              onTagToggle={handleTagToggle}
              onClearTags={clearFilters}
            />
            
            <RecentPostsSection
              isLoading={isLoading}
              loadingPage={loadingPage}
              paginatedPosts={posts}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onClearFilters={clearFilters}
            />
          </div>
          
          <aside className="space-y-8">
            <BlogCategories 
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            <BlogNewsletter />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Blog;
