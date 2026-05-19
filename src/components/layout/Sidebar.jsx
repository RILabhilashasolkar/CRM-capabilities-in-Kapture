import {
  LayoutGrid, Ticket, ShoppingCart, Users, Settings, BarChart2,
  Link2, Headphones, ChevronDown, ChevronRight, Plus, ClipboardList,
  Wrench, Search, FileText, AlertCircle
} from 'lucide-react';

const iconItems = [
  { icon: LayoutGrid, label: 'Dashboard' },
  { icon: Ticket, label: 'Tickets', active: true },
  { icon: ShoppingCart, label: 'Orders' },
  { icon: Users, label: 'Customers' },
  { icon: BarChart2, label: 'Reports' },
  { icon: Link2, label: 'Integrations' },
  { icon: Settings, label: 'Settings' },
];

export default function Sidebar({ activeView, onViewChange, activeSection, onSectionChange }) {
  const isTickets = activeSection === 'tickets';
  const isServiceOrders = activeSection === 'serviceOrders';

  return (
    <div className="flex flex-shrink-0" style={{ height: '100%' }}>
      {/* Icon rail */}
      <div className="k-icon-rail flex flex-col items-center py-2 gap-1" style={{ width: 40 }}>
        {/* Logo */}
        <div className="w-8 h-8 mb-1 flex items-center justify-center">
          <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold" style={{ fontSize: 11 }}>R</span>
          </div>
        </div>
        {iconItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            title={label}
            onClick={() => {
              if (label === 'Tickets') onSectionChange('tickets');
            }}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              (label === 'Tickets' && isTickets) || (label === 'Dashboard' && isServiceOrders)
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Icon size={16} />
          </button>
        ))}
        {/* Service Orders icon */}
        <button
          title="Service Orders"
          onClick={() => onSectionChange('serviceOrders')}
          className={`w-8 h-8 rounded flex items-center justify-center transition-colors mt-1 ${
            isServiceOrders ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Wrench size={16} />
        </button>
      </div>

      {/* Sidebar panel */}
      <div className="k-sidebar flex flex-col overflow-y-auto" style={{ width: 192 }}>
        {isTickets && <TicketsSidebar activeView={activeView} onViewChange={onViewChange} />}
        {isServiceOrders && <ServiceOrdersSidebar activeView={activeView} onViewChange={onViewChange} />}
      </div>
    </div>
  );
}

function TicketsSidebar({ activeView, onViewChange }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-700">
        <span className="font-semibold text-white text-sm">Tickets</span>
        <button className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
          <Plus size={12} className="text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        <div className="sidebar-section">OVERALL</div>
        {['Unassigned', 'All Pending', 'All Complete', 'All Junk'].map(v => (
          <div key={v} className={`sidebar-item ${activeView === v ? 'active' : ''}`} onClick={() => onViewChange(v)}>{v}</div>
        ))}
        {['Assigned to me', 'Created by me', 'Completed by me', 'Pending by team', 'Completed by team'].map(v => (
          <div key={v} className={`sidebar-item ${activeView === v ? 'active' : ''}`} onClick={() => onViewChange(v)}>{v}</div>
        ))}

        <div className="sidebar-section mt-2">SAVED FILTER LIST</div>
        {['Bhumika', 'JMD cs email', 'pbg', 'PBG', 'Sachin Singh', 'Naina Duggal', 'Lishu Sharma', 'Grievance RIL Digital', 'Shivanshi', 'Csrd Queue', 'No reply Folder'].map(v => (
          <div key={v} className={`sidebar-item text-xs ${activeView === v ? 'active' : ''}`} onClick={() => onViewChange(v)}>{v}</div>
        ))}
      </div>

      <div className="px-3 py-2 border-t border-gray-700 text-xs text-gray-500 flex items-center gap-1">
        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
        v5.3.73-can.6c0041ef
      </div>
    </div>
  );
}

function ServiceOrdersSidebar({ activeView, onViewChange }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-700">
        <span className="font-semibold text-white text-sm">Service Orders</span>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-orange-500 rounded flex items-center justify-center">
            <Wrench size={9} className="text-white" />
          </span>
          <span className="text-xs text-orange-400 font-semibold">CRM</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        <div className="sidebar-section">SEARCH & LOOKUP</div>
        <div
          className={`sidebar-item flex items-center gap-2 ${activeView === 'so-search' ? 'active' : ''}`}
          onClick={() => onViewChange('so-search')}
        >
          <Search size={12} />
          <span>Search by Phone</span>
        </div>
        <div
          className={`sidebar-item flex items-center gap-2 ${activeView === 'so-track' ? 'active' : ''}`}
          onClick={() => onViewChange('so-track')}
        >
          <ClipboardList size={12} />
          <span>Track Service Order</span>
        </div>

        <div className="sidebar-section mt-2">CREATE</div>
        <div
          className={`sidebar-item flex items-center gap-2 ${activeView === 'so-create' ? 'active' : ''}`}
          onClick={() => onViewChange('so-create')}
        >
          <Plus size={12} />
          <span>New Service Request</span>
        </div>

        <div className="sidebar-section mt-2">COMPLAINTS</div>
        <div
          className={`sidebar-item flex items-center gap-2 ${activeView === 'so-complaint-create' ? 'active' : ''}`}
          onClick={() => onViewChange('so-complaint-create')}
        >
          <AlertCircle size={12} />
          <span>Raise Complaint</span>
        </div>
        <div
          className={`sidebar-item flex items-center gap-2 ${activeView === 'so-complaint-track' ? 'active' : ''}`}
          onClick={() => onViewChange('so-complaint-track')}
        >
          <FileText size={12} />
          <span>Track Complaint</span>
        </div>

        <div className="sidebar-section mt-2">ALL SERVICE ORDERS</div>
        {['All Open', 'Assigned to me', 'Pending Appointment', 'Completed'].map(v => (
          <div key={v} className={`sidebar-item text-xs ${activeView === `so-${v}` ? 'active' : ''}`} onClick={() => onViewChange(`so-${v}`)}>{v}</div>
        ))}
      </div>

      <div className="px-3 py-2 border-t border-gray-700">
        <div className="text-xs text-orange-400 font-semibold flex items-center gap-1">
          <Wrench size={10} />
          CRM Capability — New
        </div>
        <div className="text-xs text-gray-500 mt-0.5">Built on Kapture v5.3.73</div>
      </div>
    </div>
  );
}
