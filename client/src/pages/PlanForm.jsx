import { useState, useEffect } from 'react';
import api from '../api/client';

export default function PlanForm({ onPlanCreated }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    provider: '',
    category: '',
    expiryDate: ''
  });
  const [error, setError] = useState('');

  // Get today's date in YYYY-MM-DD format (local time)
  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Fetch categories when the form loads
  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        setCategories(res.data.categories);
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate expiry date
    if (form.expiryDate < getToday()) {
      setError('Expiry date cannot be in the past.');
      return;
    }

    try {
      const res = await api.post('/plans', form);

      onPlanCreated(res.data.plan);

      // Reset form
      setForm({
        name: '',
        provider: '',
        category: '',
        expiryDate: ''
      });

    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to create plan'
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 24,
        background: '#f9f9f9',
        padding: 16
      }}
    >
      <input
        required
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        style={{ padding: 8 }}
      />

      <input
        required
        placeholder="Provider"
        value={form.provider}
        onChange={(e) =>
          setForm({ ...form, provider: e.target.value })
        }
        style={{ padding: 8 }}
      />

      <select
        required
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
        style={{ padding: 8 }}
      >
        <option value="">Select Category</option>

        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        required
        type="date"
        value={form.expiryDate}
        min={getToday()}
        onChange={(e) =>
          setForm({ ...form, expiryDate: e.target.value })
        }
        style={{ padding: 8 }}
      />

      <button type="submit" style={{ padding: '8px 16px' }}>
        Add Plan
      </button>

      {error && (
        <p style={{ color: 'red', width: '100%' }}>
          {error}
        </p>
      )}
    </form>
  );
}
