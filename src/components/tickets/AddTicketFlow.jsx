import { useState } from 'react';
import { ChevronUp, ChevronDown, Search, User, Truck, Calendar, ShoppingBag, Upload, Folder, X, Wrench, AlertCircle, Package, MapPin, Shield, ArrowLeft, Clock, ExternalLink, Copy, CheckCheck, FileText, RotateCcw } from 'lucide-react';
import { customers, customerOrders, serviceOrders, complaints, tickets } from '../../data/dummyData';
import CRMCreateSR from '../crm/CRMCreateSR';
import CRMRaiseComplaint from '../crm/CRMRaiseComplaint';

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

  // Live data store — initialized from dummyData, updated when B2B records are added
  const [liveCustomers, setLiveCustomers] = useState(() => ({ ...customers }));
  const [liveCustomerOrders, setLiveCustomerOrders] = useState(() => ({ ...customerOrders }));
  const [liveSOs, setLiveSOs] = useState(() => [...serviceOrders]);

  // Search form state
  const [form, setForm] = useState({ customer: '', name: '', phone: '', email: '', customerCode: '', orderId: '', erpOrderId: '', company: '' });
  const [searchSectionOpen, setSearchSectionOpen] = useState(true);
  const [searchError, setSearchError] = useState('');

  // SO search tab state
  const [soSearchMode, setSoSearchMode] = useState('soNumber');
  const [soQuery, setSoQuery] = useState('');

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
  const [activeOrderTab, setActiveOrderTab] = useState('all');
  const [selectedSOInTab, setSelectedSOInTab] = useState(null);
  const [selectedIObject, setSelectedIObject] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // SO flow state (new)
  const [foundSO, setFoundSO] = useState(null);
  const [taggedSO, setTaggedSO] = useState(null);
  const [createSRFor, setCreateSRFor] = useState(null);
  const [raiseComplaintFor, setRaiseComplaintFor] = useState(null);
  const [newlyCreatedSOs, setNewlyCreatedSOs] = useState([]);
  const [srCreatedBanner, setSrCreatedBanner] = useState(null);

  // Shipsy / audit state
  const [copiedLink, setCopiedLink] = useState(null);
  const logAuditEvent = (eventType, orderId = null, extra = {}) => {
    console.log('[Kapture Audit]', { event: eventType, agentId: 'current-user', orderId, timestamp: new Date().toISOString(), ...extra });
  };

  // B2B/PBG SR — Case 1 (no customer) & Case 2 (no product history)
  const [showNoCustomerScript, setShowNoCustomerScript] = useState(false);
  const [b2bFormData, setB2bFormData] = useState({ firstName: '', lastName: '', phone: '', dop: '', serial: '', family: '', brand: '', productId: '', mfgSerial: '', serviceType: '', symptom: '', flat: '', building: '', street: '', area: '', pincode: '', city: '', state: '', note: '' });
  const [b2bEligibilityChecked, setB2bEligibilityChecked] = useState(false);
  const [b2bSRSubmitted, setB2bSRSubmitted] = useState(false);
  const [b2bSRId, setB2bSRId] = useState('');
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [newProd, setNewProd] = useState({ dop: '', family: '', brand: '', productId: '', mfgSerial: '' });

  // Folder + ticket state
  const [selType, setSelType] = useState('');
  const [selSource, setSelSource] = useState('');
  const [selIssue, setSelIssue] = useState('');
  const [selComplexity, setSelComplexity] = useState('');
  const [selSubFolder, setSelSubFolder] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // ── Search ──────────────────────────────────────────────────────────────
  const handleSearch = () => {
    let cust = null, ords = [], phone = '';
    setFoundSO(null);
    setActiveOrderTab('all');
    setSelectedSOInTab(null);
    setSelectedIObject(null);
    setSelectedComplaint(null);
    setShowNoCustomerScript(false);

    // OR SEARCH BY tab bar (SO / SR / Serial / Complaint)
    if (soQuery.trim()) {
      const q = soQuery.trim();
      let so = null;

      if (soSearchMode === 'soNumber') {
        so = liveSOs.find(s =>
          s.id === q || s.sapServiceOrderNo.toLowerCase() === q.toLowerCase()
        );
        if (!so) { setSearchError(`No service order found for "${q}". Try: 86379827`); return; }
        phone = so.customer.phone;
        cust = liveCustomers[phone] || { name: so.customer.name, code: so.customer.code, email: '—', phone: so.customer.phone };
        ords = liveCustomerOrders[phone] || [];
        setFoundCustomer(cust); setOrders(ords); setFoundSO(so);
        setExpandedOrderId(so.orderId);
        setActiveOrderTab('so'); setSelectedSOInTab(so);
        setSearchError(''); setStep('orders');
        return;

      } else if (soSearchMode === 'srNumber') {
        so = liveSOs.find(s =>
          s.serviceRefId && s.serviceRefId.toLowerCase() === q.toLowerCase()
        );
        if (!so) { setSearchError(`No service request found for "${q}". Try: SR-JMD-2026-0044`); return; }
        phone = so.customer.phone;
        cust = liveCustomers[phone] || { name: so.customer.name, code: so.customer.code, email: '—', phone: so.customer.phone };
        ords = liveCustomerOrders[phone] || [];
        setFoundCustomer(cust); setOrders(ords); setFoundSO(so);
        setExpandedOrderId(so.orderId);
        setActiveOrderTab('so'); setSelectedSOInTab(so);
        setSearchError(''); setStep('orders');
        return;

      } else if (soSearchMode === 'serialNo') {
        let foundPhone = null, foundOrder = null, foundProduct = null;
        Object.entries(liveCustomerOrders).forEach(([p, oList]) => {
          oList.forEach(o => {
            const pr = o.products.find(pr => pr.serialNo === q);
            if (pr) { foundPhone = p; foundOrder = o; foundProduct = pr; }
          });
        });
        if (!foundPhone) { setSearchError(`No product found with serial number "${q}". Try: SN-VT-2024-0019`); return; }
        cust = liveCustomers[foundPhone] || null;
        ords = liveCustomerOrders[foundPhone] || [];
        so = liveSOs.find(s => s.orderId === foundOrder?.orderId) || null;
        const iObj = foundProduct ? { ...foundProduct, order: foundOrder } : null;
        setFoundCustomer(cust); setOrders(ords);
        if (so) { setFoundSO(so); setExpandedOrderId(so.orderId); }
        setActiveOrderTab('iobjects');
        if (iObj) setSelectedIObject(iObj);
        setSearchError(''); setStep('orders');
        return;

      } else if (soSearchMode === 'complaint') {
        const comp = complaints.find(c => c.id.toLowerCase() === q.toLowerCase());
        if (!comp) { setSearchError(`No complaint found for "${q}". Try: COMP-2026-8834512901`); return; }
        so = liveSOs.find(s => s.id === comp.serviceOrderId);
        if (!so) { setSearchError(`Complaint found but no linked service order for "${q}"`); return; }
        phone = so.customer.phone;
        cust = liveCustomers[phone] || { name: so.customer.name, code: so.customer.code, email: '—', phone: so.customer.phone };
        ords = liveCustomerOrders[phone] || [];
        setFoundCustomer(cust); setOrders(ords); setFoundSO(so);
        setExpandedOrderId(so.orderId);
        setActiveOrderTab('complaints'); setSelectedComplaint(comp);
        setSearchError(''); setStep('orders');
        return;
      }
    }

    // Form-based search
    const q = form.phone || form.customer;
    if (q && liveCustomers[q]) { cust = liveCustomers[q]; ords = liveCustomerOrders[q] || []; phone = q; }
    else if (form.customerCode) {
      Object.entries(liveCustomers).forEach(([p, c]) => { if (c.code === form.customerCode) { cust = c; ords = liveCustomerOrders[p] || []; phone = p; } });
    } else if (form.name) {
      Object.entries(liveCustomers).forEach(([p, c]) => { if (c.name.toLowerCase().includes(form.name.toLowerCase())) { cust = c; ords = liveCustomerOrders[p] || []; phone = p; } });
    } else if (form.orderId) {
      let matchedOrder = null;
      Object.entries(liveCustomerOrders).forEach(([p, oList]) => {
        const match = oList.find(o => o.orderId.toLowerCase() === form.orderId.toLowerCase());
        if (match) { cust = liveCustomers[p]; ords = oList; phone = p; matchedOrder = match; }
      });
      if (matchedOrder) { setExpandedOrderId(matchedOrder.orderId); setActiveOrderTab('orders'); }
    }

    if (!cust) { setSearchError('No customer found. Try phone: 9916265181 or SO No: 86379827'); setShowNoCustomerScript(true); return; }
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
    // If this was a synthetic (B2B/new-product) order, persist it to live data so future searches find it
    const syntheticOrder = createSRFor?.order;
    if (syntheticOrder && foundCustomer?.phone) {
      setLiveCustomerOrders(prev => {
        const existing = prev[foundCustomer.phone] || [];
        const alreadySaved = existing.some(o => o.orderId === syntheticOrder.orderId);
        return alreadySaved ? prev : { ...prev, [foundCustomer.phone]: [...existing, syntheticOrder] };
      });
      setOrders(prev => {
        const alreadySaved = prev.some(o => o.orderId === syntheticOrder.orderId);
        return alreadySaved ? prev : [...prev, syntheticOrder];
      });
    }
    setCreateSRFor(null);
    setStep('orders');
  };

  const toggleAccordion = (key) => setOpenAccordions(p => ({ ...p, [key]: !p[key] }));

  const filteredOrders = orderFilterId ? orders.filter(o => o.orderId.toLowerCase().includes(orderFilterId.toLowerCase())) : orders;

  const customerPhone = foundCustomer?.phone;
  const allSOs = [...liveSOs, ...newlyCreatedSOs];
  const customerSOs = allSOs.filter(so => so.customer?.phone === customerPhone);

  // iObjects = installed base items (one per physical product with a serial number)
  const iObjects = filteredOrders.flatMap(order =>
    order.products
      .filter(p => p.family !== 'Service' && p.serialNo && p.serialNo !== 'N/A')
      .map(p => ({ ...p, order }))
  );

  // CRM ZRCO Complaints linked to this customer's service orders
  const customerComplaints = complaints.filter(c =>
    customerSOs.some(so => so.id === c.serviceOrderId)
  );

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

  // ── STEP: raiseComplaint ─────────────────────────────────────────────────
  if (step === 'raiseComplaint') {
    return (
      <CRMRaiseComplaint
        so={raiseComplaintFor}
        onBack={() => setStep('orders')}
        onSuccess={() => setStep('orders')}
      />
    );
  }

  // ── STEP: b2bSR — Case 1: no customer found, B2B/PBG SR creation ─────────
  if (step === 'b2bSR') {
    const B2B_FAMILIES = ['Air Conditioner', 'Washing Machine', 'Refrigerator', 'TV', 'Microwave', 'Water Purifier'];
    const B2B_BRANDS = { 'Air Conditioner': ['Samsung','LG','Voltas','Bluestar','Godrej','Daikin','Hitachi'], 'Washing Machine': ['Godrej','LG','Samsung','IFB','Whirlpool'], 'Refrigerator': ['LG','Samsung','Godrej','Whirlpool','Haier'], 'TV': ['Samsung','LG','Sony','TCL','Vu'], 'Microwave': ['LG','Samsung','IFB','Godrej'], 'Water Purifier': ['Kent','Livpure','AO Smith','Eureka Forbes'] };
    const B2B_TYPES = ['Repair', 'Installation', 'Demo', 'PMS', 'Uninstallation'];
    const B2B_SYMPTOMS = { Repair: ['Machine not working','Not cooling / heating','Unusual noise','Leaking water','Error code displayed','Remote not working','Power issue'], Installation: ['New installation','Re-installation','Relocation'], Demo: ['Product demo requested'], PMS: ['Annual maintenance check','Gas top-up','Filter cleaning','General servicing'], Uninstallation: ['Shifting / moving','Return / replacement'] };
    const setB2b = (k, v) => setB2bFormData(p => ({ ...p, [k]: v }));
    const canSubmit = b2bFormData.firstName && b2bFormData.phone && b2bFormData.dop && (b2bFormData.serial || (b2bFormData.family && b2bFormData.brand)) && b2bFormData.serviceType && b2bFormData.flat && b2bFormData.city;
    const resetB2b = () => { setB2bSRSubmitted(false); setB2bSRId(''); setB2bEligibilityChecked(false); setB2bFormData({ firstName: '', lastName: '', phone: '', dop: '', serial: '', family: '', brand: '', productId: '', mfgSerial: '', serviceType: '', symptom: '', flat: '', building: '', street: '', area: '', pincode: '', city: '', state: '', note: '' }); };

    if (b2bSRSubmitted) {
      const srId = b2bSRId;
      return (
        <div className="at-wrapper">
          <div className="at-header">
            <button className="at-back-btn" onClick={() => { resetB2b(); setStep('search'); setShowNoCustomerScript(false); }}>‹</button>
            <span className="at-title">Service Request Created</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#16a34a' }}>✓</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e' }}>Service Request Raised</div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>SR ID: <strong style={{ color: '#2563eb' }}>{srId}</strong></div>
            <div style={{ background: '#f0f4ff', border: '1px solid #c7d2fe', borderRadius: 8, padding: '14px 18px', maxWidth: 400, width: '100%', marginTop: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#3730a3', marginBottom: 10, display: 'flex', gap: 8 }}>
                <span style={{ padding: '2px 8px', borderRadius: 10, background: '#fef3c7', color: '#92400e', fontSize: 11 }}>B2B / PBG</span>
                <span style={{ padding: '2px 8px', borderRadius: 10, background: '#fee2e2', color: '#991b1b', fontSize: 11 }}>No CRM Record</span>
              </div>
              {[['Customer', `${b2bFormData.firstName} ${b2bFormData.lastName}`.trim()], ['Mobile', `+91 ${b2bFormData.phone}`], ['Product', b2bFormData.serial ? `Serial: ${b2bFormData.serial}` : `${b2bFormData.brand} ${b2bFormData.family}`], ['Service Type', b2bFormData.serviceType], ['City', b2bFormData.city]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0', borderBottom: '1px solid #e0e7ff' }}>
                  <span style={{ color: '#6b7280' }}>{l}</span>
                  <strong style={{ color: '#1a1a2e' }}>{v}</strong>
                </div>
              ))}
            </div>
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 6, padding: '8px 14px', fontSize: 12, color: '#92400e', maxWidth: 400, width: '100%', textAlign: 'center' }}>
              Customer registered as <strong>B2B / PBG</strong>. Record saved for future assistance.
            </div>
            <button className="kap-search-attach" style={{ marginTop: 8, maxWidth: 220 }} onClick={() => { resetB2b(); setStep('search'); setShowNoCustomerScript(false); }}>BACK TO SEARCH</button>
          </div>
        </div>
      );
    }

    return (
      <div className="at-wrapper">
        <div className="at-header">
          <button className="at-back-btn" onClick={() => setStep('search')}>‹</button>
          <span className="at-title">Raise Service Request</span>
        </div>
        <div className="at-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>B2B / PBG Customer</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10, background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>No CRM Record Found</span>
          </div>

          {/* Customer details */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16, background: 'white' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 14 }}>Customer details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label className="kap-label">First Name <span style={{ color: '#dc2626' }}>*</span></label>
                <input className="kap-input" placeholder="First Name" value={b2bFormData.firstName} onChange={e => setB2b('firstName', e.target.value)} />
              </div>
              <div>
                <label className="kap-label">Last Name</label>
                <input className="kap-input" placeholder="Last Name" value={b2bFormData.lastName} onChange={e => setB2b('lastName', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="kap-label">Mobile Number <span style={{ color: '#dc2626' }}>*</span></label>
              <div style={{ display: 'flex' }}>
                <span style={{ padding: '7px 10px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRight: 'none', borderRadius: '6px 0 0 6px', fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>+91</span>
                <input className="kap-input" style={{ borderRadius: '0 6px 6px 0' }} placeholder="Mobile number" value={b2bFormData.phone} onChange={e => setB2b('phone', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Product details */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16, background: 'white' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 14 }}>Product details</div>
            <div style={{ marginBottom: 12 }}>
              <label className="kap-label">Date of purchase <span style={{ color: '#dc2626' }}>*</span></label>
              <input className="kap-input" type="date" value={b2bFormData.dop} onChange={e => setB2b('dop', e.target.value)} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label className="kap-label">MFG Serial Number</label>
              <input className="kap-input" placeholder="Enter serial number to auto-fill product details" value={b2bFormData.serial} onChange={e => { setB2b('serial', e.target.value); if (e.target.value) { setB2b('family', ''); setB2b('brand', ''); setB2b('productId', ''); setB2b('mfgSerial', ''); } }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} /><span style={{ fontSize: 12, color: '#9ca3af' }}>or</span><div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="kap-label">Family <span style={{ color: '#dc2626' }}>*</span></label>
                <select className="kap-input" value={b2bFormData.family} onChange={e => setB2b('family', e.target.value)} disabled={!!b2bFormData.serial}>
                  <option value="">Select family</option>
                  {B2B_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="kap-label">Brand <span style={{ color: '#dc2626' }}>*</span></label>
                <select className="kap-input" value={b2bFormData.brand} onChange={e => setB2b('brand', e.target.value)} disabled={!!b2bFormData.serial || !b2bFormData.family}>
                  <option value="">Select brand</option>
                  {(B2B_BRANDS[b2bFormData.family] || []).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="kap-label">Product ID</label>
                <input className="kap-input" placeholder="Product ID / SKU" value={b2bFormData.productId} onChange={e => setB2b('productId', e.target.value)} disabled={!!b2bFormData.serial} />
              </div>
              <div>
                <label className="kap-label">MFG Serial Number</label>
                <input className="kap-input" placeholder="D123456789" value={b2bFormData.mfgSerial} onChange={e => setB2b('mfgSerial', e.target.value)} disabled={!!b2bFormData.serial} />
              </div>
            </div>
          </div>

          {/* Raise service request */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16, background: 'white' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 14 }}>Raise service request</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label className="kap-label">Service Type <span style={{ color: '#dc2626' }}>*</span></label>
                <select className="kap-input" value={b2bFormData.serviceType} onChange={e => { setB2b('serviceType', e.target.value); setB2b('symptom', ''); setB2bEligibilityChecked(false); }}>
                  <option value="">Select service type</option>
                  {B2B_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="kap-label">Repair related - Symptoms (IRIS) <span style={{ color: '#dc2626' }}>*</span></label>
                <select className="kap-input" value={b2bFormData.symptom} onChange={e => setB2b('symptom', e.target.value)} disabled={!b2bFormData.serviceType}>
                  <option value="">Select symptom</option>
                  {(B2B_SYMPTOMS[b2bFormData.serviceType] || []).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {b2bFormData.serviceType && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={() => setB2bEligibilityChecked(true)} style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Check Eligibility</button>
                {b2bEligibilityChecked && (
                  <>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#eff6ff', color: '#1d4ed8' }}>Service Request Type: Paid</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#f0fdf4', color: '#16a34a' }}>Service Charges: ₹300</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Service address */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16, background: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>Service address</div>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#2563eb', background: 'none', border: '1px solid #bfdbfe', borderRadius: 5, padding: '4px 10px', cursor: 'pointer' }}>✏ Add new address</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['flat','Flat No. / Block No.',true],['building','Building',true],['street','Street',true],['area','Area / Landmark',true],['pincode','Pincode',true],['city','City / District / Town',true]].map(([k, l, req]) => (
                <div key={k}>
                  <label className="kap-label">{l}{req && <span style={{ color: '#dc2626' }}> *</span>}</label>
                  <input className="kap-input" placeholder={l} value={b2bFormData[k]} onChange={e => setB2b(k, e.target.value)} />
                </div>
              ))}
              <div>
                <label className="kap-label">State <span style={{ color: '#dc2626' }}>*</span></label>
                <select className="kap-input" value={b2bFormData.state} onChange={e => setB2b('state', e.target.value)}>
                  <option value="">Select state</option>
                  {['Maharashtra','Gujarat','Rajasthan','Delhi','Karnataka','Tamil Nadu','Haryana','West Bengal','Uttar Pradesh','Telangana','Kerala','Punjab'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Service note */}
          <div style={{ marginBottom: 16 }}>
            <label className="kap-label">Write Service Note</label>
            <textarea className="kap-input" rows={3} maxLength={200} placeholder="Describe the service requirement..." value={b2bFormData.note} onChange={e => setB2b('note', e.target.value)} style={{ resize: 'vertical' }} />
            <div style={{ textAlign: 'right', fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{b2bFormData.note.length}/200</div>
          </div>

          <div style={{ display: 'flex', gap: 12, paddingBottom: 24 }}>
            <button className="kap-search-attach" style={{ flex: 1, opacity: canSubmit ? 1 : 0.5 }} disabled={!canSubmit} onClick={() => {
              const srId = `SR-B2B-${Math.floor(10000 + Math.random() * 90000)}`;
              const custCode = `B2B-${Math.floor(10000 + Math.random() * 90000)}`;
              const newProduct = {
                id: `b2b-prod-${Date.now()}`, sku: `B2B-SKU-${Date.now()}`,
                name: b2bFormData.serial ? `Product (Serial: ${b2bFormData.serial})` : `${b2bFormData.brand} ${b2bFormData.family}`,
                brand: b2bFormData.brand || '—', family: b2bFormData.family || '—',
                modelNo: b2bFormData.productId || '—',
                serialNo: b2bFormData.serial || b2bFormData.mfgSerial || '—',
                purchaseDate: b2bFormData.dop, warranty: 'N/A',
              };
              const newOrder = {
                orderId: `B2B-ORD-${Date.now()}`, date: b2bFormData.dop, status: 'Delivered',
                products: [newProduct], totalAmount: 0,
                shipsy: null, invoice: null, returns: null,
              };
              const newSO = {
                id: srId, sapServiceOrderNo: `SAP-B2B-${Math.floor(100000 + Math.random() * 900000)}`,
                serviceRefId: srId, type: b2bFormData.serviceType, status: 'Created',
                customer: { name: `${b2bFormData.firstName} ${b2bFormData.lastName}`.trim(), phone: b2bFormData.phone, code: custCode },
                product: { name: newProduct.name, sku: newProduct.sku, family: newProduct.family },
                orderId: newOrder.orderId,
                address: `${b2bFormData.flat}, ${b2bFormData.building}, ${b2bFormData.city}, ${b2bFormData.state}`.replace(/^,\s*|,\s*,/g, ''),
                symptom: b2bFormData.symptom, note: b2bFormData.note,
                createdAt: new Date().toISOString(),
              };
              const newCust = { name: `${b2bFormData.firstName} ${b2bFormData.lastName}`.trim(), code: custCode, email: '', phone: b2bFormData.phone, isB2B: true };
              setLiveCustomers(prev => ({ ...prev, [b2bFormData.phone]: newCust }));
              setLiveCustomerOrders(prev => ({ ...prev, [b2bFormData.phone]: [newOrder] }));
              setLiveSOs(prev => [...prev, newSO]);
              setB2bSRId(srId);
              setB2bSRSubmitted(true);
            }}>Submit</button>
            <button style={{ padding: '9px 20px', background: 'white', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }} onClick={() => setStep('search')}>Cancel</button>
          </div>
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

                {/* SO / SR / Serial search */}
                <div style={{ margin: '12px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>OR SEARCH BY</span>
                  <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                </div>
                <div style={{ border: '1.5px solid #a78bfa', borderRadius: 8, padding: '10px 12px', background: '#faf5ff', marginBottom: 12 }}>
                  <div className="search-mode-tabs" style={{ marginBottom: 10 }}>
                    {[
                      ['soNumber', 'Service Order No.'],
                      ['srNumber', 'SR Number'],
                      ['serialNo', 'Serial Number'],
                      ['complaint', 'CRM ZRCO Complaint'],
                    ].map(([val, label]) => (
                      <button key={val}
                        className={`search-mode-tab ${soSearchMode === val ? 'active' : ''}`}
                        onClick={() => { setSoSearchMode(val); setSoQuery(''); setSearchError(''); }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <input
                    className="kap-input"
                    style={{ borderColor: '#a78bfa', background: 'white' }}
                    placeholder={
                      soSearchMode === 'soNumber' ? 'e.g. 86379827' :
                      soSearchMode === 'srNumber' ? 'e.g. SR-JMD-2026-0044' :
                      soSearchMode === 'serialNo' ? 'e.g. SN-VT-2024-0019' :
                      'e.g. COMP-2026-8834512901'
                    }
                    value={soQuery}
                    onChange={e => setSoQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                {searchError && !showNoCustomerScript && <div style={{ color: '#dc2626', fontSize: 12, marginBottom: 8 }}>{searchError}</div>}
                {showNoCustomerScript && (
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
                      <span style={{ fontSize: 16, color: '#d97706', marginTop: 1 }}>⚠</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#92400e', marginBottom: 4 }}>No customer record found</div>
                        <div style={{ fontSize: 12, color: '#78350f', lineHeight: 1.5 }}>
                          Please share alternative registered mobile number and try again. If the customer does not have an alternative number and wishes to raise a service request, proceed as <strong>B2B / PBG customer</strong>.
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep('b2bSR')}
                      style={{ width: '100%', padding: '8px 0', background: '#f59e0b', color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 6, cursor: 'pointer', letterSpacing: 0.3 }}
                    >
                      + Create SR as B2B / PBG Customer
                    </button>
                  </div>
                )}
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

          {/* Quick Access — prototype demo shortcuts */}
          <div style={{ margin: '0 0 16px 0', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ background: '#f8faff', borderBottom: '1px solid #e5e7eb', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>⚡ Quick Access</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Click any scenario to load demo data</span>
            </div>
            <div style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                {
                  label: 'Full Customer Journey',
                  desc: 'Orders + iObjects + Service Orders + Complaint',
                  tag: 'Phone',
                  tagColor: '#2563eb',
                  value: '9689808472',
                  action: () => { setF('phone', '9689808472'); setSoQuery(''); setSoSearchMode('soNumber'); },
                },
                {
                  label: 'Product Orders Only',
                  desc: 'Customer with multiple product orders, no SO',
                  tag: 'Phone',
                  tagColor: '#2563eb',
                  value: '9916265181',
                  action: () => { setF('phone', '9916265181'); setSoQuery(''); setSoSearchMode('soNumber'); },
                },
                {
                  label: 'Service Order Search',
                  desc: 'Look up by SO number, see SO detail flow',
                  tag: 'SO No.',
                  tagColor: '#7c3aed',
                  value: '86379827',
                  action: () => { setSoSearchMode('soNumber'); setSoQuery('86379827'); setF('phone', ''); },
                },
                {
                  label: 'SR Reference Search',
                  desc: 'Look up via service request reference ID',
                  tag: 'SR Ref',
                  tagColor: '#7c3aed',
                  value: 'SR-JMD-2026-0044',
                  action: () => { setSoSearchMode('srNumber'); setSoQuery('SR-JMD-2026-0044'); setF('phone', ''); },
                },
                {
                  label: 'Serial Number Search',
                  desc: 'Find customer & product via device serial no.',
                  tag: 'Serial',
                  tagColor: '#059669',
                  value: 'SN-VT-2024-0019',
                  action: () => { setSoSearchMode('serialNo'); setSoQuery('SN-VT-2024-0019'); setF('phone', ''); },
                },
                {
                  label: 'Order ID Search',
                  desc: 'Find customer by JioMart order ID, opens order directly',
                  tag: 'Order ID',
                  tagColor: '#d97706',
                  value: 'B63515626500726',
                  action: () => { setF('orderId', 'B63515626500726'); setF('phone', ''); setSoQuery(''); setSoSearchMode('soNumber'); },
                },
                {
                  label: 'ZRCO Complaint Search',
                  desc: 'Look up by complaint ID, opens complaint detail directly',
                  tag: 'Complaint',
                  tagColor: '#dc2626',
                  value: 'COMP-2026-8834512901',
                  action: () => { setSoSearchMode('complaint'); setSoQuery('COMP-2026-8834512901'); setF('phone', ''); setF('orderId', ''); },
                },
              ].map(({ label, desc, tag, tagColor, value, action }) => (
                <button key={value}
                  onClick={() => { action(); }}
                  style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.15s', display: 'flex', flexDirection: 'column', gap: 4 }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = tagColor}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>{label}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: tagColor + '18', color: tagColor, whiteSpace: 'nowrap' }}>{tag}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.4 }}>{desc}</div>
                  <div style={{ fontSize: 11, color: tagColor, fontWeight: 600, marginTop: 2, fontFamily: 'monospace' }}>{value}</div>
                </button>
              ))}
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

          {/* Tab bar */}
          <div className="tab-bar" style={{ background: 'white', borderRadius: '8px 8px 0 0', marginBottom: 0 }}>
            {[
              ['all',        `All (${filteredOrders.length + customerSOs.length})`],
              ['orders',     `Product Orders (${filteredOrders.length})`],
              ['iobjects',   `iObjects (${iObjects.length})`],
              ['so',         `Service Orders (${customerSOs.length})`],
              ['complaints', `CRM ZRCO Complaints (${customerComplaints.length})`],
            ].map(([key, label]) => (
              <div key={key} className={`tab ${activeOrderTab === key ? 'active' : ''}`}
                style={{ fontSize: 12, whiteSpace: 'nowrap' }}
                onClick={() => setActiveOrderTab(key)}>
                {label}
              </div>
            ))}
          </div>

          {/* iObjects tab — installed base items */}
          {activeOrderTab === 'iobjects' && (
            <div style={{ background: 'white', borderRadius: '0 0 8px 8px', border: '1px solid #e5e7eb', borderTop: 'none', marginBottom: 12, overflow: 'hidden' }}>
              {iObjects.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: 32, fontSize: 13 }}>No iObjects found for this customer</div>
              ) : !selectedIObject ? (
                /* iObjects list table */
                <table className="kap-prod-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Object ID</th>
                      <th>Serial No.</th>
                      <th>Article Description</th>
                      <th>Brand</th>
                      <th>Warranty</th>
                      <th>Date of Purchase</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {iObjects.map(iobj => (
                      <tr key={iobj.serialNo} className="order-row" style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedIObject(iobj)}>
                        <td style={{ fontWeight: 700, color: '#2563eb', fontSize: 12 }}>{iobj.objectId || iobj.serialNo}</td>
                        <td style={{ fontSize: 12, color: '#6b7280' }}>{iobj.serialNo}</td>
                        <td style={{ fontSize: 12, maxWidth: 160 }}>{iobj.name?.slice(0, 28)}{iobj.name?.length > 28 ? '…' : ''}</td>
                        <td style={{ fontSize: 12 }}>{iobj.brand}</td>
                        <td>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                            background: iobj.warranty === 'Out of Warranty' ? '#fee2e2' : '#d1fae5',
                            color: iobj.warranty === 'Out of Warranty' ? '#dc2626' : '#065f46' }}>
                            {iobj.warranty}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: '#6b7280' }}>{iobj.order.orderDate}</td>
                        <td>
                          <button
                            style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            onClick={e => { e.stopPropagation(); setSelectedIObject(iobj); }}
                          >View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* iObject detail view */
                <div style={{ padding: '14px 16px' }}>
                  {/* Topbar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                    <button onClick={() => setSelectedIObject(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, padding: 0 }}>
                      <ArrowLeft size={14} /> Back
                    </button>
                    <span style={{ color: '#d1d5db' }}>›</span>
                    <Package size={14} color="#2563eb" />
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: '#1a1a2e' }}>Object ID: {selectedIObject.objectId || selectedIObject.serialNo}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10,
                      background: selectedIObject.warranty === 'Out of Warranty' ? '#fee2e2' : '#d1fae5',
                      color: selectedIObject.warranty === 'Out of Warranty' ? '#dc2626' : '#065f46' }}>
                      {selectedIObject.warranty}
                    </span>
                    <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                      <button
                        style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        onClick={() => handleCreateSRForProduct(selectedIObject.order, selectedIObject)}
                      >
                        <Wrench size={13} /> Create Service Request
                      </button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div style={{ background: '#f8faff', border: '1px solid #e0e7ff', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <Shield size={12} color="#2563eb" />
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Product Details</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 16px' }}>
                      {[
                        ['Article Description', selectedIObject.name],
                        ['Serial No. (SERIALNO)', selectedIObject.serialNo],
                        ['Brand', selectedIObject.brand],
                        ['SKU / Product ID', selectedIObject.sku],
                        ['Date of Purchase (DOP)', selectedIObject.order.orderDate],
                        ['Warranty Start', selectedIObject.order.orderDate],
                        ['Warranty End', selectedIObject.warrantyExpiry],
                        ['Installation Type', selectedIObject.installationType],
                        ['Upcoming PMS', selectedIObject.upcomingPMS || '—'],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{label}</div>
                          <div style={{ fontSize: 12.5, color: '#1a1a2e', fontWeight: 500 }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Details & Address */}
                  {foundCustomer && (
                    <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                        <MapPin size={12} color="#6b7280" />
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Customer Details & Address</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px 16px' }}>
                        {[
                          ['Sold-to Party', foundCustomer.code],
                          ['First Name', foundCustomer.firstName || foundCustomer.name.split(' ')[0]],
                          ['Last Name', foundCustomer.lastName || foundCustomer.name.split(' ').slice(1).join(' ') || '—'],
                          ['Mobile No.', foundCustomer.phone],
                          ['Email', foundCustomer.email],
                          ['Flat No.', foundCustomer.addresses?.[0]?.flat || '—'],
                          ['House / Building', foundCustomer.addresses?.[0]?.building || '—'],
                          ['Street', foundCustomer.addresses?.[0]?.street || '—'],
                          ['Area / Landmark', foundCustomer.addresses?.[0]?.area || '—'],
                          ['City', foundCustomer.addresses?.[0]?.city || '—'],
                          ['State', foundCustomer.addresses?.[0]?.state || '—'],
                          ['Postal Code', foundCustomer.addresses?.[0]?.pincode || '—'],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{label}</div>
                            <div style={{ fontSize: 12, color: '#374151' }}>{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CRM ZRCO Complaints tab */}
          {activeOrderTab === 'complaints' && (
            <div style={{ background: 'white', borderRadius: '0 0 8px 8px', border: '1px solid #e5e7eb', borderTop: 'none', marginBottom: 12, overflow: 'hidden' }}>
              {customerComplaints.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: 32, fontSize: 13 }}>No CRM ZRCO Complaints found for this customer</div>
              ) : !selectedComplaint ? (
                /* Complaints list table */
                <table className="kap-prod-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Complaint ID</th>
                      <th>Category</th>
                      <th>Sub Category</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Created Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerComplaints.map(comp => (
                      <tr key={comp.id} className="order-row" style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedComplaint(comp)}>
                        <td style={{ fontWeight: 700, color: '#dc2626', fontSize: 12 }}>{comp.id}</td>
                        <td style={{ fontSize: 12 }}>{comp.category}</td>
                        <td style={{ fontSize: 12 }}>{comp.subCategory}</td>
                        <td style={{ fontSize: 12 }}>{comp.department}</td>
                        <td><SOStatusBadge status={comp.status} /></td>
                        <td style={{ fontSize: 12, color: '#6b7280' }}>{comp.createdDate}</td>
                        <td>
                          <button
                            style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            onClick={e => { e.stopPropagation(); setSelectedComplaint(comp); }}
                          >View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* Complaint detail view */
                (() => {
                  const comp = selectedComplaint;
                  const linkedSO = customerSOs.find(so => so.id === comp.serviceOrderId);
                  return (
                    <div style={{ padding: '14px 16px' }}>
                      {/* Topbar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                        <button onClick={() => setSelectedComplaint(null)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, padding: 0 }}>
                          <ArrowLeft size={14} /> Back
                        </button>
                        <span style={{ color: '#d1d5db' }}>›</span>
                        <AlertCircle size={14} color="#dc2626" />
                        <span style={{ fontWeight: 700, fontSize: 13.5, color: '#dc2626' }}>{comp.id}</span>
                        <SOStatusBadge status={comp.status} />
                        <span style={{ fontSize: 11, background: '#f3f4f6', color: '#374151', fontWeight: 700, padding: '3px 8px', borderRadius: 5, border: '1px solid #e5e7eb' }}>
                          {comp.source}
                        </span>
                        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                          <button
                            style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                            onClick={() => linkedSO ? handleTagSO(linkedSO) : null}
                          >
                            <Wrench size={13} /> Follow-up Ticket
                          </button>
                        </div>
                      </div>

                      {/* Complaint Details */}
                      <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Complaint Details</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 16px' }}>
                          {[
                            ['Category Description', comp.categoryDesc],
                            ['Transaction Type', comp.transactionType],
                            ['Department', comp.department],
                            ['Category', comp.category],
                            ['Sub Category', comp.subCategory],
                            ['Created Date', comp.createdDate],
                          ].map(([l, v]) => (
                            <div key={l}>
                              <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{l}</div>
                              <div style={{ fontSize: 12.5, color: '#1a1a2e', fontWeight: 500 }}>{v || '—'}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status Timeline */}
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Status History</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {comp.statusHistory?.map((h, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                              <div style={{ width: 9, height: 9, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                                background: i === comp.statusHistory.length - 1 ? '#16a34a' : '#d1d5db',
                                border: `2px solid ${i === comp.statusHistory.length - 1 ? '#16a34a' : '#d1d5db'}` }} />
                              <div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a2e' }}>{h.status}</span>
                                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{h.date} · {h.by}</span>
                                </div>
                                <div style={{ fontSize: 12, color: '#374151' }}>{h.remarks}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Follow-up Tickets against this Complaint */}
                      {comp.followUps?.length > 0 && (
                        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e', marginBottom: 10 }}>Follow-up Enquiries ({comp.followUps.length})</div>
                          <table className="kap-prod-table" style={{ margin: 0 }}>
                            <thead>
                              <tr>
                                <th>Ticket ID</th><th>Type</th><th>Issue Type</th><th>Title</th><th>Status</th><th>Assignee</th><th>Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {comp.followUps.map(f => (
                                <tr key={f.id} className="order-row">
                                  <td style={{ color: '#2563eb', fontWeight: 700, fontSize: 12 }}>{f.id}</td>
                                  <td><span style={{ background: '#eff6ff', color: '#2563eb', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>{f.type}</span></td>
                                  <td style={{ fontSize: 12 }}>{f.issueType}</td>
                                  <td style={{ fontSize: 12 }}>
                                    <div style={{ fontWeight: 500 }}>{f.title}</div>
                                    {f.notes && <div style={{ fontSize: 11, color: '#6b7280', fontStyle: 'italic', marginTop: 3 }}>📝 {f.notes}</div>}
                                  </td>
                                  <td><SOStatusBadge status={f.status} /></td>
                                  <td style={{ fontSize: 12, color: '#374151' }}>{f.assignee}</td>
                                  <td style={{ fontSize: 12, color: '#6b7280' }}>{f.date}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Associated SO + Product + Customer — 3 columns */}
                      {linkedSO && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                          <div style={{ border: '1px solid #e0e7ff', borderRadius: 8, padding: '12px 14px', background: '#f8faff' }}>
                            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Associated Service Order</div>
                            {[
                              ['SO Number', `#${linkedSO.id}`],
                              ['SAP Reference', linkedSO.sapServiceOrderNo],
                              ['Service Type', linkedSO.type],
                              ['SR Ref', linkedSO.serviceRefId],
                              ['Status', linkedSO.status],
                              ['Created', linkedSO.createdDate],
                            ].map(([l, v]) => (
                              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0', borderBottom: '1px solid #f0f4ff' }}>
                                <span style={{ color: '#6b7280' }}>{l}</span>
                                <span style={{ fontWeight: 600, color: l === 'SO Number' ? '#7c3aed' : '#1a1a2e' }}>{v}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px' }}>
                            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Product Details</div>
                            {[
                              ['Product', linkedSO.product?.name],
                              ['Brand', linkedSO.product?.brand],
                              ['Family', linkedSO.product?.family],
                              ['Serial No.', linkedSO.product?.serial],
                              ['SKU', linkedSO.product?.sku],
                              ['Order ID', linkedSO.orderId],
                            ].map(([l, v]) => (
                              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0', borderBottom: '1px solid #f9fafb' }}>
                                <span style={{ color: '#6b7280' }}>{l}</span>
                                <span style={{ fontWeight: 600, color: l === 'Order ID' ? '#2563eb' : '#1a1a2e', textAlign: 'right', maxWidth: 120, wordBreak: 'break-word' }}>{v || '—'}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px' }}>
                            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Customer Details</div>
                            {[
                              ['Name', linkedSO.customer?.name],
                              ['Mobile', linkedSO.customer?.phone],
                              ['Customer ID', linkedSO.customer?.code],
                              ['Sold to Party', linkedSO.customer?.soldToParty],
                              ['Sales Office', linkedSO.customer?.salesOffice],
                              ['Store', linkedSO.customer?.storeCode],
                            ].map(([l, v]) => (
                              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0', borderBottom: '1px solid #f9fafb' }}>
                                <span style={{ color: '#6b7280' }}>{l}</span>
                                <span style={{ fontWeight: 600, color: '#1a1a2e', textAlign: 'right', maxWidth: 120, wordBreak: 'break-word' }}>{v || '—'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* Service Orders tab */}
          {activeOrderTab === 'so' && (
            <div style={{ background: 'white', borderRadius: '0 0 8px 8px', border: '1px solid #e5e7eb', borderTop: 'none', marginBottom: 12, overflow: 'hidden' }}>
              {customerSOs.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: 32, fontSize: 13 }}>No service orders found</div>
              ) : !selectedSOInTab ? (
                /* SO list table */
                <table className="kap-prod-table" style={{ margin: 0 }}>
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
                    {customerSOs.map(so => (
                      <tr key={so.id} className="order-row" style={{ background: foundSO?.id === so.id ? '#fdf4ff' : 'white', cursor: 'pointer' }}
                        onClick={() => setSelectedSOInTab(so)}>
                        <td style={{ fontWeight: 700, color: '#7c3aed', fontSize: 12 }}>#{so.id}</td>
                        <td style={{ fontSize: 11.5, color: '#6b7280' }}>{so.sapServiceOrderNo}</td>
                        <td style={{ fontSize: 12 }}>{so.type}</td>
                        <td style={{ fontSize: 12, maxWidth: 160 }}>{so.product?.name?.slice(0, 30)}{so.product?.name?.length > 30 ? '…' : ''}</td>
                        <td><SOStatusBadge status={so.status} /></td>
                        <td style={{ fontSize: 12 }}>{so.engineer?.name}</td>
                        <td>
                          <button
                            style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            onClick={e => { e.stopPropagation(); handleTagSO(so); }}
                          >Tag to Ticket</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* SO detail view */
                <div style={{ padding: '14px 16px' }}>
                  {/* Topbar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                    <button onClick={() => setSelectedSOInTab(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, padding: 0 }}>
                      <ArrowLeft size={14} /> Back
                    </button>
                    <span style={{ color: '#d1d5db' }}>›</span>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: '#1a1a2e' }}>Service Order #{selectedSOInTab.id}</span>
                    <SOStatusBadge status={selectedSOInTab.status} />
                    <span style={{ fontSize: 11, background: '#eff6ff', color: '#2563eb', fontWeight: 700, padding: '3px 8px', borderRadius: 5, border: '1px solid #bfdbfe' }}>
                      SAP: {selectedSOInTab.sapServiceOrderNo}
                    </span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button
                        style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => { setRaiseComplaintFor(selectedSOInTab); setStep('raiseComplaint'); }}
                      >
                        Raise Complaint
                      </button>
                      <button
                        style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => handleTagSO(selectedSOInTab)}
                      >
                        Follow-up Ticket
                      </button>
                    </div>
                  </div>

                  {/* Service Order Details */}
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e' }}>Service Order Details</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {selectedSOInTab.ticketId && <span style={{ fontSize: 11, background: '#eff6ff', color: '#2563eb', fontWeight: 700, padding: '2px 8px', borderRadius: 4, border: '1px solid #bfdbfe' }}>Ticket: {selectedSOInTab.ticketId}</span>}
                        {selectedSOInTab.serviceRefId && <span style={{ fontSize: 11, background: '#f3f4f6', color: '#374151', fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>Ref: {selectedSOInTab.serviceRefId}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px 16px' }}>
                      {[
                        ['Service Type', selectedSOInTab.type, false],
                        ['Request Type', selectedSOInTab.requestType === 'Paid' ? `Paid (₹${selectedSOInTab.serviceCharges})` : 'Free', selectedSOInTab.requestType === 'Paid'],
                        ['Created Date', selectedSOInTab.createdDate, false],
                        ['Status', selectedSOInTab.status, false],
                      ].map(([l, v, highlight]) => (
                        <div key={l}>
                          <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{l}</div>
                          <div style={{ fontSize: 13, color: highlight ? '#c2410c' : '#1a1a2e', fontWeight: 600 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product + Customer Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e', marginBottom: 10 }}>Product Details</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                        {[
                          ['Product', selectedSOInTab.product?.name],
                          ['Brand', selectedSOInTab.product?.brand],
                          ['Serial No.', selectedSOInTab.product?.serial],
                          ['Family', selectedSOInTab.product?.family],
                          ['SKU', selectedSOInTab.product?.sku],
                          ['Order ID', selectedSOInTab.orderId],
                        ].map(([l, v]) => (
                          <div key={l}>
                            <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{l}</div>
                            <div style={{ fontSize: 12.5, color: l === 'Order ID' ? '#2563eb' : '#1a1a2e', fontWeight: 500 }}>{v || '—'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e', marginBottom: 10 }}>Customer Details</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                        {[
                          ['Customer Name', selectedSOInTab.customer?.name],
                          ['Mobile', selectedSOInTab.customer?.phone],
                          ['Customer ID', selectedSOInTab.customer?.code],
                          ['Sold to Party', selectedSOInTab.customer?.soldToParty],
                          ['Sales Office', selectedSOInTab.customer?.salesOffice],
                          ['Store', selectedSOInTab.customer?.storeCode],
                        ].map(([l, v]) => (
                          <div key={l}>
                            <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{l}</div>
                            <div style={{ fontSize: 12.5, color: '#1a1a2e', fontWeight: 500 }}>{v || '—'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Engineer & Appointment */}
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e', marginBottom: 10 }}>Engineer & Appointment</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px 16px', marginBottom: 10 }}>
                      {[
                        ['Engineer Name', selectedSOInTab.engineer?.name, false],
                        ['Engineer Contact', selectedSOInTab.engineer?.phone, true],
                        ['Appointment Date & Time', selectedSOInTab.appointmentDate, false],
                        ['Est. Completion', selectedSOInTab.estimatedTAT, false],
                      ].map(([l, v, link]) => (
                        <div key={l}>
                          <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{l}</div>
                          <div style={{ fontSize: 12.5, color: link ? '#2563eb' : '#1a1a2e', fontWeight: 500 }}>{v || '—'}</div>
                        </div>
                      ))}
                    </div>
                    {selectedSOInTab.serviceNote && (
                      <div style={{ background: '#f9fafb', borderLeft: '3px solid #d1d5db', padding: '6px 10px', fontSize: 12, color: '#374151', marginBottom: 8, borderRadius: '0 4px 4px 0' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Service Note: </span>{selectedSOInTab.serviceNote}
                      </div>
                    )}
                    {selectedSOInTab.address && (
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Service Address: </span>{selectedSOInTab.address}
                      </div>
                    )}
                  </div>

                  {/* Complaints */}
                  {(() => {
                    const soComplaints = complaints.filter(c => c.serviceOrderId === selectedSOInTab.id);
                    if (!soComplaints.length) return null;
                    return (
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e', marginBottom: 10 }}>Complaints ({soComplaints.length})</div>
                        <table className="kap-prod-table" style={{ margin: 0 }}>
                          <thead>
                            <tr>
                              <th>Complaint ID</th><th>Category</th><th>Sub Category</th><th>Department</th><th>Status</th><th>Date</th><th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {soComplaints.map(c => (
                              <tr key={c.id} className="order-row" style={{ cursor: 'pointer' }}
                                onClick={() => { setSelectedComplaint(c); setActiveOrderTab('complaints'); }}>
                                <td style={{ color: '#dc2626', fontWeight: 700, fontSize: 12 }}>{c.id}</td>
                                <td style={{ fontSize: 12 }}>{c.category}</td>
                                <td style={{ fontSize: 12 }}>{c.subCategory}</td>
                                <td><span style={{ background: '#f3f4f6', color: '#374151', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>{c.department}</span></td>
                                <td><SOStatusBadge status={c.status} /></td>
                                <td style={{ fontSize: 12, color: '#6b7280' }}>{c.createdDate}</td>
                                <td>
                                  <button
                                    style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                    onClick={e => { e.stopPropagation(); setSelectedComplaint(c); setActiveOrderTab('complaints'); }}
                                  >View</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}

                  {/* Follow-up Tickets */}
                  {(() => {
                    const soTickets = tickets.filter(t =>
                      t.id === selectedSOInTab.ticketId || t.taggedOrder === selectedSOInTab.orderId
                    );
                    if (!soTickets.length) return null;
                    return (
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e', marginBottom: 10 }}>Follow-up Enquiries ({soTickets.length})</div>
                        <table className="kap-prod-table" style={{ margin: 0 }}>
                          <thead>
                            <tr>
                              <th>Ticket ID</th><th>Type</th><th>Issue Type</th><th>Title</th><th>Status</th><th>Assignee</th><th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {soTickets.map(t => (
                              <tr key={t.id} className="order-row">
                                <td style={{ color: '#2563eb', fontWeight: 700, fontSize: 12 }}>{t.id}</td>
                                <td><span style={{ background: '#eff6ff', color: '#2563eb', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>{t.type}</span></td>
                                <td style={{ fontSize: 12 }}>{t.issueType}</td>
                                <td style={{ fontSize: 12 }}>
                                  <div style={{ fontWeight: 500 }}>{t.title}</div>
                                  {t.notes && <div style={{ fontSize: 11, color: '#6b7280', fontStyle: 'italic', marginTop: 3 }}>📝 {t.notes}</div>}
                                </td>
                                <td><SOStatusBadge status={t.status} /></td>
                                <td style={{ fontSize: 12, color: '#374151' }}>{t.assignee}</td>
                                <td style={{ fontSize: 12, color: '#6b7280' }}>{t.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}

                  {/* Status Timeline */}
                  {selectedSOInTab.statusHistory?.length > 0 && (
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e', marginBottom: 12 }}>Status Timeline</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {selectedSOInTab.statusHistory.map((h, i) => (
                          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                              background: i === selectedSOInTab.statusHistory.length - 1 ? '#16a34a' : '#d1d5db',
                              border: i === selectedSOInTab.statusHistory.length - 1 ? '2px solid #16a34a' : '2px solid #d1d5db'
                            }} />
                            <div>
                              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a2e' }}>{h.status}</div>
                              <div style={{ fontSize: 11.5, color: '#6b7280', marginTop: 1 }}>{h.date} · {h.by}</div>
                              <div style={{ fontSize: 12, color: '#374151', marginTop: 2 }}>{h.remarks}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Order cards — shown for 'all' and 'orders' tabs */}
          {(activeOrderTab === 'all' || activeOrderTab === 'orders') && filteredOrders.length === 0 && (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: 24, fontSize: 13 }}>No orders found</div>
          )}

          {(activeOrderTab === 'all' || activeOrderTab === 'orders') && filteredOrders.map(order => {
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
                                  <tr key={so.id} className="order-row" style={{ background: foundSO?.id === so.id ? '#fdf4ff' : 'white', cursor: 'pointer' }}
                                    onClick={() => { setSelectedSOInTab(so); setActiveOrderTab('so'); }}>
                                    <td style={{ fontWeight: 700, color: '#7c3aed', fontSize: 12 }}>#{so.id}</td>
                                    <td style={{ fontSize: 11.5, color: '#6b7280' }}>{so.sapServiceOrderNo}</td>
                                    <td style={{ fontSize: 12 }}>{so.type}</td>
                                    <td style={{ fontSize: 12, maxWidth: 160 }}>{so.product?.name?.slice(0, 30)}{so.product?.name?.length > 30 ? '…' : ''}</td>
                                    <td><SOStatusBadge status={so.status} /></td>
                                    <td style={{ fontSize: 12 }}>{so.engineer?.name}</td>
                                    <td>
                                      <button
                                        style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        onClick={e => { e.stopPropagation(); setSelectedSOInTab(so); setActiveOrderTab('so'); }}
                                      >
                                        View
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
                        <div className="kap-accordion-body" style={{ paddingTop: 8 }}>
                          {order.trackingSteps?.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                              {order.trackingSteps.map((step, i) => (
                                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                  {/* Line + dot */}
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 20 }}>
                                    <div style={{
                                      width: 16, height: 16, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                                      background: step.current ? '#2563eb' : step.done ? '#16a34a' : '#e5e7eb',
                                      border: `2px solid ${step.current ? '#2563eb' : step.done ? '#16a34a' : '#d1d5db'}`,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                      {step.done && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
                                    </div>
                                    {i < order.trackingSteps.length - 1 && (
                                      <div style={{ width: 2, flexGrow: 1, minHeight: 28, background: step.done ? '#16a34a' : '#e5e7eb', margin: '2px 0' }} />
                                    )}
                                  </div>
                                  {/* Content */}
                                  <div style={{ paddingBottom: i < order.trackingSteps.length - 1 ? 16 : 4 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                      <span style={{ fontSize: 12.5, fontWeight: 700, color: step.current ? '#2563eb' : step.done ? '#1a1a2e' : '#9ca3af' }}>
                                        {step.status}
                                      </span>
                                      {step.current && (
                                        <span style={{ fontSize: 10, fontWeight: 700, background: '#dbeafe', color: '#2563eb', padding: '1px 6px', borderRadius: 10 }}>CURRENT</span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>{step.date} · {step.time}</div>
                                    <div style={{ fontSize: 11.5, color: '#374151', marginTop: 2 }}>{step.desc}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="kap-fields-grid">
                              <div className="kap-field-item"><div className="kap-field-label">Status</div><div className="kap-field-value">{order.status}</div></div>
                              <div className="kap-field-item"><div className="kap-field-label">Date</div><div className="kap-field-value">{order.orderDate}</div></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Shipsy Status — Story 1 & 2 */}
                    {(() => {
                      const shipsyOpen = openAccordions[`shipsy-${order.orderId}`];
                      const shipsy = order.shipsy;
                      const statusChip = (status) => {
                        const m = { Delivered: ['#d1fae5','#065f46'], 'In Transit': ['#dbeafe','#1d4ed8'], 'Out for Delivery': ['#fed7aa','#9a3412'], Returned: ['#fee2e2','#991b1b'] };
                        const [bg, color] = m[status] || ['#f3f4f6','#374151'];
                        return <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 10, background: bg, color }}>{status}</span>;
                      };
                      return (
                        <div className="kap-accordion">
                          <div className="kap-accordion-hdr" onClick={() => {
                            toggleAccordion(`shipsy-${order.orderId}`);
                            if (!shipsyOpen) logAuditEvent('status_card_viewed', order.orderId);
                          }}>
                            <span className="kap-accordion-title" style={{ color: '#0369a1', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Truck size={13} /> Shipsy Status
                            </span>
                            {shipsyOpen ? <ChevronUp size={14} color="#9ca3af" /> : <ChevronDown size={14} color="#9ca3af" />}
                          </div>
                          {shipsyOpen && (
                            <div className="kap-accordion-body">
                              {!shipsy ? (
                                <div style={{ color: '#9ca3af', fontSize: 12.5, textAlign: 'center', padding: '8px 0' }}>No shipment found for this order</div>
                              ) : (
                                <>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                    {statusChip(shipsy.currentStatus)}
                                    <span style={{ fontSize: 11.5, color: '#6b7280' }}>via {shipsy.logisticsPartner}</span>
                                    <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 'auto' }}>AWB: <strong style={{ fontFamily: 'monospace', color: '#374151' }}>{shipsy.airwayBill}</strong></span>
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: 12 }}>
                                    {[
                                      ['Last Scan Event', shipsy.lastScanEvent, 'Most recent carrier scan event'],
                                      ['Last Scan Date & Time', `${shipsy.lastScanDate} · ${shipsy.lastScanTime}`, 'Date and time of the last carrier scan'],
                                      ['Current Location', shipsy.currentLocation, 'Location as per last carrier scan'],
                                      ['Expected Delivery', shipsy.expectedDeliveryDate, 'Estimated delivery date from carrier'],
                                      ['Logistics Partner', shipsy.logisticsPartner, 'Carrier / logistics company'],
                                      ['Airway Bill / AWB', shipsy.airwayBill, 'Airway bill or tracking number from carrier'],
                                    ].map(([l, v, tip]) => (
                                      <div key={l}>
                                        <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }} title={tip}>{l}</div>
                                        <div style={{ fontSize: 12.5, color: '#1a1a2e', fontWeight: 500 }}>{v}</div>
                                      </div>
                                    ))}
                                  </div>
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                      title="Copy tracking link to clipboard"
                                      onClick={() => {
                                        navigator.clipboard?.writeText(shipsy.trackingUrl).catch(() => {});
                                        setCopiedLink(order.orderId);
                                        setTimeout(() => setCopiedLink(null), 2000);
                                        logAuditEvent('tracking_link_copied', order.orderId);
                                      }}
                                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: copiedLink === order.orderId ? '#d1fae5' : '#f3f4f6', color: copiedLink === order.orderId ? '#065f46' : '#374151', border: 'none', borderRadius: 5, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                      {copiedLink === order.orderId ? <CheckCheck size={13} /> : <Copy size={13} />}
                                      {copiedLink === order.orderId ? 'Copied!' : 'Copy Link'}
                                    </button>
                                    <a href={shipsy.trackingUrl} target="_blank" rel="noopener noreferrer"
                                      onClick={() => logAuditEvent('tracking_link_opened', order.orderId)}
                                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#0369a1', color: 'white', border: 'none', borderRadius: 5, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
                                      <ExternalLink size={13} /> Open in Shipsy
                                    </a>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Invoice — Story 3 */}
                    {(() => {
                      const invoiceOpen = openAccordions[`invoice-${order.orderId}`];
                      const inv = order.invoice;
                      return (
                        <div className="kap-accordion">
                          <div className="kap-accordion-hdr" onClick={() => {
                            toggleAccordion(`invoice-${order.orderId}`);
                            if (!invoiceOpen) logAuditEvent('invoice_section_viewed', order.orderId);
                          }}>
                            <span className="kap-accordion-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <FileText size={13} /> Invoice
                            </span>
                            {invoiceOpen ? <ChevronUp size={14} color="#9ca3af" /> : <ChevronDown size={14} color="#9ca3af" />}
                          </div>
                          {invoiceOpen && (
                            <div className="kap-accordion-body">
                              {!inv ? (
                                <div style={{ color: '#9ca3af', fontSize: 12.5, textAlign: 'center' }}>No invoice data available</div>
                              ) : (
                                <>
                                  <div className="kap-fields-grid">
                                    {[
                                      ['Invoice Number', inv.invoiceNumber, false],
                                      ['Invoice Date', inv.invoiceDate, false],
                                      ['Invoice Amount', `₹${inv.invoiceAmount.toLocaleString('en-IN')}`, false],
                                      ['Tax Amount', `₹${inv.taxAmount.toLocaleString('en-IN')}`, false],
                                      ['Payment Method', inv.paymentMethod, false],
                                      ['Payment Status', inv.paymentStatus, true],
                                    ].map(([l, v, chip]) => (
                                      <div key={l} className="kap-field-item">
                                        <div className="kap-field-label">{l}</div>
                                        <div className="kap-field-value">
                                          {chip ? (
                                            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: v === 'Paid' ? '#d1fae5' : '#fef3c7', color: v === 'Paid' ? '#065f46' : '#92400e' }}>{v}</span>
                                          ) : v}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div style={{ marginTop: 10 }}>
                                    <a href={inv.invoiceFileLink} target="_blank" rel="noopener noreferrer"
                                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#2563eb', fontWeight: 600, textDecoration: 'none', padding: '4px 8px', background: '#eff6ff', borderRadius: 5, border: '1px solid #bfdbfe' }}>
                                      <FileText size={12} /> View Invoice PDF
                                    </a>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Returns & Refund — Story 4 */}
                    {(() => {
                      const returnsOpen = openAccordions[`returns-${order.orderId}`];
                      const ret = order.returns;
                      const pickupColor = (s) => ({ Completed: '#065f46', Scheduled: '#1d4ed8', Attempted: '#92400e', Failed: '#991b1b' }[s] || '#374151');
                      const refundColor = (s) => ({ Processed: '#065f46', Approved: '#1d4ed8', 'Pending Approval': '#92400e', 'Not Started': '#9ca3af' }[s] || '#374151');
                      return (
                        <div className="kap-accordion">
                          <div className="kap-accordion-hdr" onClick={() => {
                            toggleAccordion(`returns-${order.orderId}`);
                            if (!returnsOpen) logAuditEvent('refund_section_viewed', order.orderId);
                          }}>
                            <span className="kap-accordion-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <RotateCcw size={13} /> Returns &amp; Refund
                            </span>
                            {returnsOpen ? <ChevronUp size={14} color="#9ca3af" /> : <ChevronDown size={14} color="#9ca3af" />}
                          </div>
                          {returnsOpen && (
                            <div className="kap-accordion-body">
                              {!ret ? (
                                <div style={{ color: '#9ca3af', fontSize: 12.5, textAlign: 'center' }}>No return or refund initiated for this order</div>
                              ) : (
                                <>
                                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Return Progress</div>
                                  <div className="kap-fields-grid" style={{ marginBottom: 14 }}>
                                    <div className="kap-field-item">
                                      <div className="kap-field-label">Return Initiated</div>
                                      <div className="kap-field-value">{ret.returnInitiatedDate}</div>
                                    </div>
                                    <div className="kap-field-item">
                                      <div className="kap-field-label">Pickup Status</div>
                                      <div className="kap-field-value">
                                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: ret.pickupStatus === 'Completed' ? '#d1fae5' : ret.pickupStatus === 'Failed' ? '#fee2e2' : '#dbeafe', color: pickupColor(ret.pickupStatus) }}>{ret.pickupStatus}</span>
                                      </div>
                                    </div>
                                    <div className="kap-field-item">
                                      <div className="kap-field-label">Return Tracking ID</div>
                                      <div className="kap-field-value" style={{ fontFamily: 'monospace', fontSize: 11.5 }}>{ret.returnTrackingId}</div>
                                    </div>
                                    <div className="kap-field-item">
                                      <div className="kap-field-label">Return to Origin (RTO)</div>
                                      <div className="kap-field-value">{ret.rtoStatus || 'N/A'}</div>
                                    </div>
                                  </div>
                                  {ret.refund && (
                                    <>
                                      <div style={{ fontSize: 11.5, fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Refund Progress</div>
                                      <div className="kap-fields-grid">
                                        <div className="kap-field-item">
                                          <div className="kap-field-label">Refund Status</div>
                                          <div className="kap-field-value">
                                            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: ret.refund.status === 'Processed' ? '#d1fae5' : ret.refund.status === 'Approved' ? '#dbeafe' : '#fef3c7', color: refundColor(ret.refund.status) }}>{ret.refund.status}</span>
                                          </div>
                                        </div>
                                        <div className="kap-field-item">
                                          <div className="kap-field-label">Refund Mode</div>
                                          <div className="kap-field-value">{ret.refund.mode}</div>
                                        </div>
                                        <div className="kap-field-item">
                                          <div className="kap-field-label">Refund Amount</div>
                                          <div className="kap-field-value" style={{ fontWeight: 700 }}>₹{ret.refund.amount.toLocaleString('en-IN')}</div>
                                        </div>
                                        <div className="kap-field-item">
                                          <div className="kap-field-label">UTR / Reference ID</div>
                                          <div className="kap-field-value" style={{ fontFamily: 'monospace', fontSize: 11.5 }}>{ret.refund.utr}</div>
                                        </div>
                                        <div className="kap-field-item">
                                          <div className="kap-field-label">ARN</div>
                                          <div className="kap-field-value" style={{ fontFamily: 'monospace', fontSize: 11.5 }}>{ret.refund.arn || '—'}</div>
                                        </div>
                                        <div className="kap-field-item">
                                          <div className="kap-field-label">Expected Refund Date</div>
                                          <div className="kap-field-value">{ret.refund.expectedDate}</div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            );
          })}

          {/* Case 2 — Add Product section (shown when on all/orders tab and no product history) */}
          {(activeOrderTab === 'all' || activeOrderTab === 'orders') && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, margin: '12px 0', background: 'white', overflow: 'hidden' }}>
              {filteredOrders.length === 0 && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, margin: 12, padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, color: '#d97706', marginTop: 1 }}>⚠</span>
                  <div style={{ fontSize: 12, color: '#78350f', lineHeight: 1.5 }}>
                    No product history found. Please share an alternative registered mobile number and try again. If the customer does not have an alternative number, proceed to add a new product and raise a <strong>B2B / PBG service request</strong>.
                  </div>
                </div>
              )}
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', cursor: 'pointer', borderTop: filteredOrders.length === 0 ? '1px solid #fde68a' : 'none' }}
                onClick={() => setAddProductOpen(p => !p)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>+ Add Product</span>
                  <span style={{ fontSize: 11, color: '#6b7280' }}>Create SR for new product (B2B / PBG)</span>
                </div>
                <span style={{ fontSize: 16, color: '#6b7280', transform: addProductOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>+</span>
              </div>
              {addProductOpen && (
                <div style={{ padding: '0 14px 16px', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
                    <div>
                      <label className="kap-label">Date of Purchase <span style={{ color: '#dc2626' }}>*</span></label>
                      <input className="kap-input" type="date" value={newProd.dop} onChange={e => setNewProd(p => ({ ...p, dop: e.target.value }))} />
                    </div>
                    <div>
                      <label className="kap-label">Family <span style={{ color: '#dc2626' }}>*</span></label>
                      <select className="kap-input" value={newProd.family} onChange={e => setNewProd(p => ({ ...p, family: e.target.value, brand: '' }))}>
                        <option value="">Select family</option>
                        {['Air Conditioner','Washing Machine','Refrigerator','TV','Microwave','Water Purifier'].map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="kap-label">Brand <span style={{ color: '#dc2626' }}>*</span></label>
                      <select className="kap-input" value={newProd.brand} onChange={e => setNewProd(p => ({ ...p, brand: e.target.value }))} disabled={!newProd.family}>
                        <option value="">Select brand</option>
                        {({ 'Air Conditioner': ['Samsung','LG','Voltas','Bluestar','Godrej','Daikin','Hitachi'], 'Washing Machine': ['Godrej','LG','Samsung','IFB','Whirlpool'], 'Refrigerator': ['LG','Samsung','Godrej','Whirlpool','Haier'], 'TV': ['Samsung','LG','Sony','TCL','Vu'], 'Microwave': ['LG','Samsung','IFB','Godrej'], 'Water Purifier': ['Kent','Livpure','AO Smith','Eureka Forbes'] }[newProd.family] || []).map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="kap-label">Product ID</label>
                      <input className="kap-input" placeholder="Product ID / SKU" value={newProd.productId} onChange={e => setNewProd(p => ({ ...p, productId: e.target.value }))} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="kap-label">MFG Serial Number</label>
                      <input className="kap-input" placeholder="e.g. D123456789" value={newProd.mfgSerial} onChange={e => setNewProd(p => ({ ...p, mfgSerial: e.target.value }))} />
                    </div>
                  </div>
                  <button
                    style={{ marginTop: 14, width: '100%', padding: '9px 0', background: newProd.dop && newProd.family && newProd.brand ? '#2563eb' : '#9ca3af', color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 6, cursor: newProd.dop && newProd.family && newProd.brand ? 'pointer' : 'not-allowed', letterSpacing: 0.3 }}
                    disabled={!newProd.dop || !newProd.family || !newProd.brand}
                    onClick={() => {
                      const syntheticProduct = { id: `SYN-${Date.now()}`, name: `${newProd.brand} ${newProd.family}`, brand: newProd.brand, family: newProd.family, modelNo: newProd.productId || '—', serialNo: newProd.mfgSerial || '—', purchaseDate: newProd.dop, warranty: 'N/A' };
                      const syntheticOrder = { orderId: `B2B-${Date.now()}`, date: newProd.dop, status: 'New', products: [syntheticProduct], totalAmount: 0, shipsy: null, invoice: null, returns: null };
                      handleCreateSRForProduct(syntheticOrder, syntheticProduct);
                    }}
                  >
                    Create Service Request
                  </button>
                </div>
              )}
            </div>
          )}

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

        {/* Notes */}
        <div style={{ marginBottom: 12 }}>
          <label className="kap-label" style={{ fontWeight: 600, color: '#374151' }}>Notes</label>
          <textarea
            className="kap-input"
            placeholder="Add notes or comments for this ticket..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            style={{ resize: 'vertical', minHeight: 72, fontFamily: 'inherit', lineHeight: 1.5 }}
          />
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
