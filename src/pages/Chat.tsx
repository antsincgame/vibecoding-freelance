import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, ArrowLeft, MessageCircle, User } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '@vibecoding/shared';
import { getSupabase, getAccount } from '@vibecoding/shared';
import { getConversations, getMessages, sendMessage } from '../lib/freelance-db';
import toast from 'react-hot-toast';

export default function Chat() {
  const { id: conversationId } = useParams();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const acc = getAccount();
        const u = await acc.get();
        setUserId(u.$id);
      } catch {}
      const convs = await getConversations();
      setConversations(convs);
      setLoading(false);

      if (conversationId) {
        const conv = convs.find((c: any) => c.id === conversationId);
        if (conv) openConversation(conv);
      }
    })();
  }, [conversationId]);

  const openConversation = async (conv: any) => {
    setActiveConv(conv);
    const msgs = await getMessages(conv.id);
    setMessages(msgs);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSend = async () => {
    if (!newMsg.trim() || !activeConv) return;
    setSending(true);
    const ok = await sendMessage(activeConv.id, newMsg.trim());
    setSending(false);
    if (!ok) { toast.error('Ошибка'); return; }
    setNewMsg('');
    const msgs = await getMessages(activeConv.id);
    setMessages(msgs);
    // Refresh conversations
    const convs = await getConversations();
    setConversations(convs);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const getOtherName = (conv: any) => {
    try {
      const names = Array.isArray(conv.participant_names) ? conv.participant_names : JSON.parse(conv.participant_names || '{}');
      const ids = Array.isArray(conv.participant_ids) ? conv.participant_ids : JSON.parse(conv.participant_ids || '[]');
      const otherId = ids.find((id: string) => id !== userId);
      return names[otherId] || 'Пользователь';
    } catch { return 'Пользователь'; }
  };

  const getOtherAvatar = (conv: any) => {
    try {
      const avatars = Array.isArray(conv.participant_avatars) ? conv.participant_avatars : JSON.parse(conv.participant_avatars || '{}');
      const ids = Array.isArray(conv.participant_ids) ? conv.participant_ids : JSON.parse(conv.participant_ids || '[]');
      const otherId = ids.find((id: string) => id !== userId);
      return avatars[otherId] || '';
    } catch { return ''; }
  };

  // Mobile: show conversation list or chat
  const showChat = !!activeConv;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-heading">Сообщения</h1>
      </div>

      <div className="card overflow-hidden flex" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        {/* Conversation list */}
        <div className={`w-full sm:w-80 border-r border-gold/20 flex-shrink-0 flex flex-col ${showChat ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gold/20">
            <h2 className="text-sm font-semibold text-heading">Диалоги</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="p-4 animate-pulse"><div className="h-4 bg-gold/10 rounded w-3/4 mb-1" /><div className="h-3 bg-gold/10 rounded w-1/2" /></div>)
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle size={32} className="text-muted mx-auto mb-2" />
                <p className="text-sm text-muted">Нет диалогов</p>
                <p className="text-xs text-muted mt-1">Напишите фрилансеру на странице гига</p>
              </div>
            ) : conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => openConversation(conv)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gold/5 transition-colors cursor-pointer border-b border-gold/10 text-left ${activeConv?.id === conv.id ? 'bg-gold/10' : ''}`}
              >
                <Avatar src={getOtherAvatar(conv)} alt="" size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-heading truncate">{getOtherName(conv)}</p>
                  <p className="text-xs text-muted truncate">{conv.last_message || 'Нет сообщений'}</p>
                </div>
                {conv.last_message_at && <span className="text-[10px] text-muted">{new Date(conv.last_message_at).toLocaleDateString('ru-RU')}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${showChat ? 'flex' : 'hidden sm:flex'}`}>
          {activeConv ? (
            <>
              <div className="p-4 border-b border-gold/20 flex items-center gap-3">
                <button onClick={() => setActiveConv(null)} className="sm:hidden text-muted hover:text-gold cursor-pointer"><ArrowLeft size={18} /></button>
                <Avatar src={getOtherAvatar(activeConv)} alt="" size="sm" />
                <span className="text-sm font-medium text-heading">{getOtherName(activeConv)}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.sender_id === userId;
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div className={`max-w-[70%]`}>
                        <div className={`inline-block px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-gold/15 text-heading' : 'bg-nebula border border-gold/20 text-body'}`}>
                          {msg.content}
                        </div>
                        <div className={`text-[10px] text-muted mt-0.5 ${isMe ? 'text-right' : ''}`}>
                          {msg.$createdAt ? new Date(msg.$createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gold/20">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Сообщение..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-gold"
                  />
                  <button onClick={handleSend} disabled={sending || !newMsg.trim()} className="px-4 py-2 bg-gold/20 text-gold rounded-xl hover:bg-gold/30 transition-all cursor-pointer disabled:opacity-50">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle size={48} className="text-muted/30 mx-auto mb-3" />
                <p className="text-sm text-muted">Выберите диалог</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
