import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import CustomersView from './components/CustomersView';
import AccountsView from './components/AccountsView';
import OperationsView from './components/OperationsView';
import TransactionsView from './components/TransactionsView';

import CreateCustomerModal from './components/CreateCustomerModal';
import OpenAccountModal from './components/OpenAccountModal';
import PostmanGuideModal from './components/PostmanGuideModal';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Operations tab defaults
  const [opsDefaultAcc, setOpsDefaultAcc] = useState('');
  const [opsDefaultMode, setOpsDefaultMode] = useState('deposit');

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [isCreateCustOpen, setIsCreateCustOpen] = useState(false);
  const [isOpenAccountOpen, setIsOpenAccountOpen] = useState(false);
  const [targetCustIdForAcc, setTargetCustIdForAcc] = useState(null);
  const [isPostmanGuideOpen, setIsPostmanGuideOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchAllData = useCallback(async () => {
    try {
      const [custRes, accRes] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/accounts')
      ]);

      const custData = await custRes.json();
      const accData = await accRes.json();

      if (custData.success) setCustomers(custData.data || []);
      if (accData.success) setAccounts(accData.data || []);
    } catch (err) {
      console.error('Error fetching data from backend:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleNavigateToOps = (mode, accountNumber) => {
    setOpsDefaultMode(mode);
    setOpsDefaultAcc(accountNumber);
    setActiveTab('operations');
  };

  const handleOpenNewAccountForCust = (customerId) => {
    setTargetCustIdForAcc(customerId);
    setIsOpenAccountOpen(true);
  };

  return (
    <div className="app-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenPostmanGuide={() => setIsPostmanGuideOpen(true)}
      />

      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Connecting to Banking Engine...
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView 
                customers={customers} 
                accounts={accounts} 
                onNavigate={setActiveTab}
                onOpenCreateCustomer={() => setIsCreateCustOpen(true)}
                onNavigateToOps={handleNavigateToOps}
              />
            )}

            {activeTab === 'customers' && (
              <CustomersView 
                customers={customers}
                onOpenCreateCustomer={() => setIsCreateCustOpen(true)}
                onOpenNewAccount={handleOpenNewAccountForCust}
              />
            )}

            {activeTab === 'accounts' && (
              <AccountsView 
                accounts={accounts}
                onRefresh={fetchAllData}
                onNavigateToOps={handleNavigateToOps}
              />
            )}

            {activeTab === 'operations' && (
              <OperationsView 
                accounts={accounts}
                onRefreshAccounts={fetchAllData}
                defaultAccNumber={opsDefaultAcc}
                defaultMode={opsDefaultMode}
                showToast={showToast}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsView 
                accounts={accounts}
              />
            )}
          </>
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={20} color="#34d399" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <CreateCustomerModal 
        isOpen={isCreateCustOpen}
        onClose={() => setIsCreateCustOpen(false)}
        onSuccess={(data) => {
          fetchAllData();
          showToast(`Customer ${data.name} created successfully!`);
        }}
      />

      <OpenAccountModal 
        isOpen={isOpenAccountOpen}
        customers={customers}
        targetCustomerId={targetCustIdForAcc}
        onClose={() => { setIsOpenAccountOpen(false); setTargetCustIdForAcc(null); }}
        onSuccess={(acc) => {
          fetchAllData();
          showToast(`Account ${acc.accountNumber} opened successfully!`);
        }}
      />

      <PostmanGuideModal 
        isOpen={isPostmanGuideOpen}
        onClose={() => setIsPostmanGuideOpen(false)}
      />
    </div>
  );
}
