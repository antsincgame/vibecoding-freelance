import { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { getSupabase } from '@vibecoding/shared';

interface GigExtra {
  id: string;
  title: string;
  description: string;
  price: number;
  delivery_days_add: number;
}

interface Props {
  gigId: string;
  onExtrasChange?: (selected: GigExtra[], total: number) => void;
}

export default function GigExtras({ gigId, onExtrasChange }: Props) {
  const [extras, setExtras] = useState<GigExtra[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const db = getSupabase();
      const { data } = await db.from('fl_gig_extras').select('*').eq('gig_id', gigId).order('sort_order', { ascending: true });
      const rows = Array.isArray(data) ? data : data ? [data] : [];
      setExtras(rows.map((r: any) => ({
        id: r.id,
        title: r.title || '',
        description: r.description || '',
        price: r.price || 0,
        delivery_days_add: r.delivery_days_add || 0,
      })));
      setLoading(false);
    })();
  }, [gigId]);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
    
    const selectedExtras = extras.filter(e => next.has(e.id));
    const total = selectedExtras.reduce((sum, e) => sum + e.price, 0);
    onExtrasChange?.(selectedExtras, total);
  };

  if (loading || extras.length === 0) return null;

  return (
    <div className="space-y-2 pt-3 border-t border-[#00f5ff]/20">
      <p className="text-xs text-[#00f5ff] font-heading font-medium uppercase tracking-wider">Дополнительные опции</p>
      {extras.map((extra) => {
        const isSelected = selected.has(extra.id);
        return (
          <button
            key={extra.id}
            onClick={() => toggle(extra.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
              isSelected ? 'border-[#00f5ff] bg-[#00f5ff]/10' : 'border-[#00f5ff]/20 hover:border-[#00f5ff]/40'
            }`}
          >
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
              isSelected ? 'bg-[#00f5ff] border-[#00f5ff]' : 'border-[#00f5ff]/30'
            }`}>
              {isSelected && <Check size={12} className="text-void" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-heading">{extra.title}</p>
              {extra.description && <p className="text-xs text-muted">{extra.description}</p>}
              {extra.delivery_days_add > 0 && <p className="text-[10px] text-muted">+{extra.delivery_days_add} дн. к сроку</p>}
            </div>
            <span className="text-sm font-mono font-bold text-[#00f5ff] flex-shrink-0">+{extra.price.toLocaleString('ru-RU')} ₽</span>
          </button>
        );
      })}
    </div>
  );
}
