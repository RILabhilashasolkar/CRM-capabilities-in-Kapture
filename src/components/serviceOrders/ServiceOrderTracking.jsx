import { useState } from 'react';
import { Search, Wrench, MapPin, Phone, User, Calendar, Clock, ChevronDown, ChevronUp, ArrowRight, AlertTriangle } from 'lucide-react';
import { serviceOrders } from '../../data/dummyData';

export default function ServiceOrderTracking({ prefillSO }) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('soId');
  const [results, setResults] = useState(prefillSO ? [prefillSO] : []);
  const [selected, setSelected] = useState(prefillSO || null);
  const [searched, setSearched] = useState(!!prefillSO);

  const handleSearch = () => {
    const q = query.toLowerCase().trim();
    if (!q) return;
    const found = serviceOrders.filter(so => {
      if (searchType === 'soId') return so.id.toLowerCase().includes(q);
      if (searchType === 'phone') return so.customer.phone.includes(q);
      if (searchType === 'refId') return so.serviceRefId.toLowerCase().includes(q);
      if (searchType === 'serialNo') return so.product.serial?.toLowerCase().includes(q);
      if (searchType === 'ticketId') return so.ticketId.toLowerCase().includes(q);
      return false;
    });
    setResults(found);
    setSearched(true);
    setSelected(null);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="k-header px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Wrench size={14} className="text-orange-500" />
          <span className="font-semibold text-gray-800">Track Service Order</span>
        </div>
        <div className="text-xs text-gray-500 mt-0.5">Search by SO ID, Service Ref ID, phone number, serial number, or ticket ID</div>
      </div>

      <div className="p-4">
        {/* Search */}
        {!prefillSO && (
          <div className="card mb-4">
            <div className="card-header">Search Service Order</div>
            <div className="p-3">
              <div className="flex gap-2 mb-2">
                <select className="form-select" style={{ width: 200 }} value={searchType} onChange={e => setSearchType(e.target.value)}>
                  <option value="soId">Service Order ID</option>
                  <option value="refId">Service Ref ID</option>
                  <option value="phone">Customer Phone</option>
                  <option value="serialNo">Serial Number</option>
                  <option value="ticketId">Ticket ID</option>
                </select>
                <input
                  className="form-input flex-1"
                  placeholder="Enter search value..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn-primary flex items-center gap-1" onClick={handleSearch}>
                  <Search size={13} /> Search
                </button>
                <button className="btn-secondary" onClick={() => { setQuery(''); setResults([]); setSearched(false); setSelected(null); }}>Reset</button>
              </div>
              <div className="text-xs text-gray-400">Try: SO-2026-0044, SO-2026-0071, SO-2026-0088 or phone 9689808472</div>
            </div>
          </div>
        )}

        {/* Results list */}
        {searched && !selected && (
          <>
            {results.length === 0 ? (
              <div className="card p-6 text-center text-gray-400 text-sm">No service orders found for this search</div>
            ) : (
              results.map(so => (
                <SOSummaryCard key={so.id} so={so} onClick={() => setSelected(so)} />
              ))
            )}
          </>
        )}

        {/* Detail view */}
        {selected && (
          <SODetailView so={selected} onBack={() => { setSelected(null); if (prefillSO) {} }} />
        )}
      </div>
    </div>
  );
}

