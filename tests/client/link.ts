import LinkConnection from '../../src/server/link/link';

export const getLinkConnection = () =>
  [LinkConnection.getClient(), () => undefined] as const;
