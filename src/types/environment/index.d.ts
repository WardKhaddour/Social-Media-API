declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: number;
      DATABASE_LOCAL: string;
      DATABASE_HOST: string;
      PROD_URL: string;
      DEV_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string | number;
      JWT_COOKIE_EXPIRES_IN: number;
      EMAIL_USERNAME: string;
      EMAIL_PASSWORD: string;
      EMAIL_HOST: string;
      EMAIL_PORT: number;
      EMAIL_FROM: string;
      EMAIL_PROD_API_KEY: string;
      SMTP_HOST: string;
      SMTP_PORT: number;
      SMTP_USERNAME: string;
      SMTP_PASSWORD: string;
      RECAPTCHA_SECRET_KEY: string;
    }
  }
}
export {};
