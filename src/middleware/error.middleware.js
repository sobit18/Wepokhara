import logger from '../config/logger.config.js';
import ApiError from '../utils/ApiError.utils.js';


// Define the error middleware
const errorMiddleware = (err, req, res, next) => {
    // Log the error
    logger.error(err);

    // Create a copy of the error object and set the message
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new ApiError(400, message);
    }

    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ApiError(400, message);
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message).join(', ');
        error = new ApiError(400, message);
    }

    // Send the error response
    res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        data: {
            message: error.message || 'An unexpected error occurred',
        },
    });
};

export default errorMiddleware;