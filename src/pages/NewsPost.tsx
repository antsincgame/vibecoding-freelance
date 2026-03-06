import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { NEWS_DATA } from '../data/news';

export default function NewsPost() {
  const { id } = useParams();
  const post = NEWS_DATA.find(n => n.id === id);
  const currentIndex = NEWS_DATA.findIndex(n => n.id === id);
  const prevPost = currentIndex > 0 ? NEWS_DATA[currentIndex - 1] : null;
  const nextPost = currentIndex < NEWS_DATA.length - 1 ? NEWS_DATA[currentIndex + 1] : null;

  if (!post) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-muted text-lg">Новость не найдена</p>
      <Link to="/news" className="text-gold text-sm mt-4 inline-block">← Все новости</Link>
    </div>
  );

  const Icon = post.icon;

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-heading font-bold text-heading mt-8 mb-3">{line.slice(3)}</h2>;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-heading mt-4 mb-1">{line.slice(2, -2)}</p>;
      if (line.startsWith('- ')) return <div key={i} className="flex gap-2 ml-2 mb-1"><span className="text-gold">•</span><span>{renderInline(line.slice(2))}</span></div>;
      if (line.startsWith('| ')) return null; // skip table markup
      if (line.trim() === '') return <div key={i} className="h-3" />;
      return <p key={i} className="mb-2">{renderInline(line)}</p>;
    });
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="text-heading font-semibold">{part.slice(2, -2)}</strong>;
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24">
      <SEO title={post.title.replace(/[🚀🤖⚡🛡🏆📱]/g, '').trim()} description={post.summary} />

      <Link to="/news" className="flex items-center gap-2 text-sm text-muted hover:text-gold mb-8">
        <ArrowLeft size={16} /> Все новости
      </Link>

      {/* Header */}
      {post.image && (
        <div className="aspect-[2/1] rounded-2xl overflow-hidden mb-8">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${post.color}`}>
          <Icon size={18} />
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-muted"><Calendar size={12} /> {post.date}</span>
          {post.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 bg-gold/10 text-muted rounded-full border border-gold/20">{tag}</span>
          ))}
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-heading mb-4 leading-tight">{post.title}</h1>
      <p className="text-base text-body leading-relaxed mb-8 font-heading font-light">{post.summary}</p>

      {/* Content */}
      <article className="text-sm text-body leading-relaxed">
        {renderContent(post.content)}
      </article>

      {/* Share */}
      <div className="flex items-center gap-4 mt-10 pt-6 border-t border-gold/20">
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold rounded-xl text-sm hover:bg-gold/20 cursor-pointer"
        >
          <Share2 size={14} /> Скопировать ссылку
        </button>
      </div>

      {/* Prev/Next */}
      <div className="flex items-stretch gap-4 mt-8">
        {prevPost ? (
          <Link to={`/news/${prevPost.id}`} className="flex-1 card p-4 hover:border-gold/30 transition-all group">
            <p className="text-[10px] text-muted mb-1">← Предыдущая</p>
            <p className="text-sm font-medium text-heading group-hover:text-gold transition-colors line-clamp-2">{prevPost.title}</p>
          </Link>
        ) : <div className="flex-1" />}
        {nextPost ? (
          <Link to={`/news/${nextPost.id}`} className="flex-1 card p-4 hover:border-gold/30 transition-all group text-right">
            <p className="text-[10px] text-muted mb-1">Следующая →</p>
            <p className="text-sm font-medium text-heading group-hover:text-gold transition-colors line-clamp-2">{nextPost.title}</p>
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </div>
  );
}
