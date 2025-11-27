import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard'); // redirect after login
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4'>
      <div className='w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-10'>
        {/* Header */}
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-1'>
          Welcome Back
        </h2>
        <p className='text-center text-gray-500 mb-8 text-sm'>
          Sign in to your account
        </p>

        {/* Error */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm mb-5 shadow-sm'>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email address
            </label>
            <input
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full px-5 py-3 rounded-2xl border border-gray-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition'
            />
          </div>

          {/* Password */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              type='password'
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-5 py-3 rounded-2xl border border-gray-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition'
            />
          </div>

          {/* Button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition disabled:opacity-60'
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className='mt-8 text-center text-sm text-gray-600'>
          Don’t have an account?{' '}
          <Link
            to='/signup'
            className='text-blue-600 font-medium hover:text-blue-700 hover:underline'
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
