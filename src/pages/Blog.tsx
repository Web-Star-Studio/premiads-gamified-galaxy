import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { 
  BlogPostCard, 
  FeaturedPostCard, 
  BlogCategories, 
  BlogNewsletter, 
  BlogPostSkeleton 
} from '@/components/blog';
import BlogPagination from '@/components/blog/BlogPagination';
import BlogTagFilter from '@/components/blog/BlogTagFilter';
import { useLocation, useNavigate } from 'react-router-dom';

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

// Extract all unique tags from blog posts
const ALL_TAGS = ['engajamento', 'gamificação', 'marketing', 'recompensas', 'digitalização', 'estratégia', 'tendências', 'análise', 'interatividade', 'conversão'];

const Blog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState(BLOG_POSTS);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);
  
  const POSTS_PER_PAGE = 4;

  // Parse URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    const category = params.get('category');
    if (category) {
      setActiveCategory(category);
    }
    
    const tag = params.get('tag');
    if (tag && !activeTags.includes(tag)) {
      setActiveTags(prev => [...prev, tag]);
    }
    
    const page = params.get('page');
    if (page) {
      setCurrentPage(parseInt(page, 10) || 1);
    }
    
    const query = params.get('query');
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  // Update URL when filters change
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (activeCategory !== 'Todos') {
      params.append('category', activeCategory);
    }
    
    activeTags.forEach(tag => {
      params.append('tag', tag);
    });
    
    if (currentPage > 1) {
      params.append('page', currentPage.toString());
    }
    
    if (searchQuery) {
      params.append('query', searchQuery);
    }
    
    const newSearch = params.toString();
    navigate({ search: newSearch ? `?${newSearch}` : '' }, { replace: true });
  }, [activeCategory, activeTags, currentPage, searchQuery, navigate]);

  // Apply filters
  useEffect(() => {
    setLoadingPage(true);
    
    // Simulate network delay for filtering
    const timer = setTimeout(() => {
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
      
      if (activeTags.length > 0) {
        // Assuming each post has tags, filter posts that contain at least one of the active tags
        // This is just a simulation since our mock data doesn't have tags
        results = results.filter((post, index) => {
          // Create fake tags for demonstration based on post index
          const fakeTags = ALL_TAGS.slice(0, (index % 5) + 2);
          return activeTags.some(tag => fakeTags.includes(tag));
        });
      }
      
      setFilteredPosts(results);
      setLoadingPage(false);
      
      // Update URL with current filters
      updateUrlParams();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory, activeTags, currentPage, updateUrlParams]);

  // Initial load simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Handle tag toggling
  const handleTagToggle = (tag: string) => {
    setActiveTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
    setCurrentPage(1); // Reset to first page when changing filters
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoadingPage(true);
    
    // Simulate page loading delay
    setTimeout(() => {
      setLoadingPage(false);
    }, 800);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

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

                {/* Tag filters */}
                {!isLoading && (
                  <BlogTagFilter 
                    activeTags={activeTags}
                    availableTags={ALL_TAGS}
                    onTagToggle={handleTagToggle}
                    onClearTags={() => {
                      setActiveTags([]);
                      setCurrentPage(1);
                    }}
                  />
                )}

                {/* Recent posts */}
                <h2 className="text-2xl font-bold mb-6 mt-8">Artigos Recentes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isLoading || loadingPage ? (
                    Array(4).fill(0).map((_, index) => (
                      <BlogPostSkeleton key={index} />
                    ))
                  ) : paginatedPosts.length > 0 ? (
                    paginatedPosts.filter(post => !post.featured).map(post => (
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
                          setActiveTags([]);
                          setCurrentPage(1);
                          
                          // Clear URL params
                          navigate('/blog', { replace: true });
                          
                          // Show toast for feedback
                          toast({
                            title: "Filtros limpos",
                            description: "Mostrando todos os artigos disponíveis.",
                            variant: "default",
                            className: "bg-neon-cyan/90 text-galaxy-dark border-0"
                          });
                        }}
                      >
                        Limpar filtros
                      </Button>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {!isLoading && (
                  <BlogPagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange}
                    isLoading={loadingPage}
                  />
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Categories */}
                <BlogCategories 
                  categories={CATEGORIES} 
                  activeCategory={activeCategory} 
                  setActiveCategory={(category) => {
                    setActiveCategory(category);
                    setCurrentPage(1); // Reset to first page when changing category
                  }} 
                />

                {/* Newsletter subscription */}
                <BlogNewsletter />

                {/* Popular posts */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">Mais Populares</h3>
                    <div className="space-y-4">
                      {BLOG_POSTS.slice(0, 3).map(post => (
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
