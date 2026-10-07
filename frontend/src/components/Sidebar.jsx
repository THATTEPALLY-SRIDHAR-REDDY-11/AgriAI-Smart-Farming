import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Scan,
  Bot,
  Package,
  ShoppingBag,
  History,
  User,
  PlusCircle,
  ClipboardList
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const isFarmer = user.role === 'FARMER';

  const farmerLinks = [
    { to: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/farmer/disease-detection', label: 'AI Disease Detection', icon: Scan },
    { to: '/farmer/advisory', label: 'AI Advisory Chat', icon: Bot },
    { to: '/farmer/products', label: 'My Products', icon: Package },
    { to: '/farmer/products/new', label: 'Add Produce', icon: PlusCircle },
    { to: '/farmer/requests', label: 'Purchase Requests', icon: ClipboardList },
    { to: '/farmer/history', label: 'Detection History', icon: History },
    { to: '/farmer/profile', label: 'Profile', icon: User },
  ];

  const buyerLinks = [
    { to: '/buyer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/buyer/marketplace', label: 'Produce Marketplace', icon: ShoppingBag },
    { to: '/buyer/requests', label: 'My Requests & Pickups', icon: ClipboardList },
    { to: '/buyer/profile', label: 'Profile', icon: User },
  ];

  const links = isFarmer ? farmerLinks : buyerLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 shrink-0 hidden md:block">
      <div className="mb-4 px-3 py-2 bg-emerald-50/70 rounded-xl border border-emerald-100">
        <p className="text-xs font-medium text-emerald-800">Role: <span className="font-bold">{user.role}</span></p>
        <p className="text-xs text-slate-500 truncate">{user.email}</p>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
