import { useState } from 'react';
import { ArrowLeft, Search, ChevronDown, ChevronUp, ChevronRight, X } from 'lucide-react';
import { customers, customerOrders } from '../../data/dummyData';

// Step labels
const STEPS = ['Search Customer', 'Orders', 'Order Detail', 'Create Ticket'];

export default function AddTicketFlow({ onBack }) {
  const [step, setStep] = useState(0);
  const [customerQuery, setCustomerQuery] = useState({ phone: '', name: '', email: '', orderId: '' });
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketFolder, setTicketFolder] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const q = customerQuery.phone.trim();
    const c = customers[q];
    if (c) {
      setFoundCustomer(c);
      setOrders(customerOrders[q] || []);
      setNotFound(false);
      setStep(1);
    } else {
      setFoundCustomer(null);
      setNotFound(true);
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setStep(2);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setTicketTitle(`${product.name} – ${product.family} issue`);
    setStep(3);
  };

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <div className="font-bold text-lg text-gray-800 mb-1">Ticket Created!</div>
        <div className="text-sm text-gray-500 mb-2">
          {selectedOrder ? `Order #${selectedOrder.orderId} tagged to ticket` : 'Ticket created successfully'}
        </div>
        <button className="btn-primary btn-sm" style={{ borderRadius: 4 }} onClick={onBack}>Back to All Pending</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Back bar */}
      <div className="k-top-bar gap-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-sm">
          <ArrowLeft size={15} /> Add Ticket
        </button>
        {/* Step breadcrumb */}
        <div className="flex items-center gap-1 ml-4">
          {STEPS.map((s, i) => (
            <span key={s} className="flex items-center gap-1">
              <span className={`text-xs px-2 py-0.5 rounded ${i === step ? 'bg-blue-600 text-white font-medium' : i < step ? 'text-green-600' : 'text-gray-400'}`}>{i < step ? '✓ ' : ''}{s}</span>
              {i < STEPS.length - 1 && <ChevronRight size={11} className="text-gray-300" />}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Step 0: Search Customer */}
        {step === 0 && (
          <div style={{ maxWidth: 700 }}>
            <div className="font-semibold text-gray-700 mb-3">Search Customer</div>
            <div className="card">
              <div className="card-body" style={{ padding: '16px 20px' }}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="form-label">Phone</label>
                    <input className="form-input" placeholder="Enter Phone Number" value={customerQuery.phone} onChange={e => setCustomerQuery({ ...customerQuery, phone: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                  </div>
                  <div>
                    <label className="form-label">Name</label>
                    <input className="form-input" placeholder="Enter Name" value={customerQuery.name} onChange={e => setCustomerQuery({ ...customerQuery, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input className="form-input" placeholder="Enter Email Id" value={customerQuery.email} onChange={e => setCustomerQuery({ ...customerQuery, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Order ID</label>
                    <input className="form-input" placeholder="Enter Order ID" value={customerQuery.orderId} onChange={e => setCustomerQuery({ ...customerQuery, orderId: e.target.value })} />
                  </div>
                </div>
                <button className="btn-primary" style={{ borderRadius: 4 }} onClick={handleSearch}>
                  SEARCH AND ATTACH
                </button>
                {notFound && <div className="text-red-500 text-xs mt-2">No customer found. Try: 9689808472, 7791015502, 8800123456, 9916265181</div>}
                <div className="text-xs text-gray-400 mt-2">Demo: try phone <span className="cursor-pointer text-blue-500" onClick={() => setCustomerQuery({ ...customerQuery, phone: '9916265181' })}>9916265181</span> or <span className="cursor-pointer text-blue-500" onClick={() => setCustomerQuery({ ...customerQuery, phone: '9689808472' })}>9689808472</span></div>
              </div>
            </div>

            {/* Also show folder selection below */}
            <div className="card mt-4">
              <div className="text-sm font-semibold text-gray-700 px-4 pt-3 mb-2">Add Ticket Details</div>
              <div className="card-body" style={{ paddingTop: 0 }}>
                <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-2 rounded mb-3">Click on selected folder level to remove it.</div>
                <div className="mb-3">
                  <label className="form-label">Search by Folder</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['BOT', 'Brian Bade', 'Call', 'Call - New', 'CEO Escalation', 'Chat'].map(f => (
                      <span key={f} className={`tag-chip cursor-pointer ${ticketFolder === f ? 'bg-blue-100 border-blue-400' : ''}`} onClick={() => setTicketFolder(f)}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Orders List */}
        {step === 1 && foundCustomer && (
          <div style={{ maxWidth: 760 }}>
            {/* Customer summary */}
            <div className="card mb-3">
              <div className="card-body" style={{ padding: '12px 20px' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">{foundCustomer.name}</div>
                    <div className="text-xs text-gray-500">{foundCustomer.code} · {foundCustomer.email} · {foundCustomer.phone}</div>
                  </div>
                  <button className="text-xs text-blue-500" onClick={() => setStep(0)}>Change</button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="font-semibold text-gray-800">Order Details</div>
                <div className="flex items-center gap-2">
                  <select className="form-select" style={{ width: 160, height: 30, fontSize: 12, padding: '4px 8px' }}>
                    <option>Select Search Type</option><option>Order ID</option><option>Phone</option>
                  </select>
                  <input className="form-input" style={{ width: 140, height: 30, fontSize: 12 }} placeholder="Order ID" />
                  <button className="btn-primary btn-sm" style={{ borderRadius: 4 }}>SEARCH</button>
                  <button className="btn-secondary btn-sm" style={{ borderRadius: 4 }}>RESET</button>
                </div>
              </div>
              <div className="p-3">
                {orders.map(order => (
                  <div key={order.orderId} className="border border-gray-200 rounded-lg mb-2 overflow-hidden cursor-pointer hover:border-blue-300" onClick={() => handleSelectOrder(order)}>
                    <div className="p-3 flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-sm text-blue-700">Order # {order.orderId}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{foundCustomer.phone} · {order.orderId} · {order.orderDate}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{order.products.length} item(s)</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-low" style={{ fontSize: 10 }}>{order.status}</span>
                        <span className="font-semibold text-xs text-gray-700">₹{order.amount.toLocaleString('en-IN')}</span>
                        <ChevronRight size={14} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Order Detail + product selection */}
        {step === 2 && selectedOrder && (
          <div style={{ maxWidth: 760 }}>
            <div className="flex items-center gap-2 mb-3">
              <button className="text-blue-500 text-sm flex items-center gap-1" onClick={() => setStep(1)}><ArrowLeft size={14} /> Orders</button>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-gray-700 font-medium">Order # {selectedOrder.orderId}</span>
            </div>

            <div className="card mb-3">
              <div className="card-body" style={{ padding: '12px 20px' }}>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div><span className="text-gray-400">Order ID: </span><span className="font-semibold text-blue-700">{selectedOrder.orderId}</span></div>
                  <div><span className="text-gray-400">Date: </span><span className="font-semibold">{selectedOrder.orderDate}</span></div>
                  <div><span className="text-gray-400">Status: </span><span className="badge badge-low" style={{ fontSize: 10 }}>{selectedOrder.status}</span></div>
                  <div><span className="text-gray-400">Amount: </span><span className="font-semibold">₹{selectedOrder.amount.toLocaleString('en-IN')}</span></div>
                  <div><span className="text-gray-400">Source: </span><span className="font-semibold">Nucleus / OFFLINE</span></div>
                  <div><span className="text-gray-400">Customer ID: </span><span className="font-semibold">{foundCustomer?.code}</span></div>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="card mb-3">
              <div className="card-title text-sm">Product Information</div>
              <table className="orders-table w-full">
                <thead>
                  <tr>
                    <th style={{ width: 32 }}></th>
                    <th>SKU</th><th>Name</th><th>Qty</th><th>Price</th><th>Delivery Type</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.products.map((p, i) => (
                    <tr key={i} className={selectedProduct?.sku === p.sku ? 'selected' : ''} onClick={() => p.objectId !== 'N/A' && handleSelectProduct(p)}>
                      <td><input type="radio" checked={selectedProduct?.sku === p.sku} onChange={() => {}} /></td>
                      <td className="text-gray-500">{p.sku}</td>
                      <td className="font-medium text-gray-800">{p.name}</td>
                      <td>{p.qty}</td>
                      <td className="font-semibold">₹{p.price.toLocaleString('en-IN')}</td>
                      <td><span className="badge badge-blue" style={{ fontSize: 10 }}>HD</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Info accordion */}
            <OrderInfoAccordion order={selectedOrder} customer={foundCustomer} />
          </div>
        )}

        {/* Step 3: Create Ticket */}
        {step === 3 && (
          <div style={{ maxWidth: 700 }}>
            <div className="flex items-center gap-2 mb-3">
              <button className="text-blue-500 text-sm flex items-center gap-1" onClick={() => setStep(2)}><ArrowLeft size={14} /> Order Detail</button>
            </div>

            {/* Tagged order summary */}
            {selectedOrder && selectedProduct && (
              <div className="card mb-3" style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}>
                <div className="card-body" style={{ padding: '12px 20px' }}>
                  <div className="text-xs font-semibold text-blue-700 mb-1">Tagged Order Details</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><span className="text-gray-400">Order ID: </span><span className="font-semibold">{selectedOrder.orderId}</span></div>
                    <div><span className="text-gray-400">Product: </span><span className="font-semibold">{selectedProduct.name}</span></div>
                    <div><span className="text-gray-400">SKU: </span><span className="font-semibold">{selectedProduct.sku}</span></div>
                    <div><span className="text-gray-400">Serial No: </span><span className="font-semibold">{selectedProduct.serialNo}</span></div>
                    <div><span className="text-gray-400">Object ID: </span><span className="font-semibold">{selectedProduct.objectId}</span></div>
                    <div><span className="text-gray-400">Warranty: </span><span className={`font-semibold ${selectedProduct.warranty === 'Within Warranty' ? 'text-green-600' : 'text-red-600'}`}>{selectedProduct.warranty}</span></div>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-title text-sm">Add Ticket Details</div>
              <div className="card-body">
                <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-2 rounded mb-3">Click on selected folder level to remove it.</div>
                <div className="flex items-center gap-1 mb-3 text-xs flex-wrap">
                  <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Type: Call</span>
                  <ChevronRight size={11} className="text-gray-300" />
                  <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Source: RD.IN</span>
                  <ChevronRight size={11} className="text-gray-300" />
                  <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Issue Type: Request</span>
                  <ChevronRight size={11} className="text-gray-300" />
                  <span className="font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Demo & Installation</span>
                  <button className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                </div>
                <div className="flex gap-1.5 mb-4 flex-wrap">
                  {['Demo(Home Delivery)', 'Std. Installation', 'Uninstallation pending'].map(f => (
                    <span key={f} className="tag-chip cursor-pointer">{f}</span>
                  ))}
                </div>
                <div className="mb-3">
                  <label className="form-label">Title <span className="text-red-500">*</span></label>
                  <input className="form-input" placeholder="Enter the Title" value={ticketTitle} onChange={e => setTicketTitle(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label className="form-label">Assigned To</label>
                  <input className="form-input" defaultValue="Abhilash Asolkar (Me)" readOnly style={{ background: '#f9fafb' }} />
                </div>
                <div className="mb-4">
                  <label className="form-label">Attachment</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <div className="text-blue-400 text-2xl mb-1">☁</div>
                    <div className="text-sm text-gray-500">Drop file here</div>
                    <div className="text-xs text-gray-400">image/* files are supported</div>
                  </div>
                </div>
                <button className="btn-primary w-full" style={{ borderRadius: 4 }} onClick={handleSubmit} disabled={!ticketTitle}>
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderInfoAccordion({ order, customer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card mb-3">
      <div className="flex items-center justify-between px-4 py-2.5 cursor-pointer border-b border-gray-100" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-sm">Order Info</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>
      {open && (
        <div className="grid grid-cols-3 gap-0">
          {[
            ['Status', order.status], ['Secured Delivery Flag', 'N/A'], ['Refund Payment Method', 'N/A'],
            ['EDD Change Count', 'N/A'], ['Org EDD', 'N/a'], ['Total Bag Qty', 'N/A'],
            ['Kirana Store Id', 'N/A'], ['Order Type', 'OFFLINE'], ['Mid', 'N/A'],
            ['Id', order.orderId], ['Source', 'Nucleus'], ['Vertical', 'OFFLINE'],
            ['Order Id', order.orderId], ['Shipment Id', order.orderId], ['Customer Id', customer?.code || 'N/A'],
            ['Total Price', `₹${order.amount.toLocaleString('en-IN')}`], ['Order Created Time', order.orderDate], ['Invoice Amt', `₹${order.amount.toLocaleString('en-IN')}`],
          ].map(([label, value], i) => (
            <div key={i} className="kv-item text-xs" style={{ padding: '7px 14px', borderBottom: '1px solid #f3f4f6' }}>
              <div className="kv-label text-gray-400" style={{ fontSize: 11 }}>{label}</div>
              <div className="kv-value text-gray-700 font-medium">{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
