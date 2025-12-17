// import React, { useState, useEffect } from 'react';
// import Layout from '@theme/Layout';
// import { isAuthenticated } from '../utils/auth';

// // This component will wrap the main layout and handle auth state
// const LayoutWrapper = (props) => {
//   const [isAuth, setIsAuth] = useState(false);

//   useEffect(() => {
//     // Check auth status on component mount
//     setIsAuth(isAuthenticated());

//     // Add event listener to check auth status changes
//     const handleStorageChange = () => {
//       setIsAuth(isAuthenticated());
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   return <Layout {...props} />;
// };

// export default LayoutWrapper;
// import React from 'react';
// import Layout from '@theme/Layout';
// import { AuthProvider } from '../context/AuthContext';

// const LayoutWrapper = (props) => {
//   return (
//     <AuthProvider>
//       <Layout {...props} />
//     </AuthProvider>
//   );
// };

// export default LayoutWrapper;
