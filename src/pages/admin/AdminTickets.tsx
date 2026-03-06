import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Clock, CheckCircle, AlertCircle, Send, ArrowLeft, User } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetTickets, adminGetTicketMessages, adminReplyTicket, adminUpdateTicket } from '../../lib/admin-api';
import toast from 'react-hot-toast';

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  open: { label: 'Открыт', color: 'text-neon-green', icon: AlertCircle },
  answered: { label: 'Отвечен', color: 'text-neon-cyan', icon: MessageCircle },
  waiting: { label: 'Ожидает', color: 'text-accent-amber', icon: Clock },
  closed: { label: 'Закрыт', color: 'text-muted', icon: CheckCircle },
};

const CAT_MAP: Record<string, string> = {
  general: 'Общий вопрос',
  order: 'Проблема с заказом',
  gig: 'Вопрос по услуге',
  payment: 'Оплата',
  account: 'Аккаунт',
  report: 'Жалоба',
  bug: 'Баг на сайте',
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const load = async () => { setLoading(true); const data = await adminGetTickets(filter); setTickets(data); setLoading(false); };
  useEffect(() => { load(); }, [filter]);

  const openTicket = async (ticket: any) => {
    setSelectedTicket(ticket);
    const msgs = await adminGetTicketMessages(ticket.id);
    setMessages(msgs);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleReply = async () => {
    if (!reply.trim() || !selectedTicket) return;
    setSending(true);
    const { error } = await adminReplyTicket(selectedTicket.id, reply);
    setSending(false);
    if (error) { toast.error('Ошибка'); return; }
    setReply('');
    const msgs = await adminGetTicketMessages(selectedTicket.id);
    setMessages(msgs);
    load();
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleClose = async (id: string) => {
    await adminUpdateTicket(id, { status: 'closed', closed_at: new Date().toISOString() });
    toast.success('Тикет закрыт');
    setSelectedTicket(null);
    load();
  };

  const handleReopen = async (id: string) => {
    await adminUpdateTicket(id, { status: 'open', closed_at: '' });
    toast.success('Тикет открыт');
    load();
  };

  const openCount = tickets.filter(t => t.status === 'open').length;

  // Ticket conversation view
  if (selectedTicket) {
    const st = STATUS_MAP[selectedTicket.status] || STATUS_MAP.open;
    return (
      <AdminLayout>
        <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-2 text-sm text-muted hover:text-gold mb-4 cursor-pointer">
          <ArrowLeft size={16} /> Назад к тикетам
        </button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-heading">{selectedTicket.subject}</h1>
            <div className="flex items-center gap-3 text-sm text-muted mt-1">
              <span>{selectedTicket.user_name}</span>
              <span className="font-mono">{selectedTicket.user_email}</span>
              <span className={st.color}>{st.label}</span>
              <span>{CAT_MAP[selectedTicket.category] || selectedTicket.category}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {selectedTicket.status !== 'closed' ? (
              <button onClick={() => handleClose(selectedTicket.id)} className="px-4 py-2 text-sm bg-gold/10 text-muted rounded-lg hover:text-body cursor-pointer">Закрыть</button>
            ) : (
              <button onClick={() => handleReopen(selectedTicket.id)} className="px-4 py-2 text-sm bg-gold/10 text-gold rounded-lg hover:bg-gold/20 cursor-pointer">Открыть</button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="card p-0 overflow-hidden">
          <div className="max-h-[50vh] overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.is_admin ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${msg.is_admin ? 'bg-gold/20 text-gold' : 'bg-accent-violet/20 text-accent-violet'}`}>
                  {msg.is_admin ? 'A' : <User size={14} />}
                </div>
                <div className={`max-w-[70%] ${msg.is_admin ? 'text-right' : ''}`}>
                  <div className={`inline-block px-4 py-3 rounded-2xl text-sm ${msg.is_admin ? 'bg-gold/10 text-heading' : 'bg-nebula border border-gold/20 text-body'}`}>
                    {msg.message}
                  </div>
                  <div className={`text-[10px] text-muted mt-1 ${msg.is_admin ? 'text-right' : ''}`}>
                    {msg.sender_name} • {msg.$createdAt ? new Date(msg.$createdAt).toLocaleString('ru-RU') : ''}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {selectedTicket.status !== 'closed' && (
            <div className="border-t border-gold/20 p-4">
              <div className="flex gap-3">
                <textarea
                  rows={2}
                  placeholder="Ответ от поддержки..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                  className="flex-1 bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-gold resize-none"
                />
                <button onClick={handleReply} disabled={sending || !reply.trim()} className="px-4 py-2 bg-gold/20 text-gold rounded-xl hover:bg-gold/30 transition-all cursor-pointer disabled:opacity-50 self-end">
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  // Ticket list view
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">Техподдержка</h1>
          {openCount > 0 && <p className="text-sm text-neon-green mt-1">{openCount} открытых</p>}
        </div>
        <span className="text-sm text-muted">{tickets.length} тикетов</span>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'open', 'answered', 'waiting', 'closed'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 text-sm rounded-xl border whitespace-nowrap transition-all cursor-pointer ${filter === s ? 'border-gold bg-gold/10 text-gold' : 'border-gold/20 text-muted hover:text-body'}`}>
            {s === 'all' ? 'Все' : STATUS_MAP[s]?.label || s}
            {s === 'open' && openCount > 0 && <span className="ml-1 w-5 h-5 inline-flex items-center justify-center bg-neon-green text-void text-[10px] font-bold rounded-full">{openCount}</span>}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {loading ? Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-5 animate-pulse"><div className="h-4 bg-gold/10 rounded w-1/2 mb-2" /><div className="h-3 bg-gold/10 rounded w-1/3" /></div>
        )) : tickets.map((ticket) => {
          const st = STATUS_MAP[ticket.status] || STATUS_MAP.open;
          const StIcon = st.icon;
          return (
            <div key={ticket.id} onClick={() => openTicket(ticket)} className={`card p-5 cursor-pointer hover:border-gold/30 transition-all ${ticket.status === 'open' ? 'border-neon-green/30' : ''}`}>
              <div className="flex items-center gap-4">
                <StIcon size={18} className={st.color} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-heading truncate">{ticket.subject}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.color} bg-white/5`}>{st.label}</span>
                    <span className="text-[10px] text-muted bg-gold/10 px-2 py-0.5 rounded-full">{CAT_MAP[ticket.category] || ticket.category}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted mt-1">
                    <span>{ticket.user_name}</span>
                    <span>{ticket.user_email}</span>
                    <span>{ticket.$createdAt ? new Date(ticket.$createdAt).toLocaleDateString('ru-RU') : ''}</span>
                  </div>
                </div>
                <MessageCircle size={16} className="text-muted" />
              </div>
            </div>
          );
        })}
        {!loading && tickets.length === 0 && <p className="text-sm text-muted text-center py-8">Нет тикетов</p>}
      </div>
    </AdminLayout>
  );
}
