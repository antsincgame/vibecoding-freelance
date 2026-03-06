import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Loader2, Star, Zap, ArrowRight, Target } from 'lucide-react';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
import { getSupabase } from '../lib/appwrite';

interface MatchResult {
  id: string;
  username: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  matchScore: number;
  reason: string;
  skills: string[];
}

export default function AIMatching() {
  const [query, setQuery] = useState('');
  const [matching, setMatching] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);

  const handleMatch = async () => {
    if (!query.trim()) return;
    setMatching(true);
    setResults(null);

    try {
      // 1. Get all freelancer profiles
      const db = getSupabase();
      const { data: profiles } = await db.from('fl_profiles').select('*').eq('role', 'freelancer');
      const profs = Array.isArray(profiles) ? profiles : profiles ? [profiles] : [];

      // 2. Get all gigs
      const { data: gigs } = await db.from('fl_gigs').select('*').eq('status', 'active');
      const gigList = Array.isArray(gigs) ? gigs : gigs ? [gigs] : [];

      // Build freelancer info for AI
      const freelancerInfo = profs.map(p => {
        const userGigs = gigList.filter((g: any) => g.freelancer_id === p.user_id);
        const allTags = userGigs.flatMap((g: any) => Array.isArray(g.tags) ? g.tags : []);
        return {
          id: p.user_id,
          username: p.username,
          name: p.name,
          title: p.title || '',
          skills: Array.isArray(p.skills) ? p.skills : [],
          rating: p.rating || 0,
          orders: p.orders_completed || 0,
          gig_tags: [...new Set(allTags)],
          gig_titles: userGigs.map((g: any) => g.title),
        };
      }).filter(f => f.gig_titles.length > 0);

      // 3. Ask AI to match
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Ты AI-матчинг система фриланс-маркетплейса VibeCoder. Подбери лучших фрилансеров для задачи.

Задача заказчика: "${query}"

Фрилансеры:
${freelancerInfo.map(f => `- ${f.name} (@${f.username}): ${f.title}. Навыки: ${f.skills.join(', ')}. Теги: ${f.gig_tags.join(', ')}. Рейтинг: ${f.rating}. Заказов: ${f.orders}. Гиги: ${f.gig_titles.join('; ')}`).join('\n')}

Ответь ТОЛЬКО в JSON:
{
  "matches": [
    {
      "username": "username фрилансера",
      "matchScore": число 1-100,
      "reason": "короткое объяснение почему подходит (1-2 предложения)"
    }
  ]
}

Верни топ-3 лучших совпадения. Сортируй по релевантности задаче.`
          }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);

      // Map AI results to full profiles
      const matches: MatchResult[] = (parsed.matches || []).map((m: any) => {
        const prof = profs.find(p => p.username === m.username);
        if (!prof) return null;
        return {
          id: prof.user_id,
          username: prof.username,
          name: prof.name,
          avatar: prof.avatar || '',
          title: prof.title || '',
          rating: prof.rating || 0,
          matchScore: m.matchScore,
          reason: m.reason,
          skills: Array.isArray(prof.skills) ? prof.skills : [],
        };
      }).filter(Boolean);

      setResults(matches);
    } catch (e) {
      console.error('AI matching error:', e);
      setResults([]);
    }

    setMatching(false);
  };

  return (
    <div className="card p-6 border-accent-violet/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)]" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} className="text-accent-violet" />
          <h3 className="text-base font-heading font-semibold text-heading">AI-подбор специалиста</h3>
          <span className="text-[10px] bg-accent-violet/15 text-accent-violet px-2 py-0.5 rounded-full border border-accent-violet/30">Только у нас</span>
        </div>

        <p className="text-xs text-muted mb-4">Опишите задачу — AI найдёт лучших фрилансеров</p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Например: Нужен Telegram-бот с AI для службы поддержки..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleMatch()}
            className="flex-1 bg-[#00f5ff]/10 border border-[#00f5ff]/30 rounded-xl px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-accent-violet focus:ring-1 focus:ring-accent-violet/40 transition-all"
          />
          <Button variant="primary" size="md" onClick={handleMatch} disabled={matching || !query.trim()}>
            {matching ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {matching ? '' : 'Найти'}
          </Button>
        </div>

        {matching && (
          <div className="flex items-center gap-3 py-6 justify-center">
            <Loader2 size={24} className="text-accent-violet animate-spin" />
            <span className="text-sm text-muted">AI подбирает специалистов...</span>
          </div>
        )}

        {results !== null && !matching && (
          <div className="space-y-3">
            {results.length === 0 ? (
              <p className="text-sm text-muted text-center py-4">Не удалось подобрать. Попробуйте уточнить задачу.</p>
            ) : (
              results.map((match, i) => (
                <Link
                  key={match.id}
                  to={`/users/${match.username}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#00f5ff]/5 border border-[#00f5ff]/10 hover:border-[#00f5ff]/30 transition-all group"
                >
                  <div className="relative">
                    <Avatar src={match.avatar} alt={match.name} size="md" />
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-accent-violet text-void text-[10px] font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-heading group-hover:text-[#00f5ff] transition-colors">{match.name}</span>
                      <span className="text-xs text-muted">@{match.username}</span>
                      <span className="flex items-center gap-0.5 text-xs text-[#00f5ff]"><Star size={10} fill="currentColor" /> {match.rating}</span>
                    </div>
                    <p className="text-xs text-accent-violet mt-0.5">{match.reason}</p>
                    <div className="flex gap-1 mt-1.5">
                      {match.skills.slice(0, 4).map(s => <span key={s} className="text-[9px] px-1.5 py-0.5 bg-[#00f5ff]/10 text-muted rounded">{s}</span>)}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold font-mono text-accent-violet">{match.matchScore}%</div>
                    <div className="text-[10px] text-muted">совпадение</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
