import { useState } from 'react';
import CustomerSearch from './CustomerSearch';
import CreateServiceOrder from './CreateServiceOrder';
import ServiceOrderTracking from './ServiceOrderTracking';
import { RaiseComplaint, TrackComplaint } from './ComplaintManagement';
import { serviceOrders } from '../../data/dummyData';
import { Wrench, Search, Plus, ClipboardList, AlertCircle, FileText, ChevronDown } from 'lucide-react';

export default function ServiceOrdersView({ activeView, onViewChange }) {
  const [createPrefill, setCreatePrefill] = useState(null);
  const [trackingSO, setTrackingSO] = useState(null);
  const [innerView, setInnerView] = useState(null);

  const handleCreateServiceOrder = (customer, context) => {
    setCreatePrefill({ customer, context });
    setInnerView('create');
  };

  const handleViewServiceOrder = (so) => {
    setTrackingSO(so);
    setInnerView('track-detail');
  };

  const handleBack = () => {
    setInnerView(null);
    setCreatePrefill(null);
    setTrackingSO(null);
  };

  // Inner navigation overrides activeView
  const currentView = innerView || activeView;

  if (currentView === 'create' || currentView === 'so-create') {
    return <CreateServiceOrder prefill={createPrefill} onSuccess={handleBack} onBack={handleBack} />;
  }

  if (currentView === 'track-detail') {
    return <ServiceOrderTracking prefillSO={trackingSO} onBack={handleBack} />;
  }

  if (currentView === 'so-track') {
    return <ServiceOrderTracking />;
  }

  if (currentView === 'so-complaint-create') {
    return <RaiseComplaint onBack={handleBack} />;
  }

  if (currentView === 'so-complaint-track') {
    return <TrackComplaint onBack={handleBack} />;
  }

  if (currentView === 'so-search') {
    return (
      <CustomerSearch
        onCreateServiceOrder={handleCreateServiceOrder}
        onViewServiceOrder={handleViewServiceOrder}
      />
    );
  }

  // Default: SO dashboard / all open list
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="k-header px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Wrench size={15} className="text-orange-500" />
          <span className="font-semibold text-gray-800">Service Orders — CRM Capability</span>
          <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontSize: 10 }}>NEW</span>
        </div>
        <div className="text-xs text-gray-500 mt-0.5">Manage service requests, track orders, and handle complaints — without SAP CRM access</div>
      </div>

      <div className="p-4">
        {/* Quick action cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <ActionCard
            icon={<Search size={18} className="text-blue-600" />}
            title="Search by Phone"
            desc="Look up customer, orders & service history"
            bg="#dbeafe"
            onClick={() => onViewChange('so-search')}
            badge="Recently Launched"
            badgeColor="#1d4ed8"
          />
          <ActionCard
            icon={<Plus size={18} className="text-green-600" />}
            title="New Service Request"
            desc="Create installation, warranty or support request"
            bg="#d1fae5"
            onClick={() => onViewChange('so-create')}
          />
          <ActionCard
            icon={<ClipboardList size={18} className="text-purple-600" />}
            title="Track Service Order"
            desc="Search by SO ID, phone, serial, ticket ID"
            bg="#ede9fe"
            onClick={() => onViewChange('so-track')}
          />
          <ActionCard
            icon={<AlertCircle size={18} className="text-red-600" />}
            title="Raise Complaint"
            desc="Log a digital complaint against a service order"
            bg="#fee2e2"
            onClick={() => onViewChange('so-complaint-create')}
          />
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            { label: 'Total SOs', value: serviceOrders.length, color: '#1d4ed8' },
            { label: 'In Progress', value: serviceOrders.filter(so => so.status === 'In Progress').length, color: '#7c3aed' },
            { label: 'Assigned', value: serviceOrders.filter(so => so.status === 'Assigned').length, color: '#92400e' },
            { label: 'Completed', value: serviceOrders.filter(so => so.status === 'Completed').length, color: '#065f46' },
          ].map(s => (
            <div key={s.label} className="card p-3 text-center">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Service Orders */}
        <div className="card">
          <div className="card-header">
            <span>Recent Service Orders</span>
            <button className="text-xs text-blue-500" onClick={() => onViewChange('so-track')}>View All</button>
          </div>
          <div>
            {serviceOrders.map(so => <SOListRow key={so.id} so={so} onClick={() => handleViewServiceOrder(so)} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, desc, bg, onClick, badge, badgeColor }) {
  return (
    <div
      className="rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
      style={{ background: bg }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">{icon}</div>
        {badge && (
          <span className="badge" style={{ background: 'white', color: badgeColor, fontSize: 9 }}>{badge}</span>
        )}
      </div>
      <div className="font-semibold text-sm text-gray-800">{title}</div>
      <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
    </div>
  );
}

function SOListRow({ so, onClick }) {
  const statusClass = {
    'New': 'so-new', 'Assigned': 'so-assigned', 'In Progress': 'so-inprogress',
    'Completed': 'so-completed', 'Cancelled': 'so-cancelled', 'On Hold': 'so-onhold',
  }[so.status] || 'so-new';

  return (
    <div className="ticket-row" onClick={onClick}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-xs text-blue-700">{so.id}</span>
          <span className="text-gray-400 text-xs">·</span>
          <span className="text-xs text-gray-600">{so.type}</span>
        </div>
        <div className="text-xs text-gray-500">{so.product.name.slice(0, 50)}</div>
        <div className="text-xs text-gray-400 mt-0.5">
          {so.customer.name} · {so.customer.phone} · Created {so.createdDate}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <span className={`badge ${statusClass}`}>{so.status}</span>
        <div className="text-xs text-gray-400 mt-1">TAT: {so.estimatedTAT}</div>
        {so.complaint && <div className="text-xs text-red-500 mt-0.5">⚠ Complaint</div>}
      </div>
    </div>
  );
}
