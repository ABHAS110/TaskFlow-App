import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

/**
 * Dashboard layout wrapping Navbar + Sidebar + main content area.
 * Manages dark mode preference in localStorage.
 */
const DashboardLayout = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('taskflow_theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeStage, setActiveStage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Apply dark class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
    localStorage.setItem('taskflow_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Navbar isDark={isDark} toggleDark={toggleDark} />

      <div className="flex pt-16">
        <Sidebar
          activeStage={activeStage}
          onStageChange={setActiveStage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main content area */}
        <main className="flex-1 md:ml-60 min-h-[calc(100vh-4rem)]">
          <Outlet context={{ activeStage, searchQuery, setIsMobileMenuOpen }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
