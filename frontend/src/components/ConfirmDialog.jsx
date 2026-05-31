import { AlertTriangle, X } from 'lucide-react';

/**
 * Confirmation dialog modal for destructive actions.
 * @param {boolean} isOpen
 * @param {string} title
 * @param {string} message
 * @param {Function} onConfirm
 * @param {Function} onCancel
 * @param {boolean} isLoading
 */
const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="overlay animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md animate-slide-up rounded-2xl p-6 border border-dark-border"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-modal)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="confirm-dialog-close"
          onClick={onCancel}
          className="absolute top-4 right-4 btn-ghost p-1 rounded-lg"
          disabled={isLoading}
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 id="confirm-dialog-title" className="text-lg font-semibold text-text-primary">
              {title}
            </h2>
            <p className="text-sm text-text-muted mt-0.5">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            id="confirm-dialog-cancel"
            onClick={onCancel}
            disabled={isLoading}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            id="confirm-dialog-confirm"
            onClick={onConfirm}
            disabled={isLoading}
            className="btn btn-danger"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                Deleting...
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
