import {
  LayoutDashboard, Sprout, ShoppingCart, Truck, Warehouse, Radio,
  Route, BarChart3, Users, Settings, DollarSign, FileText, User,
  MapPin, ShieldAlert, CheckCircle2, Package, Search
} from "lucide-react";

export const ROLES = {
  farmer: "farmer",
  buyer: "buyer",
  transporter: "transporter",
  admin: "admin"
};

export const ROLE_CONFIG = {
  farmer: {
    key: "farmer",
    name: "Farmer",
    badgeLabel: "Verified Farmer",
    headerTitle: "Farmer Dashboard",
    headerSubtitle: "Welcome back, Farmer",
    themeClass: "theme-farmer",
    accentColor: "#166534",
    defaultPage: "Dashboard",
    navigation: [
      { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "My Produce", label: "My Produce", icon: Sprout },
      { id: "Find Buyers", label: "Find Buyers", icon: Search },
      { id: "My Orders", label: "My Orders", icon: ShoppingCart },
      { id: "Transport", label: "Transport", icon: Truck },
      { id: "Storage", label: "Storage", icon: Warehouse },
      { id: "IoT Monitoring", label: "IoT Monitoring", icon: Radio },
      { id: "Payments", label: "Payments", icon: DollarSign },
      { id: "Profile", label: "Profile", icon: User }
    ]
  },
  buyer: {
    key: "buyer",
    name: "Buyer",
    badgeLabel: "Verified Buyer",
    headerTitle: "Buyer Dashboard",
    headerSubtitle: "Find fresh produce directly from verified suppliers",
    themeClass: "theme-buyer",
    accentColor: "#0284c7",
    defaultPage: "Dashboard",
    navigation: [
      { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "Find Produce", label: "Find Produce", icon: Sprout },
      { id: "My Requirements", label: "My Requirements", icon: FileText },
      { id: "My Orders", label: "My Orders", icon: ShoppingCart },
      { id: "Transport Tracking", label: "Transport Tracking", icon: Truck },
      { id: "Payments", label: "Payments", icon: DollarSign },
      { id: "Profile", label: "Profile", icon: User }
    ]
  },
  transporter: {
    key: "transporter",
    name: "Transporter",
    badgeLabel: "Logistics Partner",
    headerTitle: "Transport Operations",
    headerSubtitle: "Manage your trips and optimize deliveries",
    themeClass: "theme-transporter",
    accentColor: "#d97706",
    defaultPage: "Dashboard",
    navigation: [
      { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "Transport Requests", label: "Transport Requests", icon: Package },
      { id: "My Vehicles", label: "My Vehicles", icon: Truck },
      { id: "Active Trips", label: "Active Trips", icon: Route },
      { id: "Route Optimizer", label: "Route Optimizer", icon: Route },
      { id: "Delivery History", label: "Delivery History", icon: CheckCircle2 },
      { id: "Earnings", label: "Earnings", icon: DollarSign },
      { id: "IoT Monitoring", label: "IoT Monitoring", icon: Radio },
      { id: "Profile", label: "Profile", icon: User }
    ]
  },
  admin: {
    key: "admin",
    name: "Admin",
    badgeLabel: "System Administrator",
    headerTitle: "System Administration",
    headerSubtitle: "Monitor the complete agricultural supply chain",
    themeClass: "theme-admin",
    accentColor: "#4f46e5",
    defaultPage: "Dashboard",
    navigation: [
      { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "Users", label: "Users", icon: Users },
      { id: "Farmers", label: "Farmers", icon: Sprout },
      { id: "Buyers", label: "Buyers", icon: ShoppingCart },
      { id: "Transporters", label: "Transporters", icon: Truck },
      { id: "Produce Listings", label: "Produce Listings", icon: Package },
      { id: "Orders", label: "Orders", icon: ShoppingCart },
      { id: "Transportation", label: "Transportation", icon: Truck },
      { id: "Storage", label: "Storage", icon: Warehouse },
      { id: "IoT Monitoring", label: "IoT Monitoring", icon: Radio },
      { id: "Analytics", label: "Analytics", icon: BarChart3 },
      { id: "System Settings", label: "System Settings", icon: Settings }
    ]
  }
};

// Helper to normalize role keys (e.g., 'Farmer' -> 'farmer')
export function normalizeRole(roleStr) {
  if (!roleStr) return ROLES.farmer;
  const lower = roleStr.toLowerCase();
  if (lower.includes("farm")) return ROLES.farmer;
  if (lower.includes("buy")) return ROLES.buyer;
  if (lower.includes("trans")) return ROLES.transporter;
  if (lower.includes("admin")) return ROLES.admin;
  return ROLES.farmer;
}

// Check if a role is authorized for a page ID
export function isPageAllowed(roleKey, pageId) {
  const normKey = normalizeRole(roleKey);
  const cfg = ROLE_CONFIG[normKey];
  if (!cfg) return false;
  return cfg.navigation.some(item => item.id === pageId);
}
