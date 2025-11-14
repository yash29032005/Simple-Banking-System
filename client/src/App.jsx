import React from "react";
import { Routes, Route } from "react-router-dom";
import TransactionsPage from "./pages/TransactionsPage";
import AccountsPage from "./pages/AccountsPage";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<AuthPage />} />

        {/* Customer Transactions */}
        <Route
          path="/transactions"
          element={
            <>
              <Navbar />
              <TransactionsPage />
            </>
          }
        />

        {/* Banker Accounts Page */}
        <Route
          path="/accounts"
          element={
            <>
              <Navbar />
              <AccountsPage />
            </>
          }
        />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
