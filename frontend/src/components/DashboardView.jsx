import React from 'react';
import { Users, CreditCard, DollarSign, ArrowUpRight, UserPlus, ArrowRightLeft, ShieldCheck, History, Send, Sparkles } from 'lucide-react';

export default function DashboardView({ customers, accounts, onNavigate, onOpenCreateCustomer, onNavigateToOps }) {
  const totalCustomers = customers.length;
  const totalAccounts = accounts.length;
  const totalBalance = accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);
  const activeAccounts = accounts.filter(a => a.status === 'ACTIVE').length;

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="animate-fade-in">
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(16, 185, 129, 0.12) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.25rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} /> Welcome to Nexus Bank
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            {greeting}, Alex
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '640px', lineHeight: '1.6' }}>
            Here is your real-time financial snapshot. Manage client accounts, send instant payments, and review statements.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button className="btn btn-emerald" onClick={() => onNavigate('operations')} style={{ padding: '0.8rem 1.4rem' }}>
            <Send size={18} />
            Send Money
          </button>
          <button className="btn btn-primary" onClick={onOpenCreateCustomer} style={{ padding: '0.8rem 1.4rem' }}>
            <UserPlus size={18} />
            Add New Client
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="metric-value">{totalCustomers}</div>
            <div className="metric-label">Active Clients</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div className="metric-value">{totalAccounts}</div>
            <div className="metric-label">Open Accounts</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="metric-value">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="metric-label">Total Vault Balance</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="metric-value">{activeAccounts} / {totalAccounts}</div>
            <div className="metric-label">Healthy Accounts</div>
          </div>
        </div>
      </div>

      {/* Quick Recipient Bar */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.25rem 1.75rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem' }}>
          Quick Pay to Clients
        </div>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {customers.slice(0, 4).map(cust => (
            <button
              key={cust.id}
              onClick={() => onNavigateToOps('transfer', cust.accounts?.[0]?.accountNumber || '')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.85rem',
                color: '#fff'
              }}>
                {cust.name.charAt(0)}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '600' }}>{cust.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Send Money →</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                <Users size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Client Profiles</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Manage registered client portfolios, open new checking or savings accounts, and view balances.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => onNavigate('customers')}>
            View Directory <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <ArrowRightLeft size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Move Money</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Deposit cash into accounts, make instant withdrawals, or process account transfers with balance validation.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => onNavigate('operations')}>
            Open Transfer Portal <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
                <History size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Account Statements</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Inspect detailed transaction audit trails, filter by date ranges, and export statement CSVs.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => onNavigate('transactions')}>
            Explore History <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
