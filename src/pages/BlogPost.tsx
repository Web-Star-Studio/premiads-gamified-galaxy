import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Linkedin, Copy, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ButtonLoadingSpinner from '@/components/ui/ButtonLoadingSpinner';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { BlogPostCard } from '@/components/blog';
import { SafeHtmlRenderer } from '@/components/blog/SafeHtmlRenderer';

// Mock data for demonstration
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
  // Additional mock posts would go here
];

// Related posts mock data
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
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [sharingLoading, setSharingLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate data loading
    setIsLoading(true);
    window.scrollTo(0, 0);
    
    setTimeout(() => {
      const foundPost = BLOG_POSTS.find(p => p.slug === slug);
      setPost(foundPost || null);
      setIsLoading(false);
      
      // Check if post was bookmarked
      const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      if (bookmarkedPosts.includes(slug)) {
        setIsBookmarked(true);
      }
    }, 1000);
  }, [slug]);

  const handleCopyLink = () => {
    setSharingLoading('copy');
    setTimeout(() => {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado!",
        description: "O link do artigo foi copiado para a área de transferência.",
        variant: "default",
        className: "bg-neon-cyan/90 text-galaxy-dark border-0"
      });
      setSharingLoading(null);
    }, 500);
  };

  const handleShare = (platform: string) => {
    setSharingLoading(platform);
    
    setTimeout(() => {
      let shareUrl = '';
      const postUrl = window.location.href;
      const postTitle = post?.title || 'Artigo PremiAds';
      
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
          break;
      }
      
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
      
      setSharingLoading(null);
    }, 500);
  };

  const handleBookmark = () => {
    setIsBookmarked(prev => {
      const newState = !prev;
      
      // Save to localStorage
      const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      
      if (newState && slug) {
        // Add to bookmarks
        if (!bookmarkedPosts.includes(slug)) {
          bookmarkedPosts.push(slug);
        }
      } else if (slug) {
        // Remove from bookmarks
        const index = bookmarkedPosts.indexOf(slug);
        if (index > -1) {
          bookmarkedPosts.splice(index, 1);
        }
      }
      
      localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts));
      
      toast({
        title: newState ? "Artigo salvo nos favoritos" : "Artigo removido dos favoritos",
        description: newState ? "O artigo foi adicionado à sua lista de leitura." : "O artigo foi removido da sua lista de leitura.",
        variant: "default",
        className: "bg-neon-cyan/90 text-galaxy-dark border-0"
      });
      
      return newState;
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
      <Header />
      <main className="bg-zinc-950/90 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="my-6 hover:bg-zinc-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center text-gray-400 mb-6 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <span className="mx-2">|</span>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>{post.author}</span>
              </div>
            </div>

            <div className="aspect-video rounded-lg overflow-hidden mb-8 shadow-lg shadow-black/20">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <SafeHtmlRenderer
                html={post.content}
                className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-gray-300 prose-a:text-neon-cyan prose-a:no-underline hover:prose-a:underline prose-blockquote:border-neon-cyan prose-blockquote:bg-zinc-900/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
              />
              
              {/* Tags */}
              <div className="mt-10 mb-6">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <Button 
                      key={tag}
                      variant="outline"
                      size="sm"
                      asChild
                      className="rounded-full hover:bg-neon-cyan/20 hover:text-neon-cyan transition-colors"
                    >
                      <Link to={`/blog?tag=${tag}`}>
                        #{tag}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Share */}
              <div className="flex items-center justify-between border-t border-b border-zinc-800 py-4 mt-8">
                <div className="flex items-center">
                  <span className="mr-3 text-gray-400">Compartilhar:</span>
                  <div className="flex space-x-2">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="rounded-full w-9 h-9 p-0"
                      onClick={() => handleShare('facebook')}
                      disabled={sharingLoading !== null}
                    >
                      {sharingLoading === 'facebook' ? (
                        <ButtonLoadingSpinner size="sm" color="cyan" />
                      ) : (
                        <Facebook size={16} />
                      )}
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="rounded-full w-9 h-9 p-0"
                      onClick={() => handleShare('twitter')}
                      disabled={sharingLoading !== null}
                    >
                      {sharingLoading === 'twitter' ? (
                        <ButtonLoadingSpinner size="sm" color="cyan" />
                      ) : (
                        <Twitter size={16} />
                      )}
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="rounded-full w-9 h-9 p-0"
                      onClick={() => handleShare('linkedin')}
                      disabled={sharingLoading !== null}
                    >
                      {sharingLoading === 'linkedin' ? (
                        <ButtonLoadingSpinner size="sm" color="cyan" />
                      ) : (
                        <Linkedin size={16} />
                      )}
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="rounded-full w-9 h-9 p-0"
                      onClick={handleCopyLink}
                      disabled={sharingLoading !== null}
                    >
                      {sharingLoading === 'copy' ? (
                        <ButtonLoadingSpinner size="sm" color="cyan" />
                      ) : (
                        <Copy size={16} />
                      )}
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
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="bg-zinc-900/30 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-4 text-xl">Newsletter</h3>
                    <p className="text-gray-400 mb-4 text-sm">Receba as últimas notícias e artigos diretamente na sua caixa de entrada.</p>
                    <div className="flex flex-col space-y-2">
                      <input type="email" placeholder="Seu melhor email" className="bg-zinc-800 border-zinc-700 rounded-md px-3 py-2 text-sm focus:ring-neon-cyan focus:border-neon-cyan" />
                      <Button className="w-full">Inscrever-se</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogPost;
