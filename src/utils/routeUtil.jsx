// utils/routeUtils.js

/**
 * Utility function to check if the current route is an admin route
 * @param {string} pathname - The current pathname from window.location or useLocation
 * @returns {boolean} - Returns true if the route starts with '/admin'
 */
export const isAdminRoute = (pathname) => {
    return pathname && pathname.startsWith('/admin');
};

/**
 * Hook to get current route admin status
 * @returns {boolean} - Returns true if current route is admin route
 */
export const useIsAdminRoute = () => {
    if (typeof window !== 'undefined') {
        return isAdminRoute(window.location.pathname);
    }
    return false;
};