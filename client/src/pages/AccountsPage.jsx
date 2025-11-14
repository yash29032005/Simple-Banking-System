import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setAccounts(res.data.users || []);
    } catch (err) {
      console.log("Error fetching accounts:", err);
    }
  };

  const fetchUserTransactions = async (userId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/${userId}/transactions`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.log("Error fetching transactions:", err);
    }
  };

  const openTransactionsModal = async (user) => {
    setSelectedUser(user);
    await fetchUserTransactions(user.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setTransactions([]);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div style={{ height: "auto", minHeight: "100vh" }} className="bg-black">
      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white">Customer Accounts</h2>
        <p className="text-grey mb-6">
          View all customer accounts and their transactions
        </p>

        {/* TABLE CARD */}
        <div className="bg-secondary rounded-xl shadow p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-white border-b">
                <th className="py-3">Account Number</th>
                <th className="py-3">Customer Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Balance</th>
                <th className="py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-white">
              {accounts.map((u) => (
                <tr key={u.id} className="hover:bg-ternary transition">
                  <td className="py-3 font-medium ">ACC{u.id}8451</td>
                  <td className="py-3">{u.name}</td>
                  <td className="py-3">{u.email}</td>
                  <td className="py-3 font-semibold">
                    ${Number(u.balance || 0).toFixed(2)}
                  </td>
                  <td className="py-3 text-center">
                    <button
                      onClick={() => openTransactionsModal(u)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
                    >
                      View Transactions
                    </button>
                  </td>
                </tr>
              ))}

              {accounts.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ============================
          POPUP TRANSACTION MODAL
      ============================ */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
            <div className="bg-secondary text-white p-6 rounded-xl w-full max-w-2xl shadow-lg relative">
              {/* CLOSE BUTTON */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-white hover:text-secondary"
              >
                ✖
              </button>

              <h3 className="text-xl font-bold mb-1">
                Transactions — {selectedUser?.name}
              </h3>
              <p className="text-grey mb-4 text-sm">
                Viewing transaction history of {selectedUser?.email}
              </p>

              <table className="w-full text-left">
                <thead className="text-white">
                  <tr className="border-b">
                    <th className="py-2">Type</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Balance After</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td className="py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm capitalize ${
                            t.type === "deposit" ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>

                      <td className="py-2 font-semibold">
                        ${Number(t.amount).toFixed(2)}
                      </td>

                      <td className="py-2">${Number(t.balance).toFixed(2)}</td>

                      <td className="py-2 text-white">
                        {new Date(t.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}

                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-grey">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
