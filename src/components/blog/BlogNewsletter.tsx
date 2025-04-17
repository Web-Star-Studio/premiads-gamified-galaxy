
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BlogNewsletter = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-galaxy-deepPurple/70 to-galaxy-purple/10 border-galaxy-purple/30 overflow-hidden relative">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2">Inscreva-se na nossa newsletter</h3>
          <p className="text-gray-400 text-sm mb-4">Receba as últimas novidades e dicas diretamente no seu email.</p>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="Seu email"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800/80 border border-zinc-700 text-white"
            />
            <Button className="w-full bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80">
              Inscrever-se
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlogNewsletter;
