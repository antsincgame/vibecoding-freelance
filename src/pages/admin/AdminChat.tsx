import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, User, Search, MessageCircle, Shield } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Avatar from '../../components/ui/Avatar';
import { getSupabase, getAccount } from '@vibecoding/shared';
import toast from 'react-hot-toast';

export default function AdminChat() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState('');
  const [convId, setConvId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const acc = getAccount();
      const u = await acc.get();
      setUserId(u.$id);
      const db = getSupabase();
      
      // Load all profiles
      const { data: profs } = await db.from('fl_profiles').select('*');
      setProfiles(Array.isArray(profs) ? profs : profs ? [profs] : []);
      
      // Load all conversations
      const { data: convs } = await db.from('fl_conversations').select('*').order('last_message_at', { ascending: false });
      setConversations(Array.isArray(convs) ? convs : convs ? [convs] : []);
      
      setLoading(false);
    })();
  }, []);

  const openChat = async (profile: any) => {
    setSelectedUser(profile);
    const db = getSupabase();
    
    // Find or create conversation with this user
    const existing = conversations.find((c: any) => {
      const ids = Array.isArray(c.participant_ids) ? c.participant_ids : [];
      return ids.includes(profile.user_id) && ids.includes(userId);
    });

    if (existing) {
      setConvId(existing.id);
      const { data: msgs } = await db.from('fl_messages').select('*').eq('conversation_id', existing.id).order('$createdAt', { ascending: true });
      setMessages(Array.isArray(msgs) ? msgs : msgs ? [msgs] : []);
    } else {
      // Create new conversation
      const names: Record<string, string> = {};
      names[userId] = '🛡️ Поддержка';
      names[profile.user_id] = profile.name;
      const avatars: Record<string, string> = {};
      avatars[userId] = '';
      avatars[profile.user_id] = profile.avatar || '';

      const { data: conv } = await db.from('fl_conversations').insert({
        participant_ids: JSON.stringify([userId, profile.user_id]),
        participant_names: JSON.stringify(names),
        participant_avatars: JSON.stringify(avatars),
        last_message: '',
        last_message_at: new Date().toISOString(),
        order_id: '',
      });
      if (conv) {
        setConvId(conv.id);
        setMessages([]);
        setConversations(prev => [conv, ...prev]);
      }
    }
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSend = async () => {
    if (!newMsg.trim() || !convId) return;
    setSending(true);
    const db = getSupabase();
    
    await db.from('fl_messages').insert({
      conversation_id: convId,
      sender_id: userId,
      content: newMsg.trim(),
      type: 'text',
      read: false,
    });

    await db.from('fl_conversations').update({
      last_message: `🛡️ ${newMsg.trim().slice(0, 100)}`,
      last_message_at: new Date().toISOString(),
    }).eq('id', convId);

    setSending(false);
    setNewMsg('');
    
    // Reload messages
    const { data: msgs } = await db.from('fl_messages').select('*').eq('conversation_id', convId).order('$createdAt', { ascending: true });
    setMessages(Array.isArray(msgs) ? msgs : msgs ? [msgs] : []);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const filteredProfiles = search
    ? profiles.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.username?.toLowerCase().includes(search.toLowerCase()))
    : profiles;

  // Get conversations with last messages for sidebar
  const recentConvs = conversations.filter(c => c.last_message).slice(0, 20);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-heading mb-4">Чат поддержки</h1>
      
      <div className="card overflow-hidden flex" style={{ height: 'calc(100vh - 180px)', minHeight: '500px' }}>
        {/* Left: user list */}
        <div className={`w-80 border-r border-gold/20 flex-shrink-0 flex flex-col ${selectedUser ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-3 border-b border-gold/20">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                placeholder="Найти пользователя..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gold/10 border border-gold/30 rounded-lg pl-9 pr-3 py-2 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-gold"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {/* Recent conversations first */}
            {!search && recentConvs.length > 0 && (
              <>
                <div className="px-3 py-2 text-[10px] text-muted uppercase tracking-wider">Последние диалоги</div>
                {recentConvs.map(conv => {
                  const ids = Array.isArray(conv.participant_ids) ? conv.participant_ids : [];
                  const otherId = ids.find((id: string) => id !== userId);
                  const profile = profiles.find(p => p.user_id === otherId);
                  if (!profile) return null;
                  return (
                    <button key={conv.id} onClick={() => openChat(profile)}
                      className={`w-full p-3 flex items-center gap-3 hover:bg-gold/5 cursor-pointer border-b border-gold/5 text-left ${selectedUser?.user_id === profile.user_id ? 'bg-gold/10' : ''}`}>
                      <Avatar src={profile.avatar} alt={profile.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-heading truncate">{profile.name}</p>
                        <p className="text-[10px] text-muted truncate">{conv.last_message}</p>
                      </div>
                    </button>
                  );
                })}
                <div className="border-b border-gold/20 my-1" />
              </>
            )}
            
            {/* All users */}
            <div className="px-3 py-2 text-[10px] text-muted uppercase tracking-wider">
              {search ? 'Результаты' : 'Все пользователи'}
            </div>
            {filteredProfiles.map(profile => (
              <button key={profile.id} onClick={() => openChat(profile)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-gold/5 cursor-pointer border-b border-gold/5 text-left ${selectedUser?.user_id === profile.user_id ? 'bg-gold/10' : ''}`}>
                <Avatar src={profile.avatar} alt={profile.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-heading truncate">{profile.name}</p>
                  <p className="text-[10px] text-muted">@{profile.username} · {profile.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: chat */}
        <div className={`flex-1 flex flex-col ${selectedUser ? 'flex' : 'hidden lg:flex'}`}>
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-gold/20 flex items-center gap-3">
                <button onClick={() => setSelectedUser(null)} className="lg:hidden text-muted hover:text-gold cursor-pointer"><ArrowLeft size={18} /></button>
                <Avatar src={selectedUser.avatar} alt={selectedUser.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-heading">{selectedUser.name}</p>
                  <p className="text-[10px] text-muted">@{selectedUser.username} · {selectedUser.role} · {selectedUser.location}</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-[10px] text-gold">
                  <Shield size={12} /> Поддержка
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle size={32} className="text-muted/20 mx-auto mb-2" />
                    <p className="text-xs text-muted">Начните диалог с пользователем</p>
                  </div>
                )}
                {messages.map((msg) => {
                  const isMe = msg.sender_id === userId;
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${isMe ? 'bg-gold/20 text-gold' : 'bg-accent-violet/20 text-accent-violet'}`}>
                        {isMe ? '🛡' : <User size={12} />}
                      </div>
                      <div className="max-w-[70%]">
                        <div className={`inline-block px-3 py-2 rounded-2xl text-sm ${isMe ? 'bg-gold/15 text-heading' : 'bg-nebula border border-gold/20 text-body'}`}>
                          {msg.content}
                        </div>
                        <div className={`text-[9px] text-muted mt-0.5 ${isMe ? 'text-right' : ''}`}>
                          {msg.$createdAt ? new Date(msg.$createdAt).toLocaleString('ru-RU') : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-gold/20">
                <div className="flex gap-2">
                  <input
                    placeholder="Сообщение от поддержки..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-gold/10 border border-gold/30 rounded-xl px-4 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-gold"
                  />
                  <button onClick={handleSend} disabled={sending || !newMsg.trim()} className="px-4 bg-gold/20 text-gold rounded-xl hover:bg-gold/30 cursor-pointer disabled:opacity-50">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Shield size={48} className="text-muted/20 mx-auto mb-3" />
                <p className="text-sm text-muted">Выберите пользователя для чата</p>
                <p className="text-xs text-muted mt-1">Сообщения отправляются от имени поддержки</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
