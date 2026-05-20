import { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { irisSymptoms, serviceTypes, appointmentSlots, complaintCategories, indiaStates } from '../../data/dummyData';

const pincodeCityMap = { '400061': ['Mumbai', 'Maharashtra'], '400051': ['Mumbai', 'Maharashtra'], '122002': ['Gurugram', 'Haryana'], '380015': ['Ahmedabad', 'Gujarat'], '400006': ['Navi Mumbai', 'Maharashtra'] };

export default function CRMCreateSR({ order, product: prefillProduct, customer, onBack, onSuccess }) {
  const [serviceType, setServiceType] = useState('');
  const [symptom, setSymptom] = useState('');
  const [appointDate, setAppointDate] = useState('');
  const [appointSlot, setAppointSlot] = useState('');
  const [flat, setFlat] = useState(customer?.addresses?.[0]?.flat || '');
  const [building, setBuilding] = useState(customer?.addresses?.[0]?.building || '');
  const [street, setStreet] = useState(customer?.addresses?.[0]?.street || '');
  const [area, setArea] = useState(customer?.addresses?.[0]?.area || '');
  const [pincode, setPincode] = useState(customer?.addresses?.[0]?.pincode || '');
  const [city, setCity] = useState(customer?.addresses?.[0]?.city || '');
  const [state, setState] = useState(customer?.addresses?.[0]?.state || '');
  const [serviceNote, setServiceNote] = useState('');
  const [eligibility, setEligibility] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [soId] = useState(() => Math.floor(80000000 + Math.random() * 9999999).toString());
  const [ticketId] = useState(() => `TKT-${Math.floor(7800 + Math.random() * 999)}`);

  const prod = prefillProduct || order?.products?.[0];
  const slots = appointDate ? (appointmentSlots[appointDate] || []) : [];
  const availableDates = Object.keys(appointmentSlots);

  const handlePincode = (val) => {
    setPincode(val);
    if (pincodeCityMap[val]) { setCity(pincodeCityMap[val][0]); setState(pincodeCityMap[val][1]); }
  };

  const handleCheckEligibility = () => {
    if (!serviceType) return;
    const warrantyStatus = prod?.warranty || 'Out of Warranty';
    const isPaid = serviceType === 'Repair' && warrantyStatus === 'Out of Warranty';
    const charges = isPaid ? 499 : 0;
    setEligibility({ type: isPaid ? 'Paid' : 'Free', charges, warranty: warrantyStatus });
  };

  const canSubmit = serviceType && appointDate && appointSlot && flat && pincode;

  if (submitted) {
    return (
      <div className="crm-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: 520, width: '100%', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle size={32} color="#16a34a" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Service Request Created</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>Synced to SAP CRM. Customer will receive SMS within 5 minutes.</div>

          <div className="card" style={{ textAlign: 'left', marginBottom: 12 }}>
            <div className="card-title" style={{ fontSize: 13 }}>Service Order Reference</div>
            <div className="card-body">
              {[
                ['Service Order No.', `#${soId}`, '#7c3aed'],
                ['SAP CRM SO', `SAP-SO-${Math.floor(88001000 + Math.random() * 999)}`, '#3730a3'],
                ['Kapture Ticket', ticketId, '#2563eb'],
                ['Customer', customer?.name || prod?.brand, ''],
                ['Product', prod?.name, ''],
                ['Service Type', serviceType, ''],
                ['Eligibility', eligibility ? `${eligibility.type}${eligibility.charges > 0 ? ` (₹${eligibility.charges})` : ''}` : '—', eligibility?.type === 'Free' ? '#16a34a' : '#f97316'],
                ['Appointment', `${appointDate} · ${appointSlot}`, ''],
              ].map(([l, v, c]) => v && (
                <div key={l} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: '1px solid #f5f5f5', fontSize: 13 }}>
                  <span style={{ color: '#9ca3af', width: 140, flexShrink: 0 }}>{l}</span>
                  <span style={{ fontWeight: 600, color: c || '#1a1a2e' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px', fontSize: 12.5, color: '#1e40af', marginBottom: 20, textAlign: 'left' }}>
            Service order created in both <strong>Kapture CRM</strong> and <strong>SAP CRM</strong>. Status updates from SAP will reflect automatically in Kapture.
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn-primary" style={{ borderRadius: 6 }} onClick={() => onSuccess(soId)}>View Service Order</button>
            <button className="btn-secondary" style={{ borderRadius: 6 }} onClick={onBack}>Back to Orders</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crm-page">
      <div className="crm-topbar">
        <button className="crm-back-btn" onClick={onBack}><ArrowLeft size={14} /> Back</button>
        <span className="crm-breadcrumb-sep">›</span>
        <span className="crm-breadcrumb-current">Create Service Request</span>
      </div>

      <div className="crm-body">
        {/* Pre-filled info banner */}
        {(customer || prod) && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px', marginBottom: 12, display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13 }}>
            {customer && <span><span style={{ color: '#6b7280' }}>Customer: </span><strong>{customer.name}</strong> · {customer.phone}</span>}
            {prod && <span><span style={{ color: '#6b7280' }}>Product: </span><strong>{prod.name}</strong></span>}
            {prod?.serialNo && <span><span style={{ color: '#6b7280' }}>Serial: </span><strong style={{ fontFamily: 'monospace' }}>{prod.serialNo}</strong></span>}
            {prod?.warranty && <span><strong style={{ color: prod.warranty === 'Within Warranty' ? '#16a34a' : '#dc2626' }}>{prod.warranty}</strong></span>}
          </div>
        )}

        {/* Service details */}
        <div className="card">
          <div className="section-header"><span className="section-title">Service Details</span></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Service Type <span style={{ color: '#dc2626' }}>*</span></label>
                <select className="form-select" value={serviceType} onChange={e => { setServiceType(e.target.value); setEligibility(null); }}>
                  <option value="">Select type</option>
                  {serviceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">IRIS Symptom</label>
                <select className="form-select" value={symptom} onChange={e => setSymptom(e.target.value)}>
                  <option value="">Select symptom</option>
                  {irisSymptoms.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Eligibility</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                  <button className="btn-outline-blue btn-sm" style={{ borderRadius: 6 }} onClick={handleCheckEligibility} disabled={!serviceType}>
                    Check Eligibility
                  </button>
                  {eligibility && (
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: eligibility.type === 'Free' ? '#16a34a' : '#f97316', background: eligibility.type === 'Free' ? '#d1fae5' : '#fff3e0', padding: '3px 10px', borderRadius: 20 }}>
                      {eligibility.type}{eligibility.charges > 0 ? ` · ₹${eligibility.charges}` : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {serviceNote !== undefined && (
              <div className="form-group" style={{ marginTop: 16, marginBottom: 0 }}>
                <label className="form-label">Service Note <span style={{ color: '#9ca3af' }}>(optional)</span></label>
                <textarea className="form-input" rows={2} maxLength={200} value={serviceNote} onChange={e => setServiceNote(e.target.value)} placeholder="Describe the issue..." style={{ resize: 'none' }} />
                <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'right' }}>{serviceNote.length}/200</div>
              </div>
            )}
          </div>
        </div>

        {/* Appointment */}
        <div className="card">
          <div className="section-header"><span className="section-title">Appointment</span></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Preferred Date <span style={{ color: '#dc2626' }}>*</span></label>
                <select className="form-select" value={appointDate} onChange={e => { setAppointDate(e.target.value); setAppointSlot(''); }}>
                  <option value="">Select date</option>
                  {availableDates.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Time Slot <span style={{ color: '#dc2626' }}>*</span></label>
                <select className="form-select" value={appointSlot} onChange={e => setAppointSlot(e.target.value)} disabled={!appointDate}>
                  <option value="">Select slot</option>
                  {slots.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Service address */}
        <div className="card">
          <div className="section-header"><span className="section-title">Service Address</span></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Flat / House No. <span style={{ color: '#dc2626' }}>*</span></label>
                <input className="form-input" value={flat} onChange={e => setFlat(e.target.value)} placeholder="Flat 402" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Building / Society</label>
                <input className="form-input" value={building} onChange={e => setBuilding(e.target.value)} placeholder="Sunrise Apts" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Street</label>
                <input className="form-input" value={street} onChange={e => setStreet(e.target.value)} placeholder="Yari Road" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Area / Landmark</label>
                <input className="form-input" value={area} onChange={e => setArea(e.target.value)} placeholder="Near D-Mart" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Pincode <span style={{ color: '#dc2626' }}>*</span></label>
                <input className="form-input" value={pincode} onChange={e => handlePincode(e.target.value)} maxLength={6} placeholder="400061" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">City</label>
                <input className="form-input" value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">State</label>
                <select className="form-select" value={state} onChange={e => setState(e.target.value)}>
                  <option value="">Select state</option>
                  {indiaStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, paddingBottom: 24 }}>
          <button className="btn-primary" style={{ borderRadius: 6, opacity: canSubmit ? 1 : 0.5 }}
            disabled={!canSubmit} onClick={() => setSubmitted(true)}>
            Submit Service Request
          </button>
          <button className="btn-secondary" style={{ borderRadius: 6 }} onClick={onBack}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
