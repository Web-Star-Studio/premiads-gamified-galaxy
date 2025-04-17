
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BlogPost } from '@/types/blog';

// Mock blog posts data - in a real app this would come from an API
const BLOG_POSTS: BlogPost[] = [
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

// Mock categories data
const CATEGORIES = [
  { name: 'Marketing Digital', count: 12 },
  { name: 'Gamificação', count: 8 },
  { name: 'Análise de Dados', count: 6 },
  { name: 'Tendências', count: 5 },
  { name: 'Cases', count: 4 },
  { name: 'Estratégia', count: 7 }
];

// Mock tags data
const ALL_TAGS = ['engajamento', 'gamificação', 'marketing', 'recompensas', 'digitalização', 'estratégia', 'tendências', 'análise', 'interatividade', 'conversão'];

export const useBlogPosts = (postsPerPage = 4) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);

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

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('Todos');
    setActiveTags([]);
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const featuredPost = BLOG_POSTS.find(post => post.featured);

  return {
    // Data
    posts: BLOG_POSTS,
    categories: CATEGORIES,
    tags: ALL_TAGS,
    filteredPosts,
    paginatedPosts,
    featuredPost,
    
    // State
    searchQuery,
    isLoading,
    activeCategory,
    activeTags,
    currentPage,
    loadingPage,
    totalPages,
    
    // Actions
    setSearchQuery,
    setActiveCategory,
    handleTagToggle,
    handlePageChange,
    handleSearchSubmit,
    clearFilters
  };
};
