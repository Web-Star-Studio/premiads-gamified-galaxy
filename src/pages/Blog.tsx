
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogHero from '@/components/blog/hero/BlogHero';
import FeaturedPostSection from '@/components/blog/content/FeaturedPostSection';
import RecentPostsSection from '@/components/blog/content/RecentPostsSection';
import BlogSidebar from '@/components/blog/sidebar/BlogSidebar';
import { useBlogPosts } from '@/hooks/blog/useBlogPosts';

const Blog = () => {
  const {
    // Data
    posts,
    categories,
    tags,
    paginatedPosts,
    featuredPost,
    
    // State
    searchQuery,
    isLoading,
    activeCategory,
    activeTags,
    currentPage,
    loadingPage,
    totalPages,
    
    // Actions
    setSearchQuery,
    setActiveCategory,
    handleTagToggle,
    handlePageChange,
    handleSearchSubmit,
    clearFilters
  } = useBlogPosts();

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-zinc-950/90 pt-20">
        {/* Hero section with search */}
        <BlogHero 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
        />

        {/* Blog content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2">
                <FeaturedPostSection 
                  featuredPost={featuredPost}
                  isLoading={isLoading}
                  activeTags={activeTags}
                  allTags={tags}
                  onTagToggle={handleTagToggle}
                  onClearTags={() => {
                    clearFilters();
                  }}
                />

                <RecentPostsSection 
                  isLoading={isLoading}
                  loadingPage={loadingPage}
                  paginatedPosts={paginatedPosts}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  onClearFilters={clearFilters}
                />
              </div>

              {/* Sidebar */}
              <BlogSidebar 
                popularPosts={posts}
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={(category) => {
                  setActiveCategory(category);
                  setSearchQuery('');
                  if (currentPage !== 1) {
                    handlePageChange(1); // Reset to first page when changing category
                  }
                }}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
