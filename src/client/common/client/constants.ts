/* eslint-disable max-len */
import { MEMBER_STATUS } from '../server/constants';
import { createEnumFromArray } from '../../local/imports';

export enum AppStatus {
  INITING = 'initing',
  INITED = 'inited',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

export const MEMBER_STATUS_ENUM = createEnumFromArray(MEMBER_STATUS);

export const CONNECTION_ATTEMPT_COUNT = 3;
export const CONNECTION_ATTEMPT_DELAY = 3000;
export const CONNECTION_TIMEOUT = 20000;

export const USE_TG = process.env.USE_TG === 'true';
export const TELEGRAM = JSON.parse(`{
  "WebView": {
    "initParams": {
      "tgWebAppData":"query_id=AAEGn4wxAAAAAAafjDHI3VsX&user=%7B%22id%22%3A831299334%2C%22first_name%22%3A%22Mykhailo%22%2C%22last_name%22%3A%22Vaskivnyuk%22%2C%22username%22%3A%22vaskivnyuk%22%2C%22language_code%22%3A%22uk%22%7D&auth_date=1687767010&hash=501603aa47f89576b8af4340d67ec4c6bf5503f1ec50f513da7dbac92a3c6aed",
      "tgWebAppVersion":"6.7",
      "tgWebAppPlatform":"tdesktop",
      "tgWebAppThemeParams":"{\\"bg_color\\":\\"#ffffff\\",\\"button_color\\":\\"#40a7e3\\",\\"button_text_color\\":\\"#ffffff\\",\\"hint_color\\":\\"#999999\\",\\"link_color\\":\\"#168acd\\",\\"secondary_bg_color\\":\\"#f1f1f1\\",\\"text_color\\":\\"#000000\\"}"
    },
    "isIframe":false
  },
  "Utils":{},
  "WebApp": {
    "initData":"query_id=AAEGn4wxAAAAAAafjDHI3VsX&user=%7B%22id%22%3A831299334%2C%22first_name%22%3A%22Mykhailo%22%2C%22last_name%22%3A%22Vaskivnyuk%22%2C%22username%22%3A%22vaskivnyuk%22%2C%22language_code%22%3A%22uk%22%7D&auth_date=1687767010&hash=501603aa47f89576b8af4340d67ec4c6bf5503f1ec50f513da7dbac92a3c6aed",
    "initDataUnsafe":{"query_id":"AAEGn4wxAAAAAAafjDHI3VsX","user":{"id":831299334,"first_name":"Mykhailo","last_name":"Vaskivnyuk","username":"vaskivnyuk","language_code":"uk"},"auth_date":"1687767010","hash":"501603aa47f89576b8af4340d67ec4c6bf5503f1ec50f513da7dbac92a3c6aed"},
    "version":"6.7",
    "platform":"tdesktop",
    "colorScheme":"light",
    "themeParams":{"bg_color":"#ffffff","button_color":"#40a7e3","button_text_color":"#ffffff","hint_color":"#999999","link_color":"#168acd","secondary_bg_color":"#f1f1f1","text_color":"#000000"},
    "isExpanded":true,
    "viewportHeight":496,
    "viewportStableHeight":496,
    "isClosingConfirmationEnabled":false,
    "headerColor":"#f1f1f1",
    "backgroundColor":"#ffffff",
    "BackButton":{"isVisible":false},
    "MainButton":{"text":"CLOSE WEBVIEW","color":"#40a7e3","textColor":"#ffffff","isVisible":true,"isProgressVisible":false,"isActive":true},
    "HapticFeedback":{}
  }
}`);
