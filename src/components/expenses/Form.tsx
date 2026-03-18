import { useEffect, useState } from "react";
import { flatPeople } from "../../data/people";
import { FiCreditCard, FiPlus } from "react-icons/fi";
import "./Form.css";
import type { Expense } from "../../App";
import { useNavigate } from "react-router-dom";
interface Props {
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  editingExpense: Expense | null;
  setEditingExpense: (expense: Expense | null) => void;
}
export default function Form({
  addExpense,
  updateExpense,
  editingExpense,
  setEditingExpense,
}: Props) {
  const [selectedPerson, setSelectedPerson] = useState(
    editingExpense?.memberId || "",
  );
  const [amount, setAmount] = useState(editingExpense?.amount.toString() || "");
  const [purpose, setPurpose] = useState(editingExpense?.purpose || "");
  const navigate = useNavigate();
  useEffect(() => {
    if (editingExpense) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedPerson(editingExpense.memberId);
      setAmount(editingExpense.amount.toString());
      setPurpose(editingExpense.purpose);
    } else {
      setSelectedPerson("");
      setAmount("");
      setPurpose("");
    }
  }, [editingExpense]);
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingExpense) {
      if (!selectedPerson || !amount || !purpose.trim()) {
        alert("Please fill all fields");
        return;
      }
      updateExpense({
        ...editingExpense,
        memberId: Number(selectedPerson),
        amount: Number(amount),
        purpose,
      });
      setEditingExpense(null);
      setSelectedPerson("");
      setAmount("");
      setPurpose("");
      navigate("/expenses");
      return;
    }
    if (!selectedPerson || !amount || !purpose.trim()) {
      alert("Please fill all fields");
      return;
    }

    const expenseData = {
      memberId: selectedPerson,
      amount: Number(amount),
      purpose,
    };

    addExpense(expenseData as Expense);
    setSelectedPerson("");
    setAmount("");
    setPurpose("");
    navigate("/expenses");
  };

  return (
    <section className="form-container">
      <h2 className="form-title">
        <FiCreditCard className="title-icon" />
        Add Expense
      </h2>
      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Flat Member</label>
          <select
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
          >
            <option value="">Select Member</option>
            {flatPeople.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Purpose</label>
          <textarea
            placeholder="Enter purpose (e.g., Groceries, Electricity bill...)"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={3}
          />
        </div>

        <button type="submit" className="add-btn">
          <FiPlus className="btn-icon" />
          Add Expense
        </button>
      </form>
    </section>
  );
}
