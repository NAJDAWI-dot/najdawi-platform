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

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch {
      // error handled in store
    }
  };

  const field = (name: keyof typeof form) => ({
    value: form[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [name]: e.target.value })),
  });

  const displayError = localError || error;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="mt-1 text-slate-400">Start your Najdawi certification journey today</p>
      </div>

      {displayError && (
        <div className="mb-4 rounded-lg bg-red-900/40 border border-red-800 px-4 py-3 text-sm text-red-300">
          {displayError}
        </div>
      )}

      <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="label">First name</label>
            <input id="firstName" type="text" className="input" placeholder="Jane" required {...field('firstName')} />
          </div>
          <div>
            <label htmlFor="lastName" className="label">Last name</label>
            <input id="lastName" type="text" className="input" placeholder="Doe" required {...field('lastName')} />
          </div>
        </div>

        <div>
          <label htmlFor="reg-username" className="label">Username (Optional)</label>
          <input id="reg-username" type="text" className="input" placeholder="janedoe" {...field('username')} />
        </div>

        <div>
          <label htmlFor="reg-email" className="label">Email address</label>
          <input id="reg-email" type="email" className="input" placeholder="you@example.com" required {...field('email')} autoComplete="email" />
        </div>

        <div>
          <label htmlFor="reg-password" className="label">Password</label>
          <input id="reg-password" type="password" className="input" placeholder="Min 8 characters" required minLength={8} {...field('password')} />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label">Confirm password</label>
          <input id="confirmPassword" type="password" className="input" placeholder="Repeat password" required {...field('confirmPassword')} />
        </div>

        <button
          id="register-submit"
          type="submit"
          className="btn-primary w-full py-3 mt-2"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-medium text-brand-400 hover:text-brand-300 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
