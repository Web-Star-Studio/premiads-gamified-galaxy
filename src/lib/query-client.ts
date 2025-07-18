
import { QueryClient } from '@tanstack/react-query'

// Criar uma função para criar o QueryClient com configurações padrão
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Configurar staleTime para evitar refetch imediato
        staleTime: 5 * 60 * 1000, // 5 minutos
        // Configurar gcTime (anteriormente cacheTime) para limpeza do cache
        gcTime: 10 * 60 * 1000, // 10 minutos
        // Configurar retry padrão
        retry: (failureCount, error: any) => {
          // Não fazer retry em erros de abort
          if (error?.message?.includes('aborted')) {
            return false
          }
          return failureCount < 3
        },
        // Desabilitar refetch automático para prevenir problemas
        refetchOnWindowFocus: false,
        // Só refetch ao montar se não houver dados
        refetchOnMount: 'always',
        // Configurar refetchOnReconnect
        refetchOnReconnect: 'always',
      },
      mutations: {
        // Configurar retry para mutations
        retry: 1,
      },
    },
  })
}

// Variável para manter o client no browser
let browserQueryClient: QueryClient | undefined = undefined

// Função para obter o QueryClient (compatível com SSR)
export function getQueryClient() {
  // No servidor, sempre criar um novo client
  if (typeof window === 'undefined') {
    return makeQueryClient()
  }
  
  // No browser, reutilizar o client ou criar um novo se não existir
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  
  return browserQueryClient
}

// Exportar instância default para uso simples
export const queryClient = getQueryClient()
