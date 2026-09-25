import React, { useState, useEffect, useCallback } from 'react';
import { History, Calendar, Filter, ChevronLeft, ChevronRight, Download, RefreshCw, AlertCircle } from 'lucide-react';

export default function TransactionsView({ accounts }) {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.accountNumber || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortDir, setSortDir] = useState('DESC');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageData, setPageData] = useState({
    content: [],
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    isFirst: true,
    isLast: true
  });

  const fetchTransactions = useCallback(async () => {
    if (!selectedAccount) return;

    setLoading(true);
    setError(null);

    let url = `/api/accounts/${selectedAccount}/transactions?page=${page}&size=${size}&sortBy=timestamp&sortDir=${sortDir}`;
    if (startDate) {
      url += `&startDate=${encodeURIComponent(startDate + 'T00:00:00')}`;
    }
    if (endDate) {
      url += `&endDate=${encodeURIComponent(endDate + 'T23:59:59')}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.success) {
        setPageData(data.data);
      } else {
        setError(data.message || 'Failed to fetch transaction history');
      }
    } catch (err) {
      setError('Error connecting to backend API: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedAccount, startDate, endDate, page, size, sortDir]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAccountChange = (accNum) => {
    setSelectedAccount(accNum);
    setPage(0);
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  const exportCSV = () => {
    if (!pageData.content || pageData.content.length === 0) return;

    const headers = ['Reference', 'Account', 'Type', 'Amount', 'Balance After', 'Related Account', 'Description', 'Timestamp'];
    const rows = pageData.content.map(t => [
      t.transactionReference,
      t.accountNumber,
      t.type,
      t.amount,
      t.balanceAfter,
      t.relatedAccountNumber || '',
      `"${t.description || ''}"`,
      t.timestamp
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Transactions_${selectedAccount}_Page${page + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Transaction History Audit Log</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Paginated statement records with custom date range filtering.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchTransactions}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button className="btn btn-primary btn-sm" onClick={exportCSV} disabled={!pageData.content || pageData.content.length === 0}>
            <Download size={15} /> Export Page CSV
          </button>
        </div>
      </div>

      {/* Filter & Pagination Controls Bar */}
      <div className="filter-bar">
        <div style={{ flex: '1 1 240px' }} className="form-group">
          <label className="form-label">Select Account</label>
          <select 
            className="form-select"
            value={selectedAccount}
            onChange={e => handleAccountChange(e.target.value)}
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.accountNumber}>
                {acc.accountNumber} ({acc.customerName}) - {acc.accountType}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 180px' }} className="form-group">
          <label className="form-label">Start Date</label>
          <input 
            type="date" 
            className="form-input"
            value={startDate}
            onChange={e => { setStartDate(e.target.value); setPage(0); }}
          />
        </div>

        <div style={{ flex: '1 1 180px' }} className="form-group">
          <label className="form-label">End Date</label>
          <input 
            type="date" 
            className="form-input"
            value={endDate}
            onChange={e => { setEndDate(e.target.value); setPage(0); }}
          />
        </div>

        <div style={{ width: '130px' }} className="form-group">
          <label className="form-label">Page Size</label>
          <select 
            className="form-select"
            value={size}
            onChange={e => { setSize(Number(e.target.value)); setPage(0); }}
          >
            <option value="5">5 / page</option>
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
          </select>
        </div>

        {(startDate || endDate) && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleClearFilters}
            style={{ marginBottom: '1.25rem' }}
          >
            Clear Date Filter
          </button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Table Content */}
      <div className="glass-card" style={{ padding: '1rem' }}>
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Related Acc</th>
                <th>Description</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Loading transactions...
                  </td>
                </tr>
              ) : pageData.content && pageData.content.length > 0 ? (
                pageData.content.map(trx => (
                  <tr key={trx.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                      {trx.transactionReference}
                    </td>
                    <td>
                      <span className={`trx-badge ${trx.type.toLowerCase()}`}>
                        {trx.type}
                      </span>
                    </td>
                    <td style={{
                      fontWeight: '700',
                      color: (trx.type === 'DEPOSIT' || trx.type === 'TRANSFER_IN') ? '#34d399' : '#fb7185'
                    }}>
                      {(trx.type === 'DEPOSIT' || trx.type === 'TRANSFER_IN') ? '+' : '-'}
                      ${Number(trx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                      ${Number(trx.balanceAfter).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                      {trx.relatedAccountNumber || '-'}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {trx.description}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                      {new Date(trx.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    No transaction history found for selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pageData && pageData.totalPages > 0 && (
          <div className="pagination-container">
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing Page <strong style={{ color: '#fff' }}>{pageData.pageNumber + 1}</strong> of <strong style={{ color: '#fff' }}>{pageData.totalPages}</strong> ({pageData.totalElements} Total Transactions)
            </div>

            <div className="pagination-controls">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={pageData.isFirst || loading}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <span className="page-num active">
                {pageData.pageNumber + 1}
              </span>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(p => p + 1)}
                disabled={pageData.isLast || loading}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
