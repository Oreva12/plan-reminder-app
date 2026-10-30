import { useState, useEffect } from 'react';
import api from '../api/client';

export default function PlanForm({ onPlanCreated }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', provider: '', category: '', expiryDate: '' });
  const [error, setError] = useState('');

  // Fetch categories when the form loads
  useEffect(() => {
    api.get('/categories').then((res) => {
      setCategories(res.data.categories);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/plans', form);
      onPlanCreated(res.data.plan); // Tell the parent to add it to the list
      setForm({ name: '', provider: '', category: '', expiryDate: '' }); // Reset form
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create plan');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, background: '#f9f9f9', padding: 16 }}>
      <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ padding: 8 }} />
      <input required placeholder="Provider" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} style={{ padding: 8 }} />
      
      <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ padding: 8 }}>
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <input required type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} style={{ padding: 8 }} />
      
      <button type="submit" style={{ padding: '8px 16px' }}>Add Plan</button>
      {error && <p style={{ color: 'red', width: '100%' }}>{error}</p>}
    </form>
  );
}