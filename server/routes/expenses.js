import { Router } from 'express';
import { readFile, writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../data/data.json');

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

async function readData() {
  try {
    const raw = await readFile(DATA_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.expenses)) return { expenses: [] };
    return parsed;
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      // If the data file doesn't exist yet, treat as empty store.
      return { expenses: [] };
    }

    if (err instanceof SyntaxError || err?.name === 'SyntaxError') {
      throw new Error('data.json contains invalid JSON');
    }

    throw err;
  }
}

async function writeData(data) {
  const safe = {
    expenses: Array.isArray(data?.expenses) ? data.expenses : [],
  };

  await writeFile(DATA_PATH, JSON.stringify(safe, null, 2) + '\n', 'utf-8');
}

function validateExpense(expense) {
  const errors = [];

  if (expense.title === undefined || expense.title === null) {
    errors.push('title is required');
  } else if (typeof expense.title !== 'string') {
    errors.push('title must be a string');
  } else if (expense.title.trim() === '') {
    errors.push(
      expense.title.length > 0
        ? 'title cannot be only spaces'
        : 'title is required'
    );
  }

  if (expense.category === undefined || expense.category === null) {
    errors.push('category is required');
  } else if (typeof expense.category !== 'string' || expense.category.trim() === '') {
    errors.push('category is required');
  }

  if (expense.amount === undefined || expense.amount === null) {
    errors.push('amount is required');
  } else if (typeof expense.amount !== 'number' || Number.isNaN(expense.amount)) {
    errors.push('amount must be a number');
  } else if (expense.amount <= 0) {
    errors.push('amount must be greater than 0');
  }

  return errors;
}

router.get('/', async (req, res) => {
  try {
    const data = await readData();
    res.status(200).json(data.expenses);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to read expenses' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;
    const expense = {
      title,
      amount,
      category,
      date: date && String(date).trim() !== '' ? date : todayISODate(),
      note: note ?? '',
    };

    const errors = validateExpense(expense);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const data = await readData();
    const newExpense = {
      id: randomUUID(),
      ...expense,
    };

    data.expenses.push(newExpense);
    await writeData(data);

    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to create expense' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.expenses.findIndex((e) => e.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const updated = {
      ...data.expenses[index],
      ...req.body,
      id: req.params.id,
    };

    const errors = validateExpense(updated);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    data.expenses[index] = updated;
    await writeData(data);

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to update expense' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.expenses.findIndex((e) => e.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    data.expenses.splice(index, 1);
    await writeData(data);

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Failed to delete expense' });
  }
});

export default router;
