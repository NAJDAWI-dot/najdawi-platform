import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { reportsService } from '../../services/reports.service';
import { AdminNav } from '../../components/layout/AdminNav';
export function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        Promise.all([
            reportsService.getDashboardStats(),
            reportsService.getCourseReports(),
        ]).then(([s, r]) => {
            setStats(s);
            setReports(r);
        }).finally(() => setIsLoading(false));
    }, []);
    if (isLoading) {
        return (_jsxs("div", { className: "mx-auto max-w-7xl px-4 py-12 animate-pulse space-y-6", children: [_jsx(AdminNav, {}), [1, 2, 3, 4].map((i) => (_jsx("div", { className: "h-24 bg-slate-800 rounded-2xl" }, i)))] }));
    }
    const statCards = [
        { label: 'Total Enrollments', value: stats?.totalEnrollments ?? 0, color: 'text-brand-400', icon: '🎓' },
        { label: 'Total Revenue', value: `$${(stats?.totalRevenue ?? 0).toFixed(2)}`, color: 'text-emerald-400', icon: '💰' },
        { label: 'Completion Rate', value: `${stats?.completionRate ?? 0}%`, color: 'text-amber-400', icon: '✅' },
    ];
    return (_jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12", children: [_jsx(AdminNav, {}), _jsxs("div", { className: "page-header", children: [_jsx("h1", { className: "page-title", children: "Admin Dashboard" }), _jsx("p", { className: "page-subtitle", children: "Platform performance overview" })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12", children: statCards.map((s) => (_jsxs("div", { className: "stat-card", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-slate-400 text-sm", children: s.label }), _jsx("span", { className: "text-2xl", children: s.icon })] }), _jsx("div", { className: `text-4xl font-black ${s.color}`, children: s.value })] }, s.label))) }), _jsx("h2", { className: "text-xl font-semibold text-white mb-6", children: "Course Analytics" }), _jsx("div", { className: "table-container", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Course" }), _jsx("th", { children: "Enrollments" }), _jsx("th", { children: "Completion Rate" }), _jsx("th", { children: "Avg Score" })] }) }), _jsx("tbody", { children: reports.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "text-center text-slate-500 py-8", children: "No data yet" }) })) : (reports.map((r) => (_jsxs("tr", { children: [_jsx("td", { className: "font-medium text-white", children: r.courseTitle }), _jsx("td", { children: r.enrollmentCount }), _jsx("td", { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-[100px]", children: _jsx("div", { className: "h-full bg-emerald-500 rounded-full", style: { width: `${r.completionRate}%` } }) }), _jsxs("span", { className: "text-emerald-400 text-xs", children: [r.completionRate, "%"] })] }) }), _jsx("td", { children: _jsxs("span", { className: r.avgScore >= 70 ? 'text-emerald-400' : 'text-amber-400', children: [r.avgScore, "%"] }) })] }, r.courseId)))) })] }) })] }));
}
//# sourceMappingURL=AdminDashboardPage.js.map