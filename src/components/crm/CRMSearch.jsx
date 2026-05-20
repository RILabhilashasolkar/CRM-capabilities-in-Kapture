import { useState } from 'react';
import { Search } from 'lucide-react';
import { customers, customerOrders, serviceOrders } from '../../data/dummyData';

export default function CRMSearch({ onResult }) {
  const [mode, setMode] = useState('mobile');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSearch = () => {
    const q = query.trim();
    if (!q) { setError('Please enter a search value'); return; }
    setError('');

    if (mode === 'mobile') {
      const customer = customers[q];
      const orders = customerOrders[q] || [];
      const sos = serviceOrders.filter(s => s.customer.phone === q);
      if (!customer && orders.length === 0 && sos.length === 0) {
        setError('No customer found for this mobile number. Try: 9916265181 or 9689808472');
        return;
      }
      onResult({ mode: 'mobile', query: q, customer, orders, relatedSOs: sos });
    } else if (mode === 'orderId') {
      let foundOrder = null, foundCustomer = null, foundPhone = null;
      Object.entries(customerOrders).forEach(([phone, ords]) => {
        const o = ords.find(x => x.orderId.toLowerCase() === q.toLowerCase());
        if (o) { foundOrder = o; foundPhone = phone; foundCustomer = customers[phone]; }
      });
      if (!foundOrder) { setError('Order not found. Try: ORD-20240402-001 or B63515626500726'); return; }
      const sos = serviceOrders.filter(s => s.orderId === foundOrder.orderId);
      onResult({ mode: 'orderId', query: q, customer: foundCustomer, orders: [foundOrder], relatedSOs: sos, phone: foundPhone });
    } else {
      const so = serviceOrders.find(s => s.id === q || s.sapServiceOrderNo === q);
      if (!so) { setError('Service order not found. Try: 86379827 or 86379901'); return; }
      onResult({ mode: 'soNumber', query: q, serviceOrder: so });
    }
  };

  const placeholders = { mobile: '9916265181', orderId: 'ORD-20240402-001', soNumber: '86379827' };
  const labels = { mobile: 'Mobile Number', orderId: 'Order ID', soNumber: 'Service Order Number' };

  return (
    <div className="crm-page" style={{ justifyContent: 'flex-start' }}>
      <div style={{ maxWidth: 560, margin: '48px auto', padding: '0 20px', width: '100%' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Search Customer / Order</div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>Look up customer by mobile number, order ID, or service order number</div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div className="search-mode-tabs">
            {[['mobile','Mobile Number'],['orderId','Order ID'],['soNumber','Service Order No.']].map(([val, label]) => (
              <button key={val} className={`search-mode-tab ${mode === val ? 'active' : ''}`}
                onClick={() => { setMode(val); setQuery(''); setError(''); }}>{label}</button>
            ))}
          </div>

          <div style={{ marginBottom: 6, fontSize: 12.5, color: '#374151', fontWeight: 600 }}>{labels[mode]}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              className="form-input"
              style={{ flex: 1 }}
              placeholder={placeholders[mode]}
              value={query}
              onChange={e => { setQuery(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              autoFocus
            />
            <button
              className="btn-primary"
              style={{ borderRadius: 6, padding: '9px 22px', display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={handleSearch}
            >
              <Search size={14} /> Search
            </button>
          </div>
          {error && <div style={{ color: '#dc2626', fontSize: 12.5, marginTop: 8 }}>{error}</div>}
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Access</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: 'Gajendiran Perumal', sub: '9916265181', val: '9916265181', m: 'mobile' },
              { label: 'Abhilash Asolkar', sub: '9689808472', val: '9689808472', m: 'mobile' },
              { label: 'SO #86379827', sub: 'In Progress', val: '86379827', m: 'soNumber' },
              { label: 'SO #86379901', sub: 'Assigned', val: '86379901', m: 'soNumber' },
            ].map(item => (
              <button key={item.val}
                onClick={() => { setMode(item.m); setQuery(item.val); setError(''); }}
                style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', textAlign: 'left', minWidth: 160 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1a2e' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{item.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
