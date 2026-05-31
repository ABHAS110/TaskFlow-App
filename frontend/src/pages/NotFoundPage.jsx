import { useNavigate } from 'react-router-dom';
import { Home, Zap, AlertTriangle } from 'lucide-react';

/**
 * 404 Not Found page with back button and navigation.
 */
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-accent shadow-glow">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-text-primary">
            Task<span className="text-accent">Flow</span>
          </span>
        </div>

        {/* Error content */}
        <div
          className="rounded-2xl border border-dark-border p-10 mb-8"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-modal)' }}
        >
          {/* Icon */}
          <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>

          {/* 404 number */}
          <div className="font-mono text-8xl font-black text-text-subtle/30 leading-none mb-4 select-none">
            404
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-3">
            Page Not Found
          </h1>
          <p className="text-text-muted text-sm leading-relaxed mb-8">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
            It might have been moved, deleted, or you entered the wrong URL.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="not-found-go-back"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Go Back
            </button>
            <button
              id="not-found-go-home"
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
