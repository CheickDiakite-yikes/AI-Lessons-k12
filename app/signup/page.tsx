'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CustomLogo } from '@/components/CustomLogo';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'teacher',
    school: '',
    howDidYouHear: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          school: formData.school,
          howDidYouHear: formData.howDidYouHear,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed. Please try again.');
        setLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created! Please log in.');
        router.push('/login');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Google signup error:', error);
      setError('Authentication failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 bg-white text-[var(--color-deep-ink)] border-2 border-[var(--color-deep-ink)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-green)] focus:border-[var(--color-sage-green)] placeholder:text-gray-400";

  return (
    <div className="min-h-[100dvh] bg-[var(--color-crisp-page)] flex flex-col items-center justify-center p-3 sm:p-4 font-sans">
      <div className="w-full max-w-md bg-white border-4 border-[var(--color-deep-ink)] shadow-[8px_8px_0px_0px_var(--color-deep-ink)] p-5 sm:p-8">
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-sage-green)] border-2 border-[var(--color-deep-ink)] rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_var(--color-deep-ink)]">
              <CustomLogo className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[var(--color-deep-ink)] leading-none">Lesson<span className="text-[var(--color-sage-green)]">Craft</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-deep-ink)]">Create an Account</h1>
          <p className="text-sm text-[var(--color-charcoal-grey)] mt-2">Join LessonCraft to start planning</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 font-medium text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-[var(--color-deep-ink)] mb-1">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-[var(--color-deep-ink)] mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@school.edu"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-[var(--color-deep-ink)] mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-bold text-[var(--color-deep-ink)] mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-bold text-[var(--color-deep-ink)] mb-1">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="teacher">Teacher</option>
              <option value="admin">Administrator</option>
              <option value="substitute">Substitute Teacher</option>
              <option value="student_teacher">Student Teacher</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="school" className="block text-sm font-bold text-[var(--color-deep-ink)] mb-1">School <span className="font-normal text-gray-400">(optional)</span></label>
            <input
              id="school"
              name="school"
              type="text"
              value={formData.school}
              onChange={handleChange}
              placeholder="Your school name"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="howDidYouHear" className="block text-sm font-bold text-[var(--color-deep-ink)] mb-1">How did you find us? <span className="font-normal text-gray-400">(optional)</span></label>
            <select
              id="howDidYouHear"
              name="howDidYouHear"
              value={formData.howDidYouHear}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select an option</option>
              <option value="search">Search Engine</option>
              <option value="social_media">Social Media</option>
              <option value="colleague">Colleague / Friend</option>
              <option value="conference">Conference / Event</option>
              <option value="blog">Blog / Article</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-sage-green)] text-white px-4 py-3 font-bold border-2 border-[var(--color-deep-ink)] shadow-[4px_4px_0px_0px_var(--color-deep-ink)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center my-5">
          <div className="flex-grow border-t-2 border-gray-200"></div>
          <span className="px-3 text-sm font-medium text-gray-400">or</span>
          <div className="flex-grow border-t-2 border-gray-200"></div>
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-2 bg-white text-[var(--color-deep-ink)] px-4 py-3 font-bold border-2 border-[var(--color-deep-ink)] shadow-[4px_4px_0px_0px_var(--color-deep-ink)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {googleLoading ? 'Signing up...' : 'Sign up with Google'}
        </button>

        <p className="mt-6 text-center text-sm font-medium text-[var(--color-charcoal-grey)]">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--color-deep-ink)] font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
