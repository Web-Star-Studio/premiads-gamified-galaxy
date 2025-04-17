
import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  imageUrl: string;
  slug: string;
}

interface FeaturedPostCardProps {
  post: BlogPost;
}

const FeaturedPostCard: React.FC<FeaturedPostCardProps> = ({ post }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-xl overflow-hidden mb-12"
    >
      <div className="relative h-[400px]">
        <div className="absolute inset-0">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-neon-cyan/90 text-galaxy-dark mb-4 w-fit">
            {post.category}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <a href={`/blog/${post.slug}`} className="hover:text-neon-cyan transition-colors">
              {post.title}
            </a>
          </h2>
          <p className="text-gray-300 mb-4 max-w-3xl">{post.excerpt}</p>
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center text-sm text-gray-300 mb-2 sm:mb-0">
              <div className="flex items-center mr-4">
                <Calendar size={16} className="mr-1" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-1" />
                <span>{post.author}</span>
              </div>
            </div>
            <Button className="bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80" asChild>
              <a href={`/blog/${post.slug}`} className="flex items-center">
                Ler artigo completo <ArrowRight size={16} className="ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedPostCard;
