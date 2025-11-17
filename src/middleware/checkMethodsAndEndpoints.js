import ApiError from './utils/apiError.utils.js';


/**
 * Retrieves all registered routes from the Express application
 */
function getRoutes(app) {
  const routes = [];

  if (!app || !app._router || !app._router.stack) {
    console.warn(" Router stack is not initialized yet.");
    return routes;
  }

  function processStack(stack, prefix = '') {
    stack.forEach((layer) => {
      if (layer.route) {
        const path = prefix + layer.route.path;
        Object.keys(layer.route.methods)
          .filter(method => layer.route.methods[method])
          .forEach(method => {
            routes.push({ method: method.toUpperCase(), path });
          });
      } else if (layer.name === 'router' && layer.handle.stack) {
        const routerPrefix = prefix + (layer.regexp.source
          .replace('^\\/?', '')
          .replace('(?:\\/(?=$))?$', '')
          .replace(/\\\//g, '/'));
        processStack(layer.handle.stack, routerPrefix);
      }
    });
  }

  processStack(app._router.stack);
  return routes;
}


/**
 * Middleware factory that checks if the requested method and endpoint are valid
 */
export function checkMethodAndEndpoint(app) {
  const routes = getRoutes(app);

  return (req, res, next) => {
    const requestedMethod = req.method.toUpperCase();
    const requestedPath = req.path;

    try {
      // Find all routes that match the requested path
      const matchingPathRoutes = routes.filter(route => {
        // Simple path matching (exact match or parameterized routes)
        if (route.path === requestedPath) return true;

        // Handle parameterized routes (e.g., /users/:id)
        const routeSegments = route.path.split('/');
        const pathSegments = requestedPath.split('/');

        if (routeSegments.length !== pathSegments.length) return false;

        for (let i = 0; i < routeSegments.length; i++) {
          if (routeSegments[i] !== pathSegments[i] &&
            !routeSegments[i].startsWith(':')) {
            return false;
          }
        }

        return true;
      });

      if (matchingPathRoutes.length === 0) {
        return next(new ApiError(404, `Endpoint ${requestedPath} not found`));
      }

      // Check if the requested method is allowed
      const methodAllowed = matchingPathRoutes.some(
        route => route.method === requestedMethod || route.method === 'ALL'
      );

      if (!methodAllowed) {
        const allowedMethods = [
          ...new Set(matchingPathRoutes.map(route => route.method))
        ].filter(m => m !== 'ALL');

        res.setHeader('Allow', allowedMethods.join(', '));
        return next(
          new ApiError(405, `Method ${requestedMethod} not allowed on ${requestedPath}. Supported methods: ${allowedMethods.join(', ')}`)
        );
      }

      next();
    } catch (error) {
      next(new ApiError(500, 'Internal server error during route validation'));
    }
  };
}