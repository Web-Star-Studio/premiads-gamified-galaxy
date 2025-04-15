
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Verificar se estamos no lado do cliente para evitar erros no SSR
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    function handleChange() {
      setMatches(getMatches(query));
    }

    const matchMedia = window.matchMedia(query);

    // Inicializar
    handleChange();

    // Adicionar listener
    if (matchMedia.addListener) {
      // Versão mais antiga
      matchMedia.addListener(handleChange);
    } else {
      // Versão mais recente
      matchMedia.addEventListener("change", handleChange);
    }

    // Limpar listener
    return () => {
      if (matchMedia.removeListener) {
        // Versão mais antiga
        matchMedia.removeListener(handleChange);
      } else {
        // Versão mais recente
        matchMedia.removeEventListener("change", handleChange);
      }
    };
  }, [query]);

  return matches;
}

export const useIsMobile = () => useMediaQuery("(max-width: 640px)");
export const useIsTablet = () => useMediaQuery("(max-width: 1024px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1025px)");

export default useMediaQuery;
