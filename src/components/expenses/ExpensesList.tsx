import type { Expense } from "../../App";
import { flatPeople } from "../../data/people";
import { FiTrash, FiEdit } from "react-icons/fi";
import "./Expenses.css";
import { useNavigate } from "react-router-dom";

interface Props {
  expenses: Expense[];
  deleteExpense: (id: number) => void;
  setEditingExpense: (expense: Expense) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

const ExpensesList = ({
  expenses,
  deleteExpense,
  setEditingExpense,
  selectedMonth,
  setSelectedMonth,
}: Props) => {
  // Default to current month
  const router = useNavigate();
  // Filter expenses by selected month
  const filteredExpenses = expenses.filter((expense) =>
    expense.created_at?.startsWith(selectedMonth),
  );
  const getPersonName = (id: number) => {
    console.log("Looking up name for ID:", id);
    console.log("Available people:", flatPeople);
    return (
      flatPeople.find((p) => Number(p.id) === Number(id))?.name || "Unknown"
    );
  };

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  return (
    <div className="expense-list">
      {/* Month Filter */}
      <div className="month-filter">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      {/* Expenses */}
      {filteredExpenses.length === 0 ? (
        <div className="empty-state">No expenses found for this month.</div>
      ) : (
        filteredExpenses.map((expense) => (
          <div key={expense.id} className="expense-card">
            <div className="expense-info">
              <strong>{getPersonName(expense.memberId)}</strong>
              <p className="purpose">{expense.purpose}</p>
              <span className="expense-date">
                {formatDate(expense.created_at)}
              </span>
            </div>

            <div className="expense-actions">
              <span className="amount">{formatCurrency(expense.amount)}</span>

              <FiEdit
                className="edit-icon"
                onClick={() => {
                  setEditingExpense(expense);
                  router("/");
                }}
              />

              <FiTrash
                className="delete-icon"
                onClick={() => deleteExpense(expense.id)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpensesList;
