// Shipsy + nucleus_orders field resolution utilities
// Field priorities approved 30 Jun 2026

function toIST(ms, opts = {}) {
  if (!ms) return '';
  return new Date(Number(ms)).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    ...opts,
  });
}

export function fmtDate(ms) {
  return toIST(ms, { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fmtTime(ms) {
  return toIST(ms, { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Shipsy event → UI label
const EVENT_LABELS = {
  accept:           'Accepted by logistics',
  pickup_completed: 'Picked up / Shipped',
  out_for_delivery: 'Out for delivery',
  attempted:        'Delivery attempted',
  undelivered:      'Delivery attempted',
  delivered:        'Delivered',
  rto_in_transit:   'Return in transit',
  rto_delivered:    'Returned to origin',
};

// Shipsy event → status chip style
const EVENT_STATUS = {
  accept:           { label: 'In Transit',       bg: '#dbeafe', color: '#1d4ed8' },
  pickup_completed: { label: 'Shipped',           bg: '#dbeafe', color: '#1d4ed8' },
  out_for_delivery: { label: 'Out for Delivery',  bg: '#fed7aa', color: '#9a3412' },
  attempted:        { label: 'Attempted',         bg: '#ffedd5', color: '#9a3412' },
  undelivered:      { label: 'Attempted',         bg: '#ffedd5', color: '#9a3412' },
  delivered:        { label: 'Delivered',         bg: '#d1fae5', color: '#065f46' },
  rto_in_transit:   { label: 'Returning',         bg: '#ffedd5', color: '#9a3412' },
  rto_delivered:    { label: 'Returned',          bg: '#fee2e2', color: '#991b1b' },
};

// Priority: courier_partner_reference_number > reference_number >
//           customer_reference_number > order_number
function resolveTrackingId(ep) {
  const notNull = (v) => v && v !== 'null' ? v : null;
  return (
    notNull(ep.courier_partner_reference_number) ||
    notNull(ep.reference_number) ||
    notNull(ep.customer_reference_number) ||
    notNull(ep.order_number) ||
    null
  );
}

// Priority: meta promise.formatted > display_message > event EDD > 'Not available'
function resolveDeliveryPromise(meta, ep) {
  try {
    const s = meta?.shipments?.[0];
    const f = s?.promise?.formatted;
    if (f?.min) return f.min === f.max ? f.min : `${f.min} – ${f.max}`;
    if (s?.display_message) return s.display_message;
  } catch (_) {}
  if (ep?.estimated_delivery_date) return ep.estimated_delivery_date;
  return 'Not available';
}

// Priority: carrier_location+code > hub_code > shipping_address city > 'Not available'
function resolveCurrentLocation(ep, shippingAddrStr) {
  const notNull = (v) => v && v !== 'null' ? v : null;
  const loc = notNull(ep?.carrier_location);
  if (loc) {
    const code = notNull(ep?.carrier_location_code);
    return code ? `${loc} (${code})` : loc;
  }
  const hub = notNull(ep?.hub_code);
  if (hub) return `Hub: ${hub}`;
  try {
    const addr = JSON.parse(shippingAddrStr);
    if (addr?.city) return `${addr.city}${addr.state ? ', ' + addr.state : ''} (Delivery address)`;
  } catch (_) {}
  return 'Not available';
}

// Use logistics_meta.account_info.name from meta (user-approved priority)
function resolveLogisticsPartner(meta) {
  try {
    const name = meta?.shipments?.[0]?.logistics_meta?.account_info?.name;
    if (name) return name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  } catch (_) {}
  return 'Reliance Logistics';
}

// Determine which tracking step is current (1–5 scale)
function currentStepNum(eventName, orderStatus) {
  const steps = {
    delivered:        5,
    rto_delivered:    5,
    attempted:        4.5,
    undelivered:      4.5,
    out_for_delivery: 4,
    pickup_completed: 3,
    accept:           3,
  };
  if (eventName && steps[eventName] !== undefined) return steps[eventName];
  if (orderStatus === 'PAYMENT_SUCCESS') return 2;
  return 1;
}

// Main transform: nucleus_order + nucleus_event_logs → { trackingSteps, shipsy }
export function buildFromNucleus(order) {
  const n = order._nucleusOrder;
  const rawEvents = order._shipsyEvents || [];

  let meta = null;
  try { meta = JSON.parse(n.meta); } catch (_) {}

  // Parse and sort events — latest first
  const events = rawEvents
    .map((e) => { try { return JSON.parse(e.event_payload); } catch (_) { return null; } })
    .filter(Boolean)
    .sort((a, b) => b.event_time - a.event_time);

  const latest = events[0] || null;
  const chrono = [...events].reverse(); // oldest first for timeline

  // ── Field resolution ──────────────────────────────────────────────────
  const logisticsPartner = resolveLogisticsPartner(meta);
  const deliveryPromise  = resolveDeliveryPromise(meta, latest);
  const currentLocation  = latest
    ? resolveCurrentLocation(latest, n.shipping_address)
    : 'Not available';
  const trackingId = latest ? resolveTrackingId(latest) : null;

  const eventName  = latest?.event || null;
  const statusInfo = EVENT_STATUS[eventName] || { label: 'Processing', bg: '#f3f4f6', color: '#374151' };

  // ── Shipsy status card ────────────────────────────────────────────────
  const nn = (v) => v && v !== 'null' ? v : null;
  const shipsy = {
    currentStatus:       statusInfo.label,
    statusBg:            statusInfo.bg,
    statusColor:         statusInfo.color,
    lastScanEvent:       EVENT_LABELS[eventName] || 'Order processing',
    lastScanDate:        latest ? fmtDate(latest.event_time) : fmtDate(new Date(n.order_date).getTime()),
    lastScanTime:        latest ? fmtTime(latest.event_time) : '',
    currentLocation:     currentLocation !== 'Not available' ? currentLocation : null,
    expectedDeliveryDate: deliveryPromise !== 'Not available' ? deliveryPromise : null,
    logisticsPartner,
    airwayBill:          trackingId || n.order_id,
    trackingUrl:         null,
    failureReason:       (eventName === 'attempted' || eventName === 'undelivered') ? nn(latest?.failure_reason) : null,
    receivedBy:          eventName === 'delivered' ? nn(latest?.receiver_name) : null,
    fleetType:           nn(latest?.courier_partner),
    hubCode:             nn(latest?.hub_code),
    consignmentType:     nn(latest?.consignment_type),
    serviceType:         nn(latest?.service_type),
    deliveryAgentCode:   nn(latest?.worker_code),
  };

  // ── Tracking timeline ─────────────────────────────────────────────────
  const orderMs  = new Date(n.order_date).getTime();
  const stepNum  = currentStepNum(eventName, n.status);
  const fulfillId = meta?.shipments?.[0]?.fulfillment_meta?.fulfillment_id || '';
  const channelLabel = n.channel === 'RD' ? 'Reliance Digital' : 'JioMart';

  const shipEvent      = chrono.find((e) => e.event === 'pickup_completed' || e.event === 'accept');
  const ofdEvent       = chrono.find((e) => e.event === 'out_for_delivery');
  const deliveredEvent = chrono.find((e) => e.event === 'delivered');
  const attemptedEvent = chrono.find((e) => e.event === 'attempted' || e.event === 'undelivered');
  const rtoEvent       = chrono.find((e) => e.event === 'rto_delivered');

  // Step 5 varies by terminal state
  let step5 = {
    status: 'Delivery Expected',
    date:   deliveryPromise !== 'Not available' ? deliveryPromise : '—',
    time:   '',
    done:   false,
    current: stepNum >= 4.5 || stepNum === 5 ? false : false,
    desc:   `Expected by ${deliveryPromise}`,
  };
  if (deliveredEvent) {
    step5 = { status: 'Delivered', date: fmtDate(deliveredEvent.event_time), time: fmtTime(deliveredEvent.event_time), done: true, current: true, desc: deliveredEvent.receiver_name ? `Delivered to ${deliveredEvent.receiver_name}` : 'Delivered to customer' };
  } else if (rtoEvent) {
    step5 = { status: 'Returned to Origin', date: fmtDate(rtoEvent.event_time), time: fmtTime(rtoEvent.event_time), done: false, current: true, desc: 'Package returned to origin warehouse' };
  } else if (attemptedEvent) {
    const reason = attemptedEvent.failure_reason && attemptedEvent.failure_reason !== '' ? attemptedEvent.failure_reason : 'Delivery attempt was made';
    step5 = { status: 'Delivery Attempted', date: fmtDate(attemptedEvent.event_time), time: fmtTime(attemptedEvent.event_time), done: false, current: true, desc: reason };
  }

  const trackingSteps = [
    {
      status: 'Order Placed',
      date:    fmtDate(orderMs),
      time:    fmtTime(orderMs),
      done:    stepNum >= 1,
      current: stepNum === 1,
      desc:    `Order placed on ${channelLabel}`,
    },
    {
      status: 'Order Confirmed & Packed',
      date:    fmtDate(orderMs),
      time:    '',
      done:    stepNum >= 2 && n.status === 'PAYMENT_SUCCESS',
      current: stepNum === 2,
      desc:    `Confirmed — fulfillment center ${fulfillId}`,
    },
    {
      status: 'Shipped',
      date:    shipEvent ? fmtDate(shipEvent.event_time) : '—',
      time:    shipEvent ? fmtTime(shipEvent.event_time) : '',
      done:    stepNum >= 3 && !!shipEvent,
      current: stepNum === 3,
      desc:    shipEvent
        ? `Picked up by ${logisticsPartner}${trackingId ? ` — AWB: ${trackingId}` : ''}`
        : `Awaiting pickup by ${logisticsPartner}`,
    },
    {
      status: 'Out for Delivery',
      date:    ofdEvent ? fmtDate(ofdEvent.event_time) : '—',
      time:    ofdEvent ? fmtTime(ofdEvent.event_time) : '',
      done:    stepNum >= 4 && !!ofdEvent,
      current: stepNum === 4,
      desc:    ofdEvent ? 'Out for delivery' : 'Pending',
    },
    step5,
  ];

  return { trackingSteps, shipsy };
}
