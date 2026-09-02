const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const error = new Error(data?.error || data?.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  functions: {
    invoke: (name, payload = {}) => request(`/api/functions/${encodeURIComponent(name)}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(data => ({ data })),
  },
  auth: {
    me: () => request('/api/auth/me'),
    logout: (redirectUrl) => {
      const task = request('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
      if (redirectUrl) task.finally(() => { window.location.href = redirectUrl; });
      return task;
    },
    redirectToLogin: (redirectUrl = window.location.href) => {
      const loginUrl = import.meta.env.VITE_LOGIN_URL || '/login';
      const separator = loginUrl.includes('?') ? '&' : '?';
      window.location.href = `${loginUrl}${separator}redirect_uri=${encodeURIComponent(redirectUrl)}`;
    },
  },
};

export { request };
