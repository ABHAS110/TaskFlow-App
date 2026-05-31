import { Loader2 } from 'lucide-react';

/**
 * Reusable centered loading spinner.
 * @param {('sm'|'md'|'lg')} size
 * @param {string} text - Optional label beneath spinner
 */
const LoadingSpinner = ({ size = 'md', text = '', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2
        className={`${sizeMap[size]} text-accent animate-spin`}
        aria-label="Loading"
      />
      {text && (
        <p className={`${textSizeMap[size]} text-text-muted font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
