
import React from 'react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import ButtonLoadingSpinner from '@/components/ui/ButtonLoadingSpinner';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const BlogPagination: React.FC<BlogPaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  isLoading = false
}) => {
  const { toast } = useToast();

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    if (!totalPages || totalPages <= 0) return [1];
    
    // Always show first page, last page, current page, and one before/after current
    const pageNumbers: number[] = [];
    
    // Always include page 1
    pageNumbers.push(1);
    
    // Pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }
    
    // Always include last page if we have more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    // Make sure the array is sorted
    return pageNumbers.sort((a, b) => a - b);
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage || isLoading) return;
    
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onPageChange(page);
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={`${currentPage <= 1 || isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
            aria-disabled={currentPage <= 1 || isLoading}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          // Add ellipsis if there's a gap
          const previousPage = pageNumbers[index - 1];
          const showEllipsis = previousPage && page - previousPage > 1;
          
          return (
            <React.Fragment key={page}>
              {showEllipsis && (
                <PaginationItem>
                  <span className="px-4 text-gray-500">...</span>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink 
                  isActive={page === currentPage}
                  onClick={() => handlePageChange(page)}
                  className={isLoading ? 'pointer-events-none' : 'cursor-pointer'}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </React.Fragment>
          );
        })}

        <PaginationItem>
          <PaginationNext 
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            className={`${currentPage >= totalPages || isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
            aria-disabled={currentPage >= totalPages || isLoading}
          >
            {isLoading && <ButtonLoadingSpinner className="mr-2" size="sm" color="cyan" />}
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default BlogPagination;
