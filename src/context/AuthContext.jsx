import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [userToken, setUserToken] = useState(localStorage.getItem('eseva_user_token') || localStorage.getItem('token'));
  const [adminToken, setAdminToken] = useState(localStorage.getItem('eseva_admin_token') || localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved tokens
    const userTok = localStorage.getItem('eseva_user_token') || localStorage.getItem('token');
    const adminTok = localStorage.getItem('eseva_admin_token') || localStorage.getItem('adminToken');

    const checkAuth = async () => {
      if (userTok) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${userTok}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (!data.isAdmin) {
              setUser(data);
              localStorage.setItem('eseva_saved_user', JSON.stringify(data));
            }
          } else {
            const savedUser = localStorage.getItem('eseva_saved_user');
            if (savedUser) {
              try {
                setUser(JSON.parse(savedUser));
              } catch (_) {
                localStorage.removeItem('eseva_user_token');
                localStorage.removeItem('token');
                setUserToken(null);
              }
            } else {
              localStorage.removeItem('eseva_user_token');
              localStorage.removeItem('token');
              setUserToken(null);
            }
          }
        } catch (e) {
          const savedUser = localStorage.getItem('eseva_saved_user');
          if (savedUser) {
            try { setUser(JSON.parse(savedUser)); } catch (_) {}
          }
        }
      }

      if (adminTok) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${adminTok}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.isAdmin) setAdmin(data);
          } else {
            localStorage.removeItem('eseva_admin_token');
            setAdminToken(null);
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
    localStorage.setItem('eseva_saved_user', JSON.stringify(userData));
    setUserToken(token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('eseva_user_token');
    localStorage.removeItem('eseva_saved_user');
    setUserToken(null);
    setUser(null);
  };

  const loginAdmin = (adminData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('eseva_admin_token', token);
    setAdminToken(token);
    setAdmin(adminData);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('eseva_admin_token');
    setAdminToken(null);
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
        userToken,
        adminToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
