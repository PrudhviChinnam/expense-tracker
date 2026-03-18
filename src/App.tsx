import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Form from "./components/expenses/Form";
import ExpensesList from "./components/expenses/ExpensesList";
import Totals from "./components/expenses/Totals";
import { Link, Route, Routes } from "react-router-dom";
import supbase from "./utils/supbase";

export interface Expense {
  id: number;
  memberId: number;
  amount: number;
  purpose: string;
  created_at: string;
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // FETCH EXPENSES
  const fetchExpenses = useCallback(async () => {
    const { data, error } = await supbase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
    } else {
      setExpenses(data || []);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExpenses();
  }, [fetchExpenses]);

  // ADD EXPENSE
  const addExpense = async (expense: {
    memberId: number;
    amount: number;
    purpose: string;
  }) => {
    const { error } = await supbase.from("expenses").insert([expense]);

    if (error) {
      console.error("Insert error:", error);
    } else {
      fetchExpenses();
    }
  };

  // DELETE EXPENSE
  const deleteExpense = async (id: number) => {
    console.log("Attempting to delete expense with ID:", id);
    const { error } = await supbase.from("expenses").delete().eq("id", id);
    console.log("Delete response error:", error);
    if (error) {
      console.error("Delete error:", error);
    } else {
      fetchExpenses();
    }
  };

  // UPDATE EXPENSE
  const updateExpense = async (expense: Expense) => {
    const { id, ...updatedFields } = expense;

    const { error } = await supbase
      .from("expenses")
      .update(updatedFields)
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
    } else {
      setEditingExpense(null);
      fetchExpenses();
    }
  };

  return (
    <>
      <nav className="navbar">
        <div>
          <Link to="/">Add Your Expense</Link>
          <Link to="/expenses">Expenses</Link>
          <Link to="/totals">Totals</Link>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <Form
              addExpense={addExpense}
              updateExpense={updateExpense}
              editingExpense={editingExpense}
              setEditingExpense={setEditingExpense}
            />
          }
        />

        <Route
          path="/expenses"
          element={
            <ExpensesList
              expenses={expenses}
              deleteExpense={deleteExpense}
              setEditingExpense={setEditingExpense}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          }
        />

        <Route
          path="/totals"
          element={<Totals expenses={expenses} selectedMonth={selectedMonth} />}
        />
      </Routes>
    </>
  );
}

export default App;
