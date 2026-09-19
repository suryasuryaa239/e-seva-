import React from 'react';
import { AlertCircle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('E-Seva ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isTamil = localStorage.getItem('eseva_lang') === 'ta';

      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-white">
          <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8 text-rose-500" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white font-heading">
                {isTamil ? 'மன்னிக்கவும்! ஒரு எதிர்பாராத பிழை ஏற்பட்டது.' : 'Something went wrong.'}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {isTamil
                  ? 'பக்கத்தை மீண்டும் ஏற்றவும் அல்லது முகப்புப் பக்கத்திற்குச் செல்லவும். உங்கள் தகவல்கள் தானாகவே சேமிக்கப்பட்டுள்ளன.'
                  : 'An unexpected application error occurred. Please reload the page or return to the home screen. Your progress has been cached.'}
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-700/50 text-left text-[11px] font-mono text-rose-300 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isTamil ? 'பக்கத்தை மீண்டும் ஏற்றுக' : 'Reload Page'}</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>{isTamil ? 'முகப்பு பக்கம்' : 'Back to Home'}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
