import { useState } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { complaintCategories, complaintSubCategories, complaintDepartments, transactionTypes } from '../../data/dummyData';

export default function CRMRaiseComplaint({ so, onBack, onSuccess }) {
  const [categoryDesc, setCategoryDesc] = useState('Complaints');
  const [transactionType, setTransactionType] = useState('');
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [compId] = useState(() => `COMP-${new Date().getFullYear()}-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  const [ticketId] = useState(() => `TKT-${Math.floor(7800 + Math.random() * 999)}`);

  const subCats = category ? (complaintSubCategories[category] || []) : [];
  const canSubmit = categoryDesc && transactionType && department;

  if (submitted) {
    return (
      <div className="crm-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: 520, width: '100%', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <AlertTriangle size={28} color="#dc2626" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Complaint Raised</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>Synced to SAP CRM. Customer will receive SMS within 5 minutes.</div>

          <div className="card" style={{ textAlign: 'left', marginBottom: 12 }}>
            <div className="card-title" style={{ fontSize: 13 }}>Complaint Reference</div>
            <div className="card-body">
              {[
                ['Complaint ID', compId, '#dc2626'],
                ['Kapture Ticket', ticketId, '#2563eb'],
                ['Service Order', `#${so.id}`, '#7c3aed'],
                ['SAP SO', so.sapServiceOrderNo, '#3730a3'],
                ['Customer', so.customer.name, ''],
                ['Product', so.product.name, ''],
                ['Category', category, ''],
                ['Sub Category', subCategory, ''],
                ['Department', department, ''],
                ['Transaction Type', transactionType, ''],
              ].map(([l, v, c]) => v && (
                <div key={l} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid #f5f5f5', fontSize: 13 }}>
                  <span style={{ color: '#9ca3af', width: 140, flexShrink: 0 }}>{l}</span>
                  <span style={{ fontWeight: 600, color: c || '#1a1a2e' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '12px 16px', fontSize: 12.5, color: '#9a3412', marginBottom: 20, textAlign: 'left' }}>
            Complaint logged in both <strong>Kapture CRM</strong> and <strong>SAP CRM</strong>. All status updates will be visible in Kapture.
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn-primary" style={{ borderRadius: 6, background: '#dc2626' }} onClick={() => onSuccess(compId)}>View Complaint</button>
            <button className="btn-secondary" style={{ borderRadius: 6 }} onClick={onBack}>Back to Service Order</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crm-page">
      <div className="crm-topbar">
        <button className="crm-back-btn" onClick={onBack}><ArrowLeft size={14} /> Service Order #{so.id}</button>
        <span className="crm-breadcrumb-sep">›</span>
        <span className="crm-breadcrumb-current">Raise Complaint</span>
      </div>

      <div className="crm-body">
        {/* SO context */}
        <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: 8, padding: '12px 16px', marginBottom: 12, fontSize: 13, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <span><span style={{ color: '#6b7280' }}>Service Order: </span><strong style={{ color: '#7c3aed' }}>#{so.id}</strong></span>
          <span><span style={{ color: '#6b7280' }}>Product: </span><strong>{so.product.name}</strong></span>
          <span><span style={{ color: '#6b7280' }}>Service Type: </span><strong>{so.type}</strong></span>
          <span><span style={{ color: '#6b7280' }}>Status: </span><strong style={{ color: '#f97316' }}>{so.status}</strong></span>
        </div>

        {/* SO details (read-only) */}
        <div className="card">
          <div className="section-header"><span className="section-title">Service Order Details</span></div>
          <div className="card-body">
            <div className="detail-grid-4">
              <div className="detail-item"><div className="detail-label">Product</div><div className="detail-value" style={{ fontSize: 12.5 }}>{so.product.name}</div></div>
              <div className="detail-item"><div className="detail-label">Serial No.</div><div className="detail-value" style={{ fontFamily: 'monospace', fontSize: 12.5 }}>{so.product.serial}</div></div>
              <div className="detail-item"><div className="detail-label">Service Type</div><div className="detail-value">{so.type}</div></div>
              <div className="detail-item"><div className="detail-label">Status</div><div className="detail-value" style={{ color: '#f97316' }}>{so.status}</div></div>
              <div className="detail-item"><div className="detail-label">Engineer</div><div className="detail-value">{so.engineer.name}</div></div>
              <div className="detail-item"><div className="detail-label">Appointment</div><div className="detail-value" style={{ fontSize: 12 }}>{so.appointmentDate}</div></div>
              <div className="detail-item"><div className="detail-label">Customer</div><div className="detail-value">{so.customer.name}</div></div>
              <div className="detail-item"><div className="detail-label">Mobile</div><div className="detail-value">{so.customer.phone}</div></div>
            </div>
          </div>
        </div>

        {/* Complaint form */}
        <div className="card">
          <div className="section-header"><span className="section-title">Complaint Details</span></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category Description <span style={{ color: '#dc2626' }}>*</span></label>
                <div className="select-clearable">
                  <select className="form-select" value={categoryDesc} onChange={e => setCategoryDesc(e.target.value)}>
                    <option value="Complaints">Complaints</option>
                    <option value="Service Request">Service Request</option>
                  </select>
                  {categoryDesc && <button className="clear-btn" onClick={() => setCategoryDesc('')}>×</button>}
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Transaction Type <span style={{ color: '#dc2626' }}>*</span></label>
                <div className="select-clearable">
                  <select className="form-select" value={transactionType} onChange={e => setTransactionType(e.target.value)}>
                    <option value="">Select type</option>
                    {transactionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {transactionType && <button className="clear-btn" onClick={() => setTransactionType('')}>×</button>}
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Department <span style={{ color: '#dc2626' }}>*</span></label>
                <div className="select-clearable">
                  <select className="form-select" value={department} onChange={e => setDepartment(e.target.value)}>
                    <option value="">Select department</option>
                    {complaintDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {department && <button className="clear-btn" onClick={() => setDepartment('')}>×</button>}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <div className="select-clearable">
                  <select className="form-select" value={category} onChange={e => { setCategory(e.target.value); setSubCategory(''); }}>
                    <option value="">Select category</option>
                    {complaintCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {category && <button className="clear-btn" onClick={() => { setCategory(''); setSubCategory(''); }}>×</button>}
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Sub Category</label>
                <div className="select-clearable">
                  <select className="form-select" value={subCategory} onChange={e => setSubCategory(e.target.value)} disabled={!category}>
                    <option value="">Select sub category</option>
                    {subCats.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {subCategory && <button className="clear-btn" onClick={() => setSubCategory('')}>×</button>}
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Remarks <span style={{ color: '#9ca3af' }}>(optional)</span></label>
              <textarea className="form-input" rows={2} value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Describe the complaint..." style={{ resize: 'none' }} maxLength={300} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, paddingBottom: 24 }}>
          <button className="btn-primary" style={{ borderRadius: 6, background: '#dc2626', opacity: canSubmit ? 1 : 0.5 }}
            disabled={!canSubmit} onClick={() => setSubmitted(true)}>
            Submit Complaint
          </button>
          <button className="btn-secondary" style={{ borderRadius: 6 }} onClick={onBack}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
