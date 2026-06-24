import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { UserRole } from '@mos/shared';
import { usersService } from '../../services/users.service';
import { AdminNav } from '../../components/layout/AdminNav';
const ROLES = Object.values(UserRole);
export function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const load = (p = 1) => {
        setIsLoading(true);
        usersService.getAll(p, 20).then(({ data, total }) => {
            setUsers(data);
            setTotal(total);
            setIsLoading(false);
        });
    };
    useEffect(() => { load(); }, []);
    const handleRoleChange = async (id, role) => {
        setUpdatingId(id);
        try {
            const updated = await usersService.assignRole(id, role);
            setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        }
        finally {
            setUpdatingId(null);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('Delete this user?'))
            return;
        await usersService.delete(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
    };
    return (_jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12", children: [_jsx(AdminNav, {}), _jsxs("div", { className: "page-header", children: [_jsx("h1", { className: "page-title", children: "Manage Users" }), _jsxs("p", { className: "page-subtitle", children: [total, " users registered"] })] }), _jsx("div", { className: "table-container", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "Role" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Joined" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: isLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "text-center py-8", children: _jsx("div", { className: "animate-spin h-6 w-6 border-2 border-brand-500 border-t-transparent rounded-full mx-auto" }) }) })) : (users.map((user) => (_jsxs("tr", { children: [_jsx("td", { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-7 w-7 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold text-white", children: user.firstName[0] }), _jsxs("span", { className: "text-white", children: [user.firstName, " ", user.lastName] })] }) }), _jsx("td", { className: "text-slate-400", children: user.email }), _jsx("td", { children: _jsx("select", { id: `role-select-${user.id}`, value: user.role, disabled: updatingId === user.id, onChange: (e) => handleRoleChange(user.id, e.target.value), className: "bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500", children: ROLES.map((r) => (_jsx("option", { value: r, children: r }, r))) }) }), _jsx("td", { children: _jsx("span", { className: user.isActive ? 'badge-green' : 'badge-red', children: user.isActive ? 'Active' : 'Inactive' }) }), _jsx("td", { className: "text-slate-500 text-xs", children: new Date(user.createdAt).toLocaleDateString() }), _jsx("td", { children: _jsx("button", { id: `delete-user-${user.id}`, onClick: () => handleDelete(user.id), className: "text-xs text-red-400 hover:text-red-300 transition-colors", children: "Delete" }) })] }, user.id)))) })] }) })] }));
}
//# sourceMappingURL=AdminUsersPage.js.map