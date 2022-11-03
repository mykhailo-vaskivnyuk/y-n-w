export type TAccountConfirm = {
      link: string;
    };
export type TAccountConfirmResponse = null | {
      email: string;
      name: string | null;
      mobile: string | null;
      net_name: string | null;
      confirmed: boolean;
    };
export type TAccountLogin = {
      email: string;
      password: string;
    };
export type TAccountLoginResponse = null | {
      email: string;
      name: string | null;
      mobile: string | null;
      net_name: string | null;
      confirmed: boolean;
    };
export type TAccountLogoutResponse = boolean;
export type TAccountOvermail = {
      email: string;
    };
export type TAccountOvermailResponse = boolean;
export type TAccountRemoveResponse = boolean;
export type TAccountRestore = {
      link: string;
    };
export type TAccountRestoreResponse = null | {
      email: string;
      name: string | null;
      mobile: string | null;
      net_name: string | null;
      confirmed: boolean;
    };
export type TAccountSignup = {
      email: string;
    };
export type TAccountSignupResponse = null | {
      email: string;
      name: string | null;
      mobile: string | null;
      net_name: string | null;
      confirmed: boolean;
    };
export type TIndexResponse = string;
export type TMeregaReadResponse = Record<string, any>;
export type TScriptsScript_jsResponse = Record<string, any>;
export type TUserCreate = {
      name: string;
      field: number;
    };
export type TUserCreateResponse = {
      name: string;
    };
export type TUserUpdateResponse = string;
export type TUserReadResponse = null | {
      email: string;
      name: string | null;
      mobile: string | null;
      net_name: string | null;
      confirmed: boolean;
    };
