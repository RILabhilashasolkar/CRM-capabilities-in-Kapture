import { useState } from 'react';
import { ChevronUp, ChevronDown, Search, User, Truck, Calendar, ShoppingBag, Upload, Folder, X, Wrench, AlertCircle } from 'lucide-react';
import { customers, customerOrders, serviceOrders } from '../../data/dummyData';
import CRMCreateSR from '../crm/CRMCreateSR';

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

function SOStatusBadge({ status }) {
  const map = {
    'Created':     { bg: '#f3e8ff', color: '#7c3aed' },
    'Assigned':    { bg: '#dbeafe', color: '#1d4ed8' },
    'In Progress': { bg: '#fff7ed', color: '#c2410c' },
    'Completed':   { bg: '#d1fae5', color: '#065f46' },
    'Cancelled':   { bg: '#fee2e2', color: '#dc2626' },
  };
  const s = map[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

export default function AddTicketFlow({ onBack }) {
  const [step, setStep] = useState('search'); // 'search' | 'orders' | 'create' | 'createSR'

  // Search form state
  const [form, setForm] = useState({ customer: '', name: '', phone: '', email: '', customerCode: '', orderId: '', erpOrderId: '', company: '', soNumber: '' });
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

  // SO flow state (new)
  const [foundSO, setFoundSO] = useState(null);
  const [taggedSO, setTaggedSO] = useState(null);
  const [createSRFor, setCreateSRFor] = useState(null);
  const [newlyCreatedSOs, setNewlyCreatedSOs] = useState([]);
  const [srCreatedBanner, setSrCreatedBanner] = useState(null);

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
    setFoundSO(null);

    // 2c: Search by service order number
    if (form.soNumber.trim()) {
      const soNum = form.soNumber.trim();
      const so = serviceOrders.find(s =>
        s.id === soNum || s.serviceRefId === soNum ||
        s.sapServiceOrderNo.toLowerCase() === soNum.toLowerCase()
      );
      if (!so) { setSearchError(`No service order found for "${soNum}". Try: 86379827 or SR-JMD-2026-0044`); return; }
      phone = so.customer.phone;
      cust = customers[phone] || { name: so.customer.name, code: so.customer.code, email: '—', phone: so.customer.phone };
      ords = customerOrders[phone] || [];
      setFoundCustomer(cust);
      setOrders(ords);
      setFoundSO(so);
      setExpandedOrderId(so.orderId);
      setSearchError('');
      setStep('orders');
      return;
    }

    // 2a: Mobile number search (irrespective of multiple customer IDs)
    const q = form.phone || form.customer;
    if (q && customers[q]) { cust = customers[q]; ords = customerOrders[q] || []; phone = q; }
    else if (form.customerCode) {
      Object.entries(customers).forEach(([p, c]) => { if (c.code === form.customerCode) { cust = c; ords = customerOrders[p] || []; phone = p; } });
    } else if (form.name) {
      Object.entries(customers).forEach(([p, c]) => { if (c.name.toLowerCase().includes(form.name.toLowerCase())) { cust = c; ords = customerOrders[p] || []; phone = p; } });
    } else if (form.orderId) {
      // 2b: Order ID search — customer ID is the key parameter
      Object.entries(customerOrders).forEach(([p, oList]) => {
        const match = oList.find(o => o.orderId.toLowerCase() === form.orderId.toLowerCase());
        if (match) { cust = customers[p]; ords = oList; phone = p; }
      });
    }

    if (!cust) { setSearchError('No customer found. Try phone: 9916265181 or SO No: 86379827'); return; }
    setFoundCustomer(cust);
    setOrders(ords);
    setSearchError('');
    setStep('orders');
  };

  // ── Tag order → create ticket step ──────────────────────────────────────
  const handleTagOrder = (order) => {
    const prod = order.products.find(p => p.sku === selectedProductSku) || order.products.find(p => p.family !== 'Service');
    setTaggedOrder(order);
    setTaggedProduct(prod);
    setTaggedSO(null);
    setTitle(prod ? `${prod.name} – ${prod.family} issue` : `Order ${order.orderId}`);
    setStep('create');
  };

  // ── Tag SO → create ticket step (2c / 5) ────────────────────────────────
  const handleTagSO = (so) => {
    const soOrder = orders.find(o => o.orderId === so.orderId);
    const prod = soOrder?.products.find(p => p.sku === so.product?.sku) ||
      soOrder?.products.find(p => p.family !== 'Service') ||
      { name: so.product?.name || 'Product', sku: so.product?.sku || '', family: so.product?.family || '' };
    setTaggedOrder(soOrder || null);
    setTaggedProduct(prod);
    setTaggedSO(so);
    setTitle(`${so.type} – ${so.product?.name || prod.name} – Service Follow-up`);
    setStep('create');
  };

  // ── Create SR for a product (3) ──────────────────────────────────────────
  const handleCreateSRForProduct = (order, product) => {
    setCreateSRFor({ order, product });
    setStep('createSR');
  };

  // ── SR created → show banner + add to orders (4) ────────────────────────
  const handleSRSuccess = (soId) => {
    const newSO = {
      id: soId,
      sapServiceOrderNo: `SAP-SO-${Math.floor(88001000 + Math.random() * 999)}`,
      serviceRefId: `SR-NEW-${soId}`,
      type: createSRFor?.product?.family === 'Air Conditioner' ? 'Installation' : 'Repair',
      status: 'Created',
      product: { name: createSRFor?.product?.name || 'Product', sku: createSRFor?.product?.sku || '', family: createSRFor?.product?.family || '' },
      orderId: createSRFor?.order?.orderId,
      customer: foundCustomer ? { name: foundCustomer.name, phone: foundCustomer.phone, code: foundCustomer.code } : {},
      engineer: { name: 'To be assigned', phone: '—' },
      appointmentDate: 'To be scheduled',
      estimatedTAT: '3–5 business days',
      createdDate: new Date().toLocaleDateString('en-IN'),
    };
    setNewlyCreatedSOs(prev => [...prev, newSO]);
    setSrCreatedBanner(newSO);
    setExpandedOrderId(createSRFor?.order?.orderId);
    setCreateSRFor(null);
    setStep('orders');
  };

  const toggleAccordion = (key) => setOpenAccordions(p => ({ ...p, [key]: !p[key] }));

  const filteredOrders = orderFilterId ? orders.filter(o => o.orderId.toLowerCase().includes(orderFilterId.toLowerCase())) : orders;

  const customerPhone = foundCustomer?.phone;
  const allSOs = [...serviceOrders, ...newlyCreatedSOs];
  const customerSOs = allSOs.filter(so => so.customer?.phone === customerPhone);

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
          <div style={{ fontSize: 13, color: '#6b7280' }}>Ticket ID: <strong style={{ color: '#2563eb' }}>{ticketId}</strong></div>
          {taggedOrder && <div style={{ fontSize: 12.5, color: '#6b7280' }}>Order <strong>{taggedOrder.orderId}</strong> tagged to ticket</div>}

          {/* 5/6: Deep SAP CRM integration box */}
          {taggedSO && (
            <div style={{ background: '#f0f4ff', border: '1px solid #c7d2fe', borderRadius: 8, padding: '14px 18px', maxWidth: 380, width: '100%', marginTop: 4 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#3730a3', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Wrench size={13} /> Kapture ↔ SAP CRM Integration
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12.5 }}>
                {[
                  ['Service Order', `#${taggedSO.id}`, '#7c3aed'],
                  ['SAP CRM Reference', taggedSO.sapServiceOrderNo, '#3730a3'],
                  ['Service Type', taggedSO.type, ''],
                  ['Current Status', taggedSO.status, '#f97316'],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>{l}</span>
                    <strong style={{ color: c || '#1a1a2e' }}>{v}</strong>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, background: '#e0e7ff', borderRadius: 5, padding: '7px 10px', fontSize: 11.5, color: '#3730a3' }}>
                ✓ Status updates from SAP CRM will be reflected in Kapture automatically. Track from Orders &amp; Service section.
              </div>
            </div>
          )}

          <button className="kap-search-attach" style={{ marginTop: 8, maxWidth: 200 }} onClick={onBack}>BACK TO TICKETS</button>
        </div>
      </div>
    );
  }

  // ── STEP: createSR (reuse CRMCreateSR component) ─────────────────────────
  if (step === 'createSR') {
    return (
      <CRMCreateSR
        order={createSRFor?.order}
        product={createSRFor?.product}
        customer={foundCustomer}
        onBack={() => setStep('orders')}
        onSuccess={handleSRSuccess}
      />
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

                {/* 2c: Service Order search */}
                <div style={{ margin: '12px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>OR SEARCH BY SERVICE ORDER</span>
                  <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                </div>
                <div style={{ border: '1.5px solid #a78bfa', borderRadius: 6, padding: '10px 12px', background: '#faf5ff', marginBottom: 12 }}>
                  <label className="kap-label" style={{ color: '#7c3aed', fontWeight: 700 }}>Service Order No. / SR Number</label>
                  <input
                    className="kap-input"
                    style={{ borderColor: '#a78bfa', background: 'white' }}
                    placeholder="e.g. 86379827 or SR-JMD-2026-0044"
                    value={form.soNumber}
                    onChange={e => setF('soNumber', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
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

          {/* 2c: Service Order Found banner */}
          {foundSO && (
            <div style={{ background: '#fdf4ff', border: '1.5px solid #e9d5ff', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, color: '#7c3aed' }}>
                  <Wrench size={14} /> Service Order Found
                </div>
                <SOStatusBadge status={foundSO.status} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 12.5, marginBottom: 10 }}>
                {[
                  ['SO Number', `#${foundSO.id}`],
                  ['SAP Reference', foundSO.sapServiceOrderNo],
                  ['Service Type', foundSO.type],
                  ['Product', foundSO.product.name],
                  ['Engineer', foundSO.engineer.name],
                  ['Appointment', foundSO.appointmentDate],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', gap: 6 }}>
                    <span style={{ color: '#9ca3af', flexShrink: 0 }}>{l}:</span>
                    <strong style={{ color: '#3b0764' }}>{v}</strong>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  style={{ flex: 1, background: '#7c3aed', color: 'white', border: 'none', borderRadius: 6, padding: '7px 0', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => handleTagSO(foundSO)}
                >
                  Create Ticket for this Service Order
                </button>
                <button
                  style={{ background: 'white', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: 6, padding: '7px 12px', fontSize: 12.5, cursor: 'pointer' }}
                  onClick={() => setFoundSO(null)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* 4: SR Created success banner */}
          {srCreatedBanner && (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '10px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12.5 }}>
                <strong style={{ color: '#16a34a' }}>✓ Service Request Created Successfully</strong>
                <div style={{ color: '#374151', marginTop: 2 }}>
                  SO# <strong>{srCreatedBanner.id}</strong> · SAP: <strong>{srCreatedBanner.sapServiceOrderNo}</strong> · Visible in Orders &amp; Service section
                </div>
              </div>
              <X size={14} color="#9ca3af" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => setSrCreatedBanner(null)} />
            </div>
          )}

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
            const prodInfoOpen = openAccordions[`prod-${order.orderId}`];
            const orderInfoOpen = openAccordions[`info-${order.orderId}`];
            const deliveryOpen = openAccordions[`delivery-${order.orderId}`];
            const trackingOpen = openAccordions[`tracking-${order.orderId}`];
            const soSectionOpen = openAccordions[`so-${order.orderId}`] !== false;

            // 2a/2b/4: All SOs for this order (including newly created)
            const orderSOs = customerSOs.filter(so => so.orderId === order.orderId);

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
                                <th>Service</th>
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
                                  <td style={{ maxWidth: 220 }}><div style={{ fontSize: 12.5 }}>{p.name}</div></td>
                                  <td style={{ textAlign: 'center' }}>{p.qty}</td>
                                  <td style={{ fontWeight: 600 }}>₹{p.price.toLocaleString('en-IN')}</td>
                                  <td style={{ fontSize: 12, color: '#6b7280' }}>OFFLINE</td>
                                  {/* 3: Create SR per product */}
                                  <td>
                                    {p.family !== 'Service' ? (
                                      <button
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 4, padding: '3px 7px', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        onClick={e => { e.stopPropagation(); handleCreateSRForProduct(order, p); }}
                                      >
                                        <Wrench size={10} /> + Create SR
                                      </button>
                                    ) : <span style={{ fontSize: 11, color: '#9ca3af' }}>—</span>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* 2a/4: Service Orders section */}
                    {orderSOs.length > 0 && (
                      <div className="kap-accordion">
                        <div className="kap-accordion-hdr" onClick={() => toggleAccordion(`so-${order.orderId}`)}>
                          <span className="kap-accordion-title" style={{ color: '#7c3aed' }}>
                            Service Orders <span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700, marginLeft: 4 }}>{orderSOs.length}</span>
                          </span>
                          {soSectionOpen ? <ChevronUp size={14} color="#9ca3af" /> : <ChevronDown size={14} color="#9ca3af" />}
                        </div>
                        {soSectionOpen && (
                          <div className="kap-accordion-body" style={{ padding: 0 }}>
                            <table className="kap-prod-table">
                              <thead>
                                <tr>
                                  <th>SO Number</th>
                                  <th>SAP Reference</th>
                                  <th>Type</th>
                                  <th>Product</th>
                                  <th>Status</th>
                                  <th>Engineer</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {orderSOs.map(so => (
                                  <tr key={so.id} style={{ background: foundSO?.id === so.id ? '#fdf4ff' : 'white' }}>
                                    <td style={{ fontWeight: 700, color: '#7c3aed', fontSize: 12 }}>#{so.id}</td>
                                    <td style={{ fontSize: 11.5, color: '#6b7280' }}>{so.sapServiceOrderNo}</td>
                                    <td style={{ fontSize: 12 }}>{so.type}</td>
                                    <td style={{ fontSize: 12, maxWidth: 160 }}>{so.product?.name?.slice(0, 30)}{so.product?.name?.length > 30 ? '…' : ''}</td>
                                    <td><SOStatusBadge status={so.status} /></td>
                                    <td style={{ fontSize: 12 }}>{so.engineer?.name}</td>
                                    <td>
                                      <button
                                        style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        onClick={() => handleTagSO(so)}
                                      >
                                        Tag to Ticket
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

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
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 12.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#6b7280' }}>Tagged Order: </span>
                <strong style={{ color: '#2563eb' }}>{taggedOrder.orderId}</strong>
                {taggedProduct && <span style={{ color: '#374151' }}> · {taggedProduct.name}</span>}
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }} onClick={() => setStep('orders')}><X size={14} /></button>
            </div>
            {/* 5: SO attached sub-row */}
            {taggedSO && (
              <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <Wrench size={12} color="#7c3aed" />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#7c3aed' }}>Service Order Attached</span>
                <SOStatusBadge status={taggedSO.status} />
                <span style={{ fontSize: 11.5, color: '#6b7280' }}>SO# <strong>{taggedSO.id}</strong></span>
                <span style={{ fontSize: 11.5, color: '#6b7280' }}>SAP: <strong>{taggedSO.sapServiceOrderNo}</strong></span>
                <span style={{ fontSize: 11.5, color: '#6b7280' }}>Type: <strong>{taggedSO.type}</strong></span>
                <span style={{ fontSize: 11.5, color: '#6b7280' }}>Engineer: <strong>{taggedSO.engineer?.name}</strong></span>
              </div>
            )}
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
