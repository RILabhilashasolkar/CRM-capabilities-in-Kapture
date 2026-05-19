import { useState } from 'react';
import { Search, Phone, User, MapPin, Package, ChevronDown, ChevronUp, ArrowRight, Wrench, Plus } from 'lucide-react';
import { customers, customerOrders, serviceOrders } from '../../data/dummyData';

export default function CustomerSearch({ onCreateServiceOrder, onViewServiceOrder }) {
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [existingSOs, setExistingSOs] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [expandedSO, setExpandedSO] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (!phone.trim()) { setError('Please enter a phone number'); return; }
    setError('');
    const found = customers[phone.trim()];
    if (found) {
      setCustomer(found);
      setOrders(customerOrders[phone.trim()] || []);
      setExistingSOs(serviceOrders.filter(so => so.customer.phone === phone.trim()));
    } else {
      setCustomer(null);
      setOrders([]);
      setExistingSOs([]);
    }
    setSearched(true);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Search bar */}
      <div className="k-header px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Wrench size={14} className="text-orange-500" />
          <span className="font-semibold text-gray-800">Search by Customer Phone Number</span>
          <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontSize: 10 }}>Recently Launched</span>
        </div>
        <div className="text-xs text-gray-500">View purchase history, service orders, and prior tickets</div>
      </div>

      <div className="p-4">
        {/* Phone search */}
        <div className="card mb-4">
          <div className="card-header">Search Customer</div>
          <div className="p-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Phone size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="form-input pl-8"
                  placeholder="Enter customer mobile number (e.g. 9689808472)"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button className="btn-primary flex items-center gap-1" onClick={handleSearch}>
                <Search size={13} /> Search
              </button>
              <button className="btn-secondary" onClick={() => { setPhone(''); setSearched(false); setCustomer(null); setError(''); }}>
                Clear
              </button>
            </div>
            {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
            <div className="mt-2 text-xs text-gray-400">
              Try: <span className="cursor-pointer text-blue-500 hover:underline" onClick={() => { setPhone('9689808472'); }}>9689808472</span>{' '}·{' '}
              <span className="cursor-pointer text-blue-500 hover:underline" onClick={() => setPhone('7791015502')}>7791015502</span>{' '}·{' '}
              <span className="cursor-pointer text-blue-500 hover:underline" onClick={() => setPhone('8800123456')}>8800123456</span>
            </div>
          </div>
        </div>

        {/* Results */}
        {searched && !customer && (
          <div className="card p-6 text-center">
            <div className="text-gray-400 text-sm mb-2">No customer found for <strong>{phone}</strong></div>
            <div className="text-xs text-gray-400 mb-3">You can create a new customer profile and proceed</div>
            <button className="btn-primary btn-sm flex items-center gap-1 mx-auto">
              <Plus size={12} /> Create New Customer
            </button>
          </div>
        )}

        {customer && (
          <>
            {/* Customer Profile */}
            <div className="card mb-4">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-blue-600" />
                  <span>Customer Profile</span>
                </div>
                <button className="btn-primary btn-sm flex items-center gap-1" onClick={() => onCreateServiceOrder(customer, null)}>
                  <Plus size={11} /> New Service Request
                </button>
              </div>
              <div className="kv-grid">
                <div className="kv-item"><div className="kv-label">Customer Name</div><div className="kv-value">{customer.name}</div></div>
                <div className="kv-item"><div className="kv-label">Customer Code</div><div className="kv-value">{customer.code}</div></div>
                <div className="kv-item"><div className="kv-label">Email</div><div className="kv-value">{customer.email}</div></div>
                <div className="kv-item"><div className="kv-label">Phone</div><div className="kv-value">{customer.phone}</div></div>
              </div>
              {/* Addresses */}
              <div className="px-3 pb-3">
                <div className="text-xs font-semibold text-gray-500 mb-1 mt-2">Addresses</div>
                {customer.addresses.map(addr => (
                  <div key={addr.id} className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 rounded p-2 mb-1">
                    <MapPin size={11} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{addr.line1}, {addr.line2}, {addr.city}, {addr.state} – {addr.pincode}</span>
                    <span className="ml-auto text-gray-400 text-xs">{addr.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Existing Service Orders */}
            {existingSOs.length > 0 && (
              <div className="card mb-4">
                <div className="card-header">
                  <div className="flex items-center gap-2">
                    <Wrench size={13} className="text-orange-500" />
                    <span>Active Service Orders ({existingSOs.length})</span>
                  </div>
                </div>
                <div className="p-2">
                  {existingSOs.map(so => (
                    <ServiceOrderRow
                      key={so.id}
                      so={so}
                      expanded={expandedSO === so.id}
                      onToggle={() => setExpandedSO(expandedSO === so.id ? null : so.id)}
                      onView={() => onViewServiceOrder(so)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Purchase / Order History */}
            <div className="card mb-4">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <Package size={13} className="text-purple-600" />
                  <span>Purchase History & Products ({orders.length} orders)</span>
                </div>
              </div>
              <div className="p-2">
                {orders.map(order => (
                  <OrderRow
                    key={order.orderId}
                    order={order}
                    customer={customer}
                    expanded={expandedOrder === order.orderId}
                    onToggle={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                    onCreateSO={(product) => onCreateServiceOrder(customer, { order, product })}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ServiceOrderRow({ so, expanded, onToggle, onView }) {
  const statusClass = {
    'New': 'so-new', 'Assigned': 'so-assigned', 'In Progress': 'so-inprogress',
    'Completed': 'so-completed', 'Cancelled': 'so-cancelled', 'On Hold': 'so-onhold',
  }[so.status] || 'so-new';

  return (
    <div className="card mb-2 overflow-visible">
      <div className="p-2.5 cursor-pointer hover:bg-gray-50" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-xs text-blue-700">{so.id}</div>
            <div className="text-xs text-gray-500">{so.type}</div>
            <div className="text-xs text-gray-400 mt-0.5">{so.product.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge ${statusClass}`}>{so.status}</span>
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </div>
        </div>

        {expanded && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <div className="kv-grid text-xs">
              <div className="kv-item"><div className="kv-label">Service Ref ID</div><div className="kv-value">{so.serviceRefId}</div></div>
              <div className="kv-item"><div className="kv-label">SAP SO No.</div><div className="kv-value">{so.sapServiceOrderNo}</div></div>
              <div className="kv-item"><div className="kv-label">Created</div><div className="kv-value">{so.createdDate}</div></div>
              <div className="kv-item"><div className="kv-label">Est. TAT</div><div className="kv-value">{so.estimatedTAT}</div></div>
              <div className="kv-item"><div className="kv-label">Engineer</div><div className="kv-value">{so.engineer.name}</div></div>
              <div className="kv-item"><div className="kv-label">Appointment</div><div className="kv-value">{so.appointmentDate}</div></div>
            </div>
            <button className="btn-primary btn-sm mt-2 flex items-center gap-1" onClick={(e) => { e.stopPropagation(); onView(); }}>
              View Full Details <ArrowRight size={11} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderRow({ order, customer, expanded, onToggle, onCreateSO }) {
  return (
    <div className="card mb-2">
      <div className="p-2.5 cursor-pointer hover:bg-gray-50" onClick={onToggle}>
        <div className="flex items-start justify-between">
          <div>
            <div className="font-semibold text-xs text-blue-700">Order # {order.orderId}</div>
            <div className="text-xs text-gray-500 mt-0.5">{order.orderDate} · {order.products.length} item(s)</div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge ${order.status === 'Delivered' ? 'badge-low' : 'badge-pending'}`}>{order.status}</span>
            <span className="text-xs font-semibold text-gray-700">₹{order.amount.toLocaleString('en-IN')}</span>
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </div>
        </div>

        {expanded && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <div className="text-xs font-semibold text-gray-600 mb-2">Products</div>
            {order.products.map((p, i) => (
              <div key={i} className="flex items-start justify-between bg-gray-50 rounded p-2 mb-1.5">
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    SKU: {p.sku} · Serial: {p.serialNo} · Object ID: {p.objectId}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge ${p.warranty === 'In Warranty' ? 'badge-low' : 'badge-high'}`} style={{ fontSize: 9 }}>
                      {p.warranty}
                    </span>
                    {p.warrantyEnd !== 'N/A' && (
                      <span className="text-xs text-gray-400">Warranty until {p.warrantyEnd}</span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-xs font-semibold text-gray-700">₹{p.price.toLocaleString('en-IN')}</div>
                  {p.objectId !== 'N/A' && (
                    <button
                      className="btn-primary btn-sm mt-1 flex items-center gap-1"
                      onClick={(e) => { e.stopPropagation(); onCreateSO(p); }}
                    >
                      <Wrench size={10} /> Raise SR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
