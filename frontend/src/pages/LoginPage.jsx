import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Zap, Mail, Lock } from 'lucide-react';
import useAuth from '../hooks/useAuth';

/**
 * Login page with email/password form, inline validation, and register link.
 */
const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setServerError('');

    const result = await login(formData.email.trim(), formData.password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setServerError(result.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-gradient min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent shadow-glow mb-4">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Welcome back
          </h1>
          <p className="text-text-muted mt-2 text-sm">
            Sign in to your TaskFlow account
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border border-dark-border p-8 animate-slide-up"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-modal)' }}
        >
          {/* Server error */}
          {serverError && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 animate-fade-in">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-muted transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 text-base"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-text-muted mt-6">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              id="login-register-link"
              className="text-accent hover:text-accent-light font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
