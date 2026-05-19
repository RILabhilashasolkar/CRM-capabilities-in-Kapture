import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import SOULayout from './SOULayout';
import { complaintCategories, complaintSubCategories, complaintDepartments, transactionTypes } from '../../data/dummyData';

export default function RaiseComplaint({ so, onBack }) {
  const [categoryDesc, setCategoryDesc] = useState('Complaints');
  const [transactionType, setTransactionType] = useState('');
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [compId] = useState(() => `COMP-${new Date().getFullYear()}-${Math.floor(1000000000 + Math.random() * 9000000000)}`);

  const subCats = category ? (complaintSubCategories[category] || []) : [];

  if (submitted) {
    return (
      <SOULayout onBack={onBack}>
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <div className="font-bold text-lg text-gray-800 mb-2">Complaint Raised!</div>
          <div className="text-sm text-gray-500 mb-6">Complaint logged against Service Order {so?.id}</div>
          <div className="card w-full" style={{ maxWidth: 480 }}>
            <div className="card-title text-sm">Complaint Reference</div>
            <div className="card-body space-y-2">
              {[['Complaint ID', compId, 'text-red-700 font-bold'], ['Service Order', so?.id, ''], ['Category', category, ''], ['Sub Category', subCategory, ''], ['Department', department, ''], ['Transaction Type', transactionType, '']].map(([l, v, cls]) => v && (
                <div key={l} className="flex gap-3 text-sm border-b border-gray-50 py-1">
                  <span className="text-gray-400 w-36 flex-shrink-0">{l}</span>
                  <span className={`font-semibold ${cls}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 mt-4 w-full" style={{ maxWidth: 480 }}>
            Complaint synced to SAP CRM. Customer will receive an SMS update within 5 minutes.
          </div>
          <button className="btn-primary mt-6" onClick={onBack}>Back to Service Order</button>
        </div>
      </SOULayout>
    );
  }

  return (
    <SOULayout onBack={onBack}>
      <div className="sou-body">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* Service Order Details card (read-only) */}
          <div className="card">
            <div className="font-bold text-gray-800 px-5 pt-4 pb-2" style={{ fontSize: 15 }}>Service order details</div>
            <hr className="divider mx-5" />
            <div className="px-5 py-3">
              <div className="so-detail-grid mb-3">
                <div className="so-detail-item"><div className="so-label">Product:</div><div className="so-value">{so?.product?.name}</div></div>
                <div className="so-detail-item"><div className="so-label">Serial No:</div><div className="so-value">{so?.product?.serial}</div></div>
                <div className="so-detail-item"><div className="so-label">Type of Service Request:</div><div className="so-value">{so?.type}</div></div>
                <div className="so-detail-item">
                  <div className="so-label">Service Request Status:</div>
                  <div className={`so-value ${so?.status === 'In Progress' ? 'status-inprogress' : 'status-assigned'}`}>{so?.status}</div>
                </div>
                <div className="so-detail-item"><div className="so-label">Visiting Engineer's Name:</div><div className="so-value">{so?.engineer?.name}</div></div>
                <div className="so-detail-item"><div className="so-label">Scheduled Appointment Date:</div><div className="so-value">{so?.appointmentDate}</div></div>
                <div className="so-detail-item"><div className="so-label">Engineer's Contact:</div><div className="so-value">{so?.engineer?.phone}</div></div>
              </div>
              {so?.serviceNote && (
                <div><div className="so-label mb-0.5">Service Note:</div><div className="so-value">{so.serviceNote}</div></div>
              )}
            </div>
          </div>

          {/* Raise Complaint form */}
          <div className="card">
            <div className="font-bold text-gray-800 px-5 pt-4 pb-2" style={{ fontSize: 15 }}>Raise complaint</div>
            <hr className="divider mx-5" />
            <div className="card-body">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="form-group">
                  <label className="form-label">Category description <span className="required">*</span></label>
                  <div className="select-clearable">
                    <select className="form-select" value={categoryDesc} onChange={e => setCategoryDesc(e.target.value)}>
                      <option value="Complaints">Complaints</option>
                      <option value="Service Request">Service Request</option>
                    </select>
                    {categoryDesc && <button className="clear-btn" onClick={() => setCategoryDesc('')}>×</button>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Transaction Type <span className="required">*</span></label>
                  <div className="select-clearable">
                    <select className="form-select" value={transactionType} onChange={e => setTransactionType(e.target.value)}>
                      <option value="">Select Type</option>
                      {transactionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {transactionType && <button className="clear-btn" onClick={() => setTransactionType('')}>×</button>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Department <span className="required">*</span></label>
                  <div className="select-clearable">
                    <select className="form-select" value={department} onChange={e => setDepartment(e.target.value)}>
                      <option value="">Select Department</option>
                      {complaintDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {department && <button className="clear-btn" onClick={() => setDepartment('')}>×</button>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <div className="select-clearable">
                    <select className="form-select" value={category} onChange={e => { setCategory(e.target.value); setSubCategory(''); }}>
                      <option value="">Select Category</option>
                      {complaintCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {category && <button className="clear-btn" onClick={() => { setCategory(''); setSubCategory(''); }}>×</button>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Sub category</label>
                  <div className="select-clearable">
                    <select className="form-select" value={subCategory} onChange={e => setSubCategory(e.target.value)} disabled={!category}>
                      <option value="">Select Sub Category</option>
                      {subCats.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {subCategory && <button className="clear-btn" onClick={() => setSubCategory('')}>×</button>}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="btn-primary"
                  disabled={!categoryDesc || !transactionType || !department}
                  style={{ opacity: (categoryDesc && transactionType && department) ? 1 : 0.5 }}
                  onClick={() => setSubmitted(true)}
                >
                  Submit
                </button>
                <button className="btn-secondary" onClick={onBack}>Cancel</button>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 py-4">
            Copyright © 2024 JioMart Digital, a division of Reliance Retail Limited
          </div>
        </div>
      </div>
    </SOULayout>
  );
}
