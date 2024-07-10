import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If there is no error message, set it to empty string
  err.message ||= "";
  err.statusCode ||= 500;

  if (err.name === "CastError") {
    err.message = "Invalid ID";
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export const TryCatch = (func: ControllerType) => {
  // Return a function that accepts req, res, and next
  return (req: Request, res: Response, next: NextFunction) => {
    // sent next because it accepts an error as the first argument
    // and we are using the errorMiddleware to handle the error
    // if there is an error
    // If there is no error, the promise is resolved
    // and the next middleware is called
    // with the req, res, and next arguments
    // This is a way to handle errors in async functions
    // without using try-catch blocks
    // This is a higher order function
    // because it returns a function
    // that accepts req, res, and next
    // and returns a promise
    // that resolves the function with req, res, and next
    // or rejects the function with the error
    // and calls the next middleware
    // which is the errorMiddleware
    return Promise.resolve(func(req, res, next)).catch(next);
  };
};
