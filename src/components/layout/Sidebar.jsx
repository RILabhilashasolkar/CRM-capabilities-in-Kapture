import { LayoutGrid, Ticket, ShoppingCart, Users, Settings, BarChart2 } from 'lucide-react';

export default function Sidebar({ activeSection, onSectionChange, activeView, onViewChange }) {
  const isTickets = activeSection === 'tickets';
  const isCRM = activeSection === 'crm';

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', section: 'dashboard' },
    { icon: Ticket, label: 'Tickets', section: 'tickets' },
    { icon: ShoppingCart, label: 'Orders & Service', section: 'crm' },
    { icon: Users, label: 'Customers', section: 'customers' },
    { icon: BarChart2, label: 'Reports', section: 'reports' },
    { icon: Settings, label: 'Settings', section: 'settings' },
  ];

  return (
    <div className="flex flex-shrink-0" style={{ height: '100%' }}>
      {/* Icon rail */}
      <div className="k-icon-rail">
        <div className="w-8 h-8 mb-2 mt-1 flex items-center justify-center">
          <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold" style={{ fontSize: 11 }}>R</span>
          </div>
        </div>
        {navItems.map(({ icon: Icon, label, section }) => {
          const isActive = activeSection === section;
          return (
            <button key={label} title={label}
              onClick={() => onSectionChange(section)}
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-700 hover:text-white'}`}
            >
              <Icon size={16} />
            </button>
          );
        })}
        <div className="flex-1" />
        <div className="px-1 pb-2 text-center" style={{ fontSize: 8, color: '#4b5563' }}>v5.3</div>
      </div>

      {/* Sidebar panel — tickets section */}
      {isTickets && (
        <div className="k-sidebar">
          <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="font-semibold text-white text-sm">Tickets</span>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            <div className="sidebar-section">OVERALL</div>
            {['Unassigned', 'All Pending', 'All Complete', 'All Junk'].map(v => (
              <div key={v} className={`sidebar-item ${activeView === v ? 'active' : ''}`} onClick={() => onViewChange(v)}>{v}</div>
            ))}
            {['Assigned to me', 'Created by me', 'Completed by me', 'Pending by team', 'Completed by team'].map(v => (
              <div key={v} className={`sidebar-item ${activeView === v ? 'active' : ''}`} onClick={() => onViewChange(v)}>{v}</div>
            ))}
            <div className="sidebar-section mt-2">SAVED FILTERS</div>
            {['Bhumika', 'JMD cs email', 'pbg', 'Sachin Singh', 'Naina Duggal', 'Grievance RIL Digital', 'Csrd Queue'].map(v => (
              <div key={v} className={`sidebar-item text-xs ${activeView === v ? 'active' : ''}`} onClick={() => onViewChange(v)}>{v}</div>
            ))}
          </div>
          <div className="px-3 py-2 text-xs text-gray-500 flex items-center gap-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="w-2 h-2 bg-green-400 rounded-full"></span> v5.3.73-can.6c0041ef
          </div>
        </div>
      )}

      {/* Sidebar panel — CRM/Orders section */}
      {isCRM && (
        <div className="k-sidebar">
          <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="font-semibold text-white text-sm">Orders & Service</span>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            <div className="sidebar-section">SEARCH BY</div>
            <div className="sidebar-item text-xs" style={{ color: '#93c5fd' }}>● Mobile Number</div>
            <div className="sidebar-item text-xs">Order ID</div>
            <div className="sidebar-item text-xs">Service Order No.</div>
            <div className="sidebar-section mt-2">QUICK ACCESS</div>
            <div className="sidebar-item text-xs">Recent Service Orders</div>
            <div className="sidebar-item text-xs">Pending Complaints</div>
            <div className="sidebar-section mt-2">CREATE</div>
            <div className="sidebar-item text-xs">New Service Request</div>
            <div className="sidebar-item text-xs">Raise Complaint</div>
          </div>
        </div>
      )}
    </div>
  );
}
