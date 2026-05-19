import { useState } from 'react';
import { X } from 'lucide-react';
import { complaints, serviceOrders } from '../../data/dummyData';
import SOULayout from './SOULayout';

// Modal version (used from SO Detail page)
export default function TrackComplaint({ so, onClose }) {
  const [searchMode, setSearchMode] = useState('mobile'); // 'id' | 'mobile'
  const [inputVal, setInputVal] = useState(so?.customer?.phone || '');
  const [selectedSONo, setSelectedSONo] = useState(so?.id || '');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    let found = null;
    if (searchMode === 'id') {
      found = complaints.find(c => c.id.toLowerCase().includes(inputVal.toLowerCase()));
    } else {
      found = complaints.find(c => c.customer.phone === inputVal && (!selectedSONo || c.serviceOrderId === selectedSONo));
    }
    setResult(found || null);
    setSearched(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="font-bold text-gray-800" style={{ fontSize: 17 }}>Track complaint</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>
        <div className="modal-body">
          {/* Radio */}
          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={searchMode === 'id'} onChange={() => { setSearchMode('id'); setSearched(false); }} />
              <span className="text-sm font-medium text-gray-700">Complaint ID</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={searchMode === 'mobile'} onChange={() => { setSearchMode('mobile'); setSearched(false); }} />
              <span className="text-sm font-medium text-blue-700 font-semibold">Mobile number</span>
            </label>
          </div>

          {searchMode === 'mobile' ? (
            <>
              <div className="form-group">
                <label className="form-label">Mobile number</label>
                <input className="form-input" placeholder="Mobile number" value={inputVal} onChange={e => setInputVal(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Select service order no</label>
                <div className="select-clearable">
                  <select className="form-select" value={selectedSONo} onChange={e => setSelectedSONo(e.target.value)}>
                    <option value="">All service orders</option>
                    {serviceOrders.filter(s => s.customer.phone === inputVal || !inputVal).map(s => (
                      <option key={s.id} value={s.id}>{s.id}</option>
                    ))}
                    {so && <option value={so.id}>{so.id}</option>}
                  </select>
                  {selectedSONo && <button className="clear-btn" onClick={() => setSelectedSONo('')}>×</button>}
                </div>
              </div>
            </>
          ) : (
            <div className="form-group">
              <label className="form-label">Complaint ID</label>
              <input className="form-input" placeholder="Enter Complaint ID" value={inputVal} onChange={e => setInputVal(e.target.value)} />
              <div className="text-xs text-gray-400 mt-1">Try: COMP-2024-7374792384</div>
            </div>
          )}

          <button className="btn-outline-blue w-full mb-4" onClick={handleSearch}>Search</button>

          {searched && !result && (
            <div className="text-center text-gray-400 text-sm py-4">No complaint found</div>
          )}

          {result && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <div className="space-y-1.5">
                {[
                  ['Sold to party:', result.customer.name],
                  ['Department:', result.department],
                  ['Category:', result.category],
                  ['Sub category:', result.subCategory],
                  ['Source:', result.source],
                  ['Status:', result.status],
                ].map(([l, v]) => (
                  <div key={l} className="flex gap-2">
                    <span className="text-gray-500">{l}</span>
                    <span className={`font-bold ${l === 'Status:' && v === 'In progress' ? 'status-inprogress' : 'text-gray-800'}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Standalone page version
export function TrackComplaintPage({ onBack }) {
  const [searchMode, setSearchMode] = useState('mobile');
  const [inputVal, setInputVal] = useState('');
  const [selectedSONo, setSelectedSONo] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    let found = null;
    if (searchMode === 'id') {
      found = complaints.find(c => c.id.toLowerCase().includes(inputVal.toLowerCase()));
    } else {
      found = complaints.find(c => c.customer.phone === inputVal);
    }
    setResult(found || null);
    setSearched(true);
  };

  return (
    <SOULayout onBack={onBack}>
      <div className="sou-body">
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2 className="font-bold text-gray-800 mb-4" style={{ fontSize: 20 }}>Track complaint</h2>
          <div className="card">
            <div className="card-body">
              <div className="flex gap-6 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={searchMode === 'id'} onChange={() => { setSearchMode('id'); setSearched(false); }} />
                  <span className="text-sm">Complaint ID</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={searchMode === 'mobile'} onChange={() => { setSearchMode('mobile'); setSearched(false); }} />
                  <span className="text-sm font-semibold text-blue-700">Mobile number</span>
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">{searchMode === 'id' ? 'Complaint ID' : 'Mobile number'}</label>
                <input className="form-input" placeholder={searchMode === 'id' ? 'COMP-2024-...' : '9916265181'} value={inputVal} onChange={e => setInputVal(e.target.value)} />
                {searchMode === 'id' && <div className="text-xs text-gray-400 mt-1">Try: COMP-2024-7374792384</div>}
              </div>
              {searchMode === 'mobile' && (
                <div className="form-group">
                  <label className="form-label">Select service order no</label>
                  <div className="select-clearable">
                    <select className="form-select" value={selectedSONo} onChange={e => setSelectedSONo(e.target.value)}>
                      <option value="">All</option>
                      {serviceOrders.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                    </select>
                    {selectedSONo && <button className="clear-btn" onClick={() => setSelectedSONo('')}>×</button>}
                  </div>
                </div>
              )}
              <button className="btn-outline-blue w-full mb-4" onClick={handleSearch}>Search</button>
              {searched && !result && <div className="text-center text-gray-400 text-sm py-2">No complaint found. Try: 9916265181</div>}
              {result && (
                <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1.5">
                  {[['Complaint ID:', result.id], ['Sold to party:', result.customer.name], ['Department:', result.department], ['Category:', result.category], ['Sub category:', result.subCategory], ['Source:', result.source], ['Status:', result.status]].map(([l, v]) => (
                    <div key={l} className="flex gap-2">
                      <span className="text-gray-500">{l}</span>
                      <span className={`font-bold ${l === 'Status:' ? 'status-inprogress' : 'text-gray-800'}`}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
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
