import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Phone, Mail } from 'lucide-react';
import { customers, customerOrders } from '../../data/dummyData';

export default function TicketDetail({ ticket, onBack }) {
  const customer = customers[ticket.phone] || { name: ticket.customer, code: 'N/A', email: 'N/A', phone: ticket.phone, addresses: [] };
  const orders = customerOrders[ticket.phone] || [];
  const taggedOrder = ticket.taggedOrder ? orders.find(o => o.orderId === ticket.taggedOrder) : null;
  const [tab, setTab] = useState('info');
  const [prodInfoOpen, setProdInfoOpen] = useState(true);
  const [orderInfoOpen, setOrderInfoOpen] = useState(true);
  const [custInfoOpen, setCustInfoOpen] = useState(false);
  const [ticketInfoOpen, setTicketInfoOpen] = useState(false);

  return (
    <div className="flex h-full">
      {/* Left panel */}
      <div className="flex-1 overflow-y-auto border-r border-gray-200">
        <div className="k-top-bar gap-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-sm">
            <ArrowLeft size={14} /> Assigned To Me
          </button>
        </div>

        {/* Tab bar */}
        <div className="tab-bar" style={{ padding: '0 16px' }}>
          {['info', 'orders', 'timeline', 'attachments'].map(t => (
            <div key={t} className={`tab capitalize ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t === 'orders' ? 'Orders' : t.charAt(0).toUpperCase() + t.slice(1)}</div>
          ))}
        </div>

        <div className="p-4">
          {tab === 'info' && (
            <div>
              {/* Tagged Order Details — prominent section */}
              {taggedOrder && (
                <div className="card mb-3" style={{ border: '1px solid #bae6fd', background: '#f0f9ff' }}>
                  <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid #bae6fd' }}>
                    <div className="font-semibold text-sm text-blue-800">Tagged Order Details</div>
                    <span className="badge badge-blue" style={{ fontSize: 10 }}>Order # {taggedOrder.orderId}</span>
                  </div>
                  {/* Product Information */}
                  <div className="px-4 py-2">
                    <div className="text-xs font-semibold text-gray-600 mb-1.5">Product Information</div>
                    <table className="orders-table w-full" style={{ fontSize: 12 }}>
                      <thead><tr>
                        <th>SKU</th><th>Name</th><th>Qty</th><th>Selling Price</th><th>Delivery</th>
                      </tr></thead>
                      <tbody>
                        {taggedOrder.products.map((p, i) => (
                          <tr key={i}>
                            <td className="text-gray-500">{p.sku}</td>
                            <td className="font-medium">{p.name}</td>
                            <td>{p.qty}</td>
                            <td className="font-semibold">₹{p.price.toLocaleString('en-IN')}</td>
                            <td><span className="badge badge-blue" style={{ fontSize: 9 }}>HD</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Order Info */}
                  <div className="px-4 pb-3">
                    <div className="text-xs font-semibold text-gray-600 mb-1.5 mt-2">Order Info</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        ['Status', taggedOrder.status], ['Total Price', `₹${taggedOrder.amount.toLocaleString('en-IN')}`],
                        ['Order Date', taggedOrder.orderDate], ['Order ID', taggedOrder.orderId],
                        ['Source', 'Nucleus'], ['Vertical', 'OFFLINE'],
                        ['Customer Id', customer.code], ['Shipment Id', taggedOrder.orderId],
                        ['Invoice Amt', `₹${taggedOrder.amount.toLocaleString('en-IN')}`],
                      ].map(([l, v], i) => (
                        <div key={i} className="bg-white rounded p-1.5">
                          <div style={{ color: '#9ca3af', fontSize: 10 }}>{l}</div>
                          <div className="font-semibold text-gray-700">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Information section (like screenshot) */}
              <div className="card mb-3">
                <div className="flex items-center justify-between px-4 py-2.5 cursor-pointer" onClick={() => setOrderInfoOpen(!orderInfoOpen)} style={{ borderBottom: orderInfoOpen ? '1px solid #f0f0f0' : 'none' }}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Order Information</span>
                    <span className="text-xs text-gray-400">8th May 2026, 05:56:05 pm</span>
                  </div>
                  {orderInfoOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {orderInfoOpen && (
                  <div className="grid grid-cols-3 gap-0">
                    {[
                      ['Shipment Id', ticket.phone], ['Shipment Created Time', 'N/A'], ['Status', ticket.status],
                      ['Vertical', 'OFFLINE'], ['Total Amount', 'N/A'], ['Expected Delivery Date', 'N/A'],
                      ['Source', 'Nucleus'], ['Selected Quantity', '0.0'], ['Sku Id', '581112288,581112288'],
                      ['Product Name', 'Bluestar 2 Ton 3 Star Inverter'], ['Qty', '0.0'], ['Sellingprice', 'N/A'],
                    ].map(([l, v], i) => (
                      <div key={i} className="kv-item" style={{ padding: '7px 14px', borderBottom: '1px solid #f3f4f6' }}>
                        <div className="kv-label" style={{ fontSize: 11, color: '#9ca3af' }}>{l}</div>
                        <div className="kv-value" style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ticket Additional Info */}
              <div className="card mb-3">
                <div className="flex items-center justify-between px-4 py-2.5 cursor-pointer" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Ticket Additional Info</span>
                    <span className="text-xs text-gray-400">8th May 2026, 05:56:05 pm</span>
                  </div>
                  <ChevronDown size={14} />
                </div>
                <div className="grid grid-cols-2 gap-0">
                  {[['Order Type', 'N/A'], ['PRM ID', 'N/A'], ['Is Asp', 'N/A'], ['Is B 2 B', 'N/A'], ['First Disposition Date', 'N/A'], ['First Disposition Remark', 'N/A'], ['Resolution Remarks', 'N/A']].map(([l, v], i) => (
                    <div key={i} className="kv-item" style={{ padding: '7px 14px', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{l}</div>
                      <div style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div>
              {orders.length === 0 && <div className="text-gray-400 text-sm text-center py-8">No orders linked to this customer</div>}
              {orders.map(o => (
                <div key={o.orderId} className="card mb-2">
                  <div className="card-body" style={{ padding: '12px 16px' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-sm text-blue-700">Order # {o.orderId}</div>
                      <span className="badge badge-low" style={{ fontSize: 10 }}>{o.status}</span>
                    </div>
                    {o.products.map((p, i) => (
                      <div key={i} className="text-xs text-gray-600 flex gap-2 py-0.5">
                        <span className="text-gray-400">{p.sku}</span>
                        <span className="font-medium">{p.name}</span>
                        <span className="ml-auto font-semibold">₹{p.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="overflow-y-auto bg-gray-50" style={{ width: 280 }}>
        <div className="p-3">
          {/* Ticket summary */}
          <div className="card mb-3">
            <div className="p-3">
              <div className="font-semibold text-sm text-gray-800 mb-3">{ticket.title.slice(0, 40)}</div>
              <div className="space-y-2">
                {[
                  ['Name', customer.name],
                  ['Email', customer.email],
                  ['Phone', customer.phone],
                  ['Ticket ID', ticket.id],
                  ['Priority', ticket.priority || '–'],
                ].map(([l, v]) => (
                  <div key={l} className="flex gap-2 text-xs">
                    <span className="text-gray-400 flex-shrink-0" style={{ width: 68 }}>{l}</span>
                    <span className="font-medium text-gray-800">{v}</span>
                  </div>
                ))}
                <div className="flex gap-2 text-xs">
                  <span className="text-gray-400 flex-shrink-0" style={{ width: 68 }}>Status</span>
                  <span className="font-semibold text-orange-500">Pending <ChevronDown size={11} className="inline" /></span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-gray-400 flex-shrink-0" style={{ width: 68 }}>Sub Status</span>
                  <span className="font-medium text-gray-800">Unattended</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="card mb-2">
            <div className="flex items-center justify-between px-3 py-2 cursor-pointer" onClick={() => setCustInfoOpen(!custInfoOpen)}>
              <span className="font-semibold text-xs">Customer Information</span>
              {custInfoOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
            {custInfoOpen && (
              <div className="px-3 pb-3 space-y-1">
                {[['Address', customer.addresses?.[0]?.line1 || 'N/A'], ['Customer Code', customer.code], ['Classification', 'N/A'], ['Pin Code', customer.addresses?.[0]?.pincode || 'N/A']].map(([l, v]) => (
                  <div key={l} className="flex gap-2 text-xs">
                    <span className="text-gray-400 flex-shrink-0" style={{ width: 80 }}>{l}</span>
                    <span className="font-medium text-gray-700">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ticket Information */}
          <div className="card mb-2">
            <div className="flex items-center justify-between px-3 py-2 cursor-pointer" onClick={() => setTicketInfoOpen(!ticketInfoOpen)}>
              <span className="font-semibold text-xs">Ticket Information</span>
              {ticketInfoOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
            {ticketInfoOpen && (
              <div className="px-3 pb-3 space-y-1">
                {[['SLA Status', ticket.sla], ['Created Date', ticket.date], ['Reopen Count', '0'], ['Merge Count', '0'], ['City', 'N/A']].map(([l, v]) => (
                  <div key={l} className="flex gap-2 text-xs">
                    <span className="text-gray-400 flex-shrink-0" style={{ width: 80 }}>{l}</span>
                    <span className={`font-medium ${l === 'SLA Status' && v === 'SLA is violated' ? 'text-red-600' : 'text-gray-700'}`}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
