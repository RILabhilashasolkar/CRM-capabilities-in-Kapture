import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import SOULayout from './SOULayout';
import {
  customers, customerOrders, productsBySerial, serviceTypes, irisSymptoms,
  productFamilies, brandsByFamily, appointmentSlots, indiaStates
} from '../../data/dummyData';

export default function RaiseServiceRequest({ onBack, onSuccess }) {
  // Customer
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [customerFound, setCustomerFound] = useState(null);

  // Product — serial lookup
  const [serialInput, setSerialInput] = useState('');
  const [resolvedProduct, setResolvedProduct] = useState(null);
  const [addProduct, setAddProduct] = useState(false);
  const [manualFamily, setManualFamily] = useState('');
  const [manualBrand, setManualBrand] = useState('');
  const [manualProductId, setManualProductId] = useState('');
  const [manualSerial, setManualSerial] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');

  // Service request
  const [serviceType, setServiceType] = useState('');
  const [symptom, setSymptom] = useState('');
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [requestType, setRequestType] = useState(''); // Free / Paid
  const [serviceCharge, setServiceCharge] = useState(0);

  // Address
  const [flat, setFlat] = useState('');
  const [building, setBuilding] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [serviceNote, setServiceNote] = useState('');
  const [noteCount, setNoteCount] = useState(0);

  const [submitted, setSubmitted] = useState(false);
  const [soId] = useState(() => Math.floor(80000000 + Math.random() * 9999999).toString());

  // Auto-fill customer when phone matches
  const handlePhoneChange = (v) => {
    setPhone(v);
    const c = customers[v];
    if (c) {
      setCustomerFound(c);
      setFirstName(c.firstName);
      setLastName(c.lastName);
      const addr = c.addresses?.[0];
      if (addr) { setFlat(addr.flat); setBuilding(addr.building); setStreet(addr.street); setArea(addr.area); setCity(addr.city); setState(addr.state); setPincode(addr.pincode); }
    } else {
      setCustomerFound(null);
    }
  };

  // Serial number lookup
  const handleSerialLookup = (v) => {
    setSerialInput(v);
    // Check all customer orders for matching serial
    const allProducts = Object.values(customerOrders).flat().flatMap(o => o.products);
    const found = allProducts.find(p => p.serialNo === v);
    if (found) {
      setResolvedProduct(found);
      if (!purchaseDate) {
        const order = Object.values(customerOrders).flat().find(o => o.products.some(p => p.serialNo === v));
        if (order) setPurchaseDate(order.orderDate);
      }
    } else {
      setResolvedProduct(null);
    }
  };

  // Pincode auto-fill city/state (stub)
  const handlePincode = (v) => {
    setPincode(v);
    if (v === '400006') { setCity('Navi Mumbai'); setState('Maharashtra'); }
    else if (v === '400061') { setCity('Mumbai'); setState('Maharashtra'); }
    else if (v === '380015') { setCity('Ahmedabad'); setState('Gujarat'); }
    else if (v === '122002') { setCity('Gurugram'); setState('Haryana'); }
  };

  const handleCheckEligibility = () => {
    const effectiveSerial = resolvedProduct?.serialNo || serialInput;
    const product = resolvedProduct;
    const REPAIR_CODES = ['ZRV', 'ZGR', 'ZGD', 'ZRL'];
    const INSTALL_CODES = ['ZSR', 'ZNR', 'ZIR', 'ZRN', 'ZIT', 'ZGI', 'ZEM'];
    const PMS_CODES = ['ZRQ', 'ZGP'];
    if (REPAIR_CODES.includes(serviceType) || PMS_CODES.includes(serviceType)) {
      if (product?.warranty === 'Within Warranty') { setRequestType('Free'); setServiceCharge(0); }
      else { setRequestType('Paid'); setServiceCharge(300); }
    } else if (INSTALL_CODES.includes(serviceType)) {
      const installationType = product?.installationType || 'Paid';
      if (installationType === 'Free') { setRequestType('Free'); setServiceCharge(0); }
      else { setRequestType('Paid'); setServiceCharge(product?.installationCharges || 300); }
    } else {
      setRequestType('Paid'); setServiceCharge(300);
    }
    setEligibilityChecked(true);
  };

  const handleSubmit = () => setSubmitted(true);

  const productInScope = resolvedProduct;
  const showIris = ['ZRV','ZGR','ZGD','ZRL','ZRQ','ZGP'].includes(serviceType);

  if (submitted) {
    return (
      <SOULayout onBack={onBack}>
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <span className="text-green-600 text-3xl">✓</span>
          </div>
          <div className="font-bold text-xl text-gray-800 mb-2">Service Request Created!</div>
          <div className="text-gray-500 text-sm mb-6">Your service request has been submitted successfully.</div>
          <div className="card w-full" style={{ maxWidth: 480 }}>
            <div className="card-title text-sm">Service Order Details</div>
            <div className="card-body">
              {[
                ['Service Order ID', soId, 'text-blue-700 font-bold'],
                ['Customer', `${firstName} ${lastName}`, ''],
                ['Phone', phone, ''],
                ['Product', resolvedProduct?.name || manualProductId || 'N/A', ''],
                ['Service Type', serviceType ? `${serviceType} – ${serviceTypes.find(t => t.code === serviceType)?.label || ''}` : '—', ''],
                ['Request Type', requestType, requestType === 'Paid' ? 'text-orange-600' : 'text-green-600'],
                ...(serviceCharge > 0 ? [['Service Charges', `₹${serviceCharge}`, 'text-orange-600']] : []),
              ].map(([l, v, cls]) => (
                <div key={l} className="flex gap-3 py-1.5 text-sm border-b border-gray-50">
                  <span className="text-gray-400 w-36 flex-shrink-0">{l}</span>
                  <span className={`font-semibold ${cls}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 w-full mt-4" style={{ maxWidth: 480 }}>
            SMS sent to {phone} with service order reference.
          </div>
          <div className="flex gap-3 mt-6">
            <button className="btn-outline-blue" onClick={onBack}>Back to Home</button>
            <button className="btn-primary" onClick={() => onSuccess?.(soId)}>View Service Order</button>
          </div>
        </div>
      </SOULayout>
    );
  }

  return (
    <SOULayout onBack={onBack}>
      <div className="sou-body">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 className="font-bold text-gray-800 mb-4" style={{ fontSize: 20 }}>Raise service request</h2>

          {/* ── Customer Details ── */}
          <div className="card">
            <div className="card-title">Customer details</div>
            <div className="card-body">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <div className="flex gap-0">
                  <span className="form-input flex-shrink-0 text-gray-500" style={{ width: 52, borderRight: 'none', borderRadius: '6px 0 0 6px' }}>+91</span>
                  <input
                    className="form-input"
                    style={{ borderRadius: '0 6px 6px 0' }}
                    placeholder="Mobile number"
                    value={phone}
                    onChange={e => handlePhoneChange(e.target.value)}
                  />
                </div>
                {!customerFound && phone.length > 5 && (
                  <div className="text-xs text-gray-400 mt-1">Try: 9916265181, 9689808472, 8800123456</div>
                )}
                {customerFound && <div className="text-xs text-green-600 mt-1">✓ Customer found: {customerFound.name}</div>}
              </div>
            </div>
          </div>

          {/* ── Product Details ── */}
          <div className="card">
            <div className="card-title">Product details</div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Date of purchase <span className="required">*</span></label>
                <input className="form-input" type="text" placeholder="DD Month YYYY" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">MFG Serial Number</label>
                <input
                  className="form-input"
                  placeholder="Enter serial number to auto-resolve product"
                  value={serialInput}
                  onChange={e => handleSerialLookup(e.target.value)}
                />
                {resolvedProduct && (
                  <div className="serial-resolved mt-2">
                    <span className="tag-chip">Family: {resolvedProduct.family}</span>
                    <span className="tag-chip">Brand: {resolvedProduct.brand}</span>
                    <span className="tag-chip">Product ID: {resolvedProduct.sku} ({resolvedProduct.name})</span>
                  </div>
                )}
                {!resolvedProduct && serialInput && (
                  <div className="text-xs text-gray-400 mt-1">Try: 83982392, SN-BS-2026-0044</div>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-3">
                <hr className="divider flex-1" />
                <span className="text-gray-400 text-xs">or</span>
                <hr className="divider flex-1" />
              </div>

              {/* Manual product entry */}
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Family <span className="required">*</span></label>
                  <select className="form-select" value={manualFamily} onChange={e => { setManualFamily(e.target.value); setManualBrand(''); }}>
                    <option value="">Select Family</option>
                    {productFamilies.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Brand <span className="required">*</span></label>
                  <select className="form-select" value={manualBrand} onChange={e => setManualBrand(e.target.value)} disabled={!manualFamily}>
                    <option value="">Select Brand</option>
                    {(brandsByFamily[manualFamily] || []).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Product ID <span className="required">*</span></label>
                  <select className="form-select" value={manualProductId} onChange={e => setManualProductId(e.target.value)} disabled={!manualBrand}>
                    <option value="">Select Product ID</option>
                    {manualBrand && <option value={`581107043 (${manualBrand} - Demo Product)`}>{`581107043 (${manualBrand} - Demo Product)`}</option>}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">MFG Serial Number</label>
                  <input className="form-input" placeholder="Enter serial number" value={manualSerial} onChange={e => setManualSerial(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Product Summary Card (if product resolved) ── */}
          {resolvedProduct && (
            <div className="card" style={{ border: '1px solid #e0e7ff' }}>
              <div className="flex items-center justify-between px-5 py-3">
                <div>
                  <div className="font-bold text-gray-800 text-base">{resolvedProduct.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Brand type: <strong>{resolvedProduct.brandType}</strong> &nbsp;·&nbsp; HD/GNG: <strong>{resolvedProduct.hdGng}</strong> &nbsp;·&nbsp; Serial No: <strong>{resolvedProduct.serialNo}</strong>
                  </div>
                </div>
              </div>
              <hr className="divider mx-5" />
              <div className="px-5 py-2">
                <div className="warranty-row">
                  <div>
                    <div className="warranty-label">Installation</div>
                    <div className="text-xs text-gray-600">Type: <strong>{resolvedProduct.installationType}</strong> &nbsp; Installation Charges: <strong>₹{resolvedProduct.installationCharges}</strong> &nbsp; Installation Status: <strong>{resolvedProduct.installationStatus}</strong></div>
                  </div>
                </div>
                <div className="warranty-row">
                  <div>
                    <div className="warranty-label">Warranty</div>
                    <div className="text-xs text-gray-600">
                      Status: <strong className={resolvedProduct.warranty === 'Within Warranty' ? 'text-green-600' : 'text-red-600'}>{resolvedProduct.warranty}</strong>
                      &nbsp; Expiry Date: <strong>{resolvedProduct.warrantyExpiry}</strong>
                      &nbsp; Warranty Details: <strong>{resolvedProduct.warrantyDetails}</strong>
                    </div>
                  </div>
                </div>
                {resolvedProduct.upcomingPMS && resolvedProduct.upcomingPMS !== 'N/A' && (
                  <div className="warranty-row" style={{ borderBottom: 'none' }}>
                    <div>
                      <div className="warranty-label">Upcoming PMS</div>
                      <div className="text-xs text-gray-600">Date: <strong>{resolvedProduct.upcomingPMS}</strong></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Raise Service Request section ── */}
          <div className="card">
            <div className="card-title">Raise service request</div>
            <div className="card-body">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="form-group">
                  <label className="form-label">Service Type <span className="required">*</span></label>
                  <div className="select-clearable">
                    <select className="form-select" value={serviceType} onChange={e => { setServiceType(e.target.value); setEligibilityChecked(false); setSymptom(''); }}>
                      <option value="">Select Service Type</option>
                      {serviceTypes.map(s => <option key={s.code} value={s.code}>{s.code} – {s.label}</option>)}
                    </select>
                    {serviceType && <button className="clear-btn" onClick={() => { setServiceType(''); setEligibilityChecked(false); }}>×</button>}
                  </div>
                </div>

                {showIris && (
                  <div className="form-group">
                    <label className="form-label">Repair related – Symptoms (IRIS) <span className="required">*</span></label>
                    <div className="select-clearable">
                      <select className="form-select" value={symptom} onChange={e => setSymptom(e.target.value)}>
                        <option value="">Select Symptom</option>
                        {irisSymptoms.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {symptom && <button className="clear-btn" onClick={() => setSymptom('')}>×</button>}
                    </div>
                  </div>
                )}
              </div>

              {/* Check Eligibility */}
              {serviceType && (
                <div>
                  <button className="eligibility-label mb-2" onClick={handleCheckEligibility}>Check Eligibility</button>
                  {eligibilityChecked && (
                    <div className="eligibility-bar">
                      <span className="eligibility-chip">Service Request Type: <strong className="ml-1">{requestType}</strong></span>
                      {serviceCharge > 0 && <span className="eligibility-chip">Service Charges: <strong className="ml-1 text-orange-600">₹{serviceCharge}</strong></span>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Service Address ── */}
          <div className="card">
            <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
              <div className="font-bold text-gray-800" style={{ fontSize: 15 }}>Service address</div>
              <button className="btn-outline-blue btn-sm flex items-center gap-1">✏️ Add new address</button>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Flat No. / Block No. <span className="required">*</span></label>
                  <input className="form-input" placeholder="Flat No." value={flat} onChange={e => setFlat(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Building <span className="required">*</span></label>
                  <input className="form-input" placeholder="Building" value={building} onChange={e => setBuilding(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Street <span className="required">*</span></label>
                  <input className="form-input" placeholder="Street" value={street} onChange={e => setStreet(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Area / Landmark <span className="required">*</span></label>
                  <input className="form-input" placeholder="Area / Landmark" value={area} onChange={e => setArea(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode <span className="required">*</span></label>
                  <input className="form-input" placeholder="Pincode" value={pincode} onChange={e => handlePincode(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">City / District / Town <span className="required">*</span></label>
                  <input className="form-input" placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">State <span className="required">*</span></label>
                  <select className="form-select" value={state} onChange={e => setState(e.target.value)}>
                    <option value="">Select State</option>
                    {indiaStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group mt-2">
                <label className="form-label">Write Service Note</label>
                <textarea
                  className="form-input"
                  rows={3}
                  maxLength={200}
                  placeholder="Add any notes for the service engineer..."
                  value={serviceNote}
                  onChange={e => { setServiceNote(e.target.value); setNoteCount(e.target.value.length); }}
                />
                <div className="text-right text-xs text-gray-400">{noteCount}/200</div>
              </div>

              <div className="flex gap-3 mt-4">
                <button className="btn-primary" onClick={handleSubmit}>Submit</button>
                <button className="btn-secondary" onClick={onBack}>Cancel</button>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 py-4">
            Copyright © 2024 JioMart Digital, a division of Reliance Retail Limited
          </div>
        </div>
      </div>
    </SOULayout>
  );
}
