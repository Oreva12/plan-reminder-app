// Logic copied from server/src/utils/planStatus.js
const EXPIRING_THRESHOLD_DAYS = 7;

function getPlanStatus(plan) {
  if (plan.cancelledAt) return 'cancelled';
  
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const expiry = new Date(plan.expiryDate);
  expiry.setUTCHours(0, 0, 0, 0);
  
  const days = Math.round((expiry - today) / (1000 * 60 * 60 * 24));
  
  if (days < 0) return 'expired';
  if (days <= EXPIRING_THRESHOLD_DAYS) return 'expiring';
  return 'active';
}

const colors = {
  active: { bg: '#e6f4ea', color: '#137333' },
  expiring: { bg: '#fef7e0', color: '#b06000' },
  expired: { bg: '#fce8e6', color: '#c5221f' },
  cancelled: { bg: '#f1f3f4', color: '#5f6368' },
};

export default function StatusBadge({ plan }) {
  const status = getPlanStatus(plan);
  const style = colors[status];
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      padding: '4px 12px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 600,
      textTransform: 'capitalize',
    }}>
      {status}
    </span>
  );
}