
import React from 'react';
import { logout } from '../utils/auth';
import { useAuth } from '../context/AuthContext';

const NavbarAuth = () => {
  const { isAuth, loading } = useAuth();

  if (loading) return null;

  return isAuth ? (
    <button onClick={logout}>Logout</button>
  ) : (
    <a href="http://localhost:3000/login">Login</a>
  );
};

export default NavbarAuth;
