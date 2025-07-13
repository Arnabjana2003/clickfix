export interface IApiError {
  statusCode: number;
  message: string;
}

class ApiError extends Error {
  statusCode: number;
  message: string;
  error: string;
  success: false;
  data: null;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.error = message;
    this.success = false;
    this.data = null;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
