declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: number;
      DATABASE_LOCAL: string;
      PROD_URL: string;
      DEV_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string | number;
      JWT_COOKIE_EXPIRES_IN: number;
      EMAIL_USERNAME: string;
      EMAIL_PASSWORD: string;
      EMAIL_HOST: string;
      EMAIL_PORT: number;
    }
  }
}
export {};
