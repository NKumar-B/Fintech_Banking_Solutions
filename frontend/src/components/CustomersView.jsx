import React, { useState } from 'react';
import { Users, UserPlus, CreditCard, Mail, Phone, MapPin, Eye, PlusCircle } from 'lucide-react';

export default function CustomersView({ 
  customers, 
  onOpenCreateCustomer, 
  onOpenNewAccount 
}) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Customers</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            View customer profiles and their linked accounts.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenCreateCustomer}>
          <UserPlus size={18} />
          New Customer
        </button>
      </div>

      {/* Customer List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {customers.map((cust) => {
          const accountCount = cust.accounts ? cust.accounts.length : 0;
          return (
            <div key={cust.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      color: '#fff',
                      fontSize: '1.1rem'
                    }}>
                      {cust.name.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{cust.name}</h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>ID #{cust.id}</span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '20px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#818cf8',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}>
                    {accountCount} {accountCount === 1 ? 'Account' : 'Accounts'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={15} color="var(--primary)" />
                    {cust.email}
                  </div>
                  {cust.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={15} color="var(--accent-cyan)" />
                      {cust.phone}
                    </div>
                  )}
                  {cust.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={15} color="var(--accent-emerald)" />
                      {cust.address}
                    </div>
                  )}
                </div>

                {/* Account Pills Preview */}
                <div style={{ marginBottom: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Accounts Overview
                  </div>
                  {cust.accounts && cust.accounts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {cust.accounts.map(acc => (
                        <div key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                            {acc.accountNumber} ({acc.accountType})
                          </span>
                          <span style={{ fontWeight: '700', color: '#34d399' }}>
                            ${Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No active accounts</span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }}>
                <button 
                  className="btn btn-secondary btn-sm" 
                  style={{ flex: 1 }}
                  onClick={() => setSelectedCustomer(cust)}
                >
                  <Eye size={15} />
                  View Profile
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => onOpenNewAccount(cust.id)}
                >
                  <PlusCircle size={15} />
                  Add Account
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Customer Modal */}
      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Customer Profile</h3>
              <button className="close-btn" onClick={() => setSelectedCustomer(null)}>✕</button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{selectedCustomer.name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedCustomer.email}</p>
            </div>

            <h5 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Accounts ({selectedCustomer.accounts ? selectedCustomer.accounts.length : 0})</span>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => {
                  const id = selectedCustomer.id;
                  setSelectedCustomer(null);
                  onOpenNewAccount(id);
                }}
              >
                + Open New Account
              </button>
            </h5>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedCustomer.accounts && selectedCustomer.accounts.map(acc => (
                <div key={acc.id} className="account-card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`account-type-badge ${acc.accountType.toLowerCase()}`}>
                      {acc.accountType}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: acc.status === 'ACTIVE' ? '#34d399' : '#fb7185', fontWeight: '700' }}>
                      {acc.status}
                    </span>
                  </div>
                  <div className="account-number">
                    {acc.accountNumber}
                  </div>
                  <div className="account-balance">
                    ${Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
