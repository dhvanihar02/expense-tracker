import React, { useState } from 'react';
import axios from 'axios';

function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExpense = { title, amount: Number(amount), type, date: new Date() };
    const res = await axios.post('http://localhost:5001/api/expenses', newExpense);
    onAdd(res.data);
    setTitle('');
    setAmount('');
    setType('expense');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" required />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
}

export default ExpenseForm;
