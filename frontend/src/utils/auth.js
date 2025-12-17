
const AUTH_BASE = 'http://localhost:3000/api/auth';

export const getSession = async () => {
  try {
    const res = await fetch(`${AUTH_BASE}/get-session`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

export const logout = async () => {
  await fetch(`${AUTH_BASE}/sign-out`, {
    method: 'POST',
    credentials: 'include',
  });

  // force full refresh so context resets
  window.location.href = '/';
};


// export const isAuthenticated = async () => {
//   const session = await getSession();
//   return !!session?.user;
// };

// export const logout = async () => {
//   await fetch(`${AUTH_BASE}/sign-out`, {
//     method: 'POST',
//     credentials: 'include',
//   });

//   window.location.reload();

// };
