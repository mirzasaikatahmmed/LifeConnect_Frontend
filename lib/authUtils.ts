export const getDefaultDashboardPath = (role: string | undefined): string => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return '/admin/dashboard';
    case 'manager':
      return '/manager/Dashboard';
    case 'donor':
      return '/donor/dashboard';
    case 'user':
      return '/user';
    default:
      return '/login';
  }
};

export const isAuthorizedForRoute = (userRole: string | undefined, route: string): boolean => {
  if (!userRole) return false;
  
  // Admin routes
  if (route.startsWith('/admin')) {
    return userRole.toLowerCase() === 'admin';
  }
  
  // Manager routes
  if (route.startsWith('/manager')) {
    return userRole.toLowerCase() === 'manager';
  }
  
  // Donor routes
  if (route.startsWith('/donor')) {
    return userRole.toLowerCase() === 'donor';
  }

  // User routes
  if (route.startsWith('/user')) {
    return ['user'].includes(userRole.toLowerCase());
  }
  
  // Public routes
  return true;
};

export const shouldRedirectFromLogin = (userRole: string | undefined): string | null => {
  if (!userRole) return null;
  return getDefaultDashboardPath(userRole);
};