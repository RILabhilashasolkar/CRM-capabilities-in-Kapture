import { useState } from 'react';
import { AlertCircle, Search, CheckCircle, ChevronDown, ChevronUp, ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { serviceOrders, complaints, complaintCategories, complaintDepartments, complaintIssueTypes } from '../../data/dummyData';

// ─── Raise Complaint ──────────────────────────────────────────────────────
export function RaiseComplaint({ onBack }) {
  const [soQuery, setSOQuery] = useState('');
  const [foundSO, setFoundSO] = useState(null);
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [compId] = useState(`COMP-2026-${String(Math.floor(1000 + Math.random() * 9000))}`);

  const searchSO = () => {
    const found = serviceOrders.find(so =>
      so.id.toLowerCase().includes(soQuery.toLowerCase()) ||
      so.serviceRefId.toLowerCase().includes(soQuery.toLowerCase())
    );
    setFoundSO(found || null);
  };

  const issueTypes = category ? (complaintIssueTypes[category] || []) : [];

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} className="text-red-600" />
        </div>
        <div className="text-lg font-bold text-gray-800 mb-1">Complaint Raised!</div>
        <div className="text-sm text-gray-500 mb-6 text-center">Complaint logged against Service Order {foundSO?.id}</div>
        <div className="card w-full max-w-md mb-4">
          <div className="card-header">Complaint Reference</div>
          <div className="kv-grid">
            <div className="kv-item"><div className="kv-label">Complaint ID</div><div className="kv-value text-red-700 font-bold">{compId}</div></div>
            <div className="kv-item"><div className="kv-label">Service Order</div><div className="kv-value">{foundSO?.id}</div></div>
            <div className="kv-item"><div className="kv-label">Category</div><div className="kv-value">{category}</div></div>
            <div className="kv-item"><div className="kv-label">Issue Type</div><div className="kv-value">{issueType}</div></div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 w-full max-w-md text-xs text-blue-800 mb-4">
          Complaint synced to SAP CRM. Customer will be updated within 5 minutes via SMS.
        </div>
        <button className="btn-primary" onClick={onBack}>Back to Service Orders</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="k-header px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          {onBack && <button onClick={onBack} className="text-gray-500"><ArrowLeft size={15} /></button>}
          <AlertCircle size={14} className="text-red-500" />
          <span className="font-semibold text-gray-800">Raise Digital Complaint</span>
        </div>
        <div className="text-xs text-gray-500 mt-0.5">Raise a complaint against an existing Service Order</div>
      </div>

      <div className="p-4">
        {/* Search SO */}
        <div className="card mb-3">
          <div className="card-header">Select Service Order</div>
          <div className="p-3">
            <div className="flex gap-2 mb-2">
              <input
                className="form-input"
                placeholder="Enter Service Order ID or Ref ID (e.g. SO-2026-0044)"
                value={soQuery}
                onChange={e => setSOQuery(e.target.value)}
              />
              <button className="btn-primary flex items-center gap-1" onClick={searchSO}>
                <Search size={13} /> Search
              </button>
            </div>
            <div className="text-xs text-gray-400">Try: SO-2026-0044, SO-2026-0071, SO-2026-0088</div>

            {foundSO && (
              <div className="mt-3 bg-gray-50 border border-gray-200 rounded p-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-blue-700">{foundSO.id}</div>
                    <div className="text-xs text-gray-600">{foundSO.type}</div>
                    <div className="text-xs text-gray-500">{foundSO.product.name.slice(0, 40)}</div>
                    <div className="text-xs text-gray-500">Customer: {foundSO.customer.name} · {foundSO.customer.phone}</div>
                  </div>
                  <span className={`badge ${foundSO.complaint ? 'badge-high' : 'badge-low'}`}>
                    {foundSO.complaint ? 'Complaint Exists' : 'No Active Complaint'}
                  </span>
                </div>
                {foundSO.complaint && (
                  <div className="mt-2 text-xs text-red-600 font-medium">
                    ⚠ A complaint ({foundSO.complaint}) already exists for this SO.
                  </div>
                )}
              </div>
            )}
            {soQuery && !foundSO && (
              <div className="mt-2 text-xs text-red-500">Service Order not found. Check the ID and try again.</div>
            )}
          </div>
        </div>

        {foundSO && !foundSO.complaint && (
          <>
            {/* Complaint Classification */}
            <div className="card mb-3">
              <div className="card-header">Complaint Classification</div>
              <div className="p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Category *</label>
                    <select className="form-select" value={category} onChange={e => { setCategory(e.target.value); setIssueType(''); }}>
                      <option value="">Select Category</option>
                      {complaintCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Department *</label>
                    <select className="form-select" value={department} onChange={e => setDepartment(e.target.value)}>
                      <option value="">Select Department</option>
                      {complaintDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Issue Type *</label>
                    <select className="form-select" value={issueType} onChange={e => setIssueType(e.target.value)} disabled={!category}>
                      <option value="">Select Issue Type</option>
                      {issueTypes.map(it => <option key={it} value={it}>{it}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card mb-4">
              <div className="card-header">Complaint Description</div>
              <div className="p-3">
                <label className="form-label">Describe the issue *</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Describe the complaint in detail..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn-danger flex items-center gap-2"
              disabled={!category || !department || !issueType || !description}
              style={{ opacity: (category && department && issueType && description) ? 1 : 0.5 }}
              onClick={() => setSubmitted(true)}
            >
              <AlertCircle size={14} /> Submit Complaint
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Track Complaint ──────────────────────────────────────────────────────
export function TrackComplaint({ onBack }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);

  const handleSearch = () => {
    const found = complaints.find(c =>
      c.id.toLowerCase().includes(query.toLowerCase()) ||
      c.serviceOrderId.toLowerCase().includes(query.toLowerCase()) ||
      c.customer.phone.includes(query)
    );
    setResult(found || null);
    setSearched(true);
  };

  const statusClass = {
    'Raised': 'badge-medium', 'Under Review': 'badge-open',
    'In Progress': 'so-inprogress', 'Resolved': 'badge-low', 'Closed': 'badge-low',
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="k-header px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          {onBack && <button onClick={onBack} className="text-gray-500"><ArrowLeft size={15} /></button>}
          <FileText size={14} className="text-orange-500" />
          <span className="font-semibold text-gray-800">Track Complaint</span>
        </div>
      </div>

      <div className="p-4">
        <div className="card mb-4">
          <div className="card-header">Search Complaint</div>
          <div className="p-3">
            <div className="flex gap-2">
              <input
                className="form-input"
                placeholder="Complaint ID, Service Order ID, or phone number"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn-primary flex items-center gap-1" onClick={handleSearch}>
                <Search size={13} /> Search
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-1">Try: COMP-2026-0031, SO-2026-0088, or 8800123456</div>
          </div>
        </div>

        {searched && !result && (
          <div className="card p-6 text-center text-gray-400 text-sm">No complaint found for this search</div>
        )}

        {result && (
          <>
            {/* Summary */}
            <div className="card mb-3">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <AlertCircle size={13} className="text-red-500" />
                  <span>Complaint: {result.id}</span>
                </div>
                <span className={`badge ${statusClass[result.status] || 'badge-pending'}`}>{result.status}</span>
              </div>
              <div className="kv-grid">
                <div className="kv-item"><div className="kv-label">Complaint ID</div><div className="kv-value text-red-700 font-bold">{result.id}</div></div>
                <div className="kv-item"><div className="kv-label">Service Order</div><div className="kv-value text-blue-700">{result.serviceOrderId}</div></div>
                <div className="kv-item"><div className="kv-label">Service Ref ID</div><div className="kv-value">{result.serviceRefId}</div></div>
                <div className="kv-item"><div className="kv-label">Customer</div><div className="kv-value">{result.customer.name}</div></div>
                <div className="kv-item"><div className="kv-label">Category</div><div className="kv-value">{result.category}</div></div>
                <div className="kv-item"><div className="kv-label">Department</div><div className="kv-value">{result.department}</div></div>
                <div className="kv-item"><div className="kv-label">Issue Type</div><div className="kv-value">{result.issueType}</div></div>
                <div className="kv-item"><div className="kv-label">Created</div><div className="kv-value">{result.createdDate}</div></div>
                {result.resolvedDate && <div className="kv-item"><div className="kv-label">Resolved</div><div className="kv-value">{result.resolvedDate}</div></div>}
              </div>

              {result.description && (
                <div className="px-3 pb-3">
                  <div className="bg-gray-50 rounded p-2.5 text-xs text-gray-700">
                    <span className="font-semibold text-gray-600">Description: </span>{result.description}
                  </div>
                </div>
              )}

              {result.resolution && (
                <div className="px-3 pb-3">
                  <div className="bg-green-50 border border-green-200 rounded p-2.5 text-xs text-green-800">
                    <span className="font-semibold">Resolution: </span>{result.resolution}
                  </div>
                </div>
              )}
            </div>

            {/* Status Timeline */}
            <div className="card mb-3">
              <div className="accordion-header" onClick={() => setHistoryOpen(!historyOpen)}>
                <span>Complaint Lifecycle</span>
                {historyOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </div>
              {historyOpen && (
                <div className="p-3">
                  {result.statusHistory.map((h, i) => (
                    <div key={i} className="timeline-item">
                      {i < result.statusHistory.length - 1 && <div className="timeline-line" />}
                      <div className={`timeline-dot flex-shrink-0 ${
                        h.status === 'Resolved' || h.status === 'Closed' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div className="pb-1">
                        <div className="flex items-center gap-2">
                          <span className={`badge ${statusClass[h.status] || 'badge-pending'}`} style={{ fontSize: 9 }}>{h.status}</span>
                          <span className="text-xs text-gray-400">{h.date}</span>
                          <span className="text-xs text-gray-500">by {h.by}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">{h.remarks}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
