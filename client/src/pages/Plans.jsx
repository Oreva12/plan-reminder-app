import { useState, useEffect } from 'react';
import api from '../api/client';
import PlanForm from './PlanForm';
import PlanTable from '../components/PlanTable';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPlans = async () => {
    try {
      const res = await api.get('/plans');
      // Sort by expiry date (soonest first)
      const sorted = res.data.plans.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
      setPlans(sorted);
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
    // Add and re-sort
    setPlans((prev) => [...prev, newPlan].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)));
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

  const handleRenew = async (plan) => {
    const newDate = window.prompt('Enter new expiry date (YYYY-MM-DD):', new Date().toISOString().slice(0, 10));
    if (!newDate) return;
    try {
      const res = await api.post(`/plans/${plan._id}/renew`, { expiryDate: new Date(newDate).toISOString() });
      // Update the plan in the list
      setPlans((prev) => prev.map((p) => p._id === plan._id ? res.data.plan : p));
    } catch (err) {
      alert('Failed to renew plan');
    }
  };

  if (loading) return <p>Loading plans...</p>;

  return (
    <div>
      <h2>Your Plans</h2>
      <PlanForm onPlanCreated={handlePlanCreated} />
      <PlanTable plans={plans} onDelete={handleDelete} onRenew={handleRenew} />
    </div>
  );
}