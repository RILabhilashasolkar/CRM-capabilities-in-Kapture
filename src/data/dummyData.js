export const currentUser = { name: 'Abhilash Asolkar', avatar: 'AA' };

// ── Kapture tickets ─────────────────────────────────────────────────────
export const tickets = [
  { id: 'TKT-7781', title: 'Complaint follow up', customer: 'Anushq8801235091', phone: '7791015502', source: 'RD.IN', type: 'Call', vertical: 'Complaint', issueType: 'Repair Related', priority: 'Low', status: 'Pending', assignee: 'Uday Adhikari', sla: 'SLA is violated', date: '18-05-2026', subStatus: 'Unattended', taggedOrder: null },
  { id: 'TKT-7782', title: 'NEHA ELECTRONICS AND MOBILE CENTRE - Installation Related', customer: 'NEHA ELECTRONICS', phone: '9689808472', source: 'JMD', type: 'Email', vertical: 'Enquiry', issueType: 'Demo & Installation', priority: 'Low', status: 'Pending', assignee: 'Uday Adhikari', sla: '1:00:41', date: '18-05-2026', subStatus: 'Unattended', taggedOrder: 'B63515626500726', notes: 'Customer reported AC cooling not effective after installation. Engineer visit scheduled for re-inspection. Customer available post 10AM.' },
  { id: 'TKT-7783', title: 'MK - Repair related', customer: 'Abdul Jabir Khan', phone: '8800123456', source: 'RD.IN', type: 'Call', vertical: 'Request', issueType: 'Repair Related', priority: 'Low', status: 'Pending', assignee: 'Nivedhita Rajesh Dev', sla: '4 Days Remaining', date: '18-05-2026', subStatus: 'Unattended', taggedOrder: 'JMD-20260101-440012' },
  { id: 'TKT-7784', title: 'External – ac not serviced, engineer no-show via ResQ app booking', customer: 'sankarparvathi528@gmail.com', phone: '7791015503', source: 'RD.IN', type: 'Email', vertical: 'Complaint', issueType: 'Repair Related', priority: 'Low', status: 'Pending', assignee: 'Sachin Singh Bhadu', sla: '5 Days Remaining', date: '18-05-2026', subStatus: 'Unattended', taggedOrder: null },
  { id: 'TKT-7785', title: 'Invoice & Warranty Activation Issue – HP Laptop Mobile 7419885341', customer: 'Sachin Singh Bhadu', phone: '7419885341', source: 'JMD', type: 'Email', vertical: 'Enquiry', issueType: 'Billing Related', priority: 'Low', status: 'Pending', assignee: 'Sachin Singh Bhadu', sla: '5 Days Remaining', date: '18-05-2026', subStatus: 'Unattended', taggedOrder: null },
  { id: 'TKT-7786', title: 'Refund related', customer: 'PRASHANT VERMA', phone: '9916265181', source: 'RD.IN', type: 'Call', vertical: 'Request', issueType: 'Refunds', priority: 'Low', status: 'Pending', assignee: 'PRASHANT VERMA', sla: 'SLA is violated', date: '18-05-2026', subStatus: 'Unattended', taggedOrder: null },
  { id: 'TKT-7787', title: 'Return Follow-up – Washing Machine', customer: 'Gajendiran Perumal', phone: '9916265181', source: 'RD.IN', type: 'Call', vertical: 'Request', issueType: 'Store Related', priority: 'Low', status: 'Pending', assignee: 'RABI GHOSH', sla: 'SLA is violated', date: '18-05-2026', subStatus: 'Unattended', taggedOrder: 'ORD-20240402-001', notes: 'Installation was delayed by 3 days. Customer escalated via call. Engineer no-show on first slot – rescheduled.' },
];

