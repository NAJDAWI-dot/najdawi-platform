import { jsx as _jsx } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
export function AdminNav() {
    const location = useLocation();
    const { user } = useAuthStore();
    const links = [
        { name: 'Dashboard', href: '/admin/dashboard', roles: ['admin', 'instructor'] },
        { name: 'Manage Courses', href: '/admin/courses', roles: ['admin', 'instructor'] },
        { name: 'Manage Users', href: '/admin/users', roles: ['admin'] },
    ].filter(l => l.roles.includes(user?.role || ''));
    return (_jsx("nav", { className: "flex space-x-4 border-b border-slate-800 mb-8 pb-4", children: links.map((link) => {
            const isActive = location.pathname === link.href;
            return (_jsx(Link, { to: link.href, className: `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                    ? 'bg-brand-900/40 text-brand-300 border border-brand-800'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'}`, children: link.name }, link.name));
        }) }));
}
//# sourceMappingURL=AdminNav.js.map