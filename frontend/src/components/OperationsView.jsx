import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, CheckCircle2, AlertCircle, Send, Plus, Wallet } from 'lucide-react';

export default function OperationsView({ accounts, onRefreshAccounts, defaultAccNumber = '', defaultMode = 'deposit', showToast }) {
  const [activeMode, setActiveMode] = useState(defaultMode); // 'deposit', 'withdraw', 'transfer'

  // Deposit / Withdraw State
  const [selectedAccount, setSelectedAccount] = useState(defaultAccNumber || (accounts[0]?.accountNumber || ''));
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Transfer State
  const [fromAccount, setFromAccount] = useState(defaultAccNumber || (accounts[0]?.accountNumber || ''));
  const [toAccount, setToAccount] = useState(accounts[1]?.accountNumber || '');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDesc, setTransferDesc] = useState('');

  // Operation Status Feedback
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const selectedAccObj = accounts.find(a => a.accountNumber === selectedAccount);
  const fromAccObj = accounts.find(a => a.accountNumber === fromAccount);
  const toAccObj = accounts.find(a => a.accountNumber === toAccount);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!selectedAccount || !amount || Number(amount) <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid deposit amount.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/accounts/${selectedAccount}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: description || 'Cash Deposit'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const msg = `Successfully added $${parseFloat(amount).toFixed(2)} to account ${selectedAccount}`;
        setFeedback({
          type: 'success',
          message: msg,
          data: data.data
        });
        if (showToast) showToast(msg);
        setAmount('');
        setDescription('');
        onRefreshAccounts();
      } else {
        setFeedback({ type: 'error', message: data.message || 'Deposit failed' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error processing deposit: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!selectedAccount || !amount || Number(amount) <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid withdrawal amount.' });
      return;
    }

    if (selectedAccObj && Number(amount) > Number(selectedAccObj.balance)) {
      setFeedback({ type: 'error', message: `Insufficient funds! Available balance: $${Number(selectedAccObj.balance).toFixed(2)}` });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/accounts/${selectedAccount}/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: description || 'Cash Withdrawal'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const msg = `Successfully withdrew $${parseFloat(amount).toFixed(2)} from account ${selectedAccount}`;
        setFeedback({
          type: 'success',
          message: msg,
          data: data.data
        });
        if (showToast) showToast(msg);
        setAmount('');
        setDescription('');
        onRefreshAccounts();
      } else {
        setFeedback({ type: 'error', message: data.message || 'Withdrawal failed' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error processing withdrawal: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!fromAccount || !toAccount) {
      setFeedback({ type: 'error', message: 'Please select both source and destination accounts.' });
      return;
    }

    if (fromAccount === toAccount) {
      setFeedback({ type: 'error', message: 'Source and destination accounts must be different.' });
      return;
    }

    if (!transferAmount || Number(transferAmount) <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid transfer amount.' });
      return;
    }

    if (fromAccObj && Number(transferAmount) > Number(fromAccObj.balance)) {
      setFeedback({ type: 'error', message: `Insufficient funds in source account! Available balance: $${Number(fromAccObj.balance).toFixed(2)}` });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAccountNumber: fromAccount,
          toAccountNumber: toAccount,
          amount: parseFloat(transferAmount),
          description: transferDesc || 'Fund Transfer'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const msg = `Transferred $${parseFloat(transferAmount).toFixed(2)} to ${toAccObj?.customerName || toAccount}!`;
        setFeedback({
          type: 'success',
          message: msg,
          data: data.data
        });
        if (showToast) showToast(msg);
        setTransferAmount('');
        setTransferDesc('');
        onRefreshAccounts();
      } else {
        setFeedback({ type: 'error', message: data.message || 'Transfer failed' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error processing transfer: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Mode Switch Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', background: 'rgba(15, 23, 42, 0.7)', padding: '0.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <button 
          className={`btn ${activeMode === 'deposit' ? 'btn-emerald' : 'btn-secondary'}`}
          style={{ flex: 1 }}
          onClick={() => { setActiveMode('deposit'); setFeedback(null); }}
        >
          <Plus size={18} /> Add Money
        </button>

        <button 
          className={`btn ${activeMode === 'withdraw' ? 'btn-rose' : 'btn-secondary'}`}
          style={{ flex: 1 }}
          onClick={() => { setActiveMode('withdraw'); setFeedback(null); }}
        >
          <ArrowUpRight size={18} /> Cash Out
        </button>

        <button 
          className={`btn ${activeMode === 'transfer' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1 }}
          onClick={() => { setActiveMode('transfer'); setFeedback(null); }}
        >
          <Send size={18} /> Send Money
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <div>{feedback.message}</div>
        </div>
      )}

      {/* DEPOSIT & WITHDRAWAL FORM */}
      {(activeMode === 'deposit' || activeMode === 'withdraw') && (
        <div className="glass-card">
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.65rem',
              borderRadius: '14px',
              background: activeMode === 'deposit' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: activeMode === 'deposit' ? '#34d399' : '#fb7185'
            }}>
              {activeMode === 'deposit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                {activeMode === 'deposit' ? 'Add Money to Account' : 'Cash Out from Account'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {activeMode === 'deposit' ? 'Credit funds directly into a bank account' : 'Withdraw funds safely from account balance'}
              </p>
            </div>
          </div>

          <form onSubmit={activeMode === 'deposit' ? handleDeposit : handleWithdraw}>
            <div className="form-group">
              <label className="form-label">Target Account</label>
              <select 
                className="form-select"
                value={selectedAccount}
                onChange={e => setSelectedAccount(e.target.value)}
                required
              >
                <option value="">-- Select Target Account --</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.accountNumber}>
                    {acc.accountNumber} ({acc.accountType}) - {acc.customerName} - Balance: ${Number(acc.balance).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {selectedAccObj && (
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Available Balance</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#fff' }}>
                    ${Number(selectedAccObj.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <span className={`account-type-badge ${selectedAccObj.accountType.toLowerCase()}`}>
                  {selectedAccObj.accountType}
                </span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input 
                type="number" 
                step="0.01" 
                min="0.01"
                className="form-input" 
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
              <div className="chip-grid">
                {[50, 100, 250, 500, 1000].map(val => (
                  <button 
                    key={val}
                    type="button" 
                    className="chip-btn"
                    onClick={() => setAmount(val.toString())}
                  >
                    +${val}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Note / Reference (Optional)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder={activeMode === 'deposit' ? 'e.g. Monthly Salary / Wire Deposit' : 'e.g. ATM Cash / Store Expense'}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className={`btn ${activeMode === 'deposit' ? 'btn-emerald' : 'btn-rose'}`} 
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : (activeMode === 'deposit' ? 'Confirm Deposit' : 'Confirm Cash Out')}
            </button>
          </form>
        </div>
      )}

      {/* FUND TRANSFER FORM */}
      {activeMode === 'transfer' && (
        <div className="glass-card">
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.65rem', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Send size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Send Money Between Accounts</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Instant internal payments with real-time balance protection.
              </p>
            </div>
          </div>

          <form onSubmit={handleTransfer}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">From Account (Source)</label>
                <select 
                  className="form-select"
                  value={fromAccount}
                  onChange={e => setFromAccount(e.target.value)}
                  required
                >
                  <option value="">-- Select Source Account --</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.accountNumber}>
                      {acc.accountNumber} ({acc.customerName}) - ${Number(acc.balance).toFixed(2)}
                    </option>
                  ))}
                </select>
                {fromAccObj && (
                  <span style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '0.2rem' }}>
                    Available: ${Number(fromAccObj.balance).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">To Account (Recipient)</label>
                <select 
                  className="form-select"
                  value={toAccount}
                  onChange={e => setToAccount(e.target.value)}
                  required
                >
                  <option value="">-- Select Recipient Account --</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.accountNumber}>
                      {acc.accountNumber} ({acc.customerName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Transfer Amount ($)</label>
              <input 
                type="number" 
                step="0.01" 
                min="0.01"
                className="form-input" 
                placeholder="0.00"
                value={transferAmount}
                onChange={e => setTransferAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Reference / Note</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Consulting payment / Invoice #104"
                value={transferDesc}
                onChange={e => setTransferDesc(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Sending Payment...' : 'Send Payment Now'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
