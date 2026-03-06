import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: string; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="card p-8 max-w-md text-center space-y-4">
            <AlertTriangle size={48} className="text-[#00f5ff] mx-auto" />
            <h2 className="text-xl font-bold text-heading">Что-то пошло не так</h2>
            <p className="text-sm text-muted">{this.state.error || 'Произошла непредвиденная ошибка'}</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 bg-[#00f5ff]/10 text-[#00f5ff] rounded-xl text-sm hover:bg-[#00f5ff]/20 cursor-pointer">
                <RefreshCw size={14} /> Обновить
              </button>
              <a href="/" className="flex items-center gap-2 px-4 py-2 text-muted text-sm hover:text-body">
                <Home size={14} /> На главную
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
