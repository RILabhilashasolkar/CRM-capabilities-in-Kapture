import { useState } from 'react';
import { Wrench, CheckCircle, ChevronDown, ChevronUp, ArrowRight, ArrowLeft, User, Package, Calendar, AlertCircle } from 'lucide-react';
import { irisSymptoms, appointmentSlots, customers, customerOrders } from '../../data/dummyData';

const REQUEST_TYPES = [
  { id: 'installation', label: 'Installation Request', icon: '🔧', desc: 'New product installation at customer site', color: '#dbeafe' },
  { id: 'warranty', label: 'Service Request (In Warranty)', icon: '🛡️', desc: 'Repair/service for product under warranty', color: '#d1fae5' },
  { id: 'support', label: 'Support Ticket', icon: '💬', desc: 'General support, enquiry or guidance', color: '#ede9fe' },
  { id: 'out-warranty', label: 'Service Request (Out of Warranty)', icon: '⚙️', desc: 'Paid repair service for out-of-warranty products', color: '#fef3c7' },
];

export default function CreateServiceOrder({ prefill, onSuccess, onBack }) {
  const [step, setStep] = useState(1);
  const [requestType, setRequestType] = useState('');
  const [customerPhone, setCustomerPhone] = useState(prefill?.customer?.phone || '');
  const [foundCustomer, setFoundCustomer] = useState(prefill?.customer || null);
  const [selectedOrder, setSelectedOrder] = useState(prefill?.context?.order || null);
  const [selectedProduct, setSelectedProduct] = useState(prefill?.context?.product || null);
  const [symptom, setSymptom] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(prefill?.customer?.addresses?.[0] || null);
  const [submitted, setSubmitted] = useState(false);
  const [generatedId] = useState(`SO-2026-${String(Math.floor(1000 + Math.random() * 9000))}`);
  const [generatedRef] = useState(`SR-JMD-2026-${String(Math.floor(1000 + Math.random() * 9000))}`);

  const orders = foundCustomer ? (customerOrders[foundCustomer.phone] || []) : [];
  const availableSlots = selectedDate ? (appointmentSlots[selectedDate] || []) : [];

  const searchCustomer = () => {
    const c = customers[customerPhone];
    if (c) setFoundCustomer(c);
    else setFoundCustomer(null);
  };

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return <SuccessScreen soId={generatedId} refId={generatedRef} customer={foundCustomer} product={selectedProduct} requestType={requestType} onDone={onBack} />;
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="k-header px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="text-gray-500 hover:text-gray-800">
              <ArrowLeft size={15} />
            </button>
          )}
          <Wrench size={14} className="text-orange-500" />
          <span className="font-semibold text-gray-800">Create Service Request</span>
        </div>
        <StepBar step={step} />
      </div>

      <div className="p-4 flex-1">

        {/* Step 1: Select request type */}
        {step === 1 && (
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-3">Select Request Type</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {REQUEST_TYPES.map(rt => (
                <div
                  key={rt.id}
                  className={`p-3 rounded border-2 cursor-pointer transition-all ${requestType === rt.id ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
                  style={{ background: requestType === rt.id ? rt.color : 'white' }}
                  onClick={() => setRequestType(rt.id)}
                >
                  <div className="text-lg mb-1">{rt.icon}</div>
                  <div className="text-xs font-semibold text-gray-800">{rt.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{rt.desc}</div>
                </div>
              ))}
            </div>

            {requestType === 'out-warranty' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3 flex items-start gap-2">
                <AlertCircle size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-yellow-800">Out-of-Warranty Service</div>
                  <div className="text-xs text-yellow-700 mt-0.5">Inform the customer that service charges apply. A payment link will be generated post-diagnosis.</div>
                </div>
              </div>
            )}

            <button
              className="btn-primary flex items-center gap-1"
              disabled={!requestType}
              style={{ opacity: requestType ? 1 : 0.5 }}
              onClick={() => setStep(2)}
            >
              Next: Customer Details <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Step 2: Customer + Product */}
        {step === 2 && (
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-3">Customer & Product Details</div>

            {/* Customer search */}
            {!foundCustomer ? (
              <div className="card mb-3">
                <div className="card-header">Search Customer</div>
                <div className="p-3">
                  <div className="flex gap-2">
                    <input
                      className="form-input"
                      placeholder="Enter mobile number"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                    />
                    <button className="btn-primary" onClick={searchCustomer}>Search</button>
                  </div>
                  {customerPhone && !foundCustomer && (
                    <div className="text-xs text-red-500 mt-1">No customer found. Try 9689808472, 7791015502, or 8800123456</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card mb-3">
                <div className="card-header">
                  <div className="flex items-center gap-2"><User size={13} /> Customer Found</div>
                  <button className="text-xs text-blue-500" onClick={() => { setFoundCustomer(null); setSelectedOrder(null); setSelectedProduct(null); }}>Change</button>
                </div>
                <div className="kv-grid">
                  <div className="kv-item"><div className="kv-label">Name</div><div className="kv-value">{foundCustomer.name}</div></div>
                  <div className="kv-item"><div className="kv-label">Code</div><div className="kv-value">{foundCustomer.code}</div></div>
                  <div className="kv-item"><div className="kv-label">Phone</div><div className="kv-value">{foundCustomer.phone}</div></div>
                  <div className="kv-item"><div className="kv-label">Email</div><div className="kv-value">{foundCustomer.email}</div></div>
                </div>
              </div>
            )}

            {/* Order + Product selection */}
            {foundCustomer && (
              <>
                <div className="card mb-3">
                  <div className="card-header"><Package size={13} /> Select Order & Product</div>
                  <div className="p-3">
                    {orders.length === 0 && (
                      <div className="text-xs text-gray-400 py-2 text-center">No orders found for this customer</div>
                    )}
                    {orders.map(order => (
                      <div key={order.orderId} className="mb-2">
                        <div className="text-xs font-semibold text-blue-700 mb-1">Order #{order.orderId} — {order.orderDate}</div>
                        {order.products.filter(p => p.objectId !== 'N/A').map((p, i) => (
                          <label key={i} className={`flex items-start gap-2 p-2 rounded border cursor-pointer mb-1 ${selectedProduct?.objectId === p.objectId ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                            <input
                              type="radio"
                              name="product"
                              className="mt-1"
                              checked={selectedProduct?.objectId === p.objectId}
                              onChange={() => { setSelectedProduct(p); setSelectedOrder(order); }}
                            />
                            <div>
                              <div className="text-xs font-medium text-gray-800">{p.name}</div>
                              <div className="text-xs text-gray-500">Serial: {p.serial || p.serialNo} · OBJ: {p.objectId}</div>
                              <span className={`badge mt-0.5 ${p.warranty === 'In Warranty' ? 'badge-low' : 'badge-high'}`} style={{ fontSize: 9 }}>{p.warranty}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Address */}
                <div className="card mb-3">
                  <div className="card-header">Service Address</div>
                  <div className="p-3">
                    {foundCustomer.addresses.map(addr => (
                      <label key={addr.id} className={`flex items-start gap-2 p-2 rounded border cursor-pointer mb-1 ${selectedAddress?.id === addr.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                        <input
                          type="radio"
                          name="address"
                          className="mt-1"
                          checked={selectedAddress?.id === addr.id}
                          onChange={() => setSelectedAddress(addr)}
                        />
                        <div>
                          <div className="text-xs font-medium">{addr.type}</div>
                          <div className="text-xs text-gray-500">{addr.line1}, {addr.line2}, {addr.city}, {addr.state} – {addr.pincode}</div>
                        </div>
                      </label>
                    ))}
                    <button className="text-xs text-blue-500 mt-1 flex items-center gap-1">+ Add New Address</button>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2">
              <button className="btn-secondary flex items-center gap-1" onClick={() => setStep(1)}>
                <ArrowLeft size={12} /> Back
              </button>
              <button
                className="btn-primary flex items-center gap-1"
                disabled={!foundCustomer || !selectedProduct}
                style={{ opacity: foundCustomer && selectedProduct ? 1 : 0.5 }}
                onClick={() => setStep(3)}
              >
                Next: Symptoms & Appointment <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Symptoms + Appointment */}
        {step === 3 && (
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-3">Symptoms & Appointment Scheduling</div>

            {/* Symptom selection (only for repair/warranty) */}
            {(requestType === 'warranty' || requestType === 'out-warranty') && (
              <div className="card mb-3">
                <div className="card-header">Symptom (IRIS List)</div>
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    {irisSymptoms.map(s => (
                      <label key={s} className={`flex items-center gap-2 p-2 rounded border cursor-pointer text-xs ${symptom === s ? 'border-blue-400 bg-blue-50 font-medium' : 'border-gray-200 hover:border-blue-200'}`}>
                        <input type="radio" name="symptom" checked={symptom === s} onChange={() => setSymptom(s)} />
                        {s}
                      </label>
                    ))}
                  </div>
                  <div className="mt-2">
                    <label className="form-label">Additional Notes</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      placeholder="Describe the issue in detail..."
                      value={customSymptom}
                      onChange={e => setCustomSymptom(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Appointment scheduling */}
            <div className="card mb-3">
              <div className="card-header"><Calendar size={13} /> Appointment Scheduling</div>
              <div className="p-3">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {Object.keys(appointmentSlots).map(date => (
                    <div
                      key={date}
                      className={`p-2 border rounded cursor-pointer text-xs ${selectedDate === date ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                      onClick={() => { setSelectedDate(date); setSelectedSlot(''); }}
                    >
                      <div className="font-semibold">{date}</div>
                      <div className="text-gray-500">{appointmentSlots[date].length} slots available</div>
                    </div>
                  ))}
                </div>

                {selectedDate && (
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1.5">Available Slots for {selectedDate}</div>
                    <div className="flex flex-wrap gap-2">
                      {availableSlots.map(slot => (
                        <button
                          key={slot}
                          className={`text-xs px-3 py-1.5 rounded border ${selectedSlot === slot ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 hover:border-blue-300'}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="btn-secondary flex items-center gap-1" onClick={() => setStep(2)}>
                <ArrowLeft size={12} /> Back
              </button>
              <button
                className="btn-primary flex items-center gap-1"
                onClick={() => setStep(4)}
              >
                Review & Submit <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-3">Review & Confirm</div>

            <div className="card mb-3">
              <div className="card-header">Service Request Summary</div>
              <div className="kv-grid">
                <div className="kv-item"><div className="kv-label">Request Type</div><div className="kv-value">{REQUEST_TYPES.find(r => r.id === requestType)?.label}</div></div>
                <div className="kv-item"><div className="kv-label">Customer</div><div className="kv-value">{foundCustomer?.name}</div></div>
                <div className="kv-item"><div className="kv-label">Customer Code</div><div className="kv-value">{foundCustomer?.code}</div></div>
                <div className="kv-item"><div className="kv-label">Phone</div><div className="kv-value">{foundCustomer?.phone}</div></div>
                <div className="kv-item"><div className="kv-label">Product</div><div className="kv-value">{selectedProduct?.name || '—'}</div></div>
                <div className="kv-item"><div className="kv-label">Object ID</div><div className="kv-value">{selectedProduct?.objectId || '—'}</div></div>
                <div className="kv-item"><div className="kv-label">Serial No.</div><div className="kv-value">{selectedProduct?.serialNo || selectedProduct?.serial || '—'}</div></div>
                <div className="kv-item"><div className="kv-label">Warranty</div><div className="kv-value">{selectedProduct?.warranty || '—'}</div></div>
                {symptom && <div className="kv-item" style={{ gridColumn: '1 / -1' }}><div className="kv-label">Symptom</div><div className="kv-value">{symptom}</div></div>}
                <div className="kv-item"><div className="kv-label">Appointment Date</div><div className="kv-value">{selectedDate || 'Not scheduled'}</div></div>
                <div className="kv-item"><div className="kv-label">Time Slot</div><div className="kv-value">{selectedSlot || 'Not selected'}</div></div>
                <div className="kv-item" style={{ gridColumn: '1 / -1' }}><div className="kv-label">Service Address</div><div className="kv-value">{selectedAddress ? `${selectedAddress.line1}, ${selectedAddress.city} – ${selectedAddress.pincode}` : '—'}</div></div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-xs text-blue-800">
              <strong>What happens next:</strong> A Ticket will be created in Kapture and a Service Order will be auto-created in SAP CRM via the orchestration API. Customer will receive an SMS with the Service Reference ID.
            </div>

            <div className="flex gap-2">
              <button className="btn-secondary flex items-center gap-1" onClick={() => setStep(3)}>
                <ArrowLeft size={12} /> Back
              </button>
              <button
                className="btn-success flex items-center gap-1"
                onClick={handleSubmit}
              >
                <CheckCircle size={14} /> Submit Service Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepBar({ step }) {
  const steps = ['Request Type', 'Customer & Product', 'Symptom & Appt.', 'Review'];
  return (
    <div className="flex items-center gap-0 mt-2">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = step > num;
        const active = step === num;
        return (
          <div key={label} className="flex items-center">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${done ? 'text-green-600' : active ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {done ? '✓' : num}
              </span>
              {label}
            </div>
            {i < steps.length - 1 && <span className="text-gray-300 mx-0.5">›</span>}
          </div>
        );
      })}
    </div>
  );
}

function SuccessScreen({ soId, refId, customer, product, requestType, onDone }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <div className="text-lg font-bold text-gray-800 mb-1">Service Request Created!</div>
      <div className="text-sm text-gray-500 mb-6 text-center">Ticket created in Kapture. SAP Service Order created via orchestration API.</div>

      <div className="card w-full max-w-md mb-4">
        <div className="card-header">Reference IDs</div>
        <div className="kv-grid">
          <div className="kv-item"><div className="kv-label">Service Order ID</div><div className="kv-value text-blue-700">{soId}</div></div>
          <div className="kv-item"><div className="kv-label">Service Ref ID</div><div className="kv-value text-orange-700">{refId}</div></div>
          <div className="kv-item"><div className="kv-label">Customer</div><div className="kv-value">{customer?.name}</div></div>
          <div className="kv-item"><div className="kv-label">Product</div><div className="kv-value">{product?.name?.slice(0, 30) || 'N/A'}</div></div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded p-3 w-full max-w-md text-xs text-green-800 mb-4">
        SMS sent to {customer?.phone} with Service Reference ID and tracking link.
      </div>

      <button className="btn-primary" onClick={onDone}>Back to Service Orders</button>
    </div>
  );
}
