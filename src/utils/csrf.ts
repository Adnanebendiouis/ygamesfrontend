// csrf.ts
export const getCookie = (name: string): string | null => {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='))
    ?.split('=')[1];
  return cookieValue ? decodeURIComponent(cookieValue) : null;
};

export const fetchWithCSRF = (url: string, options: RequestInit = {}) => {
  const csrfToken = getCookie('csrftoken');
  return fetch(url, {
    ...options,
    credentials: 'include', // très important pour les sessions
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken || '',
      ...(options.headers || {}),
    },
  });
};
