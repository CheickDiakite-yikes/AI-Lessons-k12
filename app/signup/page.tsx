'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CustomLogo } from '@/components/CustomLogo';
import { motion } from 'motion/react';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConf: '',
    role: 'teacher',
    school: '',
    howDidYouHear: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.passwordConf) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: formData.name,
        role: formData.role,
        school: formData.school,
        howDidYouHear: formData.howDidYouHear,
        createdAt: serverTimestamp(),
      });

      router.push('/');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Only set doc if it's a new user, but since we can't easily tell without fetching,
      // we can do a setDoc with merge: true, or just set it. 
      // Actually, we should check if the user exists first to not overwrite role/school.
      // But for simplicity, we can set default values if they don't exist.
      // Let's import getDoc to check.
      const { getDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || 'Google User',
          role: 'teacher', // default role
          school: '',
          howDidYouHear: 'Google',
          createdAt: serverTimestamp(),
        });
      }

      router.push('/');
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-crisp-page)] flex flex-col items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border-4 border-[var(--color-deep-ink)] shadow-[8px_8px_0px_0px_var(--color-deep-ink)] p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-[var(--color-sage-green)] border-2 border-[var(--color-deep-ink)] rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_var(--color-deep-ink)]">
              <CustomLogo className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-serif font-black tracking-tight text-[var(--color-deep-ink)]">Lesson<span className="text-[var(--color-sage-green)]">Craft</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-deep-ink)]">Create an Account</h1>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full mb-6 flex items-center justify-center gap-2 bg-white text-[var(--color-deep-ink)] px-4 py-3 font-bold border-2 border-[var(--color-deep-ink)] shadow-[4px_4px_0px_0px_var(--color-deep-ink)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>

        <div className="relative flex items-center py-2 mb-6">
          <div className="flex-grow border-t-2 border-[var(--color-deep-ink)]"></div>
          <span className="flex-shrink-0 mx-4 text-[var(--color-charcoal-grey)] font-bold text-sm uppercase">Or sign up with email</span>
          <div className="flex-grow border-t-2 border-[var(--color-deep-ink)]"></div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[var(--color-deep-ink)] mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border-2 border-[var(--color-deep-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-green)] bg-[var(--color-crisp-page)]"
              placeholder="Jane Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[var(--color-deep-ink)] mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border-2 border-[var(--color-deep-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-green)] bg-[var(--color-crisp-page)]"
              placeholder="jane@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-ink)] mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border-2 border-[var(--color-deep-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-green)] bg-[var(--color-crisp-page)]"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-ink)] mb-1">Confirm Password</label>
              <input
                type="password"
                name="passwordConf"
                required
                minLength={6}
                value={formData.passwordConf}
                onChange={handleChange}
                className="w-full p-3 border-2 border-[var(--color-deep-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-green)] bg-[var(--color-crisp-page)]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-ink)] mb-1">Role</label>
              <select
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 border-2 border-[var(--color-deep-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-green)] bg-[var(--color-crisp-page)] appearance-none"
              >
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-ink)] mb-1">School (Optional)</label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="w-full p-3 border-2 border-[var(--color-deep-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-green)] bg-[var(--color-crisp-page)]"
                placeholder="Springfield High"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--color-deep-ink)] mb-1">How did you hear about us? (Optional)</label>
            <input
              type="text"
              name="howDidYouHear"
              value={formData.howDidYouHear}
              onChange={handleChange}
              className="w-full p-3 border-2 border-[var(--color-deep-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-green)] bg-[var(--color-crisp-page)]"
              placeholder="Colleague, Twitter, etc."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-sage-green)] text-white px-4 py-3 font-bold border-2 border-[var(--color-deep-ink)] shadow-[4px_4px_0px_0px_var(--color-deep-ink)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-[var(--color-charcoal-grey)]">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--color-deep-ink)] font-bold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
