
import React from 'react';
import FeaturedPostCard from '../FeaturedPostCard';
import BlogTagFilter from '../BlogTagFilter';
import { BlogPost } from '@/types/blog';

interface FeaturedPostSectionProps {
  featuredPost: BlogPost | undefined;
  isLoading: boolean;
  activeTags: string[];
  allTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
}

const FeaturedPostSection: React.FC<FeaturedPostSectionProps> = ({
  featuredPost,
  isLoading,
  activeTags,
  allTags,
  onTagToggle,
  onClearTags
}) => {
  return (
    <>
      {/* Featured post */}
      {featuredPost && !isLoading ? (
        <FeaturedPostCard post={featuredPost} />
      ) : (
        <div className="h-[400px] rounded-xl bg-zinc-900/50 animate-pulse mb-12"></div>
      )}

      {/* Tag filters */}
      {!isLoading && (
        <BlogTagFilter 
          activeTags={activeTags}
          availableTags={allTags}
          onTagToggle={onTagToggle}
          onClearTags={onClearTags}
        />
      )}
    </>
  );
};

export default FeaturedPostSection;
