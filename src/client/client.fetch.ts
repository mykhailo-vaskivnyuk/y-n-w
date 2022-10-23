export const getConnection =
  (baseUrl: string) => async (url: string, data: Record<string, any>) => {
    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
    const response = await fetch(baseUrl + url, options);
    const { ok, status, statusText } = response;
    if (ok) return response.json();
    throw new Error(`HTTP response error: ${status} / ${statusText}`);
  };
