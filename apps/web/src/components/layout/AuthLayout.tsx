import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-800/20 blur-3xl" />

        <div className="relative z-10 max-w-md text-center">
          <div className="mx-auto mb-8 h-20 w-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-brand-900/60">
            N
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Najdawi Platform</h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Master Microsoft Office Specialist certifications with expert-led courses,
            interactive quizzes, and real exam simulations.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { label: 'Courses', value: '50+' },
              { label: 'Students', value: '12K+' },
              { label: 'Pass Rate', value: '94%' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden flex items-center gap-2 justify-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-black text-lg">
              N
            </div>
            <span className="font-bold text-white text-xl">Najdawi Platform</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