// ── Customers ─────────────────────────────────────────────────────────────
export const customers = {
  '9689808472': { name: 'Abhilash Asolkar', firstName: 'Abhilash', lastName: 'Asolkar', code: '25400001', email: 'abhilash.asolkar@jiml.org', phone: '9689808472', addresses: [{ id: 'A1', type: 'Home', flat: 'Flat 402', building: 'Sunrise Apts', street: 'Yari Road', area: 'Near D-Mart', city: 'Mumbai', district: 'Mumbai', state: 'Maharashtra', pincode: '400061' }, { id: 'A2', type: 'Office', flat: 'Floor 12', building: 'JioMart Digital HQ', street: 'BKC Road', area: 'Bandra Kurla Complex', city: 'Mumbai', district: 'Mumbai', state: 'Maharashtra', pincode: '400051' }] },
  '7791015502': { name: 'Ravi Kumar Sharma', firstName: 'Ravi Kumar', lastName: 'Sharma', code: '10200453', email: 'ravi.sharma@gmail.com', phone: '7791015502', addresses: [{ id: 'A1', type: 'Home', flat: '12', building: 'Green Park Colony', street: 'Sector 45 Road', area: 'Near Metro Station', city: 'Gurugram', district: 'Gurugram', state: 'Haryana', pincode: '122002' }] },
  '8800123456': { name: 'Priya Mehta', firstName: 'Priya', lastName: 'Mehta', code: '30145678', email: 'priya.mehta@email.com', phone: '8800123456', addresses: [{ id: 'A1', type: 'Home', flat: 'B-204', building: 'Silver Oak Society', street: 'Vastrapur Road', area: 'Near Wonder Park', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', pincode: '380015' }] },
  '9916265181': { name: 'Gajendiran Perumal', firstName: 'Gajendiran', lastName: 'Perumal', code: '40299001', email: 'gajendiran.p@email.com', phone: '9916265181', addresses: [{ id: 'A1', type: 'Home', flat: '112 A', building: '724', street: '11th Road, Khar West', area: 'Near Wonders Park', city: 'Navi Mumbai', district: 'Mumbai', state: 'Maharashtra', pincode: '400006' }] },
};

// ── Products (by serial number) ──────────────────────────────────────────
export const productsBySerial = {
  '8323456789': { family: 'Washing Machine', brand: 'Godrej', productId: '581107043', productName: 'Godrej 7KG FALT ADR 70 R Grey', serialNo: '8323456789', objectId: 'OBJ-WM-001' },
  'SN-BS-2026-0044': { family: 'Air Conditioner', brand: 'Bluestar', productId: '581112288', productName: 'Bluestar 2 Ton 3 Star Inverter Split AC (IA322DXU)', serialNo: 'SN-BS-2026-0044', objectId: 'OBJ-AC-004' },
  'SN-LG-2025-0187': { family: 'Air Conditioner', brand: 'LG', productId: '490112201', productName: 'LG 1.5 Ton 5 Star Inverter Split AC (PS-Q19YNZE)', serialNo: 'SN-LG-2025-0187', objectId: 'OBJ-AC-008' },
};

// ── Orders per customer ────────────────────────────────────────────────────
export const customerOrders = {
  '9689808472': [
    {
      orderId: 'B63515626500726', orderDate: '06-04-2026', status: 'Delivered', amount: 92416.98,
      trackingSteps: [
        { status: 'Order Placed', date: '03-04-2026', time: '10:22 AM', done: true, current: false, desc: 'Order placed successfully on JioMart' },
        { status: 'Order Confirmed & Packed', date: '04-04-2026', time: '09:00 AM', done: true, current: false, desc: 'Item verified and packed at Mumbai warehouse' },
        { status: 'Shipped', date: '04-04-2026', time: '06:30 PM', done: true, current: false, desc: 'Dispatched via BlueDart — AWB: BD7291048302' },
        { status: 'Out for Delivery', date: '06-04-2026', time: '08:45 AM', done: true, current: false, desc: 'Out for delivery — Delivery executive: Ramesh K.' },
        { status: 'Delivered', date: '06-04-2026', time: '01:30 PM', done: true, current: true, desc: 'Delivered at Flat 402, Sunrise Apts, Yari Road, Mumbai' },
      ],
      products: [
        { sku: '581112288', name: 'Bluestar 2 Ton 3 Star Inverter Split AC (IA322DXU, White)', qty: 1, price: 45500.99, serialNo: 'SN-BS-2026-0044', objectId: 'OBJ-AC-004', family: 'Air Conditioner', brand: 'Bluestar', brandType: 'Authorised', hdGng: 'HD', warranty: 'Within Warranty', warrantyExpiry: '05-04-2028', warrantyDetails: '2 years comprehensive warranty', installationType: 'Free', installationCharges: 0, installationStatus: 'Completed', upcomingPMS: '05-10-2026' },
        { sku: '600725903', name: 'ResQ Installation Service', qty: 1, price: 1415.00, serialNo: 'N/A', objectId: 'N/A', family: 'Service', brand: 'ResQ', brandType: 'N/A', hdGng: 'N/A', warranty: 'N/A', warrantyExpiry: 'N/A', warrantyDetails: 'N/A', installationType: 'N/A', installationCharges: 0, installationStatus: 'N/A', upcomingPMS: 'N/A' },
      ],
      shipsy: { currentStatus: 'Delivered', lastScanEvent: 'Package delivered to recipient', lastScanDate: '06-04-2026', lastScanTime: '01:30 PM', currentLocation: 'Flat 402, Sunrise Apts, Yari Road, Mumbai 400061', expectedDeliveryDate: '06-04-2026', logisticsPartner: 'BlueDart', airwayBill: 'BD7291048302', trackingUrl: 'https://www.bluedart.com/tracking/BD7291048302' },
      invoice: { invoiceNumber: 'INV-2026-B6351562', invoiceDate: '06-04-2026', invoiceAmount: 92416.98, taxAmount: 8401.54, paymentMethod: 'Credit Card', paymentStatus: 'Paid', invoiceFileLink: '#' },
      returns: null,
    },
    {
      orderId: 'BB681077040EAFF98674', orderDate: '29-04-2025', status: 'Delivered', amount: 34800.00,
      trackingSteps: [
        { status: 'Order Placed', date: '26-04-2025', time: '03:10 PM', done: true, current: false, desc: 'Order placed successfully on JioMart' },
        { status: 'Order Confirmed & Packed', date: '27-04-2025', time: '10:00 AM', done: true, current: false, desc: 'Item verified and packed at Pune warehouse' },
        { status: 'Shipped', date: '27-04-2025', time: '05:00 PM', done: true, current: false, desc: 'Dispatched via Delhivery — AWB: DL8830192847' },
        { status: 'Out for Delivery', date: '29-04-2025', time: '09:15 AM', done: true, current: false, desc: 'Out for delivery — Delivery executive: Suresh P.' },
        { status: 'Delivered', date: '29-04-2025', time: '12:45 PM', done: true, current: true, desc: 'Delivered at Flat 402, Sunrise Apts, Yari Road, Mumbai' },
      ],
      products: [
        { sku: '490112201', name: 'LG 1.5 Ton 5 Star Inverter Split AC (PS-Q19YNZE)', qty: 1, price: 34800.00, serialNo: 'SN-LG-2025-0187', objectId: 'OBJ-AC-008', family: 'Air Conditioner', brand: 'LG', brandType: 'Authorised', hdGng: 'HD', warranty: 'Within Warranty', warrantyExpiry: '28-04-2027', warrantyDetails: '2 years comprehensive warranty', installationType: 'Free', installationCharges: 0, installationStatus: 'Completed', upcomingPMS: '28-10-2026' },
      ],
      shipsy: { currentStatus: 'Delivered', lastScanEvent: 'Shipment delivered successfully', lastScanDate: '29-04-2025', lastScanTime: '12:45 PM', currentLocation: 'Flat 402, Sunrise Apts, Yari Road, Mumbai 400061', expectedDeliveryDate: '29-04-2025', logisticsPartner: 'Delhivery', airwayBill: 'DL8830192847', trackingUrl: 'https://www.delhivery.com/track/package/DL8830192847' },
      invoice: { invoiceNumber: 'INV-2025-BB681077', invoiceDate: '29-04-2025', invoiceAmount: 34800.00, taxAmount: 3163.64, paymentMethod: 'UPI', paymentStatus: 'Paid', invoiceFileLink: '#' },
      returns: null,
    },
  ],
  '9916265181': [
    {
      orderId: 'ORD-20240402-001', orderDate: '02-04-2024', status: 'Delivered', amount: 28500.00,
      trackingSteps: [
        { status: 'Order Placed', date: '30-03-2024', time: '11:00 AM', done: true, current: false, desc: 'Order placed successfully on JioMart' },
        { status: 'Order Confirmed & Packed', date: '31-03-2024', time: '02:00 PM', done: true, current: false, desc: 'Item verified and packed at Delhi warehouse' },
        { status: 'Shipped', date: '01-04-2024', time: '08:00 AM', done: true, current: false, desc: 'Dispatched via DTDC — AWB: DT5510293847' },
        { status: 'Out for Delivery', date: '02-04-2024', time: '07:30 AM', done: true, current: false, desc: 'Out for delivery — Delivery executive: Mohan L.' },
        { status: 'Delivered', date: '02-04-2024', time: '11:20 AM', done: true, current: true, desc: 'Delivered at 112 A, 724, 11th Road, Khar West, Navi Mumbai' },
      ],
      products: [
        { sku: '581107043', name: 'Godrej 7KG FALT WTEON ADR 70 R Grey', qty: 1, price: 28500.00, serialNo: '83982392', objectId: 'OBJ-WM-001', family: 'Washing Machine', brand: 'Godrej', brandType: 'Unauthorised', hdGng: 'HD', warranty: 'Within Warranty', warrantyExpiry: '24-05-2026', warrantyDetails: '2 years comprehensive warranty', installationType: 'Paid', installationCharges: 300, installationStatus: 'NA', upcomingPMS: '01-10-2024' },
      ],
      shipsy: { currentStatus: 'Delivered', lastScanEvent: 'Package delivered to recipient', lastScanDate: '02-04-2024', lastScanTime: '11:20 AM', currentLocation: '112 A, 724, 11th Road, Khar West, Navi Mumbai 400006', expectedDeliveryDate: '02-04-2024', logisticsPartner: 'DTDC', airwayBill: 'DT5510293847', trackingUrl: 'https://www.dtdc.in/trace.asp?cnno=DT5510293847' },
      invoice: { invoiceNumber: 'INV-2024-ORD040200', invoiceDate: '02-04-2024', invoiceAmount: 28500.00, taxAmount: 2590.91, paymentMethod: 'Debit Card', paymentStatus: 'Paid', invoiceFileLink: '#' },
      returns: { returnInitiatedDate: '10-04-2024', pickupStatus: 'Completed', returnTrackingId: 'RTN-2024-WM-001-DTDC', rtoStatus: null, refund: { status: 'Processed', mode: 'Original Payment Method', amount: 28500.00, utr: 'UTR-HDFC-20240415-9876543', arn: 'ARN-HDFC-2024-0054321', expectedDate: '15-04-2024' } },
    },
  ],
  '8800123456': [
    {
      orderId: 'JMD-20260101-440012', orderDate: '01-01-2026', status: 'Delivered', amount: 28999.00,
      trackingSteps: [
        { status: 'Order Placed', date: '29-12-2025', time: '04:05 PM', done: true, current: false, desc: 'Order placed successfully on JioMart' },
        { status: 'Order Confirmed & Packed', date: '30-12-2025', time: '11:00 AM', done: true, current: false, desc: 'Item verified and packed at Ahmedabad warehouse' },
        { status: 'Shipped', date: '30-12-2025', time: '07:00 PM', done: true, current: false, desc: 'Dispatched via Ecom Express — AWB: EC9920374821' },
        { status: 'Out for Delivery', date: '01-01-2026', time: '08:00 AM', done: true, current: false, desc: 'Out for delivery — Delivery executive: Pradeep V.' },
        { status: 'Delivered', date: '01-01-2026', time: '02:10 PM', done: true, current: true, desc: 'Delivered at B-204, Silver Oak Society, Vastrapur, Ahmedabad' },
      ],
      products: [
        { sku: '810034521', name: 'Samsung 1.5 Ton 3 Star Inverter Split AC (AR18TYHYCWK)', qty: 1, price: 28999.00, serialNo: 'SN-SS-2026-0031', objectId: 'OBJ-AC-011', family: 'Air Conditioner', brand: 'Samsung', brandType: 'Authorised', hdGng: 'GNG', warranty: 'Within Warranty', warrantyExpiry: '31-12-2027', warrantyDetails: '2 years comprehensive warranty', installationType: 'Free', installationCharges: 0, installationStatus: 'Completed', upcomingPMS: '30-06-2027' },
      ],
      shipsy: { currentStatus: 'Delivered', lastScanEvent: 'Delivered at customer address', lastScanDate: '01-01-2026', lastScanTime: '02:10 PM', currentLocation: 'B-204, Silver Oak Society, Vastrapur, Ahmedabad 380015', expectedDeliveryDate: '01-01-2026', logisticsPartner: 'Ecom Express', airwayBill: 'EC9920374821', trackingUrl: 'https://ecomexpress.in/tracking/?awb_field=EC9920374821' },
      invoice: { invoiceNumber: 'INV-2026-JMD440012', invoiceDate: '01-01-2026', invoiceAmount: 28999.00, taxAmount: 2636.27, paymentMethod: 'Net Banking', paymentStatus: 'Paid', invoiceFileLink: '#' },
      returns: null,
    },
  ],
  '7791015502': [
    {
      orderId: 'RD-20260318-009123', orderDate: '18-03-2026', status: 'Delivered', amount: 65000.00,
      trackingSteps: [
        { status: 'Order Placed', date: '15-03-2026', time: '01:30 PM', done: true, current: false, desc: 'Order placed successfully on JioMart' },
        { status: 'Order Confirmed & Packed', date: '16-03-2026', time: '10:30 AM', done: true, current: false, desc: 'Items verified and packed at Gurugram warehouse' },
        { status: 'Shipped', date: '16-03-2026', time: '06:00 PM', done: true, current: false, desc: 'Dispatched via BlueDart — AWB: BD4471920384' },
        { status: 'Out for Delivery', date: '18-03-2026', time: '09:00 AM', done: true, current: false, desc: 'Out for delivery — Delivery executive: Anil S.' },
        { status: 'Delivered', date: '18-03-2026', time: '03:45 PM', done: true, current: true, desc: 'Delivered at 12, Green Park Colony, Sector 45, Gurugram' },
      ],
      products: [
        { sku: '701098321', name: 'Voltas 1.5 Ton 3 Star Inverter Split AC (183V CZW)', qty: 1, price: 32000.00, serialNo: 'SN-VT-2026-0091', objectId: 'OBJ-AC-015', family: 'Air Conditioner', brand: 'Voltas', brandType: 'Authorised', hdGng: 'HD', warranty: 'Within Warranty', warrantyExpiry: '17-03-2028', warrantyDetails: '2 years comprehensive warranty', installationType: 'Paid', installationCharges: 500, installationStatus: 'Completed', upcomingPMS: '17-09-2027' },
        { sku: '701098322', name: 'Voltas 2 Ton 5 Star Inverter Window AC', qty: 1, price: 33000.00, serialNo: 'SN-VT-2024-0019', objectId: 'OBJ-AC-016', family: 'Air Conditioner', brand: 'Voltas', brandType: 'Authorised', hdGng: 'GNG', warranty: 'Out of Warranty', warrantyExpiry: '17-03-2024', warrantyDetails: 'Expired', installationType: 'Paid', installationCharges: 500, installationStatus: 'Completed', upcomingPMS: 'N/A' },
      ],
      shipsy: { currentStatus: 'Delivered', lastScanEvent: 'All items delivered successfully', lastScanDate: '18-03-2026', lastScanTime: '03:45 PM', currentLocation: '12, Green Park Colony, Sector 45, Gurugram 122002', expectedDeliveryDate: '18-03-2026', logisticsPartner: 'BlueDart', airwayBill: 'BD4471920384', trackingUrl: 'https://www.bluedart.com/tracking/BD4471920384' },
      invoice: { invoiceNumber: 'INV-2026-RD009123', invoiceDate: '18-03-2026', invoiceAmount: 65000.00, taxAmount: 5909.09, paymentMethod: 'Credit Card', paymentStatus: 'Paid', invoiceFileLink: '#' },
      returns: null,
    },
  ],
};

// ── Service Orders ─────────────────────────────────────────────────────────
export const serviceOrders = [
  {
    id: '86379827',
    ticketId: 'TKT-7787',
    serviceRefId: 'SR-JMD-2026-0044',
    sapServiceOrderNo: 'SAP-SO-88001234',
    type: 'Installation',
    requestType: 'Paid',
    serviceCharges: 300,
    customer: { name: 'Gajendiran Perumal', phone: '9916265181', code: '40299001', soldToParty: 'Mr Gajendiran Perumal', employeeResponsible: 'Mr Abhilash Asolkar', salesOffice: 'TDR9', storeCode: 'RRL Bhawani Singh Marg Jaipur', department: 'HO Store' },
    product: { name: 'Godrej 7KG FALT WTEON ADR 70 R', serial: '83982392', sku: '581107043', objectId: 'OBJ-WM-001', family: 'Washing Machine', brand: 'Godrej' },
    orderId: 'ORD-20240402-001',
    address: '112 A, 724, 11th Road Khar West, Near Wonders Park, Navi Mumbai – 400006, Maharashtra',
    status: 'In Progress',
    createdDate: '28-04-2024',
    engineer: { name: 'Abhilash Asolkar', phone: '9689808472', id: 'ENG-401' },
    appointmentDate: '28-Apr-2024 10:30:00 AM',
    estimatedTAT: '30-04-2024',
    serviceNote: 'Lorem Ipsum is simply dummy text',
    complaint: null,
    statusHistory: [
      { date: '28-04-2024 09:00', status: 'Created', remarks: 'Service order created via Agent portal', by: 'Abhilash Asolkar' },
      { date: '28-04-2024 10:00', status: 'Assigned', remarks: 'Engineer Abhilash Asolkar assigned', by: 'System' },
      { date: '28-04-2024 11:30', status: 'In Progress', remarks: 'Engineer on site', by: 'System' },
    ],
  },
  {
    id: '86379901',
    ticketId: 'TKT-7782',
    serviceRefId: 'SR-JMD-2026-0071',
    sapServiceOrderNo: 'SAP-SO-88001502',
    type: 'Repair',
    requestType: 'Free',
    serviceCharges: 0,
    customer: { name: 'Abhilash Asolkar', phone: '9689808472', code: '25400001', soldToParty: 'Mr Abhilash Asolkar', employeeResponsible: 'Mr Uday Adhikari', salesOffice: 'MUM9', storeCode: 'RRL Mumbai BKC', department: 'Mumbai Store' },
    product: { name: 'Bluestar 2 Ton 3 Star Inverter Split AC (IA322DXU)', serial: 'SN-BS-2026-0044', sku: '581112288', objectId: 'OBJ-AC-004', family: 'Air Conditioner', brand: 'Bluestar' },
    orderId: 'B63515626500726',
    address: 'Flat 402, Sunrise Apts, Yari Road, Mumbai – 400061, Maharashtra',
    status: 'Assigned',
    createdDate: '16-05-2026',
    engineer: { name: 'Rajesh Mehta', phone: '9876543210', id: 'ENG-219' },
    appointmentDate: '19-May-2026 02:00:00 PM',
    estimatedTAT: '20-05-2026',
    serviceNote: 'Cooling not effective, unusual noise from outdoor unit',
    complaint: null,
    statusHistory: [
      { date: '16-05-2026 11:00', status: 'Created', remarks: 'Service order created', by: 'Uday Adhikari' },
      { date: '16-05-2026 13:20', status: 'Assigned', remarks: 'Engineer Rajesh Mehta assigned', by: 'System' },
    ],
  },
];

// ── Complaints ─────────────────────────────────────────────────────────────
export const complaints = [
  {
    id: 'COMP-2026-8834512901',
    serviceOrderId: '86379901',
    customer: { name: 'Abhilash Asolkar', phone: '9689808472' },
    categoryDesc: 'Complaints',
    transactionType: 'Digital complaints',
    department: 'ResQ',
    category: 'Repair related',
    subCategory: 'Repeated visit',
    source: 'Call',
    status: 'In progress',
    createdDate: '17-05-2026',
    statusHistory: [
      { date: '17-05-2026 11:30', status: 'Raised', by: 'Abhilash Asolkar', remarks: 'Complaint raised – AC repair issue not resolved after engineer visit' },
      { date: '18-05-2026 10:00', status: 'In progress', by: 'ResQ Team', remarks: 'Escalated to field service team for re-inspection' },
    ],
    followUps: [
      { id: 'TKT-7782', title: 'AC repair follow-up – Bluestar 2 Ton Split AC (IA322DXU)', type: 'Email', vertical: 'Enquiry', issueType: 'Service Quality', status: 'Pending', assignee: 'Uday Adhikari', date: '18-05-2026', notes: 'Customer reported AC cooling not effective after installation. Engineer visit scheduled for re-inspection. Customer available post 10AM.' },
      { id: 'TKT-7790', title: 'Re-inspection request – cooling still not effective after repair', type: 'Call', vertical: 'Complaint', issueType: 'Repair Related', status: 'Pending', assignee: 'Abhilash Asolkar', date: '20-05-2026', notes: 'Second follow-up call from customer. Outdoor unit making noise, gas leak suspected. Escalated to senior technician.' },
    ],
  },
  {
    id: 'COMP-2024-7374792384',
    serviceOrderId: '86379827',
    customer: { name: 'Gajendiran Perumal', phone: '9916265181' },
    categoryDesc: 'Complaints',
    transactionType: 'Digital complaints',
    department: 'ResQ',
    category: 'Installation related',
    subCategory: 'Delayed',
    source: 'Call',
    status: 'In progress',
    createdDate: '30-04-2024',
    statusHistory: [
      { date: '30-04-2024 10:00', status: 'Raised', by: 'Abhilash Asolkar', remarks: 'Complaint raised – installation delayed' },
      { date: '01-05-2024 09:00', status: 'In progress', by: 'ResQ Team', remarks: 'Escalated to field service' },
    ],
    followUps: [
      { id: 'TKT-7787', title: 'Return Follow-up – Washing Machine installation not done', type: 'Call', vertical: 'Request', issueType: 'Demo & Installation', status: 'Pending', assignee: 'RABI GHOSH', date: '03-05-2024', notes: 'Installation was delayed by 3 days. Customer escalated via call. Engineer no-show on first slot – rescheduled.' },
    ],
  },
];

// ── Appointment slots ──────────────────────────────────────────────────────
export const appointmentSlots = {
  '20-05-2026': ['09:00 AM – 11:00 AM', '11:00 AM – 01:00 PM', '02:00 PM – 04:00 PM'],
  '21-05-2026': ['10:00 AM – 12:00 PM', '03:00 PM – 05:00 PM'],
  '22-05-2026': ['09:00 AM – 11:00 AM', '02:00 PM – 04:00 PM'],
  '23-05-2026': ['11:00 AM – 01:00 PM'],
};

// ── IRIS symptoms ──────────────────────────────────────────────────────────
export const irisSymptoms = [
  'Machine not working', 'No cooling / Not cooling', 'Cooling not effective',
  'Water leakage – indoor unit', 'Water leakage – outdoor unit', 'Gas leakage suspected',
  'Unusual noise / vibration', 'Remote not working', 'Error code displayed',
  'Smell / Odour from unit', 'Ice formation on unit', 'Compressor not running',
  'Fan not running', 'Swing/louver not working', 'Wi-Fi / Smart control issue',
  'Does not start', 'Display not working',
];

export const serviceTypes = [
  { code: 'ZUR', label: 'Uninstallation' },
  { code: 'ZSR', label: 'Standard Installation' },
  { code: 'ZRV', label: 'Repair Service@cust site' },
  { code: 'ZRN', label: 'Reinstallation' },
  { code: 'ZNR', label: 'Non Std Installation' },
  { code: 'ZIR', label: 'Installation Request' },
  { code: 'ZIT', label: 'resQ GT Installation' },
  { code: 'ZGU', label: 'GT Uninstallation' },
  { code: 'ZGR', label: 'GT Repair' },
  { code: 'ZGM', label: 'GT Demo' },
  { code: 'ZGI', label: 'GT Installation' },
  { code: 'ZGD', label: 'GT Distribution Repair' },
  { code: 'ZDR', label: 'Demo Request' },
  { code: 'ZDM', label: 'Demo (Home Delivery)' },
  { code: 'ZDI', label: 'DOA Inspection Request' },
  { code: 'ZEM', label: 'Ecommerce Install' },
  { code: 'ZRL', label: 'RHP Repair -Lbr Only' },
  { code: 'ZRQ', label: 'ResQ GT PMS' },
  { code: 'ZGP', label: 'GT PMS' },
];

export const productFamilies = ['Air Conditioner', 'Washing Machine', 'Refrigerator', 'Microwave', 'Television', 'Dishwasher', 'Water Purifier'];
export const brandsByFamily = {
  'Air Conditioner': ['Bluestar', 'LG', 'Samsung', 'Voltas', 'Daikin', 'Carrier', 'Hitachi'],
  'Washing Machine': ['Godrej', 'LG', 'Samsung', 'Whirlpool', 'IFB', 'Haier'],
  'Refrigerator': ['LG', 'Samsung', 'Godrej', 'Whirlpool', 'Haier'],
  'Microwave': ['LG', 'Samsung', 'Morphy Richards', 'IFB'],
  'Television': ['LG', 'Samsung', 'Sony', 'TCL', 'OnePlus'],
  'Dishwasher': ['Bosch', 'Siemens', 'IFB'],
  'Water Purifier': ['Kent', 'AO Smith', 'Pureit', 'Livpure'],
};

export const complaintCategories = ['Installation related', 'Repair related', 'Billing related', 'Delivery related', 'Product quality'];
export const complaintSubCategories = {
  'Installation related': ['Delayed', 'Wrong installation', 'Engineer no-show', 'Incomplete installation'],
  'Repair related': ['Repeated visit', 'Problem not resolved', 'Wrong diagnosis', 'Parts replaced unnecessarily'],
  'Billing related': ['Extra charges', 'Refund not processed', 'Wrong invoice'],
  'Delivery related': ['Delayed delivery', 'Wrong item delivered', 'Damaged product'],
  'Product quality': ['DOA', 'Manufacturing defect', 'Performance issue'],
};
export const complaintDepartments = ['ResQ', 'Field Service', 'Customer Support', 'Logistics', 'Billing'];
export const transactionTypes = ['Digital complaints', 'Voice complaint', 'Email complaint', 'Social media'];

export const indiaStates = ['Andhra Pradesh', 'Delhi', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];
