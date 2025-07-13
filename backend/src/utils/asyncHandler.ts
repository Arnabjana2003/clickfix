import { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler =
  (func: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await func(req, res, next);
    } catch (error:any) {
      console.error("Error caught by asyncHandler ❌:", error);

      const status = error.statusCode || error.http_code || 500;
      res.status(status).json({
        statusCode: status,
        success: false,
        message: error.message || "Internal Server Error",
        data: null,
      });
    }
  };

export default asyncHandler;
