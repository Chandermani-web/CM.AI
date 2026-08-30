const api = (path, options = {}) => {
  const isFormData = options?.body instanceof FormData;

  return fetch(`http://localhost:8000${path}`, {
    ...options, // spreads method, body, etc.
    credentials: 'include',
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(options?.headers || {}),
    },
  });
};

export default api;