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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    const decoded = decodeToken(token);

    if (decoded) {
      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      });

      if (decoded.role === "customer") {
        navigate("/transactions");
      } else if (decoded.role === "banker") {
        navigate("/accounts");
      }
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
