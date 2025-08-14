import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// Use environment variable for the API URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/expenses`);
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  // Add expense
  const addExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    try {
      await axios.post(`${API_URL}/api/expenses`, {
        title,
        amount: Number(amount),
        type,
        date: new Date(),
      });
      setTitle("");
      setAmount("");
      setType("expense");
      fetchExpenses();
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  // Summary calculations
  const totalIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = expenses
    .filter((e) => e.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div>
      <header>💰 Expense Tracker</header>

      <div className="container">
        <div className="summary">
          <div className="summary-card">
            <h3>Total Balance</h3>
            <p className={balance >= 0 ? "income" : "expense"}>
              ₹{balance.toLocaleString()}
            </p>
          </div>
          <div className="summary-card">
            <h3>Total Income</h3>
            <p className="income">₹{totalIncome.toLocaleString()}</p>
          </div>
          <div className="summary-card">
            <h3>Total Expense</h3>
            <p className="expense">₹{totalExpense.toLocaleString()}</p>
          </div>
        </div>

        {/* Add Expense Form */}
        <div className="card">
          <h2>Add New Transaction</h2>
          <form onSubmit={addExpense}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button type="submit">Add Transaction</button>
          </form>
        </div>

        {/* Expense Table */}
        <div className="card">
          <h2>Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense._id}
                  className={
                    expense.type === "income" ? "income-row" : "expense-row"
                  }
                >
                  <td>{expense.title}</td>
                  <td>₹{expense.amount}</td>
                  <td>{expense.type}</td>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => deleteExpense(expense._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;