/**
 * Email notifications via vibecoding-api (Resend)
 * API is at vibecoding.by/functions/v1/send-email
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://vibecoding.by/functions/v1';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    console.error('Email send failed');
    return false;
  }
}

// ============================================
// Templates
// ============================================

const BRAND = 'VibeCoder';
const BASE_URL = 'https://freelance.vibecoding.by';

function wrap(content: string): string {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a14; color: #e0e0e0; border-radius: 12px; overflow: hidden; border: 1px solid rgba(212,175,55,0.2);">
      <div style="padding: 24px; text-align: center; border-bottom: 1px solid rgba(212,175,55,0.2);">
        <span style="font-size: 24px; font-weight: bold; color: #d4af37; letter-spacing: 3px;">⚡ ${BRAND}</span>
      </div>
      <div style="padding: 32px 24px;">
        ${content}
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid rgba(212,175,55,0.1); text-align: center;">
        <span style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} ${BRAND} — Маркетплейс AI-разработчиков</span>
      </div>
    </div>
  `;
}

function btn(text: string, url: string): string {
  return `<a href="${url}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #d4af37, #b8962e); color: #0a0a14; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; margin-top: 16px;">${text}</a>`;
}

// ============================================
// Notification Types
// ============================================

export async function notifyNewOrder(sellerEmail: string, data: { gigTitle: string; buyerName: string; packageType: string; price: number; orderId: string }) {
  return sendEmail({
    to: sellerEmail,
    subject: `🎉 Новый заказ: ${data.gigTitle}`,
    html: wrap(`
      <h2 style="color: #e0e0e0; margin: 0 0 16px;">Новый заказ!</h2>
      <p style="color: #aaa; line-height: 1.6;">Покупатель <strong style="color: #d4af37;">${data.buyerName}</strong> оформил заказ на вашу услугу.</p>
      <div style="background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.2); border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="margin: 4px 0; color: #ccc;">📦 <strong>${data.gigTitle}</strong></p>
        <p style="margin: 4px 0; color: #ccc;">📋 Пакет: ${data.packageType}</p>
        <p style="margin: 4px 0; color: #d4af37; font-size: 18px; font-weight: bold;">${data.price.toLocaleString('ru-RU')} ₽</p>
      </div>
      <p style="color: #aaa;">Примите заказ и начните работу.</p>
      ${btn('Открыть заказ', `${BASE_URL}/orders/${data.orderId}`)}
    `),
  });
}

export async function notifyOrderStatus(email: string, data: { gigTitle: string; status: string; orderId: string }) {
  const statusLabels: Record<string, string> = {
    in_progress: '🔨 Взят в работу',
    delivered: '📦 Работа сдана',
    completed: '✅ Заказ завершён',
    revision: '🔄 Запрошена доработка',
    cancelled: '❌ Заказ отменён',
  };
  const label = statusLabels[data.status] || data.status;

  return sendEmail({
    to: email,
    subject: `${label}: ${data.gigTitle}`,
    html: wrap(`
      <h2 style="color: #e0e0e0; margin: 0 0 16px;">Статус заказа обновлён</h2>
      <div style="background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.2); border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="margin: 4px 0; color: #ccc;">📦 <strong>${data.gigTitle}</strong></p>
        <p style="margin: 8px 0; color: #d4af37; font-size: 16px; font-weight: bold;">${label}</p>
      </div>
      ${btn('Открыть заказ', `${BASE_URL}/orders/${data.orderId}`)}
    `),
  });
}

export async function notifyNewMessage(email: string, data: { senderName: string; preview: string }) {
  return sendEmail({
    to: email,
    subject: `💬 Новое сообщение от ${data.senderName}`,
    html: wrap(`
      <h2 style="color: #e0e0e0; margin: 0 0 16px;">Новое сообщение</h2>
      <p style="color: #aaa;">От: <strong style="color: #d4af37;">${data.senderName}</strong></p>
      <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 3px solid #d4af37;">
        <p style="color: #ccc; margin: 0;">${data.preview}</p>
      </div>
      ${btn('Открыть чат', `${BASE_URL}/chat`)}
    `),
  });
}

export async function notifyNewReview(email: string, data: { gigTitle: string; rating: number; reviewerName: string }) {
  const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);
  return sendEmail({
    to: email,
    subject: `⭐ Новый отзыв на "${data.gigTitle}"`,
    html: wrap(`
      <h2 style="color: #e0e0e0; margin: 0 0 16px;">Новый отзыв!</h2>
      <p style="color: #aaa;"><strong style="color: #d4af37;">${data.reviewerName}</strong> оставил отзыв на вашу услугу.</p>
      <div style="background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.2); border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
        <p style="font-size: 24px; color: #d4af37; margin: 0;">${stars}</p>
        <p style="color: #ccc; margin: 8px 0 0;">${data.gigTitle}</p>
      </div>
      ${btn('Посмотреть', `${BASE_URL}/dashboard/freelancer`)}
    `),
  });
}

export async function notifyTicketReply(email: string, data: { subject: string; preview: string }) {
  return sendEmail({
    to: email,
    subject: `🛡 Ответ поддержки: ${data.subject}`,
    html: wrap(`
      <h2 style="color: #e0e0e0; margin: 0 0 16px;">Ответ от поддержки</h2>
      <p style="color: #aaa;">По вашему обращению: <strong style="color: #ccc;">${data.subject}</strong></p>
      <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 3px solid #00fff9;">
        <p style="color: #ccc; margin: 0;">${data.preview}</p>
      </div>
      ${btn('Открыть тикет', `${BASE_URL}/support`)}
    `),
  });
}
