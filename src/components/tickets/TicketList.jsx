import { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, MoreHorizontal, Plus, Mail, Phone } from 'lucide-react';
import { tickets } from '../../data/dummyData';
import TicketDetail from './TicketDetail';

export default function TicketList({ view }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = tickets.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.customer.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search)
  );

  if (selectedTicket) {
    return <TicketDetail ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="k-header flex items-center gap-2 px-3 py-2 border-b border-gray-200 flex-shrink-0">
        <button className="btn-primary btn-sm flex items-center gap-1">
          <Plus size={12} /> Add Ticket
        </button>
        <button className="btn-secondary btn-sm flex items-center gap-1">
          <Mail size={12} /> Compose Email
        </button>
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="form-input pl-7"
            style={{ height: 28 }}
            placeholder="Search tickets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>Show</span>
          <select className="form-select" style={{ width: 50, height: 26, padding: '2px 4px' }}>
            <option>50</option><option>100</option>
          </select>
          <span className="ml-1">1 – {filtered.length} of {filtered.length}</span>
        </div>
        <button className="btn-secondary btn-sm"><ChevronLeft size={12} /></button>
        <button className="btn-secondary btn-sm"><ChevronRight size={12} /></button>
        <button className="btn-secondary btn-sm flex items-center gap-1 text-xs">
          <Filter size={11} /> Last Conversation
        </button>
        <button className="btn-secondary btn-sm"><MoreHorizontal size={14} /></button>
      </div>

      {/* Ticket rows */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map(ticket => (
          <TicketRow key={ticket.id} ticket={ticket} onClick={() => setSelectedTicket(ticket)} />
        ))}
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No tickets found</div>
        )}
      </div>
    </div>
  );
}

function TicketRow({ ticket, onClick }) {
  const slaIsViolated = ticket.sla === 'SLA is violated';
  return (
    <div className="ticket-row" onClick={onClick}>
      {/* Left: checkbox + source dot */}
      <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
        <input type="checkbox" className="w-3.5 h-3.5" onClick={e => e.stopPropagation()} />
        <span
          className="w-2 h-2 rounded-sm flex-shrink-0"
          style={{ background: ticket.source === 'RD.IN' ? '#3b82f6' : ticket.source === 'JMD' ? '#8b5cf6' : '#10b981' }}
        />
      </div>

      {/* Middle: main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            {/* Type tag */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="tag" style={{ background: '#fef3c7', color: '#92400e' }}>{ticket.type}</span>
              {ticket.vertical === 'Complaint' && (
                <span className="tag" style={{ background: '#fee2e2', color: '#991b1b' }}>Complaint</span>
              )}
            </div>
            {/* Title */}
            <div className="font-medium text-gray-800 text-xs leading-tight truncate" style={{ maxWidth: 440 }}>
              {ticket.title}
            </div>
            {/* Customer + Phone */}
            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
              <span>{ticket.customer}</span>
              <span>·</span>
              <Phone size={10} />
              <span>{ticket.phone}</span>
            </div>
            {/* Date */}
            <div className="text-xs text-gray-400 mt-0.5">{ticket.date}</div>
          </div>
        </div>
      </div>

      {/* Right: assignee + meta */}
      <div className="flex-shrink-0 text-right" style={{ minWidth: 180 }}>
        <div className="text-xs text-gray-500 truncate" style={{ maxWidth: 160 }}>{ticket.assignee}</div>
        <div className={`text-xs mt-0.5 ${slaIsViolated ? 'sla-violated' : 'text-gray-400'}`}>{ticket.sla}</div>
        <div className="flex items-center justify-end gap-1.5 mt-1">
          <span className={`badge ${ticket.subStatus === 'Unattended' ? 'badge-medium' : 'badge-low'}`} style={{ fontSize: 9 }}>
            {ticket.subStatus}
          </span>
          <span className="badge badge-pending" style={{ fontSize: 9 }}>PENDING</span>
          <span className="text-xs text-gray-400">{ticket.date}</span>
        </div>
      </div>
    </div>
  );
}
