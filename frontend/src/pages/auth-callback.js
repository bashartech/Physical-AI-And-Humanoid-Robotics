// import React, { useEffect } from 'react';
// import { navigate } from '@docusaurus/router';
// import { setAuthToken } from '../utils/auth';

// const AuthCallback = () => {
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const token = urlParams.get('token');

//     if (token) {
//       // Store the JWT token in localStorage
//       setAuthToken(token);

//       // Redirect to the main page or dashboard
//       setTimeout(() => {
//         navigate('/');
//       }, 1000); // Wait 1 second before redirecting to show a message
//     } else {
//       // If no token, redirect to login
//       setTimeout(() => {
//         navigate('/login');
//       }, 1000);
//     }
//   }, []);

//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100vh',
//       flexDirection: 'column'
//     }}>
//       <h2>Processing authentication...</h2>
//       <p>Please wait while we complete the login process.</p>
//     </div>
//   );
// };

// export default AuthCallback;