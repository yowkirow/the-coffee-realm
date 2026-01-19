import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('coffee_realm_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (name, role = 'customer') => {
    // Simulate login - generate a random ID if not exists
    const newUser = {
      id: crypto.randomUUID(),
      name,
      role, // 'customer' or 'barista'
      points: role === 'customer' ? 0 : undefined,
      joinedDate: new Date().toISOString(),
    };
    
    // For demo purposes, we just persist this new user
    // In a real app, we'd fetch from API
    setUser(newUser);
    localStorage.setItem('coffee_realm_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('coffee_realm_user');
  };

  const addPoint = () => {
    if (user && user.role === 'customer') {
      const updatedUser = { ...user, points: (user.points || 0) + 1 };
      setUser(updatedUser);
      localStorage.setItem('coffee_realm_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, addPoint, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
