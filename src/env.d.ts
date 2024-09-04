/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
    // 添加 Quasar 相關的環境變量
    QUASAR_APP_VERSION: string;
    QUASAR_APP_BUILD_DATE: string;
  }
}
