import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('eseva_saved_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('eseva_saved_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [userToken, setUserToken] = useState(
    () => localStorage.getItem('eseva_user_token') || localStorage.getItem('token') || null
  );

  const [adminToken, setAdminToken] = useState(
    () => localStorage.getItem('eseva_admin_token') || localStorage.getItem('adminToken') || null
  );

  const [loading, setLoading] = useState(false);

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
            } else {
              setUser(null);
              setUserToken(null);
              localStorage.removeItem('eseva_user_token');
              localStorage.removeItem('token');
              localStorage.removeItem('eseva_saved_user');
            }
          } else if (res.status === 401 || res.status === 403) {
            // Token is explicitly invalid or expired
            localStorage.removeItem('eseva_user_token');
            localStorage.removeItem('token');
            localStorage.removeItem('eseva_saved_user');
            setUserToken(null);
            setUser(null);
          } else {
            // Server returned non-auth error (500, 502, etc.) - do not log user out
            console.warn('Auth check returned status', res.status, '- retaining local session');
          }
        } catch (e) {
          // Network error or backend offline - retain cached session
          console.warn('Auth verification network error, retaining cached session:', e);
        }
      } else {
        setUser(null);
        setUserToken(null);
      }

      if (adminTok) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${adminTok}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.isAdmin) {
              setAdmin(data);
              localStorage.setItem('eseva_saved_admin', JSON.stringify(data));
            } else {
              setAdmin(null);
              setAdminToken(null);
              localStorage.removeItem('eseva_admin_token');
              localStorage.removeItem('adminToken');
              localStorage.removeItem('eseva_saved_admin');
            }
          } else if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('eseva_admin_token');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('eseva_saved_admin');
            setAdminToken(null);
            setAdmin(null);
          } else {
            console.warn('Admin auth check returned status', res.status, '- retaining local admin session');
          }
        } catch (e) {
          console.warn('Admin auth verification network error:', e);
        }
      } else {
        setAdmin(null);
        setAdminToken(null);
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
    localStorage.setItem('eseva_admin_token', token);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('eseva_saved_admin', JSON.stringify(adminData));
    setAdminToken(token);
    setAdmin(adminData);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('eseva_admin_token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('eseva_saved_admin');
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
