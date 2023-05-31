import LinkConnection from '../../src/server/link/link';

export const getLinkConnection = () =>
  [LinkConnection.handleRequest, () => undefined] as const;
