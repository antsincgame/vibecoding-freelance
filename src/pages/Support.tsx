import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, MessageCircle, Clock, CheckCircle, AlertCircle, Send, ArrowLeft, HelpCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '@vibecoding/shared';
import { getMyTickets, getTicketMessages, replyToTicket, createTicket } from '../lib/admin-api';
import toast from 'react-hot-toast';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  open: { label: 'Открыт', color: 'text-neon-green' },
  answered: { label: 'Отвечен', color: 'text-neon-cyan' },
  waiting: { label: 'Ожидает', color: 'text-[#00f5ff]' },
  closed: { label: 'Закрыт', color: 'text-muted' },
};

const CATEGORIES = [
  { value: 'general', label: 'Общий вопрос' },
  { value: 'order', label: 'Проблема с заказом' },
  { value: 'gig', label: 'Вопрос по услуге' },
  { value: 'account', label: 'Аккаунт' },
  { value: 'report', label: 'Жалоба' },
  { value: 'bug', label: 'Баг на сайте' },
];

export default function Support() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ subject: '', category: 'general', message: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const load = async () => { setLoading(true); const data = await getMyTickets(); setTickets(data); setLoading(false); };
  useEffect(() => { if (user) load(); }, [user]);

  const openTicket = async (ticket: any) => {
    setSelectedTicket(ticket);
    const msgs = await getTicketMessages(ticket.id);
    setMessages(msgs);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleCreate = async () => {
    if (!form.subject.trim() || !form.message.trim()) { toast.error('Заполните тему и сообщение'); return; }
    setSending(true);
    const { error } = await createTicket(form);
    setSending(false);
    if (error) { toast.error('Ошибка: ' + error.message); return; }
    toast.success('Тикет создан!');
    setCreating(false);
    setForm({ subject: '', category: 'general', message: '' });
    load();
  };

  const handleReply = async () => {
    if (!reply.trim() || !selectedTicket) return;
    setSending(true);
    const { error } = await replyToTicket(selectedTicket.id, reply);
    setSending(false);
    if (error) { toast.error('Ошибка'); return; }
    setReply('');
    const msgs = await getTicketMessages(selectedTicket.id);
    setMessages(msgs);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const inputClass = 'w-full bg-[#00f5ff]/10 border border-[#00f5ff]/30 rounded-xl px-4 py-3.5 text-base text-heading placeholder:text-muted focus:outline-none focus:border-[#00f5ff] focus:ring-1 focus:ring-[#00f5ff]/40 transition-all';

  // Conversation view
  if (selectedTicket) {
    const st = STATUS_MAP[selectedTicket.status] || STATUS_MAP.open;
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-2 text-sm text-muted hover:text-[#00f5ff] mb-4 cursor-pointer">
          <ArrowLeft size={16} /> Мои обращения
        </button>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-heading">{selectedTicket.subject}</h1>
          <div className="flex items-center gap-3 text-sm text-muted mt-1">
            <span className={st.color}>{st.label}</span>
            <span>{CATEGORIES.find(c => c.value === selectedTicket.category)?.label}</span>
          </div>
        </div>
        <div className="card p-0 overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.is_admin ? '' : 'flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${msg.is_admin ? 'bg-[#00f5ff]/20 text-[#00f5ff]' : 'bg-accent-violet/20 text-accent-violet'}`}>
                  {msg.is_admin ? '🛡' : '👤'}
                </div>
                <div className={`max-w-[70%] ${msg.is_admin ? '' : 'text-right'}`}>
                  <div className={`inline-block px-4 py-3 rounded-2xl text-sm ${msg.is_admin ? 'bg-[#00f5ff]/10 text-heading' : 'bg-nebula border border-[#00f5ff]/20 text-body'}`}>
                    {msg.message}
                  </div>
                  <div className={`text-[10px] text-muted mt-1 ${msg.is_admin ? '' : 'text-right'}`}>
                    {msg.is_admin ? 'Поддержка' : 'Вы'} • {msg.$createdAt ? new Date(msg.$createdAt).toLocaleString('ru-RU') : ''}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {selectedTicket.status !== 'closed' && (
            <div className="border-t border-[#00f5ff]/20 p-4">
              <div className="flex gap-3">
                <textarea
                  rows={2}
                  placeholder="Ваше сообщение..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                  className="flex-1 bg-[#00f5ff]/10 border border-[#00f5ff]/30 rounded-xl px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-[#00f5ff] resize-none"
                />
                <button onClick={handleReply} disabled={sending || !reply.trim()} className="px-4 py-2 bg-[#00f5ff]/20 text-[#00f5ff] rounded-xl hover:bg-[#00f5ff]/30 transition-all cursor-pointer disabled:opacity-50 self-end">
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
          {selectedTicket.status === 'closed' && (
            <div className="border-t border-[#00f5ff]/20 p-4 text-center text-sm text-muted">Тикет закрыт</div>
          )}
        </div>
      </div>
    );
  }

  // Create form
  if (creating) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <button onClick={() => setCreating(false)} className="flex items-center gap-2 text-sm text-muted hover:text-[#00f5ff] mb-4 cursor-pointer">
          <ArrowLeft size={16} /> Назад
        </button>
        <h1 className="text-2xl font-bold text-heading mb-6">Новое обращение</h1>
        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-sm text-muted mb-1.5">Тема *</label>
            <input type="text" placeholder="Кратко опишите проблему" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Категория</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`${inputClass} cursor-pointer appearance-none`}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Сообщение *</label>
            <textarea rows={5} placeholder="Подробно опишите вашу проблему или вопрос..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputClass} resize-none`} />
          </div>
          <Button variant="primary" size="lg" className="w-full" onClick={handleCreate} disabled={sending}>
            {sending ? '...' : 'Отправить'}
          </Button>
        </div>
      </div>
    );
  }

  // Tickets list
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">Поддержка</h1>
          <p className="text-sm text-muted mt-1">Задайте вопрос или сообщите о проблеме</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setCreating(true)}>
          <Plus size={16} /> Создать тикет
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="card p-5 animate-pulse"><div className="h-4 bg-[#00f5ff]/10 rounded w-1/2 mb-2" /><div className="h-3 bg-[#00f5ff]/10 rounded w-1/3" /></div>)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="card p-12 text-center">
          <HelpCircle size={48} className="text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-heading mb-2">Нет обращений</h3>
          <p className="text-sm text-muted mb-6">Если у вас есть вопрос или проблема — создайте тикет</p>
          <Button variant="primary" size="md" onClick={() => setCreating(true)}><Plus size={16} /> Создать тикет</Button>
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map((ticket) => {
            const st = STATUS_MAP[ticket.status] || STATUS_MAP.open;
            return (
              <div key={ticket.id} onClick={() => openTicket(ticket)} className="card p-5 cursor-pointer hover:border-[#00f5ff]/30 transition-all">
                <div className="flex items-center gap-4">
                  <MessageCircle size={18} className={st.color} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-heading truncate">{ticket.subject}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.color} bg-white/5`}>{st.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted mt-1">
                      <span>{CATEGORIES.find(c => c.value === ticket.category)?.label}</span>
                      <span>{ticket.$createdAt ? new Date(ticket.$createdAt).toLocaleDateString('ru-RU') : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
