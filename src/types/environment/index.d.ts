declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;
      DATABASE_LOCAL: string;
      DATABASE_HOST: string;
      PROD_URL: string;
      DEV_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      JWT_COOKIE_EXPIRES_IN: string;
      EMAIL_USERNAME: string;
      EMAIL_PASSWORD: string;
      EMAIL_HOST: string;
      EMAIL_PORT: string;
      EMAIL_FROM: string;
      EMAIL_PROD_API_KEY: string;
      SPARK_POST_API_KEY: string;
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_USERNAME: string;
      SMTP_PASSWORD: string;
      RECAPTCHA_SECRET_KEY: string;
    }
  }
}
export {};
