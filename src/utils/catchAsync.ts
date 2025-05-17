import { Request, Response, NextFunction } from "express";

// adds catch method to function to send errors to global handler
export function catchAsync(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => next(err));
  };
}
