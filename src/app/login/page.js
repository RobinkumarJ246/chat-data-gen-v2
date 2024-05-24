'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      router.push('/');
    }
  }, []);

  const fetchUsername = async (email) => {
    try {
      const response = await axios.get(`https://cdg-server-vercel.onrender.com/api/getUsername/${email}`);
      return response.data.username;
    } catch (err) {
      console.error('Fetch username error:', err);
      return null;
    }
  };

  const fetchDisplayname = async (email) => {
    try {
      const response = await axios.get(`https://cdg-server-v2.onrender.com/api/getDisplayname/${email}`);
      return response.data.displayname;
    } catch (err) {
      console.error('Fetch displayname error:', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://cdg-server-v2.onrender.com/api/login', { email, password });

      if (response.status === 200) {
        const userName = await fetchUsername(email);
        const displayName = await fetchDisplayname(email);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName',userName)
        localStorage.setItem('email', email);
        localStorage.setItem('displayName', displayName);
        console.log(localStorage.getItem('email'))  // Store email in localStorage
        console.log(localStorage.getItem('userName'))  // Store email in localStorage
        console.log(localStorage.getItem('displayName'))  // Store email in localStorage
        router.push('/');
      } else {
        setError(response.data.error || 'Login failed. Please try again later.');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password');
      } else {
        console.error('Login error:', err);
        setError('Login failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-center text-2xl font-bold mb-4">Login to your account</h1>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-2" role="alert">
              <p>{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block font-semibold text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block font-semibold text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <button 
            type="submit" 
            className={`w-full p-2 rounded-md transition duration-300 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing you in...' : 'Sign In'}
          </button>
        </form>
        <Link href="/register" className=" w-full p-2 rounded-md block text-center mt-4 bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
          I dont have an account
        </Link>
        <Link href="/" className="block text-center mt-4 text-gray-600 hover:text-gray-700 transition duration-300">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SignIn;