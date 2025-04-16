export interface NavItem {
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  shortcut: string[];
  items: NavItem[];
  roles: string[]; // Add roles array for role-based access
}
