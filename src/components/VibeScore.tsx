import { Zap } from 'lucide-react';

const AI_TOOLS = ['Cursor', 'Copilot', 'Claude', 'ChatGPT', 'v0', 'Bolt', 'Replit', 'Windsurf', 'Devin', 'Lovable'];
const AI_TAGS = ['AI', 'OpenAI', 'GPT', 'LangChain', 'RAG', 'Claude', 'Anthropic', 'LLM', 'ML', 'NLP', 'Vector', 'Embedding'];

interface Props {
  skills: string[];
  ordersCompleted: number;
  rating: number;
  reviewCount: number;
  gigTags?: string[];
  size?: 'sm' | 'md' | 'lg';
}

export function calculateVibeScore(skills: string[], ordersCompleted: number, rating: number, reviewCount: number, gigTags: string[] = []): number {
  let score = 0;

  // AI tools in skills (max 30)
  const aiToolCount = skills.filter(s => AI_TOOLS.some(t => s.toLowerCase().includes(t.toLowerCase()))).length;
  score += Math.min(aiToolCount * 10, 30);

  // AI tags in gigs (max 20)
  const aiTagCount = gigTags.filter(t => AI_TAGS.some(ai => t.toLowerCase().includes(ai.toLowerCase()))).length;
  score += Math.min(aiTagCount * 5, 20);

  // Orders (max 20)
  score += Math.min(ordersCompleted * 0.5, 20);

  // Rating (max 15)
  score += Math.min((rating / 5) * 15, 15);

  // Reviews (max 15)
  score += Math.min(reviewCount * 0.5, 15);

  return Math.round(Math.min(score, 100));
}

export default function VibeScore({ skills, ordersCompleted, rating, reviewCount, gigTags = [], size = 'md' }: Props) {
  const score = calculateVibeScore(skills, ordersCompleted, rating, reviewCount, gigTags);

  if (score === 0) return null;

  const getLevel = () => {
    if (score >= 80) return { label: 'Legendary', color: 'from-[#00f5ff] via-neon-cyan to-[#00f5ff]', textColor: 'text-[#00f5ff]', glow: 'shadow-[0_0_15px_rgba(0,245,255,0.4)]' };
    if (score >= 60) return { label: 'Master', color: 'from-neon-cyan via-accent-violet to-neon-cyan', textColor: 'text-neon-cyan', glow: 'shadow-[0_0_12px_rgba(0,255,249,0.3)]' };
    if (score >= 40) return { label: 'Advanced', color: 'from-neon-green via-neon-cyan to-neon-green', textColor: 'text-neon-green', glow: 'shadow-[0_0_10px_rgba(57,255,20,0.2)]' };
    if (score >= 20) return { label: 'Rising', color: 'from-[#00f5ff] via-[#00f5ff] to-[#00f5ff]', textColor: 'text-[#00f5ff]', glow: '' };
    return { label: 'Starter', color: 'from-muted to-muted', textColor: 'text-muted', glow: '' };
  };

  const level = getLevel();
  const sizes = {
    sm: { container: 'gap-1.5', icon: 14, text: 'text-[10px]', score: 'text-xs' },
    md: { container: 'gap-2', icon: 16, text: 'text-xs', score: 'text-sm' },
    lg: { container: 'gap-3', icon: 20, text: 'text-sm', score: 'text-base' },
  };
  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.container} ${level.glow} rounded-full px-2.5 py-1 bg-void/80 border border-[#00f5ff]/20`}>
      <Zap size={s.icon} className={level.textColor} />
      <div className="flex items-center gap-1">
        <span className={`font-mono font-bold ${s.score} ${level.textColor}`}>{score}</span>
        <span className={`${s.text} text-muted`}>vibe</span>
      </div>
    </div>
  );
}

// Compact badge version for cards
export function VibeScoreBadge({ score }: { score: number }) {
  if (score === 0) return null;
  const color = score >= 80 ? 'text-[#00f5ff] bg-[#00f5ff]/15 border-[#00f5ff]/30' : score >= 60 ? 'text-neon-cyan bg-neon-cyan/15 border-neon-cyan/30' : score >= 40 ? 'text-neon-green bg-neon-green/15 border-neon-green/30' : 'text-muted bg-white/5 border-white/10';
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${color} flex items-center gap-0.5`}>
      <Zap size={9} /> {score}
    </span>
  );
}
