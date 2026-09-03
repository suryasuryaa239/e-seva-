import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved tokens
    const userToken = localStorage.getItem('eseva_user_token') || localStorage.getItem('token');
    const adminToken = localStorage.getItem('eseva_admin_token') || localStorage.getItem('adminToken');

    const checkAuth = async () => {
      if (userToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${userToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (!data.isAdmin) setUser(data);
          } else {
            localStorage.removeItem('eseva_user_token');
            localStorage.removeItem('token');
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (adminToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.isAdmin) setAdmin(data);
          } else {
            localStorage.removeItem('eseva_admin_token');
          }
        } catch (e) {
          console.error(e);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('eseva_user_token', token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('eseva_user_token');
    setUser(null);
  };

  const loginAdmin = (adminData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('eseva_admin_token', token);
    setAdmin(adminData);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('eseva_admin_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        loginUser,
        logoutUser,
        loginAdmin,
        logoutAdmin,
        userToken: localStorage.getItem('eseva_user_token'),
        adminToken: localStorage.getItem('eseva_admin_token')
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
