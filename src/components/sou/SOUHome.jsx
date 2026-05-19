import SOULayout from './SOULayout';

export default function SOUHome({ onNavigate }) {
  const cards = [
    { icon: '🔧', title: 'Raise Service Request', desc: 'Create installation, repair, or support request for customer', action: 'raise-sr', color: '#dbeafe', border: '#93c5fd' },
    { icon: '📋', title: 'Track Service Request', desc: 'View status, engineer details, and appointment info', action: 'track-sr', color: '#d1fae5', border: '#6ee7b7' },
    { icon: '⚠️', title: 'Raise Complaint', desc: 'Log a digital complaint against a service order', action: 'raise-complaint', color: '#fee2e2', border: '#fca5a5' },
    { icon: '🔍', title: 'Track Complaint', desc: 'Track complaint status and lifecycle', action: 'track-complaint', color: '#fef3c7', border: '#fcd34d' },
  ];

  return (
    <SOULayout>
      <div className="sou-body">
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="text-center mb-8 pt-4">
            <h1 className="font-bold text-gray-800 mb-2" style={{ fontSize: 22 }}>Service Order Utility</h1>
            <p className="text-gray-500 text-sm">Manage service requests and complaints without SAP CRM access</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {cards.map(c => (
              <div
                key={c.action}
                className="card cursor-pointer hover:shadow-lg transition-shadow"
                style={{ border: `1.5px solid ${c.border}`, background: c.color }}
                onClick={() => onNavigate(c.action)}
              >
                <div className="card-body" style={{ padding: '24px' }}>
                  <div className="text-3xl mb-3">{c.icon}</div>
                  <div className="font-bold text-gray-800 mb-1" style={{ fontSize: 15 }}>{c.title}</div>
                  <div className="text-gray-600 text-sm">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent SOs quick strip */}
          <div className="card mt-6">
            <div className="card-title text-sm">Recent Service Orders</div>
            <div style={{ padding: '0 4px 4px' }}>
              {[
                { id: '86379827', name: 'Gajendiran Perumal', product: 'Godrej 7KG Washing Machine', status: 'In Progress', date: '28-Apr-2024' },
                { id: '86379901', name: 'Abhilash Asolkar', product: 'Bluestar 2T Split AC', status: 'Assigned', date: '16-May-2026' },
              ].map(so => (
                <div key={so.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer rounded" onClick={() => onNavigate('so-detail', so.id)}>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">🔧</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">SO #{so.id}</div>
                    <div className="text-xs text-gray-500">{so.name} · {so.product}</div>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold text-xs ${so.status === 'In Progress' ? 'status-inprogress' : 'status-assigned'}`}>{so.status}</span>
                    <div className="text-xs text-gray-400">{so.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SOULayout>
  );
}
