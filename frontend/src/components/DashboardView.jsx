import React from 'react';
import { Users, CreditCard, DollarSign, ArrowUpRight, UserPlus, ArrowRightLeft, ShieldCheck, History } from 'lucide-react';

export default function DashboardView({ customers, accounts, onNavigate, onOpenCreateCustomer }) {
  const totalCustomers = customers.length;
  const totalAccounts = accounts.length;
  const totalBalance = accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);
  const activeAccounts = accounts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div className="animate-fade-in">
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(6, 182, 212, 0.12) 100%)',
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
          <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
            Banking Dashboard
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Welcome back, Administrator
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '620px', lineHeight: '1.6' }}>
            Manage client accounts, process deposits and transfers, and view live financial statements across all branches.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={onOpenCreateCustomer} style={{ padding: '0.8rem 1.4rem', fontSize: '0.95rem' }}>
            <UserPlus size={18} />
            + New Customer
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
            <div className="metric-label">Total Accounts</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="metric-value">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="metric-label">Total Vault Liquidity</div>
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

      {/* Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                <Users size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Customer Directory</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Browse customer profiles, open new checking or savings accounts, and view multi-account holdings.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => onNavigate('customers')}>
            View Customers <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <ArrowRightLeft size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Transfers & Payments</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Deposit cash, withdraw funds, or transfer money between accounts with real-time balance protection.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => onNavigate('operations')}>
            Make a Transfer <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
                <History size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Account Statements</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Review transaction histories, filter by date ranges, and export statement reports.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => onNavigate('transactions')}>
            View Statements <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
