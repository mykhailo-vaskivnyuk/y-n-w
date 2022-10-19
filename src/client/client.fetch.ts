const connection = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (response.ok) return response.json();
    throw new Error('http response error');
  } catch (e: any) {
    console.log(e);
    throw e;
  }
}

export { connection };
