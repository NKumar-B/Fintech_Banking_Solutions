import React from 'react';
import { FileCode, Download, ExternalLink, CheckCircle2, Layers } from 'lucide-react';

export default function PostmanGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileCode size={22} color="var(--primary)" />
            <h3 className="modal-title">Postman Collection & REST API Documentation</h3>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} /> Ready-to-Use Postman Collection Included!
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              A full Postman Collection file <code style={{ color: '#38bdf8' }}>Banking_System_Postman_Collection.json</code> has been generated in the project root folder.
            </p>
          </div>

          <div>
            <h5 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.5rem' }}>How to Import into Postman:</h5>
            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Open <strong>Postman App</strong> on your desktop.</li>
              <li>Click the <strong>Import</strong> button (top left).</li>
              <li>Select file: <code className="code-box" style={{ padding: '0.1rem 0.4rem', fontSize: '0.8rem' }}>Banking_System_Postman_Collection.json</code></li>
              <li>All API endpoints will load into your sidebar with pre-configured requests, JSON bodies, and headers!</li>
            </ol>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h5 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem' }}>Endpoints Included in Postman Collection:</h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.6rem', borderRadius: '6px' }}>
                <span style={{ color: '#34d399', fontWeight: '700' }}>POST</span> /api/customers
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Create customer & open account</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.6rem', borderRadius: '6px' }}>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>GET</span> /api/customers/1
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Get customer & accounts</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.6rem', borderRadius: '6px' }}>
                <span style={{ color: '#34d399', fontWeight: '700' }}>POST</span> /api/accounts
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Open secondary account</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.6rem', borderRadius: '6px' }}>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>GET</span> /api/accounts/ACC...
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Get account & balance</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.6rem', borderRadius: '6px' }}>
                <span style={{ color: '#34d399', fontWeight: '700' }}>POST</span> /api/accounts/ACC.../deposit
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Deposit cash into account</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.6rem', borderRadius: '6px' }}>
                <span style={{ color: '#fb7185', fontWeight: '700' }}>POST</span> /api/accounts/ACC.../withdraw
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Withdraw cash from account</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.6rem', borderRadius: '6px' }}>
                <span style={{ color: '#c084fc', fontWeight: '700' }}>POST</span> /api/transfers
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Atomic fund transfer</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.6rem', borderRadius: '6px' }}>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>GET</span> /api/accounts/ACC.../transactions
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Paginated & Date filtered history</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <a 
              href="http://localhost:8080/swagger-ui.html" 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Open Interactive Swagger UI
              <ExternalLink size={16} />
            </a>
            <a 
              href="http://localhost:8080/h2-console" 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Open H2 Database Console
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
