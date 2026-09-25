import React, { useState } from 'react';
import { CreditCard, Search, RefreshCw, Copy, Check, ArrowRightLeft, DollarSign } from 'lucide-react';

export default function AccountsView({ accounts, onRefresh, onNavigateToOps }) {
  const [copiedAcc, setCopiedAcc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (acc.customerName && acc.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'ALL' || acc.accountType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCopy = (accNum) => {
    navigator.clipboard.writeText(accNum);
    setCopiedAcc(accNum);
    setTimeout(() => setCopiedAcc(null), 2000);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Bank Accounts Portfolio</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Real-time balance tracking, account details, and status monitoring.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={onRefresh}>
          <RefreshCw size={16} />
          Refresh Balances
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: '220px' }} className="form-group">
          <label className="form-label">Search Accounts or Customers</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by ACC number or customer name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          </div>
        </div>

        <div style={{ width: '200px' }} className="form-group">
          <label className="form-label">Filter by Account Type</label>
          <select 
            className="form-select"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
          >
            <option value="ALL">All Account Types</option>
            <option value="SAVINGS">SAVINGS</option>
            <option value="CHECKING">CHECKING</option>
            <option value="BUSINESS">BUSINESS</option>
          </select>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="accounts-grid">
        {filteredAccounts.map((acc) => (
          <div key={acc.id} className="account-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`account-type-badge ${acc.accountType.toLowerCase()}`}>
                {acc.accountType}
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.2rem 0.5rem',
                borderRadius: '12px',
                background: acc.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: acc.status === 'ACTIVE' ? '#34d399' : '#fb7185'
              }}>
                {acc.status}
              </span>
            </div>

            <div className="account-number">
              <span>{acc.accountNumber}</span>
              <button 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                onClick={() => handleCopy(acc.accountNumber)}
                title="Copy Account Number"
              >
                {copiedAcc === acc.accountNumber ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
              </button>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Customer: <strong style={{ color: 'var(--text-main)' }}>{acc.customerName || 'N/A'}</strong> (ID #{acc.customerId})
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Available Balance
              </div>
              <div className="account-balance">
                ${Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ flex: 1 }}
                onClick={() => onNavigateToOps('deposit', acc.accountNumber)}
              >
                <DollarSign size={14} /> Deposit / Withdraw
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onNavigateToOps('transfer', acc.accountNumber)}
              >
                <ArrowRightLeft size={14} /> Transfer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
