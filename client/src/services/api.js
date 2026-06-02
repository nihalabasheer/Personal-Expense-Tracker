import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/expenses',
});

function handleApiError(error, action) {
  const message =
    error?.response?.data?.error ||
    (Array.isArray(error?.response?.data?.errors)
      ? error.response.data.errors.join(', ')
      : null) ||
    error.message ||
    `Failed to ${action}`;

  throw new Error(message);
}

export async function getExpenses() {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    handleApiError(error, 'get expenses');
  }
}

export async function addExpense(expense) {
  try {
    const response = await api.post('/', expense);
    return response.data;
  } catch (error) {
    handleApiError(error, 'add expense');
  }
}

export async function updateExpense(id, expense) {
  try {
    const response = await api.put(`/${id}`, expense);
    return response.data;
  } catch (error) {
    handleApiError(error, 'update expense');
  }
}

export async function deleteExpense(id) {
  try {
    await api.delete(`/${id}`);
    return true;
  } catch (error) {
    handleApiError(error, 'delete expense');
  }
}
