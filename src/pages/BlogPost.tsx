
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Linkedin, Copy, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { BlogPostCard, BlogNewsletter } from '@/components/blog';

// Dados mockados para demonstração
const BLOG_POSTS = [
  {
    id: 1,
    title: 'Como engajar sua audiência com campanhas interativas',
    content: `
      <p class="lead">A gamificação tem se tornado uma das estratégias mais eficazes para aumentar o engajamento do público. Neste artigo, exploramos como implementar elementos de jogos em suas campanhas de marketing para resultados surpreendentes.</p>
      
      <h2>Por que a gamificação funciona?</h2>
      <p>O cérebro humano é naturalmente atraído por jogos e desafios. Quando incorporamos elementos lúdicos em nossas estratégias de marketing, acionamos os mesmos circuitos neurológicos responsáveis pela motivação e recompensa.</p>
      
      <p>Estudos mostram que campanhas gamificadas podem aumentar em até 200% o tempo que os usuários passam interagindo com uma marca. Isso se traduz diretamente em maior reconhecimento, fidelidade e, em última análise, conversões.</p>
      
      <h2>Elementos essenciais para gamificar suas campanhas</h2>
      <ol>
        <li><strong>Objetivos claros</strong>: Os participantes precisam entender facilmente o que devem fazer</li>
        <li><strong>Sistema de pontos</strong>: Métricas visíveis que mostram o progresso</li>
        <li><strong>Níveis e desafios</strong>: Etapas que aumentam gradualmente em dificuldade</li>
        <li><strong>Recompensas</strong>: Incentivos tangíveis ou intangíveis pela participação</li>
        <li><strong>Competição saudável</strong>: Rankings e comparações com outros participantes</li>
      </ol>
      
      <h2>Implementando na prática</h2>
      <p>A plataforma PremiAds foi desenvolvida precisamente para atender a essa necessidade de mercado. Através dela, marcas podem criar experiências gamificadas para seus consumidores sem a necessidade de conhecimentos técnicos avançados.</p>
      
      <p>O sistema permite a criação de missões personalizadas, onde o público pode ganhar pontos ao interagir com o conteúdo da marca de diferentes formas: assistindo vídeos, respondendo questionários, compartilhando nas redes sociais, entre outras ações.</p>
      
      <blockquote>
        "A gamificação transformou completamente nossa estratégia digital. Vimos um aumento de 320% no tempo médio de interação e nossas taxas de conversão subiram 45% em apenas dois meses." - Maria Oliveira, CMO da Empresa XYZ
      </blockquote>
      
      <h2>Métricas a acompanhar</h2>
      <p>Para garantir o sucesso de suas campanhas gamificadas, é essencial monitorar algumas métricas-chave:</p>
      
      <ul>
        <li><strong>Taxa de participação</strong>: Percentual do público-alvo que se engaja na campanha</li>
        <li><strong>Tempo médio de interação</strong>: Quanto tempo os usuários passam engajados</li>
        <li><strong>Taxa de conclusão</strong>: Quantos participantes completam todos os desafios</li>
        <li><strong>Viralização</strong>: Número de compartilhamentos e novos usuários trazidos</li>
        <li><strong>Conversão</strong>: Quantos participantes realizam a ação final desejada</li>
      </ul>
      
      <h2>Conclusão</h2>
      <p>A gamificação não é apenas uma tendência passageira, mas uma transformação fundamental na maneira como as marcas se relacionam com seus públicos. Ao incorporar elementos de jogos em suas estratégias de marketing, as empresas podem criar experiências mais envolventes, memoráveis e eficazes.</p>
      
      <p>O futuro do marketing digital será cada vez mais interativo, personalizado e gamificado. As marcas que dominarem essa abordagem terão uma vantagem competitiva significativa em um cenário onde a atenção do consumidor é o recurso mais valioso.</p>
    `,
    excerpt: 'Descubra estratégias comprovadas para aumentar o engajamento do seu público através de campanhas gamificadas.',
    category: 'Marketing Digital',
    date: '15 Abr 2025',
    author: 'Marina Silva',
    authorRole: 'Especialista em Marketing Digital',
    authorImage: '/placeholder.svg',
    imageUrl: '/placeholder.svg',
    featured: true,
    tags: ['engajamento', 'gamificação', 'campanhas', 'marketing digital', 'interatividade'],
    slug: 'como-engajar-audiencia-campanhas-interativas'
  },
  // Os demais posts do array BLOG_POSTS
];

