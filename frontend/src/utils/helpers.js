/**
 * Format a date string into a human-readable format.
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  };
  try {
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
  } catch {
    return '';
  }
};

/**
 * Format a date relative to now (e.g., "2 hours ago").
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeDate = (date) => {
  if (!date) return '';
  try {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
  } catch {
    return '';
  }
};

/**
 * Get Tailwind CSS classes for a given stage.
 * @param {string} stage
 * @returns {{ badge: string, dot: string, column: string }}
 */
export const getStageColor = (stage) => {
  const colors = {
    Todo: {
      badge: 'badge-todo',
      dot: 'bg-blue-400',
      column: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
      hex: '#3B82F6',
    },
    'In Progress': {
      badge: 'badge-progress',
      dot: 'bg-amber-400',
      column: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      hex: '#F59E0B',
    },
    Done: {
      badge: 'badge-done',
      dot: 'bg-emerald-400',
      column: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      hex: '#10B981',
    },
  };
  return colors[stage] || colors.Todo;
};

/**
 * Truncate a string to a given max length.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (str, maxLength = 100) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '…';
};

/**
 * Get user initials from a name.
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
};

/**
 * Debounce a function.
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Generate a short task ID display string.
 * @param {string} id - MongoDB ObjectId
 * @returns {string}
 */
export const shortId = (id) => {
  if (!id) return '';
  return `#${id.slice(-6).toUpperCase()}`;
};
