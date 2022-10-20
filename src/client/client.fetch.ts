export const getConnection = (baseUrl: string) => async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(baseUrl + url, options);
    const { ok, status, statusText } = response;
    if (ok) return response.json();
    throw new Error(`HTTP response error: ${status} / ${statusText}`);
  } catch (e: any) {
    console.log(e);
    throw e;
  }
}
