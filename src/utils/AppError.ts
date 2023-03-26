class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  path?: string;
  value?: string;
  code?: number;
  errmsg?: string;
  constructor(
    message: string,
    statusCode: number,
    path?: string,
    value?: string,
    code?: number,
    errmsg?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.path = path;
    this.value = value;
    this.code = code;
    this.errmsg = errmsg;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
