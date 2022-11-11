import { logData } from '../../utils/utils';
import { HttpResponseErrorCode, HttpResponseError } from './errors';

export const getConnection =
  (baseUrl: string) =>
  async (url: string, data: Record<string, any> = {}) => {
    logData(data, 'request');
    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    };
    try {
      const response = await fetch(baseUrl + url, options);
      const { ok, status } = response;
      if (!ok) throw new HttpResponseError(status as HttpResponseErrorCode);
      const responseData = await response.json();
      logData(responseData, 'response');
      return responseData;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
