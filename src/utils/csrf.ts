// csrf.ts
export const getCookie = (name: string): string | null => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
  return cookieValue ? decodeURIComponent(cookieValue) : null;
};

export const refreshCSRFToken = async (): Promise<string | null> => {
  await fetch("https://api.ygames.shop/api/csrf/", {
    credentials: "include",
  });
  return getCookie("csrftoken");
};

export const fetchWithCSRF = async (url: string, options: RequestInit = {}) => {
  let csrfToken = getCookie("csrftoken");

  // If no token, fetch it first
  if (!csrfToken) {
    csrfToken = await refreshCSRFToken();
  }

  return fetch(url, {
    ...options,
    credentials: "include", // important for cookies
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken || "",
      ...(options.headers || {}),
    },
  });
};
