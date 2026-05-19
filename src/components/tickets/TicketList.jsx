import { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Plus, Mail, MoreHorizontal, Phone } from 'lucide-react';
import { tickets } from '../../data/dummyData';
import AddTicketFlow from './AddTicketFlow';
import TicketDetail from './TicketDetail';

export default function TicketList({ view }) {
  const [mode, setMode] = useState('list'); // list | add | detail
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = tickets.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.customer.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search)
  );

  if (mode === 'add') return <AddTicketFlow onBack={() => setMode('list')} />;
  if (mode === 'detail' && selectedTicket) return <TicketDetail ticket={selectedTicket} onBack={() => setMode('list')} />;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="k-top-bar gap-2 flex-shrink-0" style={{ height: 36, borderBottom: '1px solid #e2e8f0', padding: '0 10px' }}>
        <button className="btn-primary btn-sm flex items-center gap-1" style={{ borderRadius: 4, padding: '4px 10px', fontSize: 12 }} onClick={() => setMode('add')}>
          <Plus size={11} /> Add Ticket
        </button>
        <button className="btn-secondary btn-sm flex items-center gap-1" style={{ borderRadius: 4 }}>
          <Mail size={11} /> Compose Email
        </button>
        <div className="flex-1 relative" style={{ maxWidth: 240 }}>
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="form-input pl-7" style={{ height: 26, fontSize: 12, borderRadius: 4 }} placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span className="text-xs text-gray-500 ml-1">Show</span>
        <select className="form-select" style={{ width: 48, height: 26, padding: '2px 4px', fontSize: 12, borderRadius: 4 }}><option>50</option></select>
        <span className="text-xs text-gray-500">1–{filtered.length} of {filtered.length}</span>
        <button className="btn-secondary btn-sm" style={{ borderRadius: 4, padding: '3px 6px' }}><ChevronLeft size={11} /></button>
        <button className="btn-secondary btn-sm" style={{ borderRadius: 4, padding: '3px 6px' }}><ChevronRight size={11} /></button>
        <button className="btn-secondary btn-sm flex items-center gap-1" style={{ borderRadius: 4, fontSize: 11 }}><Filter size={10} /> Last Conversation</button>
        <button className="btn-secondary btn-sm" style={{ borderRadius: 4 }}><MoreHorizontal size={13} /></button>
      </div>

      {/* Ticket rows */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map(t => (
          <div key={t.id} className="ticket-row" onClick={() => { setSelectedTicket(t); setMode('detail'); }}>
            <input type="checkbox" className="mt-0.5 flex-shrink-0" style={{ width: 13, height: 13 }} onClick={e => e.stopPropagation()} />
            <span className="w-2 h-2 rounded-sm flex-shrink-0 mt-1.5" style={{ background: t.source === 'RD.IN' ? '#3b82f6' : t.source === 'JMD' ? '#8b5cf6' : '#10b981' }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="tag-chip" style={{ fontSize: 10, padding: '1px 6px' }}>{t.type}</span>
                {t.vertical === 'Complaint' && <span className="tag-chip" style={{ fontSize: 10, padding: '1px 6px', background: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b' }}>Complaint</span>}
                {t.taggedOrder && <span className="tag-chip" style={{ fontSize: 10, padding: '1px 6px', background: '#d1fae5', borderColor: '#6ee7b7', color: '#065f46' }}>Order Tagged</span>}
              </div>
              <div className="text-xs font-medium text-gray-800 leading-tight" style={{ maxWidth: 400 }}>{t.title}</div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                <span>{t.customer}</span><span>·</span><Phone size={9} /><span>{t.phone}</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{t.date}</div>
            </div>
            <div className="flex-shrink-0 text-right" style={{ minWidth: 180 }}>
              <div className="text-xs text-gray-500 truncate" style={{ maxWidth: 160 }}>{t.assignee}</div>
              <div className={`text-xs mt-0.5 ${t.sla === 'SLA is violated' ? 'sla-violated' : 'text-gray-400'}`}>{t.sla}</div>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="badge badge-pending" style={{ fontSize: 9 }}>PENDING</span>
                <span className="text-xs text-gray-400">{t.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
