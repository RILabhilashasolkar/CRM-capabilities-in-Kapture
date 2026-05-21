import { ArrowLeft, AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';

const TIMELINE = [
  { status: 'Submitted', desc: 'Complaint logged in Kapture CRM & synced to SAP CRM' },
  { status: 'Under Review', desc: 'Complaint assigned to service team for investigation' },
  { status: 'Resolution Pending', desc: 'Field team dispatched; awaiting closure confirmation', pending: true },
  { status: 'Resolved', desc: 'Complaint closed and customer notified', future: true },
];

export default function CRMComplaintDetail({ compId, ticketId, category, subCategory, department, transactionType, categoryDesc, remarks, so, onBack }) {
  const currentStep = 1; // index into TIMELINE (0-based) — "Under Review" is current

  return (
    <div className="crm-page">
      <div className="crm-topbar">
        <button className="crm-back-btn" onClick={onBack}><ArrowLeft size={14} /> Service Order #{so?.id}</button>
        <span className="crm-breadcrumb-sep">›</span>
        <span className="crm-breadcrumb-current">Complaint {compId}</span>
        <div style={{ marginLeft: 'auto' }}>
          <StatusBadge status="Under Review" />
        </div>
      </div>

      <div className="crm-body">
        {/* Header banner */}
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: '#991b1b', marginBottom: 2 }}>Complaint {compId}</div>
            <div style={{ fontSize: 12.5, color: '#6b7280', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <span>Kapture Ticket: <strong style={{ color: '#2563eb' }}>{ticketId}</strong></span>
              {so && <span>Service Order: <strong style={{ color: '#7c3aed' }}>#{so.id}</strong></span>}
              {so && <span>SAP SO: <strong>{so.sapServiceOrderNo}</strong></span>}
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="section-header"><span className="section-title">Complaint Details</span></div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="detail-item"><div className="detail-label">Category Description</div><div className="detail-value">{categoryDesc || 'Complaints'}</div></div>
                <div className="detail-item"><div className="detail-label">Transaction Type</div><div className="detail-value">{transactionType || '—'}</div></div>
                <div className="detail-item"><div className="detail-label">Department</div><div className="detail-value">{department || '—'}</div></div>
                <div className="detail-item"><div className="detail-label">Category</div><div className="detail-value">{category || '—'}</div></div>
                <div className="detail-item"><div className="detail-label">Sub Category</div><div className="detail-value">{subCategory || '—'}</div></div>
                <div className="detail-item"><div className="detail-label">Status</div><div className="detail-value"><StatusBadge status="Under Review" /></div></div>
              </div>
              {remarks && (
                <div style={{ marginTop: 12, padding: '8px 12px', background: '#f9fafb', borderRadius: 6, borderLeft: '3px solid #e5e7eb' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Remarks: </span>
                  <span style={{ fontSize: 12.5, color: '#374151' }}>{remarks}</span>
                </div>
              )}
            </div>
          </div>

          {so && (
            <div className="card">
              <div className="section-header"><span className="section-title">Linked Service Order</span></div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="detail-item"><div className="detail-label">Service Order</div><div className="detail-value" style={{ color: '#7c3aed' }}>#{so.id}</div></div>
                  <div className="detail-item"><div className="detail-label">SAP SO No.</div><div className="detail-value">{so.sapServiceOrderNo}</div></div>
                  <div className="detail-item"><div className="detail-label">Product</div><div className="detail-value" style={{ fontSize: 12 }}>{so.product?.name}</div></div>
                  <div className="detail-item"><div className="detail-label">Serial No.</div><div className="detail-value" style={{ fontFamily: 'monospace', fontSize: 12 }}>{so.product?.serial}</div></div>
                  <div className="detail-item"><div className="detail-label">Customer</div><div className="detail-value">{so.customer?.name}</div></div>
                  <div className="detail-item"><div className="detail-label">SO Status</div><div className="detail-value"><StatusBadge status={so.status} /></div></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status timeline */}
        <div className="card">
          <div className="section-header"><span className="section-title">Complaint Status Timeline</span></div>
          <div className="card-body">
            <div className="timeline">
              {TIMELINE.map((item, i) => {
                const isDone = i < currentStep;
                const isCurrent = i === currentStep;
                const isFuture = i > currentStep;
                return (
                  <div key={i} className="timeline-item">
                    {i < TIMELINE.length - 1 && <div className={`timeline-line ${isDone ? 'done' : ''}`} />}
                    <div className={`timeline-dot ${isCurrent ? 'active' : isDone ? 'done' : ''}`}
                      style={isFuture ? { background: '#e5e7eb', borderColor: '#e5e7eb' } : {}} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: isFuture ? '#9ca3af' : '#1a1a2e' }}>{item.status}</span>
                        {isCurrent && <span style={{ fontSize: 10, background: '#fee2e2', color: '#dc2626', fontWeight: 700, padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase' }}>Current</span>}
                        {isDone && <span style={{ fontSize: 10, background: '#d1fae5', color: '#065f46', fontWeight: 700, padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase' }}>Done</span>}
                      </div>
                      <div style={{ fontSize: 12.5, color: isFuture ? '#d1d5db' : '#6b7280' }}>{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info box */}
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '12px 16px', fontSize: 12.5, color: '#9a3412', marginBottom: 24 }}>
          Complaint is logged in both <strong>Kapture CRM</strong> and <strong>SAP CRM</strong>. Status updates from SAP will sync automatically. Customer will receive an SMS notification on each status change.
        </div>
      </div>
    </div>
  );
}
