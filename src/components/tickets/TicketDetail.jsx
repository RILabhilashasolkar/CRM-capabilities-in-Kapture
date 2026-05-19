import { useState } from 'react';
import { ArrowLeft, Phone, Mail, MessageSquare, ChevronDown, ChevronUp, Tag, Edit2, Plus } from 'lucide-react';
import { customerOrders, customers } from '../../data/dummyData';

export default function TicketDetail({ ticket, onBack }) {
  const customer = customers[ticket.phone] || {
    name: ticket.customer,
    code: 'N/A',
    email: 'N/A',
    phone: ticket.phone,
  };
  const orders = customerOrders[ticket.phone] || [];

  const [orderExpanded, setOrderExpanded] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [custInfoOpen, setCustInfoOpen] = useState(false);
  const [ticketInfoOpen, setTicketInfoOpen] = useState(false);

  return (
    <div className="flex h-full">
      {/* Left: Order info panel */}
      <div className="flex-1 overflow-y-auto border-r border-gray-200">
        {/* Back + title */}
        <div className="k-header flex items-center gap-2 px-4 py-2 border-b border-gray-200">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-800">
            <ArrowLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-gray-700">Add Ticket</span>
        </div>

        <div className="p-4">
          {/* Customer Details */}
          <div className="section-accordion card mb-3">
            <div className="accordion-header">
              <span>Customer Details</span>
              <div className="flex items-center gap-2">
                <Plus size={13} className="text-blue-500" />
                <ChevronDown size={14} />
              </div>
            </div>
            <div className="kv-grid">
              <div className="kv-item"><div className="kv-label">Customer Name</div><div className="kv-value">{customer.name}</div></div>
              <div className="kv-item"><div className="kv-label">Customer Code</div><div className="kv-value">{customer.code}</div></div>
              <div className="kv-item"><div className="kv-label">Customer Email</div><div className="kv-value">{customer.email}</div></div>
              <div className="kv-item"><div className="kv-label">Customer Phone</div><div className="kv-value">{customer.phone}</div></div>
            </div>
          </div>

          {/* Order Details */}
          <div className="card mb-3">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <button className="btn-secondary btn-sm flex items-center gap-1">
                  <Tag size={11} /> SEARCH ORDERS
                </button>
              </div>
            </div>
            <div className="p-3">
              <div className="text-sm font-semibold text-gray-700 mb-2">Order Details</div>
              <div className="flex items-center gap-2 mb-3">
                <select className="form-select" style={{ width: 140 }}>
                  <option>Select Search Type</option>
                  <option>Order ID</option>
                  <option>Phone Number</option>
                </select>
                <input className="form-input" style={{ width: 160 }} placeholder="Order ID" />
                <button className="btn-primary btn-sm">SEARCH</button>
                <button className="btn-secondary btn-sm">RESET</button>
                <div className="ml-auto flex items-center gap-1">
                  <ChevronLeft_ />
                  <span className="text-xs text-gray-500">{orders.length}</span>
                  <ChevronRight_ />
                </div>
              </div>

              {orders.map(order => (
                <div
                  key={order.orderId}
                  className={`card mb-2 cursor-pointer hover:border-blue-300 transition-colors ${selectedOrder?.orderId === order.orderId ? 'border-blue-400 ring-1 ring-blue-200' : ''}`}
                  onClick={() => setSelectedOrder(selectedOrder?.orderId === order.orderId ? null : order)}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-xs text-blue-700">Order # {order.orderId}</div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                          <span>{customer.phone}</span>
                          <span>·</span>
                          <span>{order.orderId}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{order.orderDate}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedOrder?.orderId === order.orderId && (
                          <button className="btn-primary btn-sm">Tag Order</button>
                        )}
                        <span className={`badge ${order.status === 'Delivered' ? 'badge-low' : 'badge-pending'}`}>{order.status}</span>
                      </div>
                    </div>

                    {selectedOrder?.orderId === order.orderId && (
                      <div className="mt-3">
                        <ProductTable products={order.products} />
                        <OrderInfo order={order} />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <div className="text-center py-4 text-gray-400 text-xs">No orders found for this customer</div>
              )}
            </div>
          </div>

          {/* Add Ticket Details */}
          <div className="card">
            <div className="card-header">Add Ticket Details</div>
            <div className="p-3">
              <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-2 rounded mb-3">
                Click on selected folder level to remove it.
              </div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs text-gray-500">Type: Call</span>
                <span className="text-xs text-gray-400">›</span>
                <span className="text-xs text-gray-500">Source: RD.IN</span>
                <span className="text-xs text-gray-400">›</span>
                <span className="text-xs text-gray-500">Issue Type: Request</span>
                <span className="text-xs text-gray-400">›</span>
                <span className="text-xs font-medium text-gray-700">Demo & Installation</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {['Demo(Home Delivery)', 'Std. Installation', 'Uninstallation pending'].map(f => (
                  <span key={f} className="tag">{f}</span>
                ))}
              </div>
              <div className="mb-3">
                <label className="form-label">Title *</label>
                <input className="form-input" placeholder="Enter the Title" defaultValue={ticket.title} />
              </div>
              <div className="mb-4">
                <label className="form-label">Assigned To</label>
                <input className="form-input" defaultValue="Abhilash Asolkar (Me)" readOnly />
              </div>
              <button className="btn-primary w-full">SUBMIT</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Details panel */}
      <div className="overflow-y-auto bg-gray-50" style={{ width: 280 }}>
        <div className="p-3">
          {/* Ticket summary card */}
          <div className="card mb-3">
            <div className="p-3">
              <div className="font-semibold text-sm text-gray-800 mb-2">{ticket.title.slice(0, 40)}</div>
              <div className="space-y-1.5">
                <KVRow label="Name" value={customer.name} />
                <KVRow label="Email" value={customer.email} />
                <KVRow label="Phone" value={customer.phone} icon={<Phone size={11} />} />
                <KVRow label="Ticket ID" value={ticket.id} />
                <KVRow label="Priority" value={ticket.priority || '—'} />
                <div className="flex gap-2 text-xs">
                  <span className="text-gray-500 w-20 flex-shrink-0">Status</span>
                  <span className="text-orange-600 font-semibold flex items-center gap-1">
                    Pending <ChevronDown size={11} />
                  </span>
                </div>
                <KVRow label="Current Sub Status" value="Unattended" />
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <AccordionPanel
            title="Customer Information"
            open={custInfoOpen}
            onToggle={() => setCustInfoOpen(!custInfoOpen)}
          >
            <div className="space-y-1.5 text-xs">
              <KVRow label="Address" value={customer.addresses?.[0]?.line1 || 'N/A'} />
              <KVRow label="Customer Code" value={customer.code} />
              <KVRow label="Classification" value="N/A" />
              <KVRow label="Pin Code" value={customer.addresses?.[0]?.pincode || 'N/A'} />
            </div>
          </AccordionPanel>

          {/* Ticket Information */}
          <AccordionPanel
            title="Ticket Information"
            open={ticketInfoOpen}
            onToggle={() => setTicketInfoOpen(!ticketInfoOpen)}
          >
            <div className="space-y-1.5 text-xs">
              <KVRow label="SLA Status" value="SLA is violated" valueClass="sla-violated" />
              <KVRow label="Created Date" value={ticket.date} />
              <KVRow label="Ticket Tags" value="—" />
              <KVRow label="Reopen Count" value="0" />
              <KVRow label="Merge Count" value="0" />
              <KVRow label="City" value="N/A" />
            </div>
          </AccordionPanel>
        </div>
      </div>
    </div>
  );
}

function ProductTable({ products }) {
  return (
    <div className="mb-3">
      <div className="text-xs font-semibold text-gray-700 mb-1.5">Product Information</div>
      <table className="w-full text-xs border border-gray-200 rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-2 py-1.5 text-left text-gray-500 font-medium">SKU</th>
            <th className="px-2 py-1.5 text-left text-gray-500 font-medium">Name</th>
            <th className="px-2 py-1.5 text-right text-gray-500 font-medium">Qty</th>
            <th className="px-2 py-1.5 text-right text-gray-500 font-medium">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={i} className="border-t border-gray-100">
              <td className="px-2 py-1.5 text-gray-500">{p.sku}</td>
              <td className="px-2 py-1.5 text-gray-700 font-medium" style={{ maxWidth: 180 }}>{p.name}</td>
              <td className="px-2 py-1.5 text-right text-gray-600">{p.qty}</td>
              <td className="px-2 py-1.5 text-right text-gray-800 font-semibold">₹{p.price.toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderInfo({ order }) {
  return (
    <div className="kv-grid border border-gray-100 rounded text-xs">
      <div className="kv-item"><div className="kv-label">Status</div><div className="kv-value">{order.status}</div></div>
      <div className="kv-item"><div className="kv-label">Total Amount</div><div className="kv-value">₹{order.amount.toLocaleString('en-IN')}</div></div>
      <div className="kv-item"><div className="kv-label">Order Date</div><div className="kv-value">{order.orderDate}</div></div>
      <div className="kv-item"><div className="kv-label">Order ID</div><div className="kv-value text-blue-600">{order.orderId}</div></div>
    </div>
  );
}

function KVRow({ label, value, icon, valueClass }) {
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-gray-500 flex-shrink-0" style={{ width: 80 }}>{label}</span>
      <span className={`font-medium text-gray-800 flex items-center gap-1 ${valueClass || ''}`}>
        {icon}{value}
      </span>
    </div>
  );
}

function AccordionPanel({ title, open, onToggle, children }) {
  return (
    <div className="card mb-2">
      <div className="accordion-header" onClick={onToggle}>
        <span>{title}</span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </div>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}

function ChevronLeft_() {
  return <button className="w-5 h-5 border border-gray-200 rounded flex items-center justify-center text-gray-400 hover:bg-gray-50"><span style={{ fontSize: 10 }}>‹</span></button>;
}
function ChevronRight_() {
  return <button className="w-5 h-5 border border-gray-200 rounded flex items-center justify-center text-gray-400 hover:bg-gray-50"><span style={{ fontSize: 10 }}>›</span></button>;
}
