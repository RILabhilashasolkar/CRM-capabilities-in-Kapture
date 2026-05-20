import { useState } from 'react';
import { ChevronUp, ChevronDown, Search, User, Truck, Calendar, ShoppingBag, Upload, Folder, X } from 'lucide-react';
import { customers, customerOrders } from '../../data/dummyData';

// Folder tree matching real Kapture
const FOLDER_TREE = {
  types: ['Call', 'Email', 'Chat', 'Social'],
  sources: { Call: ['RD.IN', 'JMD', 'Reliance One'], Email: ['RD.IN', 'JMD'], Chat: ['Website'], Social: ['Facebook', 'Twitter'] },
  issueTypes: { 'RD.IN': ['Request', 'Complaint', 'Enquiry'], JMD: ['Request', 'Complaint'], 'Reliance One': ['Request'], Website: ['Enquiry'], Facebook: ['Complaint'], Twitter: ['Complaint'] },
  complexities: {
    Request: ['Demo & Installation', 'Repair Related', 'Refund Related', 'AMC Related', 'PMS Related'],
    Complaint: ['Service Quality', 'Engineer No-Show', 'Billing Issue', 'Product Issue', 'Delayed Service'],
    Enquiry: ['Product Info', 'Warranty Info', 'Order Status', 'Service Status'],
  },
  subFolders: {
    'Demo & Installation': ['Demo(Home Delivery)', 'Std. Installation', 'Uninstallation pending'],
    'Repair Related': ['AC Not Cooling', 'Washing Machine Issue', 'Refrigerator Issue', 'TV Issue'],
    'Refund Related': ['Full Refund', 'Partial Refund', 'Refund Delay'],
    'AMC Related': ['AMC Renewal', 'AMC Claim'],
    'PMS Related': ['PMS Scheduling', 'PMS Quality'],
    'Service Quality': ['Poor Workmanship', 'Repeated Issue'],
    'Engineer No-Show': ['No-Show', 'Late Arrival'],
    'Billing Issue': ['Extra Charges', 'Wrong Invoice'],
    'Product Issue': ['DOA', 'Manufacturing Defect'],
    'Delayed Service': ['SLA Breach', 'No Response'],
    'Product Info': ['Specifications', 'Availability'],
    'Warranty Info': ['Warranty Period', 'Warranty Claim'],
    'Order Status': ['Delivery Status', 'Return Status'],
    'Service Status': ['SR Status', 'Complaint Status'],
  },
};

