import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <span className="text-[120px] font-display font-bold text-[#00f5ff]/10 leading-none select-none">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-display font-bold neon-text text-[var(--neon-cyan)]">404</span>
          </div>
        </div>
        <h1 className="text-2xl font-heading font-bold text-heading">Страница не найдена</h1>
        <p className="text-sm text-muted leading-relaxed">Возможно, страница была удалена или вы ввели неверный адрес. Попробуйте начать с главной.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/"><Button variant="primary" size="md"><Home size={16} /> На главную</Button></Link>
          <Link to="/categories/all"><Button variant="secondary" size="md"><Search size={16} /> Каталог</Button></Link>
        </div>
        <button onClick={() => window.history.back()} className="text-sm text-muted hover:text-[#00f5ff] cursor-pointer flex items-center gap-1 mx-auto">
          <ArrowLeft size={14} /> Вернуться назад
        </button>
      </div>
    </div>
  );
}
