export default function ExpenseItem({ expense, onEdit, onDelete }) {
  const { id, title, amount, category, date, note } = expense;

  const formattedAmount =
    typeof amount === 'number' && !Number.isNaN(amount)
      ? amount.toFixed(2)
      : String(amount ?? '');

  const formattedDate = date ? String(date).slice(0, 10) : '';

  return (
    <li className="expense-item">
      <div className="expense-item__main">
        <div className="expense-item__title-row">
          <span className="expense-item__title">{title}</span>
          <span className="expense-item__amount">₹{formattedAmount}</span>
        </div>
        <div className="expense-item__meta">
          <span className="expense-item__category">{category}</span>
          {formattedDate ? (
            <span className="expense-item__date">{formattedDate}</span>
          ) : null}
        </div>
        {note ? <div className="expense-item__note">{note}</div> : null}
      </div>

      <div className="expense-item__actions">
        <button type="button" onClick={() => onEdit?.(expense)}>
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(id)}
          className="expense-item__delete"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