export default function AddTicketFlow({ onBack }) {
  const [step, setStep] = useState('search'); // 'search' | 'orders' | 'create'

  // Search form state
  const [form, setForm] = useState({ customer: '', name: '', phone: '', email: '', customerCode: '', orderId: '', erpOrderId: '', company: '' });
  const [searchSectionOpen, setSearchSectionOpen] = useState(true);
  const [searchError, setSearchError] = useState('');

  // Customer + orders state
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customerOpen, setCustomerOpen] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [openAccordions, setOpenAccordions] = useState({});
  const [taggedOrder, setTaggedOrder] = useState(null);
  const [taggedProduct, setTaggedProduct] = useState(null);
  const [selectedProductSku, setSelectedProductSku] = useState(null);
  const [orderFilterId, setOrderFilterId] = useState('');

  // Folder + ticket state
  const [selType, setSelType] = useState('');
  const [selSource, setSelSource] = useState('');
  const [selIssue, setSelIssue] = useState('');
  const [selComplexity, setSelComplexity] = useState('');
  const [selSubFolder, setSelSubFolder] = useState('');
  const [title, setTitle] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // ── Search ──────────────────────────────────────────────────────────────
  const handleSearch = () => {
    let cust = null, ords = [], phone = '';
    const q = form.phone || form.customer;
    if (q && customers[q]) { cust = customers[q]; ords = customerOrders[q] || []; phone = q; }
    else if (form.customerCode) {
      Object.entries(customers).forEach(([p, c]) => { if (c.code === form.customerCode) { cust = c; ords = customerOrders[p] || []; phone = p; } });
    } else if (form.name) {
      Object.entries(customers).forEach(([p, c]) => { if (c.name.toLowerCase().includes(form.name.toLowerCase())) { cust = c; ords = customerOrders[p] || []; phone = p; } });
    }
    if (!cust) { setSearchError('No customer found. Try phone: 9916265181 or 9689808472'); return; }
    setFoundCustomer(cust);
    setOrders(ords);
    setSearchError('');
    setStep('orders');
  };

  // ── Tag Order ────────────────────────────────────────────────────────────
  const handleTagOrder = (order) => {
    const prod = order.products.find(p => p.sku === selectedProductSku) || order.products.find(p => p.family !== 'Service');
    setTaggedOrder(order);
    setTaggedProduct(prod);
    setTitle(prod ? `${prod.name} – ${prod.family} issue` : `Order ${order.orderId}`);
    setStep('create');
  };

  const toggleAccordion = (key) => setOpenAccordions(p => ({ ...p, [key]: !p[key] }));

  const filteredOrders = orderFilterId ? orders.filter(o => o.orderId.toLowerCase().includes(orderFilterId.toLowerCase())) : orders;

  // ── Success ──────────────────────────────────────────────────────────────
  if (submitted) {
    const ticketId = `TKT-${Math.floor(7800 + Math.random() * 999)}`;
    return (
      <div className="at-wrapper">
        <div className="at-header">
          <button className="at-back-btn" onClick={onBack}>‹</button>
          <span className="at-title">Add Ticket</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#16a34a' }}>✓</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e' }}>Ticket Created Successfully</div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>Ticket ID: <strong>{ticketId}</strong></div>
          {taggedOrder && <div style={{ fontSize: 12.5, color: '#6b7280' }}>Order <strong>{taggedOrder.orderId}</strong> tagged to ticket</div>}
          <button className="kap-search-attach" style={{ marginTop: 8, maxWidth: 200 }} onClick={onBack}>BACK TO TICKETS</button>
        </div>
      </div>
    );
  }

  // ── STEP: search ─────────────────────────────────────────────────────────
  if (step === 'search') {
    return (
      <div className="at-wrapper">
        <div className="at-header">
          <button className="at-back-btn" onClick={onBack}>‹</button>
          <span className="at-title">Add Ticket</span>
        </div>
        <div className="at-body">
          {/* Search Customer Form */}
          <div className="kap-section">
            <div className="kap-section-hdr" onClick={() => setSearchSectionOpen(p => !p)}>
              <span className="kap-section-title">Search Customer Form</span>
              {searchSectionOpen ? <ChevronUp size={16} color="#2563eb" /> : <ChevronDown size={16} color="#6b7280" />}
            </div>
            {searchSectionOpen && (
              <div style={{ paddingBottom: 16 }}>
                <div className="kap-form-grid">
                  {[
                    ['customer', 'Customer'],
                    ['name', 'Name'],
                    ['phone', 'Phone'],
                    ['email', 'Email'],
                    ['customerCode', 'Customer Code'],
                    ['orderId', 'Order ID'],
                    ['erpOrderId', 'ERP Order ID'],
                    ['company', 'Company Name'],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="kap-label">{label}</label>
                      <input
                        className="kap-input"
                        placeholder={`Enter ${label}`}
                        value={form[key]}
                        onChange={e => setF(key, e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                  ))}
                </div>
                {searchError && <div style={{ color: '#dc2626', fontSize: 12, marginBottom: 8 }}>{searchError}</div>}
                <button className="kap-search-attach" onClick={handleSearch}>SEARCH AND ATTACH</button>
              </div>
            )}
          </div>

          {/* Add Ticket Details (folder picker visible always) */}
          <div className="kap-section" style={{ borderBottom: 'none' }}>
            <div className="kap-section-hdr">
              <span className="kap-section-title">Add Ticket Details</span>
            </div>
            <div style={{ paddingBottom: 16 }}>
              <div className="kap-folder-info">
                <span>ⓘ Click on selected folder level to remove it.</span>
                <X size={14} style={{ cursor: 'pointer', color: '#6b7280' }} />
              </div>
              <div className="kap-folder-path-wrap">
                <Folder size={13} color="#6b7280" />
                <span className="kap-folder-sep">›</span>
                <span style={{ color: '#9ca3af', fontSize: 12 }}>Search By Folder</span>
                <X size={13} color="#9ca3af" style={{ marginLeft: 'auto', cursor: 'pointer' }} />
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', padding: '8px 0' }}>Search for a customer first to create ticket</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP: orders ─────────────────────────────────────────────────────────
  if (step === 'orders') {
    return (
      <div className="at-wrapper">
        <div className="at-header">
          <button className="at-back-btn" onClick={() => setStep('search')}>‹</button>
          <span className="at-title">Add Ticket</span>
        </div>
        <div className="at-body">
          {/* Customer Details */}
          <div className="kap-cust-card">
            <div className="kap-cust-card-hdr" onClick={() => setCustomerOpen(p => !p)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="kap-cust-icon"><User size={14} color="#2563eb" /></div>
                <span className="kap-cust-card-title">Customer Details</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={14} color="#9ca3af" />
                {customerOpen ? <ChevronUp size={15} color="#6b7280" /> : <ChevronDown size={15} color="#6b7280" />}
              </div>
            </div>
            {customerOpen && foundCustomer && (
              <div style={{ padding: '0 16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 0' }}>
                {[
                  ['Customer Name', foundCustomer.name],
                  ['Customer Code', foundCustomer.code],
                  ['Customer Email', foundCustomer.email],
                  ['Customer Phone', foundCustomer.phone],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '3px 0' }}>
                    <span style={{ color: '#6b7280' }}>{label}</span>
                    <span style={{ color: '#1a1a2e', fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Orders bar */}
          <button className="kap-search-orders-btn">
            <Search size={13} /> SEARCH ORDERS
          </button>

          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Order Details</div>

          <div className="kap-order-filter-row">
            <select className="kap-select-sm" style={{ minWidth: 140 }}>
              <option>Select Search Type</option>
              <option>Order ID</option>
              <option>Product SKU</option>
            </select>
            <input className="kap-input" style={{ maxWidth: 200 }} placeholder="Order ID" value={orderFilterId} onChange={e => setOrderFilterId(e.target.value)} />
            <button className="kap-search-btn-sm">SEARCH</button>
            <button className="kap-reset-btn-sm" onClick={() => setOrderFilterId('')}>RESET</button>
            <div className="kap-pagination">
              <span>‹</span>
              <span style={{ fontWeight: 700, color: '#2563eb', padding: '0 4px' }}>{filteredOrders.length}</span>
              <span>›</span>
            </div>
          </div>

          {/* Order cards */}
          {filteredOrders.length === 0 && (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: 24, fontSize: 13 }}>No orders found</div>
          )}

          {filteredOrders.map(order => {
            const isExpanded = expandedOrderId === order.orderId;
            const mainProducts = order.products.filter(p => p.family !== 'Service');
            const prodInfoOpen = openAccordions[`prod-${order.orderId}`];
            const orderInfoOpen = openAccordions[`info-${order.orderId}`];
            const deliveryOpen = openAccordions[`delivery-${order.orderId}`];
            const trackingOpen = openAccordions[`tracking-${order.orderId}`];

            return (
              <div key={order.orderId} className="kap-order-card">
                {/* Card header */}
                <div className="kap-order-card-hdr" onClick={() => setExpandedOrderId(isExpanded ? null : order.orderId)}>
                  <span className="kap-order-num">Order # {order.orderId}</span>
                  {isExpanded && <X size={14} color="#6b7280" onClick={e => { e.stopPropagation(); setExpandedOrderId(null); }} />}
                </div>

                <div className="kap-order-body">
                  <div className="kap-order-meta">
                    <span className="kap-order-meta-item"><User size={12} color="#9ca3af" /> {foundCustomer?.phone}</span>
                    <span className="kap-order-meta-item"><Truck size={12} color="#9ca3af" /> {order.orderId}</span>
                  </div>
                  <div className="kap-order-meta">
                    <span className="kap-order-meta-item"><Calendar size={12} color="#9ca3af" /> {order.orderDate}</span>
                    <span className="kap-order-meta-item"><Calendar size={12} color="#9ca3af" /> N/a</span>
                  </div>
                  <div className="kap-order-meta">
                    <span className="kap-order-meta-item"><ShoppingBag size={12} color="#9ca3af" /> {order.products.length}</span>
                    <span className="kap-badge-purchase">Purchase Date</span>
                    <span className="kap-badge-delivered">{order.status}</span>
                  </div>
                  <div className="kap-offline-tag">OFFLINE</div>
                </div>

                {isExpanded && (
                  <>
                    {/* Product Information accordion */}
                    <div className="kap-accordion">
                      <div className="kap-accordion-hdr" onClick={() => toggleAccordion(`prod-${order.orderId}`)}>
                        <span className="kap-accordion-title">Product Information</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <button className="kap-tag-order-btn" onClick={e => { e.stopPropagation(); handleTagOrder(order); }}>Tag Order</button>
                          {prodInfoOpen ? <ChevronUp size={14} color="#9ca3af" /> : <ChevronDown size={14} color="#9ca3af" />}
                        </div>
                      </div>
                      {prodInfoOpen !== false && (
                        <div className="kap-accordion-body" style={{ padding: 0 }}>
                          <table className="kap-prod-table">
                            <thead>
                              <tr>
                                <th style={{ width: 36 }}></th>
                                <th style={{ width: 44 }}></th>
                                <th>SKU</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Selling Price</th>
                                <th>Delivery Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.products.map(p => (
                                <tr key={p.sku} style={{ background: selectedProductSku === p.sku ? '#eff6ff' : 'white' }}>
                                  <td>
                                    <input type="checkbox" checked={selectedProductSku === p.sku}
                                      onChange={() => setSelectedProductSku(selectedProductSku === p.sku ? null : p.sku)} />
                                  </td>
                                  <td>
                                    <div style={{ width: 32, height: 32, background: '#f3f4f6', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#9ca3af' }}>IMG</div>
                                  </td>
                                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.sku}</td>
                                  <td style={{ maxWidth: 260 }}>
                                    <div style={{ fontSize: 12.5 }}>{p.name}</div>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>{p.qty}</td>
                                  <td style={{ fontWeight: 600 }}>{p.price.toLocaleString('en-IN')}</td>
                                  <td style={{ fontSize: 12, color: '#6b7280' }}>OFFLINE</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Order Info accordion */}
                    <div className="kap-accordion">
                      <div className="kap-accordion-hdr" onClick={() => toggleAccordion(`info-${order.orderId}`)}>
                        <span className="kap-accordion-title">Order Info</span>
                        {orderInfoOpen ? <ChevronUp size={14} color="#9ca3af" /> : <ChevronDown size={14} color="#9ca3af" />}
                      </div>
                      {orderInfoOpen && (
                        <div className="kap-accordion-body">
                          <div className="kap-fields-grid">
                            {[
                              ['Status', order.status], ['Order Type', 'OFFLINE'], ['Mid', 'N/A'],
                              ['Source', 'Nucleus'], ['Vertical', 'OFFLINE'], ['Order Id', order.orderId],
                              ['Shipment Id', order.orderId], ['Customer Id', foundCustomer?.code],
                              ['Go Green', 'false'], ['Total Price', `₹${order.amount.toLocaleString('en-IN')}`],
                              ['Invoice Amt', `₹${order.amount.toLocaleString('en-IN')}`], ['Channel Type', 'RD'],
                            ].map(([l, v]) => (
                              <div key={l} className="kap-field-item">
                                <div className="kap-field-label">{l}</div>
                                <div className="kap-field-value">{v}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delivery Details */}
                    <div className="kap-accordion">
                      <div className="kap-accordion-hdr" onClick={() => toggleAccordion(`delivery-${order.orderId}`)}>
                        <span className="kap-accordion-title">Delivery Details</span>
                        {deliveryOpen ? <ChevronUp size={14} color="#9ca3af" /> : <ChevronDown size={14} color="#9ca3af" />}
                      </div>
                      {deliveryOpen && (
                        <div className="kap-accordion-body">
                          <div className="kap-fields-grid">
                            <div className="kap-field-item"><div className="kap-field-label">Phone</div><div className="kap-field-value">{foundCustomer?.phone}</div></div>
                            <div className="kap-field-item"><div className="kap-field-label">Address</div><div className="kap-field-value">{foundCustomer?.addresses?.[0]?.city}, {foundCustomer?.addresses?.[0]?.state}</div></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tracking List */}
                    <div className="kap-accordion">
                      <div className="kap-accordion-hdr" onClick={() => toggleAccordion(`tracking-${order.orderId}`)}>
                        <span className="kap-accordion-title">Tracking List</span>
                        {trackingOpen ? <ChevronUp size={14} color="#9ca3af" /> : <ChevronDown size={14} color="#9ca3af" />}
                      </div>
                      {trackingOpen && (
                        <div className="kap-accordion-body">
                          <div className="kap-fields-grid">
                            <div className="kap-field-item"><div className="kap-field-label">Status</div><div className="kap-field-value">{order.status}</div></div>
                            <div className="kap-field-item"><div className="kap-field-label">Date</div><div className="kap-field-value">{order.orderDate}</div></div>
                            <div className="kap-field-item"><div className="kap-field-label">Is Current</div><div className="kap-field-value">true</div></div>
                            <div className="kap-field-item"><div className="kap-field-label">Is Passed</div><div className="kap-field-value">false</div></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment + Refund */}
                    {['Payment Details', 'Refund Details'].map(label => (
                      <div key={label} className="kap-accordion">
                        <div className="kap-accordion-hdr" onClick={() => toggleAccordion(`${label}-${order.orderId}`)}>
                          <span className="kap-accordion-title">{label}</span>
                          {openAccordions[`${label}-${order.orderId}`] ? <ChevronUp size={14} color="#9ca3af" /> : <ChevronDown size={14} color="#9ca3af" />}
                        </div>
                        {openAccordions[`${label}-${order.orderId}`] && (
                          <div className="kap-accordion-body">
                            <div style={{ color: '#9ca3af', fontSize: 12, textAlign: 'center' }}>No {label.toLowerCase()} available</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}

          {/* Add Ticket Details section */}
          <div className="kap-section" style={{ borderBottom: 'none', marginTop: 8 }}>
            <div className="kap-section-hdr">
              <span className="kap-section-title">Add Ticket Details</span>
            </div>
            <div style={{ paddingBottom: 16, color: '#6b7280', fontSize: 12.5 }}>
              Select an order above and click <strong>Tag Order</strong> to continue
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP: create ─────────────────────────────────────────────────────────
  const sources = selType ? (FOLDER_TREE.sources[selType] || []) : [];
  const issueTypes = selSource ? (FOLDER_TREE.issueTypes[selSource] || []) : [];
  const complexities = selIssue ? (FOLDER_TREE.complexities[selIssue] || []) : [];
  const subFolders = selComplexity ? (FOLDER_TREE.subFolders[selComplexity] || []) : [];

  const folderPath = [
    selType && { label: 'Type', value: selType, clear: () => { setSelType(''); setSelSource(''); setSelIssue(''); setSelComplexity(''); setSelSubFolder(''); } },
    selSource && { label: 'Source', value: selSource, clear: () => { setSelSource(''); setSelIssue(''); setSelComplexity(''); setSelSubFolder(''); } },
    selIssue && { label: 'Issue Type', value: selIssue, clear: () => { setSelIssue(''); setSelComplexity(''); setSelSubFolder(''); } },
    selComplexity && { label: 'Complexity', value: selComplexity, clear: () => { setSelComplexity(''); setSelSubFolder(''); } },
    selSubFolder && { label: '', value: selSubFolder, clear: () => setSelSubFolder('') },
  ].filter(Boolean);

  const currentLevel = !selType ? 'type' : !selSource ? 'source' : !selIssue ? 'issue' : !selComplexity ? 'complexity' : !selSubFolder ? 'subfolder' : 'done';
  const currentOptions = currentLevel === 'type' ? FOLDER_TREE.types : currentLevel === 'source' ? sources : currentLevel === 'issue' ? issueTypes : currentLevel === 'complexity' ? complexities : subFolders;

  return (
    <div className="at-wrapper">
      <div className="at-header">
        <button className="at-back-btn" onClick={() => setStep('orders')}>‹</button>
        <span className="at-title">Add Ticket</span>
      </div>
      <div className="at-body">
        {/* Tagged order summary */}
        {taggedOrder && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 12.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#6b7280' }}>Tagged Order: </span>
              <strong style={{ color: '#2563eb' }}>{taggedOrder.orderId}</strong>
              {taggedProduct && <span style={{ color: '#374151' }}> · {taggedProduct.name}</span>}
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }} onClick={() => setStep('orders')}><X size={14} /></button>
          </div>
        )}

        {/* Add Ticket Details */}
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>Add Ticket Details</div>

        <div className="kap-folder-info">
          <span>ⓘ Click on selected folder level to remove it.</span>
          <X size={14} style={{ cursor: 'pointer', color: '#6b7280' }} />
        </div>

        {/* Folder path */}
        <div className="kap-folder-path-wrap">
          <Folder size={13} color="#6b7280" />
          {folderPath.length === 0 ? (
            <>
              <span className="kap-folder-sep">›</span>
              <span style={{ color: '#9ca3af', fontSize: 12 }}>Search By Folder</span>
            </>
          ) : (
            folderPath.map((seg, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span className="kap-folder-sep">›</span>
                <span style={{ fontSize: 12, color: '#374151' }}>{seg.label && `${seg.label} › `}</span>
                <span className="kap-folder-path-seg active" onClick={seg.clear}>{seg.value}</span>
              </span>
            ))
          )}
          <X size={13} color="#9ca3af" style={{ marginLeft: 'auto', cursor: 'pointer' }}
            onClick={() => { setSelType(''); setSelSource(''); setSelIssue(''); setSelComplexity(''); setSelSubFolder(''); }} />
        </div>

        {/* Current level chips */}
        {currentLevel !== 'done' && currentOptions.length > 0 && (
          <>
            <div style={{ fontSize: 11.5, color: '#6b7280', marginBottom: 6, fontWeight: 600 }}>
              {currentLevel === 'type' ? 'MAIN FOLDERS' : currentLevel === 'subfolder' ? 'SUB FOLDERS' : currentLevel.toUpperCase()}
            </div>
            <div className="kap-folder-chips">
              {currentOptions.map(opt => (
                <button key={opt} className={`kap-folder-chip ${(selType === opt || selSource === opt || selIssue === opt || selComplexity === opt || selSubFolder === opt) ? 'selected' : ''}`}
                  onClick={() => {
                    if (currentLevel === 'type') setSelType(opt);
                    else if (currentLevel === 'source') setSelSource(opt);
                    else if (currentLevel === 'issue') setSelIssue(opt);
                    else if (currentLevel === 'complexity') setSelComplexity(opt);
                    else setSelSubFolder(opt);
                  }}>
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Title */}
        <div style={{ marginTop: 12, marginBottom: 10 }}>
          <label className="kap-label" style={{ fontWeight: 600, color: '#374151' }}>Title <span style={{ color: '#dc2626' }}>*</span></label>
          <input className="kap-input" placeholder="Enter the Title" value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        {/* Assigned To */}
        <div style={{ marginBottom: 12 }}>
          <label className="kap-label" style={{ fontWeight: 600, color: '#374151' }}>Assigned To</label>
          <input className="kap-input" value="Abhilash Asolkar (Me)" readOnly style={{ background: '#f9fafb', color: '#6b7280' }} />
        </div>

        {/* File upload */}
        <div className="kap-file-upload">
          <Upload size={28} color="#93c5fd" style={{ margin: '0 auto 8px' }} />
          <div style={{ color: '#2563eb', fontWeight: 500, fontSize: 13 }}>Drop file here</div>
          <div style={{ fontSize: 11.5, marginTop: 2 }}>image/* files are supported</div>
        </div>

        <button
          className="kap-submit-btn"
          disabled={!title}
          style={{ opacity: title ? 1 : 0.5 }}
          onClick={() => setSubmitted(true)}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}