// Posts relacionados
const RELATED_POSTS = [
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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulação de carregamento de dados
    setIsLoading(true);
    window.scrollTo(0, 0);
    
    setTimeout(() => {
      const foundPost = BLOG_POSTS.find(p => p.slug === slug);
      setPost(foundPost || null);
      setIsLoading(false);
    }, 1000);
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copiado!",
      description: "O link do artigo foi copiado para a área de transferência.",
      variant: "default",
      className: "bg-neon-cyan/90 text-galaxy-dark border-0"
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Artigo removido dos favoritos" : "Artigo salvo nos favoritos",
      description: isBookmarked ? "O artigo foi removido da sua lista de leitura." : "O artigo foi adicionado à sua lista de leitura.",
      variant: "default",
      className: "bg-neon-cyan/90 text-galaxy-dark border-0"
    });
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-zinc-950/90 pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse h-8 w-32 bg-zinc-800 rounded my-6"></div>
            <div className="animate-pulse h-14 bg-zinc-800 rounded-lg w-3/4 mb-6"></div>
            <div className="animate-pulse h-96 bg-zinc-800 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse h-4 bg-zinc-800 rounded w-full"></div>
                ))}
              </div>
              <div>
                <div className="animate-pulse h-64 bg-zinc-800 rounded-lg"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-zinc-950/90 pt-20 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Artigo não encontrado</h1>
            <p className="text-gray-400 mb-6">O artigo que você está procurando não existe ou foi removido.</p>
            <Button asChild>
              <Link to="/blog">Voltar para o Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Blog PremiAds</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.premiads.com/blog/${post.slug}`} />
        <meta property="og:image" content={post.imageUrl} />
        <link rel="canonical" href={`https://www.premiads.com/blog/${post.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="article:published_time" content="2025-04-15T10:00:00Z" />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        {post.tags.map((tag: string) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-zinc-950/90 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/blog" className="inline-flex items-center text-gray-400 hover:text-neon-cyan mb-6 transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Voltar para o Blog
            </Link>
            
            <article>
              {/* Header */}
              <header className="mb-10">
                <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-galaxy-deepPurple text-neon-cyan mb-4">
                  {post.category}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
                <div className="flex flex-wrap items-center text-gray-400 gap-4 mb-6">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <User size={16} className="mr-2" />
                    <span>{post.author}</span>
                  </div>
                </div>
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </header>
              
              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div 
                    className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-gray-300 prose-a:text-neon-cyan prose-a:no-underline hover:prose-a:underline prose-blockquote:border-neon-cyan prose-blockquote:bg-zinc-900/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  ></div>
                  
                  {/* Tags */}
                  <div className="mt-10 mb-6">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string) => (
                        <Link 
                          key={tag} 
                          to={`/blog?tag=${tag}`}
                          className="px-3 py-1 text-sm rounded-full bg-zinc-800 hover:bg-neon-cyan/20 text-gray-300 hover:text-neon-cyan transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Share */}
                  <div className="flex items-center justify-between border-t border-b border-zinc-800 py-4 mt-8">
                    <div className="flex items-center">
                      <span className="mr-3 text-gray-400">Compartilhar:</span>
                      <div className="flex space-x-2">
                        <Button size="icon" variant="outline" className="rounded-full w-9 h-9 p-0">
                          <Facebook size={16} />
                        </Button>
                        <Button size="icon" variant="outline" className="rounded-full w-9 h-9 p-0">
                          <Twitter size={16} />
                        </Button>
                        <Button size="icon" variant="outline" className="rounded-full w-9 h-9 p-0">
                          <Linkedin size={16} />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="rounded-full w-9 h-9 p-0"
                          onClick={handleCopyLink}
                        >
                          <Copy size={16} />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBookmark}
                      className={isBookmarked ? "text-neon-cyan border-neon-cyan" : ""}
                    >
                      {isBookmarked ? (
                        <>
                          <BookmarkCheck size={16} className="mr-1" />
                          Salvo
                        </>
                      ) : (
                        <>
                          <Bookmark size={16} className="mr-1" />
                          Salvar
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Author box */}
                  <Card className="mt-8 bg-zinc-900/30 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <img src={post.authorImage} alt={post.author} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{post.author}</h3>
                          <p className="text-gray-400 text-sm">{post.authorRole}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Related posts */}
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Artigos Relacionados</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {RELATED_POSTS.map(relatedPost => (
                        <BlogPostCard key={relatedPost.id} post={relatedPost} />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="space-y-8">
                  <BlogNewsletter />
                  
                  {/* Popular posts */}
                  <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Mais Populares</h3>
                      <div className="space-y-4">
                        {BLOG_POSTS.slice(0, 3).map(popularPost => (
                          <a 
                            key={popularPost.id} 
                            href={`/blog/${popularPost.slug}`} 
                            className="flex group items-start gap-3 hover:bg-zinc-800/30 p-2 rounded-lg transition-colors"
                          >
                            <div className="w-16 h-16 rounded-lg bg-zinc-800 shrink-0 overflow-hidden">
                              <img src={popularPost.imageUrl} alt={popularPost.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-medium group-hover:text-neon-cyan transition-colors">{popularPost.title}</h4>
                              <div className="flex items-center text-xs text-gray-400 mt-1">
                                <Calendar size={12} className="mr-1" />
                                <span>{popularPost.date}</span>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </article>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default BlogPost;
