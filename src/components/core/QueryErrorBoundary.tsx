import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { queryClient } from '@/lib/query-client';

interface QueryErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
}

interface QueryErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class QueryErrorBoundary extends Component<QueryErrorBoundaryProps, QueryErrorBoundaryState> {
  constructor(props: QueryErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): QueryErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console
    console.error('[QueryErrorBoundary] Caught error:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      errorInfo
    });
  }

  handleReset = () => {
    // Clear all queries
    queryClient.clear();
    
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Reload the page to ensure clean state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-galaxy-dark">
          <Card className="max-w-lg w-full bg-galaxy-darkPurple border-galaxy-purple">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                Erro na Aplicação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {this.props.fallbackMessage || 
                 'Ocorreu um erro ao carregar os dados. Isso pode acontecer ao mudar de aba ou devido a problemas de conexão.'}
              </p>
              
              {this.state.error && (
                <div className="bg-galaxy-dark/50 p-3 rounded-lg border border-galaxy-purple/30">
                  <p className="text-sm font-mono text-red-300">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  onClick={this.handleReset}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Recarregar Página
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Voltar
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Se o problema persistir, tente limpar o cache do navegador ou entrar em contato com o suporte.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
} 