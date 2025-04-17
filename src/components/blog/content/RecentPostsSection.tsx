
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BlogPost } from '@/types/blog';
import BlogPostCard from '../BlogPostCard';
import BlogPostSkeleton from '../BlogPostSkeleton';
import BlogPagination from '../BlogPagination';
import { useNavigate } from 'react-router-dom';

interface RecentPostsSectionProps {
  isLoading: boolean;
  loadingPage: boolean;
  paginatedPosts: BlogPost[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

const RecentPostsSection: React.FC<RecentPostsSectionProps> = ({
  isLoading,
  loadingPage,
  paginatedPosts,
  currentPage,
  totalPages,
  onPageChange,
  onClearFilters
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 mt-8">Artigos Recentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading || loadingPage ? (
          Array(4).fill(0).map((_, index) => (
            <BlogPostSkeleton key={index} />
          ))
        ) : paginatedPosts.length > 0 ? (
          paginatedPosts.filter(post => !post.featured).map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="col-span-full p-8 text-center bg-zinc-900/30 rounded-xl">
            <p className="text-gray-400">Nenhum artigo encontrado com os critérios selecionados.</p>
            <Button 
              variant="link" 
              className="mt-2 text-neon-cyan"
              onClick={() => {
                onClearFilters();
                
                // Clear URL params
                navigate('/blog', { replace: true });
                
                // Show toast for feedback
                toast({
                  title: "Filtros limpos",
                  description: "Mostrando todos os artigos disponíveis.",
                  variant: "default",
                  className: "bg-neon-cyan/90 text-galaxy-dark border-0"
                });
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && (
        <BlogPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={onPageChange}
          isLoading={loadingPage}
        />
      )}
    </>
  );
};

export default RecentPostsSection;
