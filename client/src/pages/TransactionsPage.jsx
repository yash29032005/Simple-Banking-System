/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function TransactionsPage() {
  const { user, loading } = useAuth();
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [popup, setPopup] = useState("");
  const [amount, setAmount] = useState(0);

  const fetchBalance = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/${user.id}/balance`
      );

      setBalance(res.data.balance);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/${user.id}/transactions`
      );

      const normalized = res.data.transactions.map((t) => ({
        ...t,
        amount: Number(t.amount),
        balance: Number(t.balance),
      }));

      setTransactions(normalized);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [user]);

  const handleDeposit = async () => {
    const value = Number(amount);

    if (!value || value <= 0) {
      return toast.error("Enter a valid amount");
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/${user.id}/deposit`,
        { amount: value }
      );

      toast.success("Deposit successful");

      setPopup("");
      setAmount("");
      fetchBalance();
      fetchTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Deposit failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  const handleWithdraw = async () => {
    const value = Number(amount);

    if (!value || value <= 0) {
      return toast.error("Enter a valid amount");
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/${user.id}/withdraw`,
        { amount: value }
      );

      if (res.data.message === "Insufficient funds") {
        return alert("❌ Insufficient Balance");
      }

      toast.success("Withdrawal successful");
      setPopup("");
      setAmount("");
      fetchBalance();
      fetchTransactions();
    } catch (err) {
      console.error("Withdraw error:", err);
      toast.error(err.response?.data?.message || "Withdraw failed");
    }
  };

  return (
    <div
      style={{ height: "auto", minHeight: "calc(100vh - 70px)" }}
      className="bg-black"
    >
      <div className="p-6 max-w-6xl mx-auto">
        {/* ACCOUNT CARD */}
        <div className="bg-linear-to-r from-secondary to-ternary p-6 rounded-xl text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span>💳</span> Account Overview
          </h2>

          <p className="text-sm mb-1">Account Number: ACC{user.id}8451</p>

          <p className="mt-4 text-lg">Available Balance</p>
          <p className="text-4xl font-bold">₹{balance}</p>

          {/* Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => setPopup("deposit")}
              className="bg-grey text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition"
            >
              + Deposit
            </button>

            <button
              onClick={() => setPopup("withdraw")}
              className="bg-grey text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition"
            >
              – Withdraw
            </button>
          </div>
        </div>

        {/* TRANSACTIONS LIST */}
        <div className="mt-8 bg-secondary text-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-1">Transaction History</h3>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Type</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Balance After</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">
                    No transactions yet.
                  </td>
                </tr>
              )}

              {transactions.map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm capitalize ${
                        t.type === "deposit" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="py-2">₹{t.amount.toFixed(2)}</td>
                  <td className="py-2">₹{t.balance.toFixed(2)}</td>
                  <td className="py-2">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* POPUP */}
        {popup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">
                {popup === "deposit" ? "Deposit Money" : "Withdraw Money"}
              </h3>

              <input
                type="number"
                className="w-full p-3 border rounded-lg mb-4"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setPopup(null)}
                  className="flex-1 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>

                {popup === "deposit" ? (
                  <button
                    onClick={handleDeposit}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Deposit
                  </button>
                ) : (
                  <button
                    onClick={handleWithdraw}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
