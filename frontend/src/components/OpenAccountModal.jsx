import React, { useState } from 'react';
import { CreditCard, AlertCircle } from 'lucide-react';

export default function OpenAccountModal({ isOpen, customers, targetCustomerId, onClose, onSuccess }) {
  const [customerId, setCustomerId] = useState(targetCustomerId || (customers[0]?.id || ''));
  const [accountType, setAccountType] = useState('CHECKING');
  const [initialBalance, setInitialBalance] = useState('500.00');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      setError('Please select a customer.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: Number(customerId),
          accountType,
          initialBalance: parseFloat(initialBalance || '0'),
          currency: 'USD'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess(data.data);
        onClose();
      } else {
        setError(data.message || 'Failed to open account');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CreditCard size={20} color="var(--primary)" />
            <h3 className="modal-title">Open Additional Bank Account</h3>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Target Customer</label>
            <select 
              className="form-select"
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              required
            >
              <option value="">-- Select Customer --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email}) - Current Accounts: {c.accounts ? c.accounts.length : 0}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">New Account Type</label>
            <select 
              className="form-select"
              value={accountType}
              onChange={e => setAccountType(e.target.value)}
            >
              <option value="SAVINGS">SAVINGS</option>
              <option value="CHECKING">CHECKING</option>
              <option value="BUSINESS">BUSINESS</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Opening Balance ($)</label>
            <input 
              type="number" 
              step="0.01" 
              min="0"
              className="form-input" 
              placeholder="0.00"
              value={initialBalance}
              onChange={e => setInitialBalance(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Opening Account...' : 'Open New Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
