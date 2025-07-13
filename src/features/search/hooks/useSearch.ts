import { useState, useCallback } from 'react';
import { searchApi } from '../search.api';

interface SearchResult {
  type: 'artisan' | 'intervention' | 'client' | 'notif';
  id: string;
  label: string;
  description?: string;
}

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchApi.search(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    results,
    isLoading,
    search,
  };
}; 