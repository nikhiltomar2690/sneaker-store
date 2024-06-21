export const errorMiddleware = (err, req, res, next) => {
    // If there is no error message, set it to empty string
    err.message || (err.message = "");
    err.statusCode || (err.statusCode = 500);
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
export const TryCatch = (func) => {
    // Return a function that accepts req, res, and next
    return (req, res, next) => {
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
