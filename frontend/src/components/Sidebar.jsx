import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckSquare, Clock, CheckCircle2, LayoutDashboard, X, SlidersHorizontal } from 'lucide-react';
import useTasks from '../hooks/useTasks';

const STAGES = [
  { label: 'All Tasks', value: null, icon: LayoutDashboard, color: 'text-accent' },
  { label: 'Todo', value: 'Todo', icon: CheckSquare, color: 'text-blue-400' },
  { label: 'In Progress', value: 'In Progress', icon: Clock, color: 'text-amber-400' },
  { label: 'Done', value: 'Done', icon: CheckCircle2, color: 'text-emerald-400' },
];

/**
 * Sidebar with stage filter links, task counts, and search input.
 * @param {string|null} activeStage - Currently selected stage filter
 * @param {Function} onStageChange - Stage selection callback
 * @param {string} searchQuery - Current search query
 * @param {Function} onSearchChange - Search change callback
 * @param {boolean} isMobileOpen - Whether sidebar is open on mobile
 * @param {Function} onMobileClose - Close mobile sidebar
 */
const Sidebar = ({
  activeStage,
  onStageChange,
  searchQuery,
  onSearchChange,
  isMobileOpen,
  onMobileClose,
}) => {
  const { tasks } = useTasks();

  const getCount = (stage) => {
    if (!stage) return tasks.length;
    return tasks.filter((t) => t.stage === stage).length;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
          <input
            id="sidebar-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="input pl-9 pr-8 py-2.5 text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-muted transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-2">
        <div className="mb-2">
          <p className="px-3 mb-1.5 text-xs font-semibold text-text-subtle uppercase tracking-wider">
            Filter by Stage
          </p>
          <nav className="space-y-0.5">
            {STAGES.map(({ label, value, icon: Icon, color }) => {
              const isActive = activeStage === value;
              const count = getCount(value);
              return (
                <button
                  key={label}
                  id={`sidebar-stage-${label.toLowerCase().replace(' ', '-')}`}
                  onClick={() => {
                    onStageChange(value);
                    if (onMobileClose) onMobileClose();
                  }}
                  className={`nav-item w-full justify-between ${isActive ? 'active' : ''}`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : color}`} />
                    <span>{label}</span>
                  </span>
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold ${
                      isActive ? 'bg-accent/20 text-accent' : 'bg-dark-border text-text-subtle'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/10 border border-accent/20">
          <SlidersHorizontal className="w-3.5 h-3.5 text-accent flex-shrink-0" />
          <p className="text-xs text-text-muted">
            <span className="font-semibold text-accent">{tasks.length}</span> total tasks
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 border-r border-dark-border h-full fixed left-0 top-16 bottom-0"
        style={{ background: 'var(--color-surface)' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 md:hidden animate-fade-in"
            onClick={onMobileClose}
          />
          <aside
            className="fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col md:hidden animate-slide-in"
            style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center justify-between p-4 border-b border-dark-border">
              <span className="font-semibold text-text-primary">Filters</span>
              <button onClick={onMobileClose} className="btn-ghost p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
