import { useState } from 'react';
import SOULayout from './SOULayout';
import { serviceOrders } from '../../data/dummyData';

export default function TrackServiceRequest({ onBack }) {
  const [searchBy, setSearchBy] = useState('phone');
  const [inputVal, setInputVal] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    let found = null;
    if (searchBy === 'phone') {
      found = serviceOrders.find(s => s.customer.phone === inputVal);
    } else if (searchBy === 'soId') {
      found = serviceOrders.find(s => s.id.toLowerCase() === inputVal.toLowerCase());
    } else if (searchBy === 'serial') {
      found = serviceOrders.find(s => s.product.serial.toLowerCase() === inputVal.toLowerCase());
    }
    setResult(found || null);
    setSearched(true);
  };

  const statusClass = (status) => {
    if (status === 'In Progress') return 'status-inprogress';
    if (status === 'Completed') return 'status-completed';
    return 'status-assigned';
  };

  return (
    <SOULayout onBack={onBack}>
      <div className="sou-body">
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 className="font-bold text-gray-800 mb-4" style={{ fontSize: 20 }}>Track service request</h2>

          <div className="card">
            <div className="card-body">
              {/* Search mode selector */}
              <div className="flex gap-6 mb-4">
                {[['phone', 'Mobile number'], ['soId', 'Service order ID'], ['serial', 'Serial number']].map(([val, label]) => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={searchBy === val} onChange={() => { setSearchBy(val); setSearched(false); setResult(null); setInputVal(''); }} />
                    <span className={`text-sm ${searchBy === val ? 'font-semibold text-blue-700' : 'text-gray-700'}`}>{label}</span>
                  </label>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">
                  {searchBy === 'phone' ? 'Mobile number' : searchBy === 'soId' ? 'Service order ID' : 'Serial number'}
                </label>
                <input
                  className="form-input"
                  placeholder={searchBy === 'phone' ? '9916265181' : searchBy === 'soId' ? '86379827' : 'SN-WM-7291'}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <button className="btn-outline-blue w-full mb-4" onClick={handleSearch}>Search</button>

              {searched && !result && (
                <div className="text-center text-gray-400 text-sm py-4">
                  No service order found.{searchBy === 'phone' && ' Try: 9916265181'}
                  {searchBy === 'soId' && ' Try: 86379827'}
                  {searchBy === 'serial' && ' Try: SN-WM-7291'}
                </div>
              )}
            </div>
          </div>

          {result && (
            <>
              {/* Main SO details */}
              <div className="card">
                <div className="font-bold text-gray-800 px-5 pt-4 pb-2" style={{ fontSize: 15 }}>Service order details</div>
                <hr className="divider mx-5" />
                <div className="px-5 py-3">
                  <div className="so-detail-grid mb-3">
                    <div className="so-detail-item">
                      <div className="so-label">Service Order ID:</div>
                      <div className="so-value font-bold text-blue-700">#{result.id}</div>
                    </div>
                    <div className="so-detail-item">
                      <div className="so-label">Product:</div>
                      <div className="so-value">{result.product.name}</div>
                    </div>
                    <div className="so-detail-item">
                      <div className="so-label">Serial No:</div>
                      <div className="so-value">{result.product.serial}</div>
                    </div>
                    <div className="so-detail-item">
                      <div className="so-label">Type of Service Request:</div>
                      <div className="so-value">{result.type}</div>
                    </div>
                    <div className="so-detail-item">
                      <div className="so-label">Service Request Status:</div>
                      <div className={`so-value ${statusClass(result.status)}`}>{result.status}</div>
                    </div>
                    <div className="so-detail-item">
                      <div className="so-label">Visiting Engineer's Name:</div>
                      <div className="so-value">{result.engineer.name}</div>
                    </div>
                    <div className="so-detail-item">
                      <div className="so-label">Engineer's Contact:</div>
                      <div className="so-value">{result.engineer.phone}</div>
                    </div>
                    <div className="so-detail-item">
                      <div className="so-label">Scheduled Appointment Date:</div>
                      <div className="so-value">{result.appointmentDate}</div>
                    </div>
                    <div className="so-detail-item">
                      <div className="so-label">Est. Completion Date:</div>
                      <div className="so-value">{result.estimatedTAT}</div>
                    </div>
                    <div className="so-detail-item">
                      <div className="so-label">Customer:</div>
                      <div className="so-value">{result.customer.name}</div>
                    </div>
                  </div>
                  {result.serviceNote && (
                    <div>
                      <div className="so-label mb-0.5">Service Note:</div>
                      <div className="so-value">{result.serviceNote}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Timeline */}
              <div className="card">
                <div className="font-bold text-gray-800 px-5 pt-4 pb-2" style={{ fontSize: 15 }}>Service order timeline</div>
                <hr className="divider mx-5" />
                <div className="px-5 py-4">
                  <div className="timeline">
                    {result.statusHistory.map((h, i) => (
                      <div key={i} className="timeline-item">
                        {i < result.statusHistory.length - 1 && <div className={`timeline-line ${i < result.statusHistory.length - 2 ? 'done' : ''}`} />}
                        <div className={`timeline-dot ${i === result.statusHistory.length - 1 ? 'active' : 'done'}`} />
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-sm text-gray-800">{h.status}</span>
                            <span className="text-xs text-gray-400">{h.date}</span>
                            <span className="text-xs text-gray-500">· {h.by}</span>
                          </div>
                          <div className="text-sm text-gray-600">{h.remarks}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="text-center text-xs text-gray-400 py-4">
            Copyright © 2024 JioMart Digital, a division of Reliance Retail Limited
          </div>
        </div>
      </div>
    </SOULayout>
  );
}
