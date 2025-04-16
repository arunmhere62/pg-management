// Define role hierarchy and route access patterns
type Role = 'ADMIN' | 'EMPLOYEE';

interface RoleConfig {
  routes: string[];
  inherits?: Role[];
}

const roleHierarchy: Record<Role, RoleConfig> = {
  ADMIN: {
    routes: ['/dashboard/overview']
  },
  EMPLOYEE: {
    routes: [
      '/dashboard/overview',
      '/pg-locations/view/*',
      '/rooms/view/*',
      '/tenants/view/*'
    ]
  }
};

function matchRoute(pattern: string, path: string): boolean {
  // Convert route pattern to regex
  const regexPattern = pattern
    .replace(/\//g, '\\/') // Escape forward slashes
    .replace(/\*/g, '.*'); // Convert * to .*
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
}

function getAllowedRoutes(role: Role): string[] {
  const config = roleHierarchy[role];
  if (!config) return [];

  let routes = [...config.routes];

  // Add inherited routes
  if (config.inherits) {
    config.inherits.forEach((inheritedRole) => {
      routes = routes.concat(getAllowedRoutes(inheritedRole));
    });
  }

  return [...new Set(routes)]; // Remove duplicates
}

export function hasAccess(path: string, roleName: string): boolean {
  const role = roleName.toUpperCase() as Role;

  // Special case: allow access to error and unauthorized pages
  if (path === '/unauthorized' || path === '/error') {
    return true;
  }

  if (!roleHierarchy[role]) {
    console.warn(`Unknown role: ${role}`);
    return false;
  }

  const allowedRoutes = getAllowedRoutes(role);
  return allowedRoutes.some((pattern) => matchRoute(pattern, path));
}
