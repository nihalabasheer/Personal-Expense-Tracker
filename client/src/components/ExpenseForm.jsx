import { useEffect, useMemo, useState } from 'react';

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Other',
];

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

function validate({ title, amount, category }) {
  const errors = {};

  if (title.trim() === '') {
    errors.title = title.length > 0 ? 'Title cannot be only spaces' : 'Title is required';
  }

  const parsedAmount = typeof amount === 'number' ? amount : Number(amount);
  if (!Number.isFinite(parsedAmount)) {
    errors.amount = 'Amount must be a number';
  } else if (parsedAmount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (category.trim() === '') {
    errors.category = 'Category is required';
  }

  return errors;
}

export default function ExpenseForm({
  editingExpense,
  onAdd,
  onUpdate,
  onCancelEdit,
  disabled = false,
}) {
  const isEditMode = Boolean(editingExpense?.id);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(todayISODate());
  const [note, setNote] = useState('');
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title ?? '');
      setAmount(
        editingExpense.amount === undefined || editingExpense.amount === null
          ? ''
          : String(editingExpense.amount)
      );
      setCategory(editingExpense.category ?? '');
      setDate(editingExpense.date ?? todayISODate());
      setNote(editingExpense.note ?? '');
      setTouched({});
      return;
    }

    setTitle('');
    setAmount('');
    setCategory('');
    setDate(todayISODate());
    setNote('');
    setTouched({});
  }, [editingExpense]);

  const errors = useMemo(
    () => validate({ title, amount, category }),
    [title, amount, category]
  );

  const canSubmit = Object.keys(errors).length === 0 && !disabled;

  async function handleSubmit(e) {
    e.preventDefault();

    const nextTouched = { title: true, amount: true, category: true };
    setTouched((prev) => ({ ...prev, ...nextTouched }));

    const currentErrors = validate({ title, amount, category });
    if (Object.keys(currentErrors).length > 0) return;

    const payload = {
      title: title.trim(),
      amount: Number(amount),
      category: category.trim(),
      date,
      note: note ?? '',
    };

    if (isEditMode) {
      await onUpdate(payload);
    } else {
      await onAdd(payload);
      setTitle('');
      setAmount('');
      setCategory('');
      setDate(todayISODate());
      setNote('');
      setTouched({});
    }
  }

  return (
    <section className="expense-form">
      <h2>{isEditMode ? 'Edit Expense' : 'Add Expense'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, title: true }))}
            disabled={disabled}
            placeholder="e.g., Groceries"
          />
          {touched.title && errors.title ? (
            <div className="field__error">{errors.title}</div>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
            disabled={disabled}
            placeholder="e.g., 25.50"
          />
          {touched.amount && errors.amount ? (
            <div className="field__error">{errors.amount}</div>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, category: true }))}
            disabled={disabled}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {touched.category && errors.category ? (
            <div className="field__error">{errors.category}</div>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="field">
          <label htmlFor="note">Note (optional)</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={disabled}
            rows={3}
            placeholder="Optional details…"
          />
        </div>

        <div className="actions">
          <button type="submit" disabled={!canSubmit}>
            {isEditMode ? 'Update' : 'Add'}
          </button>

          {isEditMode ? (
            <button type="button" onClick={onCancelEdit} disabled={disabled}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
