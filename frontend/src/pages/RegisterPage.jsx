import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Zap, Mail, Lock, User } from 'lucide-react';
import useAuth from '../hooks/useAuth';

/**
 * Register page with full validation including password confirmation.
 */
const RegisterPage = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
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
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    const result = await register(
      formData.name.trim(),
      formData.email.trim(),
      formData.password,
      formData.confirmPassword
    );
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setServerError(result.message || 'Registration failed. Please try again.');
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (score === 2) return { label: 'Fair', color: 'bg-amber-500', width: '50%' };
    if (score === 3) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const strength = formData.password ? getPasswordStrength() : null;

  return (
    <div className="auth-gradient min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent shadow-glow mb-4">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Create account
          </h1>
          <p className="text-text-muted mt-2 text-sm">
            Start managing tasks with TaskFlow today
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

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full name */}
            <div>
              <label htmlFor="register-name" className="label">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                <input
                  id="register-email"
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
              <label htmlFor="register-password" className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-muted transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength bar */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-dark-border rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs text-text-subtle mt-1">{strength.label} password</p>
                </div>
              )}
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="register-confirm-password" className="label">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-muted transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="register-submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              id="register-login-link"
              className="text-accent hover:text-accent-light font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
