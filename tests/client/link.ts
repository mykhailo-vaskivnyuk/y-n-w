import LinkConnection from '../../src/server/link/link';

export const getLinkConnection = (
  url: string,
  onConnection: () => void,
  onMessage: (data: any) => void,
) => [LinkConnection.getClient(onMessage), () => undefined] as const;
