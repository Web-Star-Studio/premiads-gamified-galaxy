
import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

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

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden hover:border-neon-cyan/50 transition-colors bg-zinc-900/50 border-zinc-800">
        <div className="h-48 overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
          />
        </div>
        <CardContent className="p-6">
          <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-galaxy-deepPurple text-neon-cyan mb-3">
            {post.category}
          </div>
          <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-neon-cyan transition-colors">
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-xs text-gray-400">
              <div className="flex items-center mr-3">
                <Calendar size={14} className="mr-1" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <User size={14} className="mr-1" />
                <span>{post.author}</span>
              </div>
            </div>
            <Button variant="link" size="sm" className="text-neon-cyan p-0" asChild>
              <Link to={`/blog/${post.slug}`} className="flex items-center">
                Ler mais <ArrowRight size={14} className="ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

export default BlogPostCard;
