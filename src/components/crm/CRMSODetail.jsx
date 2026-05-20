import { ArrowLeft } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { complaints as allComplaints, customers } from '../../data/dummyData';

export default function CRMSODetail({ so, fromPage, onRaiseComplaint, onCreateTicket, onBack }) {
  const linkedComplaints = allComplaints.filter(c => c.serviceOrderId === so.id);
  const customer = customers[so.customer.phone];

  const backLabel = fromPage === 'orderDetail' ? 'Order Detail' : fromPage === 'soNumber' ? 'Search' : 'Order List';

  return (
    <div className="crm-page">
      <div className="crm-topbar">
        <button className="crm-back-btn" onClick={onBack}><ArrowLeft size={14} /> {backLabel}</button>
        <span className="crm-breadcrumb-sep">›</span>
        <span className="crm-breadcrumb-current">Service Order #{so.id}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <StatusBadge status={so.status} />
          <span className="sap-badge">SAP: {so.sapServiceOrderNo}</span>
          <button className="btn-primary" style={{ borderRadius: 6, fontSize: 12.5, padding: '6px 14px' }}
            onClick={() => onRaiseComplaint(so)}>Raise Complaint</button>
          <button className="btn-outline-blue" style={{ borderRadius: 6, fontSize: 12.5, padding: '5px 14px' }}
            onClick={() => onCreateTicket(null, so)}>Follow-up Ticket</button>
        </div>
      </div>

      <div className="crm-body">
        {/* SO Summary */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Service Order Details</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="sap-badge">Ticket: {so.ticketId}</span>
              <span className="sap-badge">Ref: {so.serviceRefId}</span>
            </div>
          </div>
          <div className="card-body">
            <div className="detail-grid-4">
              <div className="detail-item"><div className="detail-label">Service Type</div><div className="detail-value">{so.type}</div></div>
              <div className="detail-item"><div className="detail-label">Request Type</div>
                <div className="detail-value" style={{ color: so.requestType === 'Free' ? '#16a34a' : '#f97316' }}>
                  {so.requestType}{so.serviceCharges > 0 ? ` (₹${so.serviceCharges})` : ''}
                </div>
              </div>
              <div className="detail-item"><div className="detail-label">Created Date</div><div className="detail-value">{so.createdDate}</div></div>
              <div className="detail-item"><div className="detail-label">Status</div><div className="detail-value"><StatusBadge status={so.status} /></div></div>
            </div>
          </div>
        </div>

        {/* Product + Customer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="section-header"><span className="section-title">Product Details</span></div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="detail-item"><div className="detail-label">Product</div><div className="detail-value" style={{ fontSize: 13 }}>{so.product.name}</div></div>
                <div className="detail-item"><div className="detail-label">Brand</div><div className="detail-value">{so.product.brand}</div></div>
                <div className="detail-item"><div className="detail-label">Serial No.</div><div className="detail-value" style={{ fontFamily: 'monospace', fontSize: 12.5 }}>{so.product.serial}</div></div>
                <div className="detail-item"><div className="detail-label">Family</div><div className="detail-value">{so.product.family}</div></div>
                <div className="detail-item"><div className="detail-label">SKU</div><div className="detail-value" style={{ fontSize: 12 }}>{so.product.sku}</div></div>
                <div className="detail-item"><div className="detail-label">Order ID</div><div className="detail-value" style={{ color: '#2563eb', fontSize: 12.5 }}>{so.orderId}</div></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="section-header"><span className="section-title">Customer Details</span></div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="detail-item"><div className="detail-label">Customer Name</div><div className="detail-value">{so.customer.name}</div></div>
                <div className="detail-item"><div className="detail-label">Mobile</div><div className="detail-value">{so.customer.phone}</div></div>
                <div className="detail-item"><div className="detail-label">Customer ID</div><div className="detail-value">{so.customer.code}</div></div>
                <div className="detail-item"><div className="detail-label">Sold To Party</div><div className="detail-value" style={{ fontSize: 12.5 }}>{so.customer.soldToParty}</div></div>
                <div className="detail-item"><div className="detail-label">Sales Office</div><div className="detail-value">{so.customer.salesOffice}</div></div>
                <div className="detail-item"><div className="detail-label">Store</div><div className="detail-value" style={{ fontSize: 11.5 }}>{so.customer.storeCode}</div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Engineer + Appointment */}
        <div className="card">
          <div className="section-header"><span className="section-title">Engineer & Appointment</span></div>
          <div className="card-body">
            <div className="detail-grid-4">
              <div className="detail-item"><div className="detail-label">Engineer Name</div><div className="detail-value">{so.engineer.name}</div></div>
              <div className="detail-item"><div className="detail-label">Engineer Contact</div>
                <div className="detail-value" style={{ color: '#2563eb' }}>{so.engineer.phone}</div>
              </div>
              <div className="detail-item"><div className="detail-label">Appointment Date & Time</div><div className="detail-value">{so.appointmentDate}</div></div>
              <div className="detail-item"><div className="detail-label">Est. Completion</div><div className="detail-value">{so.estimatedTAT}</div></div>
            </div>
            {so.serviceNote && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: '#f9fafb', borderRadius: 6, borderLeft: '3px solid #e5e7eb' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Service Note: </span>
                <span style={{ fontSize: 13, color: '#374151' }}>{so.serviceNote}</span>
              </div>
            )}
            <div style={{ marginTop: 12, padding: '10px 14px', background: '#f9fafb', borderRadius: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Service Address: </span>
              <span style={{ fontSize: 13, color: '#374151' }}>{so.address}</span>
            </div>
          </div>
        </div>

        {/* Complaints */}
        {linkedComplaints.length > 0 && (
          <div className="card">
            <div className="section-header">
              <span className="section-title">Complaints ({linkedComplaints.length})</span>
            </div>
            <table className="orders-table">
              <thead>
                <tr><th>Complaint ID</th><th>Category</th><th>Sub Category</th><th>Department</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {linkedComplaints.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700, color: '#dc2626' }}>{c.id}</td>
                    <td style={{ fontSize: 12.5 }}>{c.category}</td>
                    <td style={{ fontSize: 12.5 }}>{c.subCategory}</td>
                    <td style={{ fontSize: 12.5 }}>{c.department}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>{c.createdDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Status Timeline */}
        <div className="card">
          <div className="section-header"><span className="section-title">Status Timeline</span></div>
          <div className="card-body">
            <div className="timeline">
              {so.statusHistory.map((h, i) => (
                <div key={i} className="timeline-item">
                  {i < so.statusHistory.length - 1 && <div className={`timeline-line ${i < so.statusHistory.length - 2 ? 'done' : ''}`} />}
                  <div className={`timeline-dot ${i === so.statusHistory.length - 1 ? 'active' : 'done'}`} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e' }}>{h.status}</span>
                      <span style={{ fontSize: 11.5, color: '#9ca3af' }}>{h.date}</span>
                      <span style={{ fontSize: 11.5, color: '#6b7280' }}>· {h.by}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: '#6b7280' }}>{h.remarks}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
