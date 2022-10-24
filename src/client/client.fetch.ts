export const getConnection =
  (baseUrl: string) => async (url: string, data: Record<string, any>) => {
    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include', // include" | "omit" | "same-origin",
    };
    const response = await fetch(baseUrl + url, options);
    const { ok, status, statusText, headers } = response;
    console.log(headers);
    if (ok) return response.json();
    throw new Error(`HTTP response error: ${status} / ${statusText}`);
  };
