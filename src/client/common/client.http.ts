import { HttpResponseErrorCode, HttpResponseError } from './errors';

export const getConnection =
  (baseUrl: string) =>
  async (url: string, data: Record<string, any> = {}) => {
    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    };
    try {
      const response = await fetch(baseUrl + url, options);
      const { ok, status } = response;
      if (ok) return await response.json();
      throw new HttpResponseError(status as HttpResponseErrorCode);
    } catch (e) {
      console.log(e);
      if (e instanceof HttpResponseError) throw e;
      throw new HttpResponseError(503);
    }
  };
