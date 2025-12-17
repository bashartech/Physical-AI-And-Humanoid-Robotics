
import React from 'react';
import Navbar from '@theme-original/Navbar';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../utils/auth';

export default function AuthNavbar(props) {
  const { isAuth } = useAuth();

  const items = props.items || [];

  if (isAuth) {
    items.push({
      type: 'button',
      label: 'Logout',
      position: 'right',
      onClick: logout,
    });
  } else {
    items.push(
      { type: 'link', label: 'Login', position: 'right', href: 'http://localhost:3000/login' },
      { type: 'link', label: 'Sign Up', position: 'right', href: 'http://localhost:3000/signup' },
    );
  }

  return <Navbar {...props} items={items} />;
}
