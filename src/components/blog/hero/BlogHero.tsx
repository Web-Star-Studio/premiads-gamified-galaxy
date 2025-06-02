
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface BlogHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
}

const BlogHero: React.FC<BlogHeroProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearchSubmit 
}) => (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-blue-purple-gradient opacity-10 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-blue-purple-gradient">
            Blog PremiAds
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            Insights, tendências e estratégias para revolucionar suas campanhas de marketing através da gamificação
          </p>
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="search"
              placeholder="Buscar artigos, tópicos ou autores..."
              className="pl-10 py-6 bg-zinc-900/70 border-zinc-800 rounded-xl focus:ring-neon-cyan focus:border-neon-cyan"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </motion.div>
      </div>
    </section>
  );

export default BlogHero;
