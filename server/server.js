import express from 'express';
import cors from 'cors';
import expenseRoutes from './routes/expenses.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/expenses', expenseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
