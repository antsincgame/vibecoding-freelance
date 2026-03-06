import { useState, useEffect, useCallback } from 'react';
import type { Gig, Category, Freelancer, Review, Order } from '../types';
import * as fdb from '../lib/freelance-db';

// Generic async data hook
function useAsync<T>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, refetch };
}

// ============================================
// Categories
// ============================================

export function useCategories() {
  return useAsync<Category[]>(() => fdb.getCategories(), []);
}

export function useCategory(slug: string | undefined) {
  return useAsync<Category | null>(
    () => slug ? fdb.getCategoryBySlug(slug) : Promise.resolve(null),
    [slug]
  );
}

// ============================================
// Gigs
// ============================================

export function useGigs(opts?: { category_slug?: string; featured?: boolean; limit?: number; search?: string }) {
  return useAsync<Gig[]>(
    () => fdb.getGigs(opts),
    [opts?.category_slug, opts?.featured, opts?.limit, opts?.search]
  );
}

export function useFeaturedGigs() {
  return useAsync<Gig[]>(() => fdb.getGigs({ featured: true }), []);
}

export function useGig(id: string | undefined) {
  return useAsync<Gig | null>(
    () => id ? fdb.getGigById(id) : Promise.resolve(null),
    [id]
  );
}

export function useFreelancerGigs(freelancerId: string | undefined) {
  return useAsync<Gig[]>(
    () => freelancerId ? fdb.getGigsByFreelancer(freelancerId) : Promise.resolve([]),
    [freelancerId]
  );
}

// ============================================
// Freelancers
// ============================================

export function useFreelancerByUsername(username: string | undefined) {
  return useAsync<Freelancer | null>(
    () => username ? fdb.getFreelancerByUsername(username) : Promise.resolve(null),
    [username]
  );
}

export function useTopFreelancers(limit = 8) {
  return useAsync<Freelancer[]>(() => fdb.getTopFreelancers(limit), [limit]);
}

export function useCurrentFreelancer() {
  return useAsync<Freelancer | null>(() => fdb.getCurrentFreelancerProfile(), []);
}

// ============================================
// Reviews
// ============================================

export function useGigReviews(gigId: string | undefined) {
  return useAsync<Review[]>(
    () => gigId ? fdb.getReviewsByGig(gigId) : Promise.resolve([]),
    [gigId]
  );
}

export function useLatestReviews(limit = 3) {
  return useAsync<Review[]>(() => fdb.getLatestReviews(limit), [limit]);
}

// ============================================
// Orders
// ============================================

export function useMyOrders(role: 'buyer' | 'seller') {
  return useAsync<Order[]>(() => fdb.getMyOrders(role), [role]);
}

// ============================================
// Favorites
// ============================================

export function useFavoriteGigs() {
  return useAsync<Gig[]>(() => fdb.getFavoriteGigs(), []);
}

export function useFavoriteStatus(gigId: string | undefined) {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!gigId) return;
    fdb.isFavorite(gigId).then(setIsFav).catch(() => {});
  }, [gigId]);

  const toggle = useCallback(async () => {
    if (!gigId || loading) return;
    setLoading(true);
    const result = await fdb.toggleFavorite(gigId);
    setIsFav(result);
    setLoading(false);
  }, [gigId, loading]);

  return { isFavorite: isFav, toggleFavorite: toggle, loading };
}

// ============================================
// Conversations
// ============================================

export function useConversations() {
  return useAsync<any[]>(() => fdb.getConversations(), []);
}

export function useMessages(conversationId: string | undefined) {
  return useAsync<any[]>(
    () => conversationId ? fdb.getMessages(conversationId) : Promise.resolve([]),
    [conversationId]
  );
}

// ============================================
// Search
// ============================================

export function useSearch(query: string) {
  const [results, setResults] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      const data = await fdb.searchGigs(query);
      setResults(data);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return { results, loading };
}
