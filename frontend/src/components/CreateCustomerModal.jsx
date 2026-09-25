import React, { useState } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';

export default function CreateCustomerModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [initialAccountType, setInitialAccountType] = useState('SAVINGS');
  const [initialDeposit, setInitialDeposit] = useState('1000.00');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          initialAccountType,
          initialDeposit: parseFloat(initialDeposit || '0'),
          currency: 'USD'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess(data.data);
        onClose();
      } else {
        setError(data.message || 'Failed to create customer');
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
            <UserPlus size={20} color="var(--primary)" />
            <h3 className="modal-title">Create Customer & Open Account</h3>
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
            <label className="form-label">Full Name *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Sarah Connor"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="e.g. sarah.connor@cyberdyne.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="+1-555-0199"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Street, City, Country"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
              Primary Account Setup
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Account Type *</label>
                <select 
                  className="form-select"
                  value={initialAccountType}
                  onChange={e => setInitialAccountType(e.target.value)}
                >
                  <option value="SAVINGS">SAVINGS</option>
                  <option value="CHECKING">CHECKING</option>
                  <option value="BUSINESS">BUSINESS</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Initial Deposit ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  className="form-input" 
                  placeholder="0.00"
                  value={initialDeposit}
                  onChange={e => setInitialDeposit(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Customer & Account...' : 'Create Customer & Open Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
