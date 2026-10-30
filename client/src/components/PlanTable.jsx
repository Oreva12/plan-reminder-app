import StatusBadge from './StatusBadge';

export default function PlanTable({ plans, onDelete, onRenew }) {
  if (plans.length === 0) return <p>No plans yet. Create your first one above!</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
          <th style={{ padding: 8 }}>Name</th>
          <th style={{ padding: 8 }}>Provider</th>
          <th style={{ padding: 8 }}>Category</th>
          <th style={{ padding: 8 }}>Expiry Date</th>
          <th style={{ padding: 8 }}>Status</th>
          <th style={{ padding: 8 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {plans.map((plan) => (
          <tr key={plan._id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: 8 }}>{plan.name}</td>
            <td style={{ padding: 8 }}>{plan.provider}</td>
            <td style={{ padding: 8 }}>{plan.category?.name || 'Unknown'}</td>
            <td style={{ padding: 8 }}>{new Date(plan.expiryDate).toLocaleDateString()}</td>
            <td style={{ padding: 8 }}><StatusBadge plan={plan} /></td>
            <td style={{ padding: 8 }}>
              <button onClick={() => onRenew(plan)} style={{ marginRight: 8 }}>Renew</button>
              <button onClick={() => onDelete(plan._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}