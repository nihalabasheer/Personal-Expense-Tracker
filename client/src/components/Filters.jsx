const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Other',
];

function parseDateToMs(value) {
  if (!value) return null;
  const d = new Date(value);
  const ms = d.getTime();
  return Number.isFinite(ms) ? ms : null;
}

export default function Filters({ filters, onChange }) {
  const search = filters?.search ?? '';
  const category = filters?.category ?? '';
  const fromDate = filters?.fromDate ?? '';
  const toDate = filters?.toDate ?? '';

  const fromMs = parseDateToMs(fromDate);
  const toMs = parseDateToMs(toDate);
  const dateRangeInvalid =
    fromMs !== null && toMs !== null && fromMs > toMs;

  function update(partial) {
    onChange?.((prev) => ({ ...prev, ...partial }));
  }

  return (
    <section className="filters">
      <h2>Filters</h2>

      <div className="filters__row">
        <div className="filters__field">
          <label htmlFor="filter-title">Title Search</label>
          <input
            id="filter-title"
            type="text"
            value={search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search title…"
          />
        </div>

        <div className="filters__field">
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => update({ category: e.target.value })}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filters__row">
        <div className="filters__field">
          <label htmlFor="filter-from">From Date</label>
          <input
            id="filter-from"
            type="date"
            value={fromDate}
            onChange={(e) => update({ fromDate: e.target.value })}
          />
        </div>

        <div className="filters__field">
          <label htmlFor="filter-to">To Date</label>
          <input
            id="filter-to"
            type="date"
            value={toDate}
            onChange={(e) => update({ toDate: e.target.value })}
          />
        </div>
      </div>

      {dateRangeInvalid ? (
        <div className="filters__error">From date cannot be after To date</div>
      ) : null}
    </section>
  );
}
