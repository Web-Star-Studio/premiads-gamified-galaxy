
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import BlogCategories from '../BlogCategories';
import BlogNewsletter from '../BlogNewsletter';
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost, Category } from '@/types/blog';

interface BlogSidebarProps {
  popularPosts: BlogPost[];
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  popularPosts,
  categories,
  activeCategory,
  setActiveCategory
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Categories */}
      <BlogCategories 
        categories={categories} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      {/* Newsletter subscription */}
      <BlogNewsletter />

      {/* Popular posts */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Mais Populares</h3>
          <div className="space-y-4">
            {popularPosts.slice(0, 3).map(post => (
              <motion.div
                key={post.id}
                whileHover={{ x: 3 }}
                className="group"
              >
                <Button 
                  variant="ghost" 
                  className="w-full p-0 h-auto justify-start" 
                  asChild
                >
                  <motion.div 
                    className="flex items-start gap-3 hover:bg-zinc-800/30 p-2 rounded-lg transition-colors w-full"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    <div className="w-16 h-16 rounded-lg bg-zinc-800 shrink-0 overflow-hidden">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium group-hover:text-neon-cyan transition-colors line-clamp-2">{post.title}</h4>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </motion.div>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BlogSidebar;
