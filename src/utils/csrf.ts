// csrf.ts
export const getCookie = (name: string): string | null => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
  return cookieValue ? decodeURIComponent(cookieValue) : null;
};

export const refreshCSRFToken = async (): Promise<string | null> => {
  const res = await fetch("https://api.ygames.shop/api/csrf/", {
    credentials: "include",
  });
  const data = await res.json();
  console.log(' new console CSRF Token refreshed:', data.csrfToken);
  return data.csrfToken || null;
};

export const fetchWithCSRF = async (url: string, options: RequestInit = {}) => {
  const csrfToken = await refreshCSRFToken();
  console.log('Using CSRF Token:', csrfToken);
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken || "",
      ...(options.headers || {}),
    },
  });
};
