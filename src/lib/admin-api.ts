/**
 * Admin API — data layer for admin panel
 * Uses shared Appwrite wrapper
 */
import { getSupabase, getAccount } from '@vibecoding/shared';

const db = () => getSupabase();

// Admin email whitelist
const ADMIN_EMAILS = ['igorsuhockii@gmail.com', 'graf.arlou@ya.ru'];

export async function isAdmin(): Promise<boolean> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    return ADMIN_EMAILS.includes(user.email);
  } catch {
    return false;
  }
}

// ============================================
// Stats
// ============================================

export async function getAdminStats() {
  const [gigs, profiles, orders, reviews, categories] = await Promise.all([
    db().from('fl_gigs').select('*', { count: 'exact', head: true }),
    db().from('fl_profiles').select('*', { count: 'exact', head: true }),
    db().from('fl_orders').select('*', { count: 'exact', head: true }),
    db().from('fl_reviews').select('*', { count: 'exact', head: true }),
    db().from('fl_categories').select('*', { count: 'exact', head: true }),
  ]);

  return {
    gigsCount: gigs.count || 0,
    profilesCount: profiles.count || 0,
    ordersCount: orders.count || 0,
    reviewsCount: reviews.count || 0,
    categoriesCount: categories.count || 0,
  };
}

// ============================================
// Categories CRUD
// ============================================

export async function adminGetCategories() {
  const { data } = await db().from('fl_categories').select('*').order('sort_order', { ascending: true });
  return Array.isArray(data) ? data : data ? [data] : [];
}

export async function adminCreateCategory(cat: { slug: string; name: string; icon: string; description: string; sort_order: number }) {
  const { data, error } = await db().from('fl_categories').insert({ ...cat, gig_count: 0 });
  return { data, error };
}

export async function adminUpdateCategory(id: string, updates: any) {
  const { data, error } = await db().from('fl_categories').update(updates).eq('id', id);
  return { data, error };
}

export async function adminDeleteCategory(id: string) {
  const { error } = await db().from('fl_categories').delete().eq('id', id);
  return { error };
}

// ============================================
// Gigs Management
// ============================================

export async function adminGetGigs(status?: string) {
  let q = db().from('fl_gigs').select('*').order('$createdAt', { ascending: false });
  if (status && status !== 'all') q = q.eq('status', status);
  const { data } = await q;
  return Array.isArray(data) ? data : data ? [data] : [];
}

export async function adminUpdateGig(id: string, updates: any) {
  const { data, error } = await db().from('fl_gigs').update(updates).eq('id', id);
  return { data, error };
}

export async function adminDeleteGig(id: string) {
  const { error } = await db().from('fl_gigs').delete().eq('id', id);
  return { error };
}

export async function adminSetGigFeatured(id: string, featured: boolean) {
  return adminUpdateGig(id, { is_featured: featured });
}

export async function adminSetGigStatus(id: string, status: string) {
  return adminUpdateGig(id, { status });
}

// ============================================
// Users / Profiles Management
// ============================================

export async function adminGetProfiles() {
  const { data } = await db().from('fl_profiles').select('*').order('$createdAt', { ascending: false });
  return Array.isArray(data) ? data : data ? [data] : [];
}

export async function adminUpdateProfile(id: string, updates: any) {
  const { data, error } = await db().from('fl_profiles').update(updates).eq('id', id);
  return { data, error };
}

export async function adminDeleteProfile(id: string) {
  const { error } = await db().from('fl_profiles').delete().eq('id', id);
  return { error };
}

export async function adminSetUserLevel(id: string, level: string) {
  return adminUpdateProfile(id, { level });
}

// ============================================
// Orders Management
// ============================================

export async function adminGetOrders(status?: string) {
  let q = db().from('fl_orders').select('*').order('$createdAt', { ascending: false });
  if (status && status !== 'all') q = q.eq('status', status);
  const { data } = await q;
  return Array.isArray(data) ? data : data ? [data] : [];
}

export async function adminUpdateOrder(id: string, updates: any) {
  const { data, error } = await db().from('fl_orders').update(updates).eq('id', id);
  return { data, error };
}

// ============================================
// Reviews Management
// ============================================

export async function adminGetReviews() {
  const { data } = await db().from('fl_reviews').select('*').order('$createdAt', { ascending: false });
  return Array.isArray(data) ? data : data ? [data] : [];
}

export async function adminDeleteReview(id: string) {
  const { error } = await db().from('fl_reviews').delete().eq('id', id);
  return { error };
}
