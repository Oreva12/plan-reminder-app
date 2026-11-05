import { useState, useEffect } from 'react';
import './RenewPlanModal.css';

export default function RenewPlanModal({
  plan,
  onClose,
  onRenew,
  loading,
}) {
  // Get today's date in YYYY-MM-DD format using local time
  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const [expiryDate, setExpiryDate] = useState(getToday());
  const [error, setError] = useState('');

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!expiryDate || expiryDate < getToday()) {
      setError('Please select today or a future date.');
      return;
    }

    try {
      await onRenew(plan, expiryDate);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div
      className="renew-modal-overlay"
      onClick={() => !loading && onClose()}
    >
      <div
        className="renew-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="renew-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="renew-modal-header">
          <div>
            <h2 id="renew-modal-title">Renew Plan</h2>
            <p>Extend your plan by choosing a new expiry date.</p>
          </div>

          <button
            type="button"
            className="renew-modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="renew-plan-info">
          <span>Selected Plan</span>
          <h3>{plan.name}</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="renew-date-field">
            <label htmlFor="renew-expiry-date">
              New Expiry Date
            </label>

            <input
              type="date"
              id="renew-expiry-date"
              value={expiryDate}
              min={getToday()}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />

            <small>
              The new expiry date must be today or a future date.
            </small>
          </div>

          {error && (
            <div className="renew-error">
              {error}
            </div>
          )}

          <div className="renew-modal-actions">
            <button
              type="button"
              className="renew-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="renew-submit-btn"
              disabled={loading || !expiryDate}
            >
              {loading ? 'Renewing...' : 'Renew Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}