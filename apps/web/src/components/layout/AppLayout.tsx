import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '@mos/shared';

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/courses" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm">
                N
              </div>
              <span className="font-bold text-white text-lg">Najdawi Platform</span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-6">
              <Link
                to="/courses"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Courses
              </Link>

              {user && (
                <Link
                  to="/student/dashboard"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  My Learning
                </Link>
              )}

              {(user?.role === UserRole.ADMIN || user?.role === UserRole.INSTRUCTOR) && (
                <Link
                  to="/admin/dashboard"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {user.role === UserRole.ADMIN ? 'Admin' : 'Instructor Dashboard'}
                </Link>
              )}
            </div>

            {/* User actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
                    <div className="h-6 w-6 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
                      {user.firstName[0]}
                    </div>
                    <span className="text-sm text-slate-300 hidden sm:block">
                      {user.firstName}
                    </span>
                  </div>
                  <button
                    id="logout-btn"
                    onClick={handleLogout}
                    className="btn-secondary text-xs px-3 py-1.5"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth/login" className="btn-secondary text-xs px-4 py-2">
                    Sign in
                  </Link>
                  <Link to="/auth/register" className="btn-primary text-xs px-4 py-2">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Najdawi Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
