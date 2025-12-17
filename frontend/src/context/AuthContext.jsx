import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSession } from '../utils/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    setLoading(true);
    const data = await getSession();
    setSession(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAuth: !!session?.user,
        loading,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
