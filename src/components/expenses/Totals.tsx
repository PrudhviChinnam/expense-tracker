import type { Expense } from "../../App";
import { flatPeople } from "../../data/people";
import { useState } from "react";
import "./Totals.css";
import { AiFillCalculator } from "react-icons/ai";

interface Props {
  expenses: Expense[];
  selectedMonth: string;
}

const Totals = ({ expenses, selectedMonth }: Props) => {
  const [totals, setTotals] = useState<Record<string, number> | null>(null);

  const handleCalculate = () => {
    // Filter by selected month FIRST
    const filteredExpenses = expenses.filter((expense) =>
      expense.created_at.startsWith(selectedMonth),
    );

    const calculatedTotals = filteredExpenses.reduce(
      (acc: Record<string, number>, curr) => {
        acc[curr.memberId] = (acc[curr.memberId] || 0) + curr.amount;
        return acc;
      },
      {},
    );

    setTotals(calculatedTotals);
  };

  const getPersonName = (id: string) => {
    return flatPeople.find((p) => p.id === id)?.name || "Unknown";
  };

  const overallTotal = totals
    ? Object.values(totals).reduce((sum, val) => sum + val, 0)
    : 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  return (
    <div className="totals-container">
      <button className="calculate-btn" onClick={handleCalculate}>
        <AiFillCalculator />
        Calculate Totals
      </button>

      {totals && (
        <div className="totals-grid">
          {Object.entries(totals).length === 0 ? (
            <div className="total-card">No expenses for selected month.</div>
          ) : (
            <>
              {Object.entries(totals).map(([memberId, total]) => (
                <div key={memberId} className="total-card">
                  <h4>{getPersonName(memberId)}</h4>
                  <p>{formatCurrency(total)}</p>
                </div>
              ))}

              <div className="total-card overall">
                <h4>Total Expense</h4>
                <p>{formatCurrency(overallTotal)}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Totals;
