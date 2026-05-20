import { ArrowLeft, Plus } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { serviceOrders as allSOs } from '../../data/dummyData';

export default function CRMOrderDetail({ order, customer, onSelectSO, onCreateSR, onCreateTicket, onBack }) {
  const linkedSOs = allSOs.filter(s => s.orderId === order.orderId);
  const mainProducts = order.products.filter(p => p.family !== 'Service');

  return (
    <div className="crm-page">
      <div className="crm-topbar">
        <button className="crm-back-btn" onClick={onBack}><ArrowLeft size={14} /> Order List</button>
        <span className="crm-breadcrumb-sep">›</span>
        <span className="crm-breadcrumb-current">{order.orderId}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn-primary" style={{ borderRadius: 6, fontSize: 12.5, padding: '6px 14px' }}
            onClick={() => onCreateSR(order, mainProducts[0])}>
            <Plus size={12} style={{ display: 'inline', marginRight: 4 }} />Service Request
          </button>
          <button className="btn-outline-blue" style={{ borderRadius: 6, fontSize: 12.5, padding: '5px 14px' }}
            onClick={() => onCreateTicket(order, null)}>
            <Plus size={12} style={{ display: 'inline', marginRight: 4 }} />Create Ticket
          </button>
        </div>
      </div>

      <div className="crm-body">
        {/* Order summary */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Order Details</span>
            <StatusBadge status={order.status} />
          </div>
          <div className="card-body">
            <div className="detail-grid-4">
              <div className="detail-item"><div className="detail-label">Order ID</div><div className="detail-value" style={{ color: '#2563eb' }}>{order.orderId}</div></div>
              <div className="detail-item"><div className="detail-label">Order Date</div><div className="detail-value">{order.orderDate}</div></div>
              <div className="detail-item"><div className="detail-label">Total Amount</div><div className="detail-value">₹{order.amount.toLocaleString('en-IN')}</div></div>
              <div className="detail-item"><div className="detail-label">Status</div><div className="detail-value"><StatusBadge status={order.status} /></div></div>
              {customer && <>
                <div className="detail-item"><div className="detail-label">Customer</div><div className="detail-value">{customer.name}</div></div>
                <div className="detail-item"><div className="detail-label">Mobile</div><div className="detail-value">{customer.phone}</div></div>
                <div className="detail-item"><div className="detail-label">Customer ID</div><div className="detail-value">{customer.code}</div></div>
                <div className="detail-item"><div className="detail-label">Email</div><div className="detail-value" style={{ fontSize: 12 }}>{customer.email}</div></div>
              </>}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Products ({mainProducts.length})</span>
          </div>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Product Name</th><th>SKU / Serial</th><th>Brand</th>
                <th>Warranty</th><th>Installation</th><th>Qty</th><th>Price</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mainProducts.map(p => (
                <tr key={p.sku}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{p.family}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: '#374151' }}>{p.sku}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>{p.serialNo}</div>
                  </td>
                  <td style={{ fontSize: 12.5 }}>{p.brand}</td>
                  <td>
                    <span style={{ fontSize: 12, fontWeight: 600, color: p.warranty === 'Within Warranty' ? '#16a34a' : '#dc2626' }}>{p.warranty}</span>
                    {p.warrantyExpiry !== 'N/A' && <div style={{ fontSize: 11, color: '#9ca3af' }}>Till {p.warrantyExpiry}</div>}
                  </td>
                  <td>
                    <span style={{ fontSize: 12 }}>{p.installationType}</span>
                    {p.installationCharges > 0 && <span style={{ fontSize: 11, color: '#6b7280' }}> (₹{p.installationCharges})</span>}
                    <div style={{ fontSize: 11, color: p.installationStatus === 'Completed' ? '#16a34a' : '#f97316' }}>{p.installationStatus}</div>
                  </td>
                  <td style={{ textAlign: 'center', fontSize: 13 }}>{p.qty}</td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>₹{p.price.toLocaleString('en-IN')}</td>
                  <td>
                    <button className="btn-primary btn-sm" style={{ borderRadius: 6, fontSize: 11, whiteSpace: 'nowrap' }}
                      onClick={() => onCreateSR(order, p)}>+ Service Req</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Associated Service Orders */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Service Orders ({linkedSOs.length})</span>
            <button className="btn-outline-blue btn-sm" style={{ borderRadius: 6, fontSize: 11 }}
              onClick={() => onCreateSR(order, mainProducts[0])}>+ New Service Request</button>
          </div>
          {linkedSOs.length === 0 ? (
            <div className="card-body" style={{ textAlign: 'center', color: '#9ca3af', padding: '24px 0' }}>
              No service orders yet.{' '}
              <button style={{ color: '#2563eb', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => onCreateSR(order, mainProducts[0])}>Create a service request</button>
            </div>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>SO Number</th><th>SAP Reference</th><th>Service Type</th>
                  <th>Engineer</th><th>Appointment</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {linkedSOs.map(so => (
                  <tr key={so.id} style={{ cursor: 'pointer' }} onClick={() => onSelectSO(so, 'orderDetail')}>
                    <td style={{ fontWeight: 700, color: '#7c3aed' }}>#{so.id}</td>
                    <td><span className="sap-badge">{so.sapServiceOrderNo}</span></td>
                    <td><span className="badge badge-purple" style={{ fontSize: 11 }}>{so.type}</span></td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{so.engineer.name}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{so.engineer.phone}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>{so.appointmentDate}</td>
                    <td><StatusBadge status={so.status} /></td>
                    <td>
                      <button style={{ background: '#ede9fe', color: '#6d28d9', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, padding: '4px 10px', fontWeight: 600 }}
                        onClick={e => { e.stopPropagation(); onSelectSO(so, 'orderDetail'); }}>View SO</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
