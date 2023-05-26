let Cookie = '';
export const getConnection = (baseUrl: string) =>
  async (url: string, data: Record<string, any> = {}) => {
    console.log(' ');
    // logData(data, 'REQ');
    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: `${Cookie};` },
      body: JSON.stringify(data),
      credentials: 'include',
    };
    try {
      const response = await fetch(baseUrl + url, options);
      const { ok, status } = response;
      // HttpResponseError(status as HttpResponseErrorCode);
      if (!ok) throw new Error(`http error: ${status}`);
      const responseData = await response.json();
      Cookie = response.headers.get('set-cookie')?.split(';')[0] || Cookie;
      // logData(responseData, 'RES');
      return responseData;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