function SOSummaryCard({ so, onClick }) {
  const statusClass = {
    'New': 'so-new', 'Assigned': 'so-assigned', 'In Progress': 'so-inprogress',
    'Completed': 'so-completed', 'Cancelled': 'so-cancelled', 'On Hold': 'so-onhold',
  }[so.status] || 'so-new';

  return (
    <div className="card mb-3 cursor-pointer hover:border-blue-300 transition-colors" onClick={onClick}>
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="font-semibold text-sm text-blue-700">{so.id}</div>
            <div className="text-xs text-gray-500">{so.type}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge ${statusClass}`}>{so.status}</span>
            <ArrowRight size={14} className="text-gray-400" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div><span className="text-gray-400">Customer: </span><span className="font-medium">{so.customer.name}</span></div>
          <div><span className="text-gray-400">Phone: </span><span className="font-medium">{so.customer.phone}</span></div>
          <div><span className="text-gray-400">Ref ID: </span><span className="font-medium text-orange-700">{so.serviceRefId}</span></div>
          <div><span className="text-gray-400">Product: </span><span className="font-medium">{so.product.name.slice(0, 30)}...</span></div>
          <div><span className="text-gray-400">Created: </span><span className="font-medium">{so.createdDate}</span></div>
          <div><span className="text-gray-400">Est. TAT: </span><span className="font-medium">{so.estimatedTAT}</span></div>
        </div>
      </div>
    </div>
  );
}

function SODetailView({ so, onBack }) {
  const [historyOpen, setHistoryOpen] = useState(true);
  const statusClass = {
    'New': 'so-new', 'Assigned': 'so-assigned', 'In Progress': 'so-inprogress',
    'Completed': 'so-completed', 'Cancelled': 'so-cancelled', 'On Hold': 'so-onhold',
  }[so.status] || 'so-new';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-blue-500 text-xs flex items-center gap-1">← Back</button>
          <span className="font-bold text-base text-gray-800">{so.id}</span>
          <span className={`badge ${statusClass}`}>{so.status}</span>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary btn-sm">Reschedule</button>
          <button className="btn-danger btn-sm">Cancel SO</button>
        </div>
      </div>

      {/* Identifiers */}
      <div className="card mb-3">
        <div className="card-header">Service Identifiers</div>
        <div className="kv-grid">
          <div className="kv-item"><div className="kv-label">Service Order ID</div><div className="kv-value text-blue-700">{so.id}</div></div>
          <div className="kv-item"><div className="kv-label">Service Ref ID</div><div className="kv-value text-orange-700">{so.serviceRefId}</div></div>
          <div className="kv-item"><div className="kv-label">SAP Service Order No.</div><div className="kv-value">{so.sapServiceOrderNo}</div></div>
          <div className="kv-item"><div className="kv-label">SAP Service Req. No.</div><div className="kv-value">{so.sapServiceReqNo}</div></div>
          <div className="kv-item"><div className="kv-label">Kapture Ticket ID</div><div className="kv-value">{so.ticketId}</div></div>
          <div className="kv-item"><div className="kv-label">Order ID</div><div className="kv-value">{so.orderId}</div></div>
        </div>
      </div>

      {/* Customer + Product */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="card">
          <div className="card-header"><User size={12} /> Customer</div>
          <div className="p-3 space-y-1.5 text-xs">
            <div><span className="text-gray-400">Name: </span><span className="font-medium">{so.customer.name}</span></div>
            <div><span className="text-gray-400">Phone: </span><span className="font-medium">{so.customer.phone}</span></div>
            <div><span className="text-gray-400">Code: </span><span className="font-medium">{so.customer.code}</span></div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><Wrench size={12} /> Product</div>
          <div className="p-3 space-y-1.5 text-xs">
            <div className="font-medium text-gray-800">{so.product.name.slice(0, 35)}</div>
            <div><span className="text-gray-400">Serial: </span><span className="font-medium">{so.product.serial}</span></div>
            <div><span className="text-gray-400">Object ID: </span><span className="font-medium">{so.product.objectId}</span></div>
          </div>
        </div>
      </div>

      {/* Engineer + Appointment */}
      <div className="card mb-3">
        <div className="card-header"><Calendar size={12} /> Engineer & Appointment</div>
        <div className="kv-grid">
          <div className="kv-item"><div className="kv-label">Engineer Name</div><div className="kv-value">{so.engineer.name}</div></div>
          <div className="kv-item"><div className="kv-label">Engineer Phone</div><div className="kv-value">{so.engineer.phone}</div></div>
          <div className="kv-item"><div className="kv-label">Engineer ID</div><div className="kv-value">{so.engineer.id}</div></div>
          <div className="kv-item"><div className="kv-label">Appointment Date</div><div className="kv-value text-blue-700 font-semibold">{so.appointmentDate}</div></div>
          <div className="kv-item"><div className="kv-label">Time Slot</div><div className="kv-value">{so.appointmentSlot}</div></div>
          <div className="kv-item"><div className="kv-label">Est. TAT</div><div className="kv-value">{so.estimatedTAT}</div></div>
          <div className="kv-item"><div className="kv-label">Service Centre</div><div className="kv-value">{so.serviceCenter.name}</div></div>
          <div className="kv-item"><div className="kv-label">SC Contact</div><div className="kv-value">{so.serviceCenter.phone}</div></div>
        </div>
        {so.symptom && so.symptom !== 'N/A' && (
          <div className="px-3 pb-3">
            <div className="bg-yellow-50 border border-yellow-100 rounded p-2 text-xs">
              <span className="font-semibold text-yellow-800">Reported Symptom: </span>
              <span className="text-yellow-700">{so.symptom}</span>
            </div>
          </div>
        )}
      </div>

      {/* Service Address */}
      <div className="card mb-3">
        <div className="card-header"><MapPin size={12} /> Service Address</div>
        <div className="p-3 text-xs text-gray-700">{so.address}</div>
      </div>

      {/* Complaint link */}
      {so.complaint && (
        <div className="card mb-3 border-red-200">
          <div className="card-header" style={{ background: '#fef2f2' }}>
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle size={13} />
              <span>Linked Complaint: {so.complaint}</span>
            </div>
          </div>
          <div className="p-3 text-xs text-gray-600">
            A digital complaint has been raised against this service order. View in Complaints section.
          </div>
        </div>
      )}

      {/* Status History Timeline */}
      <div className="card mb-3">
        <div className="accordion-header" onClick={() => setHistoryOpen(!historyOpen)}>
          <span>Status History / Timeline</span>
          {historyOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </div>
        {historyOpen && (
          <div className="p-3">
            {so.statusHistory.map((h, i) => (
              <div key={i} className="timeline-item">
                {i < so.statusHistory.length - 1 && <div className="timeline-line" />}
                <div className={`timeline-dot flex-shrink-0 ${i === so.statusHistory.length - 1 ? 'bg-blue-500' : 'bg-green-500'}`} />
                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-gray-800">{h.status}</span>
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

      {/* Escalation Matrix */}
      <div className="card mb-3">
        <div className="card-header">Escalation Matrix</div>
        <div className="p-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-2 py-1.5 text-gray-500 font-medium">Level</th>
                <th className="text-left px-2 py-1.5 text-gray-500 font-medium">Contact</th>
                <th className="text-left px-2 py-1.5 text-gray-500 font-medium">TAT Trigger</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100">
                <td className="px-2 py-1.5">L1 – Engineer</td>
                <td className="px-2 py-1.5">{so.engineer.name} · {so.engineer.phone}</td>
                <td className="px-2 py-1.5">Same day</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="px-2 py-1.5">L2 – Service Centre</td>
                <td className="px-2 py-1.5">{so.serviceCenter.name} · {so.serviceCenter.phone}</td>
                <td className="px-2 py-1.5">+1 day of TAT breach</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="px-2 py-1.5">L3 – Regional Head</td>
                <td className="px-2 py-1.5">region-head@reliance.com</td>
                <td className="px-2 py-1.5">+2 days of TAT breach</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
