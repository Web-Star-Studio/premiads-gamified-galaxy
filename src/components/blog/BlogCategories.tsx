
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';

interface Category {
  name: string;
  count: number;
}

interface BlogCategoriesProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const BlogCategories: React.FC<BlogCategoriesProps> = ({ 
  categories, 
  activeCategory, 
  setActiveCategory 
}) => (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">Categorias</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveCategory('Todos')}
              className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center transition-colors ${
                activeCategory === 'Todos'
                  ? 'bg-neon-cyan/20 text-neon-cyan'
                  : 'hover:bg-zinc-800/50'
              }`}
            >
              <span>Todos os artigos</span>
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="px-2 py-0.5 rounded-full text-xs bg-zinc-800"
              >
                {categories.reduce((acc, cat) => acc + cat.count, 0)}
              </motion.span>
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.name}>
              <button
                onClick={() => setActiveCategory(category.name)}
                className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center transition-colors ${
                  activeCategory === category.name
                    ? 'bg-neon-cyan/20 text-neon-cyan'
                    : 'hover:bg-zinc-800/50'
                }`}
              >
                <span>{category.name}</span>
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-0.5 rounded-full text-xs bg-zinc-800"
                >
                  {category.count}
                </motion.span>
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

export default BlogCategories;
