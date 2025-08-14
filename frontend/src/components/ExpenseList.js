import React from 'react';
import axios from 'axios';

function ExpenseList({ expenses, onDelete }) {
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    onDelete(id);
  };

  return (
    <ul>
      {expenses.map((exp) => (
        <li key={exp._id}>
          {exp.title} - ${exp.amount} ({exp.type})
          <button onClick={() => handleDelete(exp._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;
