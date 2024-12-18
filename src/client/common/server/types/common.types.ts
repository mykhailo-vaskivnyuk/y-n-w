export type ITokenParams = {
  token: string;
};

export type OmitNull<T> = T extends null ? never : T;
