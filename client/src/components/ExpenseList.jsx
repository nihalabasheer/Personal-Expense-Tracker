import ExpenseItem from './ExpenseItem.jsx';

export default function ExpenseList({ expenses, onEdit, onDelete, hasFilters }) {
  if (!expenses || expenses.length === 0) {
    return (
      <section className="expense-list expense-list--empty">
        <p>
          {hasFilters
            ? 'No expenses match the current filters.'
            : 'No expenses found. Add your first expense.'}
        </p>
      </section>
    );
  }

  const sorted = [...expenses].sort((a, b) => {
    const aTime = a.date ? new Date(a.date).getTime() : 0;
    const bTime = b.date ? new Date(b.date).getTime() : 0;
    return bTime - aTime;
  });

  return (
    <section className="expense-list">
      <ul>
        {sorted.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
}
