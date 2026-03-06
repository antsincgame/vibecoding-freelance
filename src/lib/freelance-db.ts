/**
 * Freelance DB — data layer for VibeCoder Freelance
 * Uses shared Supabase-compatible Appwrite wrapper.
 * Fallback на mock-данные при недоступности AppWrite.
 */
import { getSupabase, getAccount } from './appwrite';
import type { Gig, GigPackage, Freelancer, Category, Review, Order, Message } from '../types';
import { MOCK_CATEGORIES, MOCK_FREELANCERS, MOCK_GIGS, MOCK_REVIEWS } from './mock-data';

const db = () => getSupabase();

// ============================================
// Types mapping (DB → Frontend)
// ============================================

function mapGig(row: any): Gig {
  const freelancer: Freelancer = {
    id: row.freelancer_id,
    username: row.freelancer_username || '',
    name: row.freelancer_name || '',
    avatar: '', // loaded separately from fl_profiles
    title: '',
    rating: row.rating || 0,
    reviewCount: row.review_count || 0,
    ordersCompleted: row.orders_count || 0,
    responseTime: '',
    isOnline: false,
    location: '',
    memberSince: '',
    bio: '',
    skills: [],
    successRate: 0,
    level: 'new',
  };

  // If no avatar in gig, will be enriched later from fl_profiles
  const parsePkg = (raw: any): GigPackage => {
    if (!raw) return { name: '', price: 0, deliveryDays: 0, description: '', features: [] };
    const p = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return { name: p.name || '', price: p.price || 0, deliveryDays: p.deliveryDays || 0, description: p.description || '', features: p.features || [] };
  };

  return {
    id: row.id,
    title: row.title || '',
    description: row.description || '',
    shortDescription: row.short_description || '',
    image: row.image || '',
    images: Array.isArray(row.images) ? row.images : (typeof row.images === 'string' ? (() => { try { return JSON.parse(row.images); } catch { return []; } })() : []),
    freelancer,
    rating: row.rating || 0,
    reviewCount: row.review_count || 0,
    ordersCount: row.orders_count || 0,
    tags: Array.isArray(row.tags) ? row.tags : [],
    category: row.category || '',
    categorySlug: row.category_slug || '',
    packages: {
      economy: parsePkg(row.package_economy),
      standard: parsePkg(row.package_standard),
      premium: parsePkg(row.package_premium),
    },
    isFeatured: row.is_featured || false,
  };
}

function mapFreelancer(row: any): Freelancer {
  return {
    id: row.user_id || row.id,
    username: row.username || '',
    name: row.name || '',
    avatar: row.avatar || '',
    title: row.title || '',
    rating: row.rating || 0,
    reviewCount: row.review_count || 0,
    ordersCompleted: row.orders_completed || 0,
    responseTime: row.response_time || '',
    isOnline: row.is_online || false,
    location: row.location || '',
    memberSince: row.member_since || '',
    bio: row.bio || '',
    skills: Array.isArray(row.skills) ? row.skills : (typeof row.skills === 'string' ? (() => { try { return JSON.parse(row.skills); } catch { return []; } })() : []),
    successRate: row.success_rate || 0,
    level: row.level || 'new',
  };
}

function mapCategory(row: any): Category {
  return {
    slug: row.slug || '',
    name: row.name || '',
    icon: row.icon || 'Globe',
    gigCount: row.gig_count || 0,
    description: row.description || '',
  };
}

function mapReview(row: any): Review {
  return {
    id: row.id,
    author: row.author_name || '',
    avatar: row.author_avatar || '',
    rating: row.rating || 0,
    text: row.text || '',
    date: row.$createdAt ? formatDate(row.$createdAt) : '',
    reply: row.reply || undefined,
  };
}

