interface IBaseEnvironment {
  VERSION: string;
}
export interface IEnvironment extends IBaseEnvironment {
  production: boolean;
  isAndroid?: boolean;
  isPWA?: boolean;
}

export const BASE_ENVIRONMENT = {
  VERSION: require("../../package.json").version
};
