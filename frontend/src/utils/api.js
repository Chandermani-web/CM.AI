const api = (path, options = {}) => {
  const isFormData = options?.body instanceof FormData;

  return fetch(`http://localhost:8000${path}`, {
    ...options,
    body: isFormData || !options?.body
      ? options?.body
      : JSON.stringify(options.body),
    credentials: 'include',
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(options?.headers || {}),
    },
  });
};

export default api;