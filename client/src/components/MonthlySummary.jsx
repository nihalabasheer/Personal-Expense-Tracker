function getCurrentMonthKey() {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
}

export default function MonthlySummary({ expenses }) {
  const monthKey = getCurrentMonthKey();

  const { total, byCategory } = (expenses || []).reduce(
    (acc, expense) => {
      if (!expense?.date) return acc;

      const expenseMonth = String(expense.date).slice(0, 7);
      if (expenseMonth !== monthKey) return acc;

      const amount =
        typeof expense.amount === 'number'
          ? expense.amount
          : Number(expense.amount);

      if (!Number.isFinite(amount) || amount <= 0) return acc;

      acc.total += amount;

      const category = expense.category || 'Uncategorized';
      acc.byCategory[category] = (acc.byCategory[category] || 0) + amount;

      return acc;
    },
    { total: 0, byCategory: {} }
  );

  const hasExpensesThisMonth = total > 0;
  const hasAnyExpenses = (expenses || []).length > 0;

  return (
    <section className="monthly-summary">
      <h2>Current Month Summary</h2>

      <div className="monthly-summary__total">
        <span>Total Spent:</span>
        <span>₹{total.toFixed(2)}</span>
      </div>

      {hasExpensesThisMonth ? (
        <div className="monthly-summary__breakdown">
          <h3>By Category</h3>
          <ul>
            {Object.entries(byCategory).map(([category, amount]) => (
              <li key={category}>
                <span>{category}</span>
                <span>₹{amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="monthly-summary__empty">
          {hasAnyExpenses
            ? 'No expenses recorded this month.'
            : 'No expenses found. Add your first expense.'}
        </p>
      )}
    </section>
  );
}
