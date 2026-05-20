export default function StatusBadge({ status }) {
  const cls = {
    'In Progress': 'inprogress', 'Assigned': 'assigned', 'Completed': 'completed',
    'Created': 'created', 'Delivered': 'delivered', 'Pending': 'pending',
    'In progress': 'inprogress', 'Cancelled': 'created',
  }[status] || 'pending';
  return <span className={`status-badge ${cls}`}>{status}</span>;
}
