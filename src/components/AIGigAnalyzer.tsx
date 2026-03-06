import { useState } from 'react';
import { Bot, Sparkles, Loader2, Check, AlertTriangle, TrendingUp } from 'lucide-react';
import Button from './ui/Button';

interface Props {
  title: string;
  description: string;
  tags: string[];
  price?: number;
}

interface Tip {
  type: 'good' | 'warning' | 'tip';
  text: string;
}

export default function AIGigAnalyzer({ title, description, tags, price }: Props) {
  const [analyzing, setAnalyzing] = useState(false);
  const [tips, setTips] = useState<Tip[] | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const analyze = async () => {
    if (!title.trim()) return;
    setAnalyzing(true);
    setTips(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Ты AI-ассистент фриланс-маркетплейса VibeCoder (аналог Kwork, специализация на AI/вайб-кодинге).

Проанализируй услугу фрилансера и дай конкретные советы по улучшению. Ответь ТОЛЬКО в JSON формате:
{
  "score": число от 1 до 100 (общая оценка качества карточки),
  "tips": [
    {"type": "good", "text": "что хорошо"},
    {"type": "warning", "text": "что плохо/отсутствует"},
    {"type": "tip", "text": "совет по улучшению"}
  ]
}

Оценивай: заголовок (цепляющий, с ключевыми словами), описание (подробное, структурированное), теги (релевантные), цену (адекватная рынку).
Максимум 6-8 советов. На русском языке.

Услуга:
Заголовок: ${title}
Описание: ${description || '(пусто)'}
Теги: ${tags.join(', ') || '(нет)'}
${price ? `Цена: ${price} ₽` : ''}`
          }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);

      setScore(parsed.score || 50);
      setTips(parsed.tips || []);
    } catch (e) {
      console.error('AI analysis error:', e);
      setTips([{ type: 'warning', text: 'Не удалось проанализировать. Попробуйте позже.' }]);
    }

    setAnalyzing(false);
  };

  const scoreColor = score !== null
    ? score >= 80 ? 'text-neon-green' : score >= 50 ? 'text-accent-amber' : 'text-neon-rose'
    : 'text-muted';

  return (
    <div className="card p-5 border-neon-cyan/20">
      <div className="flex items-center gap-2 mb-3">
        <Bot size={18} className="text-neon-cyan" />
        <h3 className="text-sm font-heading font-semibold text-heading">AI-анализ услуги</h3>
        <span className="text-[10px] bg-neon-cyan/15 text-neon-cyan px-2 py-0.5 rounded-full border border-neon-cyan/30">Эксклюзив</span>
      </div>

      {!tips && !analyzing && (
        <div className="space-y-3">
          <p className="text-xs text-muted">AI проанализирует вашу услугу и даст советы по улучшению заголовка, описания и цены для повышения конверсии.</p>
          <Button variant="secondary" size="sm" onClick={analyze} disabled={!title.trim()}>
            <Sparkles size={14} /> Проверить с AI
          </Button>
        </div>
      )}

      {analyzing && (
        <div className="flex items-center gap-3 py-4">
          <Loader2 size={20} className="text-neon-cyan animate-spin" />
          <span className="text-sm text-muted">AI анализирует вашу услугу...</span>
        </div>
      )}

      {tips && (
        <div className="space-y-3">
          {score !== null && (
            <div className="flex items-center gap-3 p-3 bg-gold/5 rounded-xl">
              <div className="relative w-14 h-14">
                <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round" className={scoreColor} />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold font-mono ${scoreColor}`}>{score}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-heading">
                  {score >= 80 ? 'Отлично!' : score >= 50 ? 'Хорошо, но можно лучше' : 'Нужна доработка'}
                </p>
                <p className="text-xs text-muted">Качество карточки услуги</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {tips.map((tip, i) => {
              const Icon = tip.type === 'good' ? Check : tip.type === 'warning' ? AlertTriangle : TrendingUp;
              const color = tip.type === 'good' ? 'text-neon-green' : tip.type === 'warning' ? 'text-neon-rose' : 'text-gold';
              const bg = tip.type === 'good' ? 'bg-neon-green/5' : tip.type === 'warning' ? 'bg-neon-rose/5' : 'bg-gold/5';
              return (
                <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-lg ${bg}`}>
                  <Icon size={14} className={`${color} mt-0.5 flex-shrink-0`} />
                  <span className="text-xs text-body leading-relaxed">{tip.text}</span>
                </div>
              );
            })}
          </div>

          <button onClick={analyze} className="text-xs text-muted hover:text-gold cursor-pointer flex items-center gap-1">
            <Sparkles size={12} /> Проверить снова
          </button>
        </div>
      )}
    </div>
  );
}
