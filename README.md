# ExpenseSmart

### Track Today, Save Tomorrow

ExpenseSmart is a full-stack personal expense tracker built as part of a time-boxed software engineering practical test. The application enables users to manage daily expenses, analyze monthly spending patterns, and filter records efficiently through a simple and intuitive interface.

---

## Features

### Expense Management

* Add new expenses
* Edit existing expenses
* Delete expenses
* Store expense details including:

  * Title
  * Amount
  * Category
  * Date
  * Optional Note

### Smart Filtering

* Filter by category
* Search by title (partial and case-insensitive)
* Filter by date range (From / To)

### Monthly Insights

* Current month total spending
* Category-wise spending breakdown
* Empty-state handling when no expenses exist for the current month

### Validation

Client-side and server-side validation ensure only valid data is stored.

Validation rules:

* Title is required
* Title cannot contain only spaces
* Amount must be greater than 0
* Category is required

---

## Tech Stack

### Frontend

* React
* Vite

### Backend

* Node.js
* Express.js

### Storage

* JSON File Storage (`server/data/data.json`)

---

## Why This Stack?

This project was designed to be completed within a limited time while remaining easy to run and evaluate.

### React + Vite

**Why**

* Fast development environment
* Minimal configuration
* Excellent developer experience

**Tradeoff**

* No advanced routing or state management libraries included

### Node.js + Express

**Why**

* Lightweight REST API
* Easy debugging and maintenance
* Quick implementation

**Tradeoff**

* Simplified architecture focused on practicality rather than enterprise-scale patterns

### JSON File Storage

**Why**

* No database setup required
* Easy local execution
* Simple data persistence

**Tradeoff**

* Not suitable for concurrent users or production-scale workloads

---

## Project Structure

```text
client/
│
├── src/
│   ├── components/
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   ├── ExpenseItem.jsx
│   │   ├── Filters.jsx
│   │   └── MonthlySummary.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
server/
│
├── data/
│   └── data.json
│
├── routes/
│   └── expenses.js
│
└── server.js
```

---

## Running the Application

Open two terminals from the project root.

### Start Backend

```powershell
cd server
npm install
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

### Start Frontend

```powershell
cd client
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## API Endpoints

Base URL:

```text
http://localhost:5000/api/expenses
```

| Method | Endpoint | Description           |
| ------ | -------- | --------------------- |
| GET    | /        | Retrieve all expenses |
| POST   | /        | Create a new expense  |
| PUT    | /:id     | Update an expense     |
| DELETE | /:id     | Delete an expense     |

---

## Expense Data Model

```json
{
  "id": "1",
  "title": "Grocery Shopping",
  "amount": 1800,
  "category": "Food",
  "date": "2026-06-02",
  "note": "Monthly groceries"
}
```

---

## Implemented Functionality

### Core Features

* Expense CRUD operations
* Current month summary
* Category-wise spending analysis
* Date-descending expense listing

### Filtering

* Category filter
* Title search
* Date range filter

### User Experience

* Responsive layout
* Styled cards and forms
* Clear empty-state messages
* Form validation feedback

### Backend Reliability

* Handles missing data file
* Handles invalid JSON content safely
* Prevents invalid data from being saved

---

## What Was Intentionally Skipped

### Authentication

Not required for the assessment and intentionally excluded to keep focus on the core functionality.

### Database Integration

JSON file storage was selected to avoid database setup overhead and keep the application easy to run locally.

### Automated Testing

Manual verification was prioritized due to the limited development time available.

### Advanced Architecture

Controllers, services, and enterprise patterns were intentionally minimized to maintain simplicity and readability.

### State Management Libraries

React local state was sufficient for the scope of this application.

---

## Known Limitations

* JSON storage is not designed for high-concurrency environments.
* Validation is implemented manually rather than through a schema validation library.
* No pagination for large expense datasets.
* Error handling is intentionally lightweight.
* No authentication or user accounts.

---

## Practical Test Notes

This project prioritizes:

* Correctness
* Simplicity
* Readability
* Fast local setup
* Easy evaluation

The solution was intentionally designed to satisfy all stated requirements while remaining compact, maintainable, and easy to understand within the constraints of a practical software engineering assessment.
