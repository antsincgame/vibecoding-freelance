import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@vibecoding/shared';
import { getSupabase, getAccount } from '@vibecoding/shared';

export default function WishlistBadge() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const acc = getAccount();
        const u = await acc.get();
        const db = getSupabase();
        const { data } = await db.from('fl_favorites').select('*').eq('user_id', u.$id);
        const items = Array.isArray(data) ? data : data ? [data] : [];
        setCount(items.length);
      } catch {}
    })();
  }, [user]);

  if (!user) return null;

  return (
    <Link to="/dashboard" className="relative p-2 text-muted hover:text-neon-rose transition-colors">
      <Heart size={20} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neon-rose text-void text-[9px] font-bold rounded-full flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}
