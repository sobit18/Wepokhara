
/**
 * Middleware to increase timeout for specific routes
 * @param timeoutMs - Timeout in milliseconds (default: 10 minutes)
 */
export const increaseTimeout = (timeoutMs = 600000) => {
  return (req, res, next) => {
    // Increase request timeout
    req.setTimeout(timeoutMs);

    // Increase response timeout
    res.setTimeout(timeoutMs);

    next();
  };
};