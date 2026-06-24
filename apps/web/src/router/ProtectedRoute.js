import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
export function ProtectedRoute({ allowedRoles }) {
    const { user } = useAuthStore();
    if (!user)
        return _jsx(Navigate, { to: "/auth/login", replace: true });
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return _jsx(Navigate, { to: "/courses", replace: true });
    }
    return _jsx(Outlet, {});
}
//# sourceMappingURL=ProtectedRoute.js.map