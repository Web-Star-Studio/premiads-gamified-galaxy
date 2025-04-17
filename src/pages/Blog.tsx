
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { BlogPostCard, FeaturedPostCard, BlogCategories, BlogNewsletter, BlogPostSkeleton } from '@/components/blog';

// Dados mockados para demonstração
const BLOG_POSTS = [
  {
    id: 1,
    title: 'Como engajar sua audiência com campanhas interativas',
    excerpt: 'Descubra estratégias comprovadas para aumentar o engajamento do seu público através de campanhas gamificadas.',
    category: 'Marketing Digital',
    date: '15 Abr 2025',
    author: 'Marina Silva',
    imageUrl: '/placeholder.svg',
    featured: true,
    slug: 'como-engajar-audiencia-campanhas-interativas'
  },
  {
    id: 2,
    title: 'O futuro da publicidade digital: tendências para 2026',
    excerpt: 'Análise das principais tendências que moldarão o cenário da publicidade digital no próximo ano.',
    category: 'Tendências',
    date: '10 Abr 2025',
    author: 'Carlos Mendes',
    imageUrl: '/placeholder.svg',
    featured: false,
    slug: 'futuro-publicidade-digital-tendencias-2026'
  },
  {
    id: 3,
    title: 'Case de sucesso: como a Marca X aumentou em 300% o ROI',
    excerpt: 'Estudo de caso detalhado sobre como uma marca utilizou a PremiAds para revolucionar sua estratégia de marketing.',
    category: 'Cases',
    date: '05 Abr 2025',
    author: 'Juliana Rios',
    imageUrl: '/placeholder.svg',
    featured: false,
    slug: 'case-sucesso-marca-x-aumento-roi'
  },
  {
    id: 4,
    title: 'Gamificação no marketing: por que isso funciona?',
    excerpt: 'Entenda a ciência por trás da gamificação e como ela pode transformar a experiência do usuário com sua marca.',
    category: 'Gamificação',
    date: '01 Abr 2025',
    author: 'Rafael Costa',
    imageUrl: '/placeholder.svg',
    featured: false,
    slug: 'gamificacao-marketing-porque-funciona'
  },
  {
    id: 5,
    title: 'Métricas essenciais para avaliar o sucesso da sua campanha',
    excerpt: 'Guia completo sobre as métricas que realmente importam ao avaliar o desempenho de campanhas digitais.',
    category: 'Análise de Dados',
    date: '28 Mar 2025',
    author: 'Amanda Lopes',
    imageUrl: '/placeholder.svg',
    featured: false,
    slug: 'metricas-essenciais-avaliar-sucesso-campanha'
  },
  {
    id: 6,
    title: 'Como criar uma estratégia de recompensas eficiente',
    excerpt: 'Aprenda a desenvolver um sistema de recompensas que motiva seu público a participar ativamente das suas campanhas.',
    category: 'Estratégia',
    date: '25 Mar 2025',
    author: 'Bruno Almeida',
    imageUrl: '/placeholder.svg',
    featured: false,
    slug: 'como-criar-estrategia-recompensas-eficiente'
  }
];

const CATEGORIES = [
  { name: 'Marketing Digital', count: 12 },
  { name: 'Gamificação', count: 8 },
  { name: 'Análise de Dados', count: 6 },
  { name: 'Tendências', count: 5 },
  { name: 'Cases', count: 4 },
  { name: 'Estratégia', count: 7 }
];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState(BLOG_POSTS);
  const [activeCategory, setActiveCategory] = useState('Todos');

  // Simulação de carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Lógica de filtragem por busca e categoria
  useEffect(() => {
    let results = BLOG_POSTS;
    
    if (searchQuery) {
      results = results.filter(
        post => 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeCategory !== 'Todos') {
      results = results.filter(post => post.category === activeCategory);
    }
    
    setFilteredPosts(results);
  }, [searchQuery, activeCategory]);

  const featuredPost = BLOG_POSTS.find(post => post.featured);

  return (
    <>
      <Helmet>
        <title>Blog PremiAds - Artigos sobre Marketing e Gamificação</title>
        <meta name="description" content="Confira as últimas tendências, dicas e estratégias sobre marketing digital, gamificação e campanhas de engajamento no blog da PremiAds." />
        <meta name="keywords" content="blog premiads, marketing gamificado, gamificação, engajamento, campanhas digitais, recompensas" />
        <meta property="og:title" content="Blog PremiAds - Artigos sobre Marketing e Gamificação" />
        <meta property="og:description" content="Confira as últimas tendências, dicas e estratégias sobre marketing digital, gamificação e campanhas de engajamento." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.premiads.com/blog" />
        <meta property="og:image" content="https://www.premiads.com/og-image-blog.jpg" />
        <link rel="canonical" href="https://www.premiads.com/blog" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-zinc-950/90 pt-20">
        {/* Hero section */}
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
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="search"
                  placeholder="Buscar artigos, tópicos ou autores..."
                  className="pl-10 py-6 bg-zinc-900/70 border-zinc-800 rounded-xl focus:ring-neon-cyan focus:border-neon-cyan"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Blog content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2">
                {/* Featured post */}
                {featuredPost && !isLoading ? (
                  <FeaturedPostCard post={featuredPost} />
                ) : (
                  <div className="h-[400px] rounded-xl bg-zinc-900/50 animate-pulse mb-12"></div>
                )}

                {/* Recent posts */}
                <h2 className="text-2xl font-bold mb-6 mt-12">Artigos Recentes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isLoading ? (
                    Array(4).fill(0).map((_, index) => (
                      <BlogPostSkeleton key={index} />
                    ))
                  ) : filteredPosts.length > 0 ? (
                    filteredPosts.filter(post => !post.featured).map(post => (
                      <BlogPostCard key={post.id} post={post} />
                    ))
                  ) : (
                    <div className="col-span-full p-8 text-center bg-zinc-900/30 rounded-xl">
                      <p className="text-gray-400">Nenhum artigo encontrado com os critérios selecionados.</p>
                      <Button 
                        variant="link" 
                        className="mt-2 text-neon-cyan"
                        onClick={() => {
                          setSearchQuery('');
                          setActiveCategory('Todos');
                        }}
                      >
                        Limpar filtros
                      </Button>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <Pagination className="mt-10">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Categories */}
                <BlogCategories 
                  categories={CATEGORIES} 
                  activeCategory={activeCategory} 
                  setActiveCategory={setActiveCategory} 
                />

                {/* Newsletter subscription */}
                <BlogNewsletter />

                {/* Popular posts */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Mais Populares</h3>
                    <div className="space-y-4">
                      {BLOG_POSTS.slice(0, 3).map(post => (
                        <a key={post.id} href={`/blog/${post.slug}`} className="flex group items-start gap-3 hover:bg-zinc-800/30 p-2 rounded-lg transition-colors">
                          <div className="w-16 h-16 rounded-lg bg-zinc-800 shrink-0 overflow-hidden">
                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium group-hover:text-neon-cyan transition-colors">{post.title}</h4>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                              <Calendar size={12} className="mr-1" />
                              <span>{post.date}</span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
