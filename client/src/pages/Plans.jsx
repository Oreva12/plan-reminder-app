import { useState, useEffect } from 'react';
import api from '../api/client';
import PlanForm from './PlanForm';
import PlanTable from '../components/PlanTable';
import RenewPlanModal from '../components/RenewPlanModal';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Renewal modal states
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [renewing, setRenewing] = useState(false);

  // Sort plans by expiry date (soonest first)
  const sortPlans = (plans) =>
    [...plans].sort(
      (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
    );

  const loadPlans = async () => {
    try {
      const res = await api.get('/plans');
      setPlans(sortPlans(res.data.plans));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handlePlanCreated = (newPlan) => {
    setPlans((prev) => sortPlans([...prev, newPlan]));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return;

    try {
      await api.delete(`/plans/${id}`);
      setPlans((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete plan');
    }
  };

  // Open the renewal modal
  const handleRenew = (plan) => {
    setSelectedPlan(plan);
  };

  // Submit the renewal request
  const submitRenewal = async (plan, expiryDate) => {
    setRenewing(true);

    try {
      const res = await api.post(`/plans/${plan._id}/renew`, {
        expiryDate: new Date(`${expiryDate}T00:00:00.000Z`).toISOString(),
      });

      // Update and re-sort plans
      setPlans((prev) =>
        sortPlans(
          prev.map((p) =>
            p._id === plan._id ? res.data.plan : p
          )
        )
      );

      setSelectedPlan(null);
    } catch (err) {
      throw new Error(
        err.response?.data?.message || 'Failed to renew plan'
      );
    } finally {
      setRenewing(false);
    }
  };

  if (loading) return <p>Loading plans...</p>;

  return (
    <div>
      <h2>Your Plans</h2>

      <PlanForm onPlanCreated={handlePlanCreated} />

      <PlanTable
        plans={plans}
        onDelete={handleDelete}
        onRenew={handleRenew}
      />

      {/* Renewal Modal */}
      {selectedPlan && (
        <RenewPlanModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onRenew={submitRenewal}
          loading={renewing}
        />
      )}
    </div>
  );
}