import { useState } from 'react';
import { ArrowLeft, ChevronRight, ChevronDown, Plus, MapPin, X, CheckCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { serviceOrders as allSOs, indiaStates } from '../../data/dummyData';

const pincodeCityMap = { '400061': ['Mumbai', 'Maharashtra'], '400051': ['Mumbai', 'Maharashtra'], '400050': ['Mumbai', 'Maharashtra'], '122002': ['Gurugram', 'Haryana'], '380015': ['Ahmedabad', 'Gujarat'], '400006': ['Navi Mumbai', 'Maharashtra'], '110001': ['New Delhi', 'Delhi'], '560001': ['Bengaluru', 'Karnataka'] };

export default function CRMOrderList({ result, onSelectOrder, onSelectSO, onCreateSR, onCreateTicket, onBack }) {
  const [activeTab, setActiveTab] = useState('all');
  const [expanded, setExpanded] = useState({});
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrSaved, setAddrSaved] = useState(false);
  const [addrForm, setAddrForm] = useState({ flat: '', building: '', street: '', area: '', pincode: '', city: '', state: '' });
  const [extraAddresses, setExtraAddresses] = useState([]);

  const setAF = (k, v) => setAddrForm(p => ({ ...p, [k]: v }));
  const handleAddrPincode = (val) => {
    setAF('pincode', val);
    if (pincodeCityMap[val]) { setAF('city', pincodeCityMap[val][0]); setAF('state', pincodeCityMap[val][1]); }
  };
  const canSaveAddr = addrForm.flat && addrForm.pincode;
  const handleSaveAddress = () => {
    setExtraAddresses(p => [...p, { ...addrForm }]);
    setAddrSaved(true);
    setAddrForm({ flat: '', building: '', street: '', area: '', pincode: '', city: '', state: '' });
    setTimeout(() => { setAddrSaved(false); setShowAddAddress(false); }, 2000);
  };

  const { customer, orders = [], relatedSOs = [] } = result;

  const enrichedOrders = orders.map(order => {
    const linkedSOs = [...relatedSOs, ...allSOs]
      .filter(s => s.orderId === order.orderId)
      .filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);
    return { ...order, linkedSOs };
  });

  const standaloneSOs = relatedSOs.filter(so => !orders.some(o => o.orderId === so.orderId));
  const toggle = id => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const totalSOs = enrichedOrders.reduce((n, o) => n + o.linkedSOs.length, 0) + standaloneSOs.length;

  return (
    <div className="crm-page">
      <div className="crm-topbar">
        <button className="crm-back-btn" onClick={onBack}><ArrowLeft size={14} /> Search</button>
        <span className="crm-breadcrumb-sep">›</span>
        <span className="crm-breadcrumb-current">
          {customer ? customer.name : `Results for "${result.query}"`}
        </span>
      </div>

      <div className="crm-body">
        {customer && (
          <div className="customer-banner">
            <div className="customer-avatar">{customer.name.charAt(0)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>{customer.name}</div>
              <div style={{ fontSize: 12.5, color: '#6b7280', marginTop: 2, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span>Mobile: <strong>{customer.phone}</strong></span>
                <span>Customer ID: <strong>{customer.code}</strong></span>
                <span>{customer.email}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="btn-primary" style={{ borderRadius: 6, fontSize: 12.5, padding: '7px 14px' }}
                onClick={() => onCreateSR(null, null)}>
                <Plus size={12} style={{ display: 'inline', marginRight: 4 }} />Service Request
              </button>
              <button className="btn-outline-blue" style={{ borderRadius: 6, fontSize: 12.5, padding: '6px 14px' }}
                onClick={() => onCreateTicket(null, null)}>
                <Plus size={12} style={{ display: 'inline', marginRight: 4 }} />Create Ticket
              </button>
            </div>
          </div>
        )}

        {/* Address management */}
        {customer && (
          <div className="card" style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: (customer.addresses?.length > 0 || extraAddresses.length > 0) ? 8 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={13} color="#6b7280" />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#374151' }}>
                  Addresses ({(customer.addresses?.length || 0) + extraAddresses.length})
                </span>
              </div>
              <button style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 11.5, color: '#374151', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                onClick={() => { setShowAddAddress(p => !p); setAddrSaved(false); }}>
                {showAddAddress ? <><X size={11} /> Cancel</> : <><Plus size={11} /> Add Address</>}
              </button>
            </div>

            {/* Existing addresses */}
            {[...(customer.addresses || []), ...extraAddresses].map((addr, i) => (
              <div key={i} style={{ fontSize: 12, color: '#6b7280', padding: '4px 0', borderTop: i === 0 ? 'none' : '1px solid #f3f4f6' }}>
                {[addr.flat, addr.building, addr.street, addr.area, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}
                {i >= (customer.addresses?.length || 0) && <span style={{ marginLeft: 8, fontSize: 10, background: '#d1fae5', color: '#065f46', fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>New</span>}
              </div>
            ))}

            {/* Add address form */}
            {showAddAddress && !addrSaved && (
              <div style={{ marginTop: 12, padding: '14px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10 }}>Add New Service Address</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[['flat','Flat / House No. *','Flat 402'],['building','Building / Society','Sunrise Apts'],['street','Street','Yari Road'],['area','Area / Landmark','Near D-Mart']].map(([k, label, ph]) => (
                    <div key={k} className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: 11 }}>{label}</label>
                      <input className="form-input" style={{ fontSize: 12 }} placeholder={ph} value={addrForm[k]} onChange={e => setAF(k, e.target.value)} />
                    </div>
                  ))}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 11 }}>Pincode *</label>
                    <input className="form-input" style={{ fontSize: 12 }} placeholder="400061" maxLength={6} value={addrForm.pincode} onChange={e => handleAddrPincode(e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 11 }}>City</label>
                    <input className="form-input" style={{ fontSize: 12 }} placeholder="Mumbai" value={addrForm.city} onChange={e => setAF('city', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                    <label className="form-label" style={{ fontSize: 11 }}>State</label>
                    <select className="form-select" style={{ fontSize: 12 }} value={addrForm.state} onChange={e => setAF('state', e.target.value)}>
                      <option value="">Select state</option>
                      {(indiaStates || ['Maharashtra','Delhi','Karnataka','Haryana','Gujarat','Tamil Nadu']).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="btn-primary" style={{ borderRadius: 6, fontSize: 12, opacity: canSaveAddr ? 1 : 0.5 }} disabled={!canSaveAddr} onClick={handleSaveAddress}>Save Address</button>
                  <button className="btn-secondary" style={{ borderRadius: 6, fontSize: 12 }} onClick={() => setShowAddAddress(false)}>Cancel</button>
                </div>
              </div>
            )}
            {addrSaved && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, color: '#16a34a', fontSize: 12.5, fontWeight: 600 }}>
                <CheckCircle size={14} /> Address saved successfully
              </div>
            )}
          </div>
        )}

        {/* Tab bar */}
        <div className="tab-bar" style={{ borderRadius: '8px 8px 0 0', background: 'white' }}>
          {[
            ['all', `All (${orders.length + totalSOs})`],
            ['orders', `Product Orders (${orders.length})`],
            ['so', `Service Orders (${totalSOs})`],
          ].map(([key, label]) => (
            <div key={key} className={`tab ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>{label}</div>
          ))}
        </div>

        <div className="card" style={{ marginBottom: 0, borderRadius: '0 0 8px 8px' }}>
          <table className="order-table">
            <thead>
              <tr>
                <th style={{ width: 32 }}></th>
                <th>Order / SO Number</th>
                <th>Product</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Amount</th>
                <th style={{ width: 90 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Product order rows */}
              {(activeTab === 'all' || activeTab === 'orders') && enrichedOrders.map(order => (
                <>
                  <tr key={order.orderId} className="order-row" onClick={() => { onSelectOrder(order, customer); toggle(order.orderId); }}>
                    <td style={{ color: '#9ca3af', paddingRight: 0 }}>
                      {order.linkedSOs.length > 0
                        ? (expanded[order.orderId] ? <ChevronDown size={14} /> : <ChevronRight size={14} />)
                        : null}
                    </td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>{order.orderId}</td>
                    <td>
                      {order.products.filter(p => p.family !== 'Service').map(p => (
                        <div key={p.sku}>
                          <div style={{ fontWeight: 600, fontSize: 12.5 }}>{p.name.length > 42 ? p.name.slice(0, 42) + '…' : p.name}</div>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>Serial: {p.serialNo}</div>
                        </div>
                      ))}
                    </td>
                    <td><span className="badge badge-blue" style={{ fontSize: 11 }}>Purchase</span></td>
                    <td><StatusBadge status={order.status} /></td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>{order.orderDate}</td>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>₹{order.amount.toLocaleString('en-IN')}</td>
                    <td>
                      <button className="btn-outline-blue btn-sm" style={{ borderRadius: 6, fontSize: 11 }}
                        onClick={e => { e.stopPropagation(); onSelectOrder(order, customer); }}>Details</button>
                    </td>
                  </tr>
                  {/* Linked SO sub-rows */}
                  {(expanded[order.orderId] || activeTab === 'so') && order.linkedSOs.map(so => (
                    <tr key={so.id} className="so-row" onClick={() => onSelectSO(so, 'orderList')}>
                      <td></td>
                      <td>
                        <span style={{ color: '#d1d5db', marginRight: 4 }}>└</span>
                        <span style={{ fontWeight: 600, color: '#7c3aed' }}>SO #{so.id}</span>
                        <span className="sap-badge" style={{ marginLeft: 8 }}>SAP: {so.sapServiceOrderNo}</span>
                      </td>
                      <td style={{ fontSize: 12, color: '#374151' }}>{so.product.name.length > 38 ? so.product.name.slice(0, 38) + '…' : so.product.name}</td>
                      <td><span className="badge badge-purple" style={{ fontSize: 11 }}>{so.type}</span></td>
                      <td><StatusBadge status={so.status} /></td>
                      <td style={{ fontSize: 11, color: '#9ca3af' }}>{so.createdDate}</td>
                      <td style={{ color: '#9ca3af' }}>—</td>
                      <td>
                        <button style={{ background: '#ede9fe', color: '#6d28d9', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, padding: '4px 10px', fontWeight: 600 }}
                          onClick={e => { e.stopPropagation(); onSelectSO(so, 'orderList'); }}>View SO</button>
                      </td>
                    </tr>
                  ))}
                </>
              ))}

              {/* Standalone SOs (mobile search, not tied to listed orders) */}
              {(activeTab === 'all' || activeTab === 'so') && standaloneSOs.map(so => (
                <tr key={so.id} className="so-row" style={{ background: 'white' }} onClick={() => onSelectSO(so, 'orderList')}>
                  <td></td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#7c3aed' }}>SO #{so.id}</span>
                    <span className="sap-badge" style={{ marginLeft: 8 }}>SAP: {so.sapServiceOrderNo}</span>
                  </td>
                  <td style={{ fontSize: 12.5 }}>{so.product.name.length > 38 ? so.product.name.slice(0, 38) + '…' : so.product.name}</td>
                  <td><span className="badge badge-purple" style={{ fontSize: 11 }}>{so.type}</span></td>
                  <td><StatusBadge status={so.status} /></td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{so.createdDate}</td>
                  <td style={{ color: '#9ca3af' }}>—</td>
                  <td>
                    <button style={{ background: '#ede9fe', color: '#6d28d9', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, padding: '4px 10px', fontWeight: 600 }}
                      onClick={() => onSelectSO(so, 'orderList')}>View SO</button>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && relatedSOs.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
