import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
export function RegisterPage() {
    const { register, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [localError, setLocalError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        setLocalError('');
        if (form.password !== form.confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }
        try {
            await register({
                firstName: form.firstName,
                lastName: form.lastName,
                username: form.username || undefined,
                email: form.email,
                password: form.password,
            });
            navigate('/courses');
        }
        catch {
            // error handled in store
        }
    };
    const field = (name) => ({
        value: form[name],
        onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
    });
    const displayError = localError || error;
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Create your account" }), _jsx("p", { className: "mt-1 text-slate-400", children: "Start your Najdawi certification journey today" })] }), displayError && (_jsx("div", { className: "mb-4 rounded-lg bg-red-900/40 border border-red-800 px-4 py-3 text-sm text-red-300", children: displayError })), _jsxs("form", { id: "register-form", onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "firstName", className: "label", children: "First name" }), _jsx("input", { id: "firstName", type: "text", className: "input", placeholder: "Jane", required: true, ...field('firstName') })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "lastName", className: "label", children: "Last name" }), _jsx("input", { id: "lastName", type: "text", className: "input", placeholder: "Doe", required: true, ...field('lastName') })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "reg-username", className: "label", children: "Username (Optional)" }), _jsx("input", { id: "reg-username", type: "text", className: "input", placeholder: "janedoe", ...field('username') })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "reg-email", className: "label", children: "Email address" }), _jsx("input", { id: "reg-email", type: "email", className: "input", placeholder: "you@example.com", required: true, ...field('email'), autoComplete: "email" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "reg-password", className: "label", children: "Password" }), _jsx("input", { id: "reg-password", type: "password", className: "input", placeholder: "Min 8 characters", required: true, minLength: 8, ...field('password') })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "label", children: "Confirm password" }), _jsx("input", { id: "confirmPassword", type: "password", className: "input", placeholder: "Repeat password", required: true, ...field('confirmPassword') })] }), _jsx("button", { id: "register-submit", type: "submit", className: "btn-primary w-full py-3 mt-2", disabled: isLoading, children: isLoading ? 'Creating account...' : 'Create account' })] }), _jsxs("p", { className: "mt-6 text-center text-sm text-slate-400", children: ["Already have an account?", ' ', _jsx(Link, { to: "/auth/login", className: "font-medium text-brand-400 hover:text-brand-300 transition-colors", children: "Sign in" })] })] }));
}
//# sourceMappingURL=RegisterPage.js.map