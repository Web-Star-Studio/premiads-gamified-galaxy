
import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface BlogTagFilterProps {
  activeTags: string[];
  availableTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
}

const BlogTagFilter: React.FC<BlogTagFilterProps> = ({ 
  activeTags, 
  availableTags, 
  onTagToggle,
  onClearTags 
}) => {
  if (!availableTags.length) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">Filtrar por tags:</h3>
        {activeTags.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-gray-400 hover:text-neon-cyan"
            onClick={onClearTags}
          >
            Limpar filtros <X size={14} className="ml-1" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {availableTags.map(tag => (
          <motion.button
            key={tag}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTagToggle(tag)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeTags.includes(tag)
                ? 'bg-neon-cyan/20 text-neon-cyan'
                : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300'
            }`}
          >
            #{tag}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BlogTagFilter;
