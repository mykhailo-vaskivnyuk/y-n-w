export type TAccountConfirm = {
      link: string;
    };
export type TAccountConfirmResponse =  | {
      email: string;
      name: string | ;
      mobile: string | ;
      net_name: string | ;
      confirmed: boolean;
    };
export type TAccountLogin = {
      email: string;
      password: string;
    };
export type TAccountLoginResponse =  | {
      email: string;
      name: string | ;
      mobile: string | ;
      net_name: string | ;
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
export type TAccountRestoreResponse =  | {
      email: string;
      name: string | ;
      mobile: string | ;
      net_name: string | ;
      confirmed: boolean;
    };
export type TAccountSignup = {
      email: string;
    };
export type TAccountSignupResponse =  | {
      email: string;
      name: string | ;
      mobile: string | ;
      net_name: string | ;
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
export type TUserReadResponse =  | {
      email: string;
      name: string | ;
      mobile: string | ;
      net_name: string | ;
      confirmed: boolean;
    };
