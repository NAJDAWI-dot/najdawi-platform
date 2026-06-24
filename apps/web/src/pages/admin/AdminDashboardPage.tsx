import { useEffect, useState } from 'react';
import { reportsService } from '../../services/reports.service';
import type { AdminDashboardStats, CourseReport } from '@mos/shared';
import { AdminNav } from '../../components/layout/AdminNav';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [reports, setReports] = useState<CourseReport[]>([]);
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
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 animate-pulse space-y-6">
        <AdminNav />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-800 rounded-2xl" />
        ))}
      </div>
    );
  }

  const statCards = [
    { label: 'Total Enrollments', value: stats?.totalEnrollments ?? 0, color: 'text-brand-400', icon: '🎓' },
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue ?? 0).toFixed(2)}`, color: 'text-emerald-400', icon: '💰' },
    { label: 'Completion Rate', value: `${stats?.completionRate ?? 0}%`, color: 'text-amber-400', icon: '✅' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <AdminNav />
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform performance overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {statCards.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">{s.label}</span>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <div className={`text-4xl font-black ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Course reports table */}
      <h2 className="text-xl font-semibold text-white mb-6">Course Analytics</h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Enrollments</th>
              <th>Completion Rate</th>
              <th>Avg Score</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-slate-500 py-8">No data yet</td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.courseId}>
                  <td className="font-medium text-white">{r.courseTitle}</td>
                  <td>{r.enrollmentCount}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-[100px]">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${r.completionRate}%` }}
                        />
                      </div>
                      <span className="text-emerald-400 text-xs">{r.completionRate}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={r.avgScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                      {r.avgScore}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
