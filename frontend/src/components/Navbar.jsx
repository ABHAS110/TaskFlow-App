import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Zap, Bell, Settings } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { getInitials } from '../utils/helpers';

/**
 * Top navigation bar with logo, dark mode toggle, user menu, and logout.
 * @param {boolean} isDark - Current dark mode state
 * @param {Function} toggleDark - Toggle dark mode callback
 */
const Navbar = ({ isDark, toggleDark }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 border-b border-dark-border"
      style={{ background: 'var(--color-surface)' }}
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link
          to="/dashboard"
          id="navbar-logo"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-accent shadow-glow">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-text-primary tracking-tight">
            Task<span className="text-accent">Flow</span>
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            id="navbar-dark-toggle"
            onClick={toggleDark}
            className="btn-ghost p-2 rounded-xl"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              id="navbar-user-menu"
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-dark-hover transition-all duration-150"
              aria-label="User menu"
              aria-expanded={showUserMenu}
            >
              {/* Avatar */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-dark text-white text-xs font-bold select-none">
                {getInitials(user?.name)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-text-primary leading-none">
                  {user?.name}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{user?.email}</p>
              </div>
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-dark-border py-1 z-20 animate-slide-up"
                  style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-modal)' }}
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-dark-border">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark text-white text-sm font-bold mx-auto mb-2 select-none">
                      {getInitials(user?.name)}
                    </div>
                    <p className="text-sm font-semibold text-text-primary text-center">{user?.name}</p>
                    <p className="text-xs text-text-muted text-center">{user?.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="p-1">
                    <button
                      id="navbar-logout"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
