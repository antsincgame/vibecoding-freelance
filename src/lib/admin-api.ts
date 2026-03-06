/**
 * Admin API — data layer for admin panel
 * Uses shared Appwrite wrapper
 */
import { getSupabase, getAccount } from './appwrite';

const db = () => getSupabase();

// Admin/Moderator access
const ADMIN_EMAILS = ['igorsuhockii@gmail.com', 'graf.arlou@ya.ru'];
const MODERATOR_EMAILS: string[] = []; // add moderator emails here

export async function isAdmin(): Promise<boolean> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    return ADMIN_EMAILS.includes(user.email);
  } catch {
    return false;
  }
}

export async function isModerator(): Promise<boolean> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    return MODERATOR_EMAILS.includes(user.email) || ADMIN_EMAILS.includes(user.email);
  } catch {
    return false;
  }
}

export type AdminRole = 'admin' | 'moderator' | null;

export async function getAdminRole(): Promise<AdminRole> {
  try {
    const acc = getAccount();
    const user = await acc.get();
    if (ADMIN_EMAILS.includes(user.email)) return 'admin';
    if (MODERATOR_EMAILS.includes(user.email)) return 'moderator';
    return null;
  } catch {
    return null;
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

export async function adminVerifyUser(id: string) {
  return adminUpdateProfile(id, { level: 'verified' });
}

export async function adminUnverifyUser(id: string) {
  return adminUpdateProfile(id, { level: 'new' });
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

// ============================================
// Moderation
// ============================================

export async function adminApproveGig(id: string) {
  const acc = getAccount();
  const user = await acc.get();
  return adminUpdateGig(id, {
    status: 'active',
    rejection_reason: '',
    moderated_by: user.email,
    moderated_at: new Date().toISOString(),
  });
}

export async function adminRejectGig(id: string, reason: string) {
  const acc = getAccount();
  const user = await acc.get();
  return adminUpdateGig(id, {
    status: 'rejected',
    rejection_reason: reason,
    moderated_by: user.email,
    moderated_at: new Date().toISOString(),
  });
}

// ============================================
// Tickets / Support
// ============================================

export async function adminGetTickets(status?: string) {
  let q = db().from('fl_tickets').select('*').order('$createdAt', { ascending: false });
  if (status && status !== 'all') q = q.eq('status', status);
  const { data } = await q;
  return Array.isArray(data) ? data : data ? [data] : [];
}

export async function adminGetTicket(id: string) {
  const { data } = await db().from('fl_tickets').select('*').eq('id', id).maybeSingle();
  return data;
}

export async function adminUpdateTicket(id: string, updates: any) {
  const { data, error } = await db().from('fl_tickets').update(updates).eq('id', id);
  return { data, error };
}

export async function adminGetTicketMessages(ticketId: string) {
  const { data } = await db().from('fl_ticket_messages').select('*').eq('ticket_id', ticketId).order('$createdAt', { ascending: true });
  return Array.isArray(data) ? data : data ? [data] : [];
}

export async function adminReplyTicket(ticketId: string, message: string) {
  const acc = getAccount();
  const user = await acc.get();
  const { error } = await db().from('fl_ticket_messages').insert({
    ticket_id: ticketId,
    sender_id: user.$id,
    sender_name: user.name || user.email,
    message,
    is_admin: true,
  });
  if (!error) {
    await db().from('fl_tickets').update({ status: 'answered' }).eq('id', ticketId);
    
    // Email notification to user
    try {
      const ticket = await adminGetTicket(ticketId);
      if (ticket?.user_email) {
        const { notifyTicketReply } = await import('./email');
        notifyTicketReply(ticket.user_email, { subject: ticket.subject, preview: message.slice(0, 200) });
      }
    } catch {}
  }
  return { error };
}

// ============================================
// User-facing ticket functions
// ============================================

export async function createTicket(data: { subject: string; category: string; message: string; related_id?: string }) {
  const acc = getAccount();
  const user = await acc.get();
  
  // Get fl_profile for name
  const { data: profile } = await db().from('fl_profiles').select('*').eq('user_id', user.$id).maybeSingle();

  const { data: ticket, error } = await db().from('fl_tickets').insert({
    user_id: user.$id,
    user_name: profile?.name || user.name || 'User',
    user_email: user.email,
    subject: data.subject,
    category: data.category || 'general',
    status: 'open',
    priority: 'normal',
    related_id: data.related_id || '',
    assigned_to: '',
    closed_at: '',
  });

  if (error || !ticket) return { error: error || { message: 'Failed' } };

  // Add first message
  await db().from('fl_ticket_messages').insert({
    ticket_id: ticket.id,
    sender_id: user.$id,
    sender_name: profile?.name || user.name || 'User',
    message: data.message,
    is_admin: false,
  });

  return { data: ticket, error: null };
}

export async function getMyTickets() {
  const acc = getAccount();
  const user = await acc.get();
  const { data } = await db().from('fl_tickets').select('*').eq('user_id', user.$id).order('$createdAt', { ascending: false });
  return Array.isArray(data) ? data : data ? [data] : [];
}

export async function getTicketMessages(ticketId: string) {
  return adminGetTicketMessages(ticketId);
}

export async function replyToTicket(ticketId: string, message: string) {
  const acc = getAccount();
  const user = await acc.get();
  const { data: profile } = await db().from('fl_profiles').select('*').eq('user_id', user.$id).maybeSingle();
  
  const { error } = await db().from('fl_ticket_messages').insert({
    ticket_id: ticketId,
    sender_id: user.$id,
    sender_name: profile?.name || user.name || 'User',
    message,
    is_admin: false,
  });
  if (!error) {
    await db().from('fl_tickets').update({ status: 'open' }).eq('id', ticketId);
  }
  return { error };
}