function mapOrder(row: any): Order {
  return {
    id: row.id,
    gigTitle: row.gig_title || '',
    freelancerName: row.seller_name || '',
    freelancerAvatar: row.seller_avatar || '',
    status: row.status || 'new',
    date: row.$createdAt ? formatDate(row.$createdAt) : '',
    price: row.price || 0,
    packageType: row.package_type || '',
  };
}

function mapMessage(row: any): Message {
  return {
    id: row.id,
    name: '', // filled from conversation
    avatar: '',
    lastMessage: row.last_message || '',
    time: row.last_message_at ? formatDate(row.last_message_at) : '',
    unread: 0,
    isOnline: false,
  };
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} мин назад`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ч назад`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} дн назад`;
    return d.toLocaleDateString('ru-RU');
  } catch { return ''; }
}

// ============================================
// Categories API
// ============================================

// Gig count cache
let _gigCountCache: Record<string, number> | null = null;
let _gigCountCacheTime = 0;

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await db().from('fl_categories').select('*').order('sort_order', { ascending: true });
    if (error || !data) return MOCK_CATEGORIES;
    const cats = (Array.isArray(data) ? data : [data]).map(mapCategory);
    
    // Cache gig counts for 5 min
    if (!_gigCountCache || Date.now() - _gigCountCacheTime > CACHE_TTL) {
      try {
        const { data: gigs } = await db().from('fl_gigs').select('*').eq('status', 'active');
        const gigList = Array.isArray(gigs) ? gigs : gigs ? [gigs] : [];
        _gigCountCache = {};
        for (const g of gigList) _gigCountCache[g.category_slug] = (_gigCountCache[g.category_slug] || 0) + 1;
        _gigCountCacheTime = Date.now();
      } catch {}
    }
    if (_gigCountCache) {
      for (const cat of cats) cat.gigCount = _gigCountCache[cat.slug] || 0;
    }
    return cats;
  } catch {
    return MOCK_CATEGORIES;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data, error } = await db().from('fl_categories').select('*').eq('slug', slug).maybeSingle();
    if (error || !data) return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
    return mapCategory(data);
  } catch {
    return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }
}

// ============================================
// Gigs API
// ============================================

export async function getGigs(opts?: { category_slug?: string; featured?: boolean; limit?: number; offset?: number; search?: string }): Promise<Gig[]> {
  try {
    let q = db().from('fl_gigs').select('*');
    if (opts?.category_slug) q = q.eq('category_slug', opts.category_slug);
    if (opts?.featured) q = q.eq('is_featured', true);
    q = q.eq('status', 'active');
    if (opts?.search) q = q.ilike('title', `%${opts.search}%`);
    if (opts?.limit) q = q.limit(opts.limit);
    if (opts?.offset) q = q.range(opts.offset, opts.offset + (opts.limit || 20) - 1);
    q = q.order('rating', { ascending: false });

    const { data, error } = await q;
    if (error || !data) return filterMockGigs(opts);
    const rows = Array.isArray(data) ? data : [data];
    const gigs = rows.map(mapGig);
    await enrichGigAvatars(gigs);
    return gigs;
  } catch {
    return filterMockGigs(opts);
  }
}

function filterMockGigs(opts?: { category_slug?: string; featured?: boolean; limit?: number; offset?: number; search?: string }): Gig[] {
  let result = [...MOCK_GIGS];
  if (opts?.category_slug) result = result.filter((g) => g.categorySlug === opts.category_slug);
  if (opts?.featured) result = result.filter((g) => g.isFeatured);
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    result = result.filter((g) => g.title.toLowerCase().includes(q) || g.tags.some((t) => t.toLowerCase().includes(q)));
  }
  const offset = opts?.offset ?? 0;
  const limit = opts?.limit ?? 20;
  return result.slice(offset, offset + limit);
}

// Profile cache (5 min TTL)
let _profileCache: any[] | null = null;
let _profileCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function getProfilesCache(): Promise<any[]> {
  if (_profileCache && Date.now() - _profileCacheTime < CACHE_TTL) return _profileCache;
  try {
    const { data } = await db().from('fl_profiles').select('*');
    _profileCache = Array.isArray(data) ? data : data ? [data] : [];
    _profileCacheTime = Date.now();
    return _profileCache;
  } catch { return _profileCache || []; }
}

async function enrichGigAvatars(gigs: Gig[]) {
  if (gigs.length === 0) return;
  const uniqueIds = [...new Set(gigs.map(g => g.freelancer.id).filter(Boolean))];
  if (uniqueIds.length === 0) return;
  try {
    const profiles = await getProfilesCache();
    for (const gig of gigs) {
      const prof = profiles.find((p: any) => p.user_id === gig.freelancer.id);
      if (prof) {
        gig.freelancer.avatar = prof.avatar || '';
        gig.freelancer.level = prof.level || 'new';
      }
    }
  } catch {}
}

export async function getGigById(id: string): Promise<Gig | null> {
  try {
    const { data, error } = await db().from('fl_gigs').select('*').eq('id', id).maybeSingle();
    if (error || !data) return MOCK_GIGS.find((g) => g.id === id) ?? null;
    const gig = mapGig(data);
    await enrichGigAvatars([gig]);
    return gig;
  } catch {
    return MOCK_GIGS.find((g) => g.id === id) ?? null;
  }
}

export async function getGigsByFreelancer(freelancerId: string): Promise<Gig[]> {
  try {
    const { data, error } = await db().from('fl_gigs').select('*').eq('freelancer_id', freelancerId).eq('status', 'active');
    if (error || !data) return MOCK_GIGS.filter((g) => g.freelancer.id === freelancerId);
    const gigs = (Array.isArray(data) ? data : [data]).map(mapGig);
    await enrichGigAvatars(gigs);
    return gigs;
  } catch {
    return MOCK_GIGS.filter((g) => g.freelancer.id === freelancerId);
  }
}

export async function createGig(gigData: any): Promise<Gig | null> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    // Get freelancer profile
    const { data: profile } = await db().from('fl_profiles').select('*').eq('user_id', user.$id).maybeSingle();
    if (!profile) throw new Error('No freelancer profile');

    const doc: any = {
      title: gigData.title,
      description: gigData.description,
      short_description: gigData.shortDescription || gigData.title,
      image: gigData.image || '',
      images: JSON.stringify(gigData.images || []),
      freelancer_id: user.$id,
      freelancer_name: profile.name,
      freelancer_username: profile.username,
      rating: 0,
      review_count: 0,
      orders_count: 0,
      tags: JSON.stringify(gigData.tags || []),
      category: gigData.category,
      category_slug: gigData.categorySlug,
      is_featured: false,
      status: 'pending', // goes through moderation
      package_economy: JSON.stringify(gigData.packages?.economy || {}),
      package_standard: JSON.stringify(gigData.packages?.standard || {}),
      package_premium: JSON.stringify(gigData.packages?.premium || {}),
    };

    const { data, error } = await db().from('fl_gigs').insert(doc);
    if (error) throw error;
    return data ? mapGig(data) : null;
  } catch (e) {
    console.error('createGig error:', e);
    return null;
  }
}

export async function updateGig(gigId: string, updates: any): Promise<boolean> {
  const clean: any = {};
  if (updates.title) clean.title = updates.title;
  if (updates.description) clean.description = updates.description;
  if (updates.short_description) clean.short_description = updates.short_description;
  if (updates.image) clean.image = updates.image;
  if (updates.images) clean.images = JSON.stringify(updates.images);
  if (updates.tags) clean.tags = JSON.stringify(updates.tags);
  if (updates.category) clean.category = updates.category;
  if (updates.category_slug) clean.category_slug = updates.category_slug;
  if (updates.status) clean.status = updates.status;
  if (updates.packages?.economy) clean.package_economy = JSON.stringify(updates.packages.economy);
  if (updates.packages?.standard) clean.package_standard = JSON.stringify(updates.packages.standard);
  if (updates.packages?.premium) clean.package_premium = JSON.stringify(updates.packages.premium);

  const { error } = await db().from('fl_gigs').update(clean).eq('id', gigId);
  return !error;
}

export async function deleteGig(gigId: string): Promise<boolean> {
  // Soft delete - set status to deleted
  const { error } = await db().from('fl_gigs').update({ status: 'deleted' }).eq('id', gigId);
  return !error;
}

// ============================================
// Freelancer Profiles API
// ============================================

export async function getFreelancerByUsername(username: string): Promise<Freelancer | null> {
  try {
    const { data, error } = await db().from('fl_profiles').select('*').eq('username', username).maybeSingle();
    if (error || !data) return MOCK_FREELANCERS.find((f) => f.username === username) ?? null;
    return mapFreelancer(data);
  } catch {
    return MOCK_FREELANCERS.find((f) => f.username === username) ?? null;
  }
}

export async function getFreelancerById(userId: string): Promise<Freelancer | null> {
  try {
    const { data, error } = await db().from('fl_profiles').select('*').eq('user_id', userId).maybeSingle();
    if (error || !data) return MOCK_FREELANCERS.find((f) => f.id === userId) ?? null;
    return mapFreelancer(data);
  } catch {
    return MOCK_FREELANCERS.find((f) => f.id === userId) ?? null;
  }
}

export async function getTopFreelancers(limit = 8): Promise<Freelancer[]> {
  try {
    const { data, error } = await db().from('fl_profiles').select('*').order('rating', { ascending: false }).limit(limit);
    if (error || !data) return MOCK_FREELANCERS.slice(0, limit);
    return (Array.isArray(data) ? data : [data]).map(mapFreelancer);
  } catch {
    return MOCK_FREELANCERS.slice(0, limit);
  }
}

export async function getCurrentFreelancerProfile(): Promise<Freelancer | null> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    return getFreelancerById(user.$id);
  } catch { return null; }
}

export async function createFreelancerProfile(data: {
  username: string; name: string; avatar?: string; title?: string;
  bio?: string; location?: string; skills?: string[]; role?: string;
}): Promise<boolean> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    const { error } = await db().from('fl_profiles').insert({
      user_id: user.$id,
      username: data.username,
      name: data.name,
      avatar: data.avatar || '',
      title: data.title || '',
      bio: data.bio || '',
      location: data.location || '',
      skills: JSON.stringify(data.skills || []),
      role: data.role || 'freelancer',
      rating: 0,
      review_count: 0,
      orders_completed: 0,
      response_time: '',
      is_online: false,
      member_since: new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }),
      success_rate: 0,
      level: 'new',
      balance: 0,
    });
    return !error;
  } catch (e) {
    console.error('createFreelancerProfile error:', e);
    return false;
  }
}

export async function updateFreelancerProfile(updates: Partial<Freelancer>): Promise<boolean> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    const clean: any = {};
    if (updates.name) clean.name = updates.name;
    if (updates.title) clean.title = updates.title;
    if (updates.bio) clean.bio = updates.bio;
    if (updates.location) clean.location = updates.location;
    if (updates.skills) clean.skills = JSON.stringify(updates.skills);
    if (updates.avatar) clean.avatar = updates.avatar;
    
    const { error } = await db().from('fl_profiles').update(clean).eq('user_id', user.$id);
    return !error;
  } catch { return false; }
}

// ============================================
// Reviews API
// ============================================

export async function getReviewsByGig(gigId: string): Promise<Review[]> {
  try {
    const { data, error } = await db().from('fl_reviews').select('*').eq('gig_id', gigId).order('$createdAt', { ascending: false });
    if (error || !data) return MOCK_REVIEWS;
    return (Array.isArray(data) ? data : [data]).map(mapReview);
  } catch {
    return MOCK_REVIEWS;
  }
}

export async function getLatestReviews(limit = 3): Promise<Review[]> {
  try {
    const { data, error } = await db().from('fl_reviews').select('*').order('$createdAt', { ascending: false }).limit(limit);
    if (error || !data) return MOCK_REVIEWS.slice(0, limit);
    return (Array.isArray(data) ? data : [data]).map(mapReview);
  } catch {
    return MOCK_REVIEWS.slice(0, limit);
  }
}

export async function createReview(review: { gig_id: string; order_id?: string; rating: number; text: string }): Promise<boolean> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    const { data: profile } = await db().from('fl_profiles').select('*').eq('user_id', user.$id).maybeSingle();
    
    const { error } = await db().from('fl_reviews').insert({
      gig_id: review.gig_id,
      order_id: review.order_id || '',
      author_id: user.$id,
      author_name: profile?.name || user.name || 'Пользователь',
      author_avatar: profile?.avatar || '',
      rating: review.rating,
      text: review.text,
      reply: '',
    });
    return !error;
  } catch { return false; }
}

// ============================================
// Orders API
// ============================================

export async function getMyOrders(role: 'buyer' | 'seller'): Promise<Order[]> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    const field = role === 'buyer' ? 'buyer_id' : 'seller_id';
    const { data, error } = await db().from('fl_orders').select('*').eq(field, user.$id).order('$createdAt', { ascending: false });
    if (error || !data) return [];
    return (Array.isArray(data) ? data : [data]).map(mapOrder);
  } catch { return []; }
}

export async function createOrder(order: { gig_id: string; package_type: string; requirements?: string }): Promise<Order | null> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    const gig = await getGigById(order.gig_id);
    if (!gig) { console.error('createOrder: gig not found', order.gig_id); return null; }

    const pkg = gig.packages[order.package_type as keyof typeof gig.packages];
    if (!pkg) { console.error('createOrder: package not found', order.package_type); return null; }

    const orderData = {
      gig_id: order.gig_id,
      gig_title: (gig.title || '').slice(0, 295),
      buyer_id: user.$id,
      client_id: user.$id,
      seller_id: gig.freelancer.id || 'unknown',
      seller_name: (gig.freelancer.name || '').slice(0, 195),
      seller_avatar: (gig.freelancer.avatar || '').slice(0, 495),
      package_type: (order.package_type || '').slice(0, 19),
      price: Math.round(Number(pkg.price) || 0),
      status: 'new',
      requirements: (order.requirements || '').slice(0, 1995),
      delivery_days: Math.round(Number(pkg.deliveryDays) || 1),
    };

    console.log('createOrder: inserting', orderData);
    const { data, error } = await db().from('fl_orders').insert(orderData);
    if (error) { console.error('createOrder error:', error); return null; }
    
    // Email notification to seller (non-blocking)
    try {
      const { notifyNewOrder } = await import('./email');
      notifyNewOrder(user.email || '', {
        gigTitle: gig.title,
        buyerName: user.name || 'Покупатель',
        packageType: order.package_type,
        price: pkg.price,
        orderId: data?.id || '',
      });
    } catch {}

    return data ? mapOrder(data) : null;
  } catch (e: any) {
    console.error('createOrder exception:', e?.message || e);
    return null;
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  const updates: any = { status };
  if (status === 'delivered') updates.delivered_at = new Date().toISOString();
  if (status === 'completed') updates.completed_at = new Date().toISOString();
  const { error } = await db().from('fl_orders').update(updates).eq('id', orderId);
  return !error;
}

// ============================================
// Favorites API
// ============================================

export async function getFavoriteGigs(): Promise<Gig[]> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    const { data: favs } = await db().from('fl_favorites').select('*').eq('user_id', user.$id);
    if (!favs) return [];
    const ids = (Array.isArray(favs) ? favs : [favs]).map((f: any) => f.gig_id);
    if (ids.length === 0) return [];
    
    // Fetch gigs one by one (Appwrite doesn't support IN on $id easily through wrapper)
    const gigs: Gig[] = [];
    for (const id of ids) {
      const gig = await getGigById(id);
      if (gig) gigs.push(gig);
    }
    return gigs;
  } catch { return []; }
}

export async function toggleFavorite(gigId: string): Promise<boolean> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    
    // Check if already favorited
    const { data: existing } = await db().from('fl_favorites').select('*').eq('user_id', user.$id).eq('gig_id', gigId).maybeSingle();
    
    if (existing) {
      await db().from('fl_favorites').delete().eq('id', existing.id);
      return false; // removed
    } else {
      await db().from('fl_favorites').insert({ user_id: user.$id, gig_id: gigId });
      return true; // added
    }
  } catch { return false; }
}

export async function isFavorite(gigId: string): Promise<boolean> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    const { data } = await db().from('fl_favorites').select('*').eq('user_id', user.$id).eq('gig_id', gigId).maybeSingle();
    return !!data;
  } catch { return false; }
}

// ============================================
// Conversations/Messages API
// ============================================

export async function getConversations(): Promise<any[]> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    // Can't easily filter JSON array, so get all and filter client-side
    const { data, error } = await db().from('fl_conversations').select('*').order('last_message_at', { ascending: false });
    if (error || !data) return [];
    const rows = Array.isArray(data) ? data : [data];
    return rows.filter((c: any) => {
      const ids = Array.isArray(c.participant_ids) ? c.participant_ids : [];
      return ids.includes(user.$id);
    });
  } catch { return []; }
}

export async function getMessages(conversationId: string): Promise<any[]> {
  const { data, error } = await db().from('fl_messages').select('*').eq('conversation_id', conversationId).order('$createdAt', { ascending: true });
  if (error || !data) return [];
  return Array.isArray(data) ? data : [data];
}

export async function startConversation(otherUserId: string, otherName: string, otherAvatar: string): Promise<string | null> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    const { data: myProfile } = await db().from('fl_profiles').select('*').eq('user_id', user.$id).maybeSingle();

    // Check if conversation already exists
    const existing = await getConversations();
    const found = existing.find((c: any) => {
      const ids = Array.isArray(c.participant_ids) ? c.participant_ids : [];
      return ids.includes(otherUserId);
    });
    if (found) return found.id;

    const names: Record<string, string> = {};
    names[user.$id] = myProfile?.name || user.name || 'User';
    names[otherUserId] = otherName;

    const avatars: Record<string, string> = {};
    avatars[user.$id] = myProfile?.avatar || '';
    avatars[otherUserId] = otherAvatar;

    const { data, error } = await db().from('fl_conversations').insert({
      participant_ids: JSON.stringify([user.$id, otherUserId]),
      participant_names: JSON.stringify(names),
      participant_avatars: JSON.stringify(avatars),
      last_message: '',
      last_message_at: new Date().toISOString(),
      order_id: '',
    });
    if (error || !data) return null;
    return data.id;
  } catch { return null; }
}

export async function sendMessage(conversationId: string, content: string): Promise<boolean> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    const { error } = await db().from('fl_messages').insert({
      conversation_id: conversationId,
      sender_id: user.$id,
      content,
      type: 'text',
      read: false,
    });
    if (error) return false;
    
    // Update conversation last message
    await db().from('fl_conversations').update({
      last_message: content.slice(0, 200),
      last_message_at: new Date().toISOString(),
    }).eq('id', conversationId);
    
    return true;
  } catch { return false; }
}

// ============================================
// Search
// ============================================

export async function searchGigs(query: string): Promise<Gig[]> {
  if (!query.trim()) return [];
  return getGigs({ search: query.trim(), limit: 20 });
}

// ============================================
// Popular searches (static for now)
// ============================================

export const popularSearches = [
  'AI чат-бот', 'MVP за 3 дня', 'Telegram бот с GPT', 'React приложение',
  'Вайб-кодинг', 'RAG система', 'Cursor разработка', 'Автоматизация с AI',
];
