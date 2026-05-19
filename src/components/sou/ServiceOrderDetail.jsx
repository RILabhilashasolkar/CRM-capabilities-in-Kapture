import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import SOULayout from './SOULayout';
import { serviceOrders, complaints } from '../../data/dummyData';
import TrackComplaint from './TrackComplaint';
import RaiseComplaint from './RaiseComplaint';

export default function ServiceOrderDetail({ soId, onBack }) {
  const so = serviceOrders.find(s => s.id === soId) || serviceOrders[0];
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showRaiseComplaint, setShowRaiseComplaint] = useState(false);

  if (showRaiseComplaint) {
    return <RaiseComplaint so={so} onBack={() => setShowRaiseComplaint(false)} />;
  }

  return (
    <SOULayout onBack={onBack}>
      {showTrackModal && <TrackComplaint so={so} onClose={() => setShowTrackModal(false)} />}

      <div className="sou-body">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* Page header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button onClick={onBack} className="text-gray-500 hover:text-gray-800">
                <ArrowLeft size={18} />
              </button>
              <h2 className="font-bold text-gray-800" style={{ fontSize: 20 }}>
                {so.product.name}
              </h2>
            </div>
            <button className="btn-outline-blue btn-sm" onClick={() => setShowTrackModal(true)}>
              Track complaint
            </button>
          </div>

          {/* Service Order Details */}
          <div className="card">
            <div className="font-bold text-gray-800 px-5 pt-4 pb-2" style={{ fontSize: 15 }}>Service order details</div>
            <hr className="divider mx-5" />
            <div className="px-5 py-3">
              {/* 4-column grid */}
              <div className="so-detail-grid mb-4">
                <div className="so-detail-item"><div className="so-label">Product:</div><div className="so-value">{so.product.name}</div></div>
                <div className="so-detail-item"><div className="so-label">Serial No:</div><div className="so-value">{so.product.serial}</div></div>
                <div className="so-detail-item"><div className="so-label">Type of Service Request:</div><div className="so-value">{so.type}</div></div>
                <div className="so-detail-item"><div className="so-label">Service Request Status:</div><div className={`so-value ${so.status === 'In Progress' ? 'status-inprogress' : so.status === 'Completed' ? 'status-completed' : 'status-assigned'}`}>{so.status}</div></div>
                <div className="so-detail-item"><div className="so-label">Visiting Engineer's Name:</div><div className="so-value">{so.engineer.name}</div></div>
                <div className="so-detail-item"><div className="so-label">Scheduled Appointment Date:</div><div className="so-value">{so.appointmentDate}</div></div>
                <div className="so-detail-item"><div className="so-label">Engineer's Contact:</div><div className="so-value">{so.engineer.phone}</div></div>
                <div className="so-detail-item"><div className="so-label">Est. Completion Date:</div><div className="so-value">{so.estimatedTAT}</div></div>
              </div>
              {so.serviceNote && (
                <div>
                  <div className="so-label mb-1">Service Note:</div>
                  <div className="so-value">{so.serviceNote}</div>
                </div>
              )}
            </div>
            <hr className="divider mx-5" />
            <div className="px-5 py-3">
              <button className="btn-primary" onClick={() => setShowRaiseComplaint(true)}>Raise Complaint</button>
            </div>
          </div>

          {/* Product Details */}
          <div className="card">
            <div className="font-bold text-gray-800 px-5 pt-4 pb-2" style={{ fontSize: 15 }}>Product details</div>
            <hr className="divider mx-5" />
            <div className="px-5 py-3">
              <div className="form-group">
                <label className="form-label">Date of purchase <span className="required">*</span></label>
                <div className="form-input text-gray-700" style={{ background: '#f9fafb' }}>02 April 2024</div>
              </div>
              <div className="form-group">
                <label className="form-label">MFG Serial Number</label>
                <div className="form-input text-gray-700" style={{ background: '#f9fafb' }}>{so.product.serial}</div>
                <div className="serial-resolved mt-2">
                  <span className="tag-chip">Family: {so.product.family}</span>
                  <span className="tag-chip">Brand: {so.product.brand}</span>
                  <span className="tag-chip">Product ID: {so.product.sku} ({so.product.name})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="card">
            <div className="font-bold text-gray-800 px-5 pt-4 pb-2" style={{ fontSize: 15 }}>Service order timeline</div>
            <hr className="divider mx-5" />
            <div className="px-5 py-4">
              <div className="timeline">
                {so.statusHistory.map((h, i) => (
                  <div key={i} className="timeline-item">
                    {i < so.statusHistory.length - 1 && <div className={`timeline-line ${i < so.statusHistory.length - 2 ? 'done' : ''}`} />}
                    <div className={`timeline-dot ${i === so.statusHistory.length - 1 ? 'active' : 'done'}`} />
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

          <div className="text-center text-xs text-gray-400 py-4">
            Copyright © 2024 JioMart Digital, a division of Reliance Retail Limited
          </div>
        </div>
      </div>
    </SOULayout>
  );
}
