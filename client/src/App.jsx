import { useEffect, useMemo, useState } from 'react';
import './App.css';

import ExpenseForm from './components/ExpenseForm.jsx';
import ExpenseList from './components/ExpenseList.jsx';
import Filters from './components/Filters.jsx';
import MonthlySummary from './components/MonthlySummary.jsx';

import {
  addExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from './services/api.js';

const initialFilters = {
  search: '',
  category: '',
  fromDate: '',
  toDate: '',
};

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getExpenses();
        if (!cancelled) setExpenses(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load expenses');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleExpenses = useMemo(() => {
    const search = (filters.search || '').trim().toLowerCase();
    const category = (filters.category || '').trim().toLowerCase();
    const fromDate = filters.fromDate || '';
    const toDate = filters.toDate || '';

    const fromMs = fromDate ? new Date(fromDate).getTime() : null;
    const toMs = toDate ? new Date(toDate).getTime() : null;
    const dateRangeInvalid =
      fromMs !== null && toMs !== null && fromMs > toMs;

    if (dateRangeInvalid) return [];

    return expenses.filter((e) => {
      const title = String(e.title ?? '').toLowerCase();
      const eCategory = String(e.category ?? '').toLowerCase();
      const eMs = e.date ? new Date(e.date).getTime() : null;

      if (search && !title.includes(search)) return false;
      if (category && eCategory !== category) return false;

      if (eMs !== null) {
        if (fromMs !== null && eMs < fromMs) return false;
        if (toMs !== null && eMs > toMs) return false;
      }
      return true;
    });
  }, [expenses, filters]);

  async function handleAddExpense(expenseInput) {
    setLoading(true);
    setError('');
    try {
      const created = await addExpense(expenseInput);
      setExpenses((prev) => [created, ...prev]);
    } catch (e) {
      setError(e?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateExpense(expenseInput) {
    if (!editingExpense?.id) return;

    setLoading(true);
    setError('');
    try {
      const updated = await updateExpense(editingExpense.id, expenseInput);
      setExpenses((prev) =>
        prev.map((e) => (e.id === editingExpense.id ? updated : e))
      );
      setEditingExpense(null);
    } catch (e) {
      setError(e?.message || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteExpense(id) {
    setLoading(true);
    setError('');
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      if (editingExpense?.id === id) setEditingExpense(null);
    } catch (e) {
      setError(e?.message || 'Failed to delete expense');
    } finally {
      setLoading(false);
    }
  }

  function handleStartEdit(expense) {
    setEditingExpense(expense);
    setError('');
  }

  function handleCancelEdit() {
    setEditingExpense(null);
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <h1 className="app__title">ExpenseSmart</h1>
          <p className="app__tagline">Track Today, Save Tomorrow</p>
        </div>
      </header>

      <main className="dashboard">
        <aside className="dashboard__sidebar">
          <MonthlySummary expenses={expenses} />
        </aside>

        <section className="dashboard__content">
          {error ? <div className="app__error">{error}</div> : null}
          {loading ? <div className="app__loading">Loading…</div> : null}

          <section className="card">
            <h2 className="card__title">Add Expense</h2>
            <ExpenseForm
              editingExpense={null}
              onAdd={handleAddExpense}
              onUpdate={handleUpdateExpense}
              onCancelEdit={handleCancelEdit}
              disabled={loading}
            />
          </section>

          <section className="card">
            <h2 className="card__title">Filters</h2>
            <Filters filters={filters} onChange={setFilters} />
          </section>

          <section className="card">
            <h2 className="card__title">Expenses</h2>
            <ExpenseList
              expenses={visibleExpenses}
              onEdit={handleStartEdit}
              onDelete={handleDeleteExpense}
              hasFilters={
                !!(
                  filters.search ||
                  filters.category ||
                  filters.fromDate ||
                  filters.toDate
                )
              }
            />
          </section>
        </section>
      </main>

      {editingExpense && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-modal="true">
            <header className="modal__header">
              <h2>Edit Expense</h2>
            </header>
            <div className="modal__body">
              <ExpenseForm
                editingExpense={editingExpense}
                onAdd={handleAddExpense}
                onUpdate={handleUpdateExpense}
                onCancelEdit={handleCancelEdit}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
