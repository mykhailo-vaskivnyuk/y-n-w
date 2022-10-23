import { HEADERS, THttpModule } from '../types';

export const allowCors: THttpModule = () => (req, res) => {
  const { method } = req;
  if (method?.toLocaleLowerCase() === 'options') {
    res.writeHead(200, HEADERS);
    res.end();
    return false;
  }
  Object
    .keys(HEADERS)
    .forEach((key) =>
      res.setHeader(key, HEADERS[key as keyof typeof HEADERS])
    );
  return true;
}
