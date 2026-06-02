# Personal Expense Tracker

Full-stack personal expense tracker built for a time-boxed practical test.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Storage:** JSON file (`server/data/data.json`)

## Why This Stack (and Tradeoffs)

- **React + Vite**
  - **Why:** Fast setup, fast local dev, minimal boilerplate for a coding assessment.
  - **Tradeoff:** No SSR or advanced routing/state tooling included by default.

- **Node.js + Express**
  - **Why:** Simple REST API, predictable structure, quick to implement and debug.
  - **Tradeoff:** Minimal architecture (no service/controller split) favors speed over long-term scalability.

- **JSON file storage**
  - **Why:** Zero external dependencies (no DB setup), easy local run and review.
  - **Tradeoff:** Not suitable for concurrent multi-user writes, large datasets, or production-grade durability.

## Project Structure

```text
client/
  src/
    components/
      ExpenseForm.jsx
      ExpenseList.jsx
      ExpenseItem.jsx
      Filters.jsx
      MonthlySummary.jsx
    services/
      api.js
    App.jsx
    App.css
    main.jsx
server/
  data/
    data.json
  routes/
    expenses.js
  server.js
```

## How To Run (Exact Commands)

> Open **two terminals** from repository root (`d:\personal-tracker`).

### 1) Start backend

```powershell
cd server
npm install
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2) Start frontend

```powershell
cd client
npm install
npm run dev
```

Frontend runs on Vite default URL (usually): `http://localhost:5173`

## API Endpoints

Base URL: `http://localhost:5000/api/expenses`

- `GET /` - list all expenses
- `POST /` - create expense
- `PUT /:id` - update expense
- `DELETE /:id` - delete expense

## What Is Implemented

- End-to-end expense CRUD flow (client + server).
- Form validation (client + server):
  - title required
  - title cannot be only spaces
  - amount must be greater than 0
  - category required
- Filters in `App.jsx`:
  - category
  - title search (partial, case-insensitive)
  - date range (from/to)
- Filter-specific empty state:
  - `"No expenses match the current filters."`
- Global empty list state:
  - `"No expenses found. Add your first expense."`
- Monthly summary (current month only):
  - total spent
  - category-wise breakdown (`reduce`)
  - empty-month state (`Total Spent: ₹0`, no-expenses message)
- Responsive CSS layout with cards, styled forms, buttons, and spacing.
- Basic backend resilience:
  - missing `data.json` handled as empty dataset
  - invalid JSON handled with safe error response

## What Was Intentionally Skipped (and Why)

- **Authentication/authorization**
  - Skipped to keep scope aligned with a 2-hour practical.
- **Database integration**
  - JSON storage was chosen to avoid setup overhead and keep submission runnable instantly.
- **Automated test suite**
  - Manual edge-case verification was prioritized within time constraints.
- **Advanced architecture**
  - No separate controllers/services to keep code compact and assessment-friendly.
- **State management library**
  - React local state is sufficient for this app size.

## Known Rough Edges

- JSON file storage is single-node and not safe for heavy concurrent writes.
- No schema validation library (validation is manual, in route/form logic).
- No loading skeletons/toast notifications; status messages are minimal.
- Error handling is practical but not fully standardized across all backend failure types.
- No pagination/sorting controls beyond default date-desc listing.

## Practical Test Notes

- This submission focuses on correctness, readability, and fast local setup.
- Code is intentionally simple and compact to fit practical-test time limits.
- The app is structured to be easily extensible (DB, auth, tests, stronger API contracts) in a next iteration.
