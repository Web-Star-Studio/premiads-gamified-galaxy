
import { useEffect } from "react";
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
  const {
    posts,
    featuredPost,
    isLoading,
    loadingPage,
    error,
    activeTags,
    allTags,
    currentPage,
    totalPages,
    setCurrentPage,
    handleTagToggle,
    clearTags
  } = useBlogPosts();

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar blog",
        description: "Não foi possível carregar os posts. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  if (error) {
    return (
      <div className="min-h-screen bg-galaxy-dark flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Erro ao carregar conteúdo</h2>
          <p className="text-gray-400 mb-4">Ocorreu um erro ao carregar os posts do blog.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-neon-cyan text-galaxy-dark rounded hover:bg-neon-cyan/80"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-galaxy-dark">
      <BlogHero />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <FeaturedPostSection
              featuredPost={featuredPost}
              isLoading={isLoading}
              activeTags={activeTags}
              allTags={allTags}
              onTagToggle={handleTagToggle}
              onClearTags={clearTags}
            />
            
            <RecentPostsSection
              isLoading={isLoading}
              loadingPage={loadingPage}
              paginatedPosts={posts}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onClearFilters={clearTags}
            />
          </div>
          
          <aside className="space-y-8">
            <BlogCategories />
            <BlogNewsletter />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Blog;
