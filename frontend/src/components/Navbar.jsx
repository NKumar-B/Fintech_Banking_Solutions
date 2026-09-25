import React from 'react';
import { Building2, LayoutDashboard, Users, CreditCard, ArrowRightLeft, History, FileCode, ExternalLink } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenPostmanGuide }) {
  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <Building2 size={22} />
        </div>
        <div>
          <div className="brand-title">Nexus Bank</div>
        </div>
        <span className="brand-tag" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)', textTransform: 'none' }}>
          ● Online
        </span>
      </div>

      <nav className="nav-links">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button
          className={`nav-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <Users size={18} />
          Customers
        </button>

        <button
          className={`nav-btn ${activeTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          <CreditCard size={18} />
          Accounts
        </button>

        <button
          className={`nav-btn ${activeTab === 'operations' ? 'active' : ''}`}
          onClick={() => setActiveTab('operations')}
        >
          <ArrowRightLeft size={18} />
          Transfers & Cash
        </button>

        <button
          className={`nav-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <History size={18} />
          Statements
        </button>
      </nav>

      <div className="nav-actions">
        <button className="btn btn-secondary btn-sm" onClick={onOpenPostmanGuide}>
          <FileCode size={16} />
          API & Postman
        </button>
        <a 
          href="http://localhost:8080/swagger-ui.html" 
          target="_blank" 
          rel="noreferrer"
          className="btn btn-primary btn-sm"
        >
          Swagger Docs
          <ExternalLink size={14} />
        </a>
      </div>
    </header>
  );
}
