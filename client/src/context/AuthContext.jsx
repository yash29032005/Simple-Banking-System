import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(null);
      setLoading(false);
      return;
    }

    const decoded = decodeToken(token);

    if (decoded) {
      setUser(decoded);

      if (decoded.role === "customer") navigate("/transactions");
      if (decoded.role === "banker") navigate("/accounts");
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }

    setLoading(false);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
