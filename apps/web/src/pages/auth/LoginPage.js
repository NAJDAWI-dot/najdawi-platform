import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
export function LoginPage() {
    const { login, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        try {
            await login(email, password);
            navigate('/courses');
        }
        catch {
            // error handled in store
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Welcome back" }), _jsx("p", { className: "mt-1 text-slate-400", children: "Sign in to continue your learning journey" })] }), error && (_jsx("div", { className: "mb-4 rounded-lg bg-red-900/40 border border-red-800 px-4 py-3 text-sm text-red-300", children: error })), _jsxs("form", { id: "login-form", onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "label", children: "Email address" }), _jsx("input", { id: "email", type: "email", className: "input", placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value), required: true, autoComplete: "email" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "label", children: "Password" }), _jsx("input", { id: "password", type: "password", className: "input", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), required: true, autoComplete: "current-password" })] }), _jsx("button", { id: "login-submit", type: "submit", className: "btn-primary w-full py-3", disabled: isLoading, children: isLoading ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsxs("svg", { className: "animate-spin h-4 w-4", viewBox: "0 0 24 24", fill: "none", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8z" })] }), "Signing in..."] })) : ('Sign in') })] }), _jsxs("p", { className: "mt-6 text-center text-sm text-slate-400", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/auth/register", className: "font-medium text-brand-400 hover:text-brand-300 transition-colors", children: "Create one free" })] })] }));
}
//# sourceMappingURL=LoginPage.js.map