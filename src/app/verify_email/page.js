'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const email = localStorage.getItem('email'); // Get the email from local storage

    try {
      const response = await axios.post('https://cdg-server-v2.onrender.com/api/validate-verification-code', { email, code: verificationCode.toString() });

      if (response.status === 200) {
        // Update the 'verifiedEmail' field to true in the 'auth' collection
        //await axios.post('https://cdg-server-v2.onrender.com/api/validate-verification-code', { email });

        setSuccess('Email verification successful. Redirecting to home page...');
        setTimeout(() => {
          router.push('/');
        }, 3000); // Redirect to home page after 3 seconds
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Invalid or expired verification code. Please try again.');
      } else {
        console.error('Verification error:', err);
        setError('Verification failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-center text-3xl font-bold mb-6">Verify your email</h1>
        
        {/* Alert Box */}
        <div className="bg-blue-50 p-4 rounded-md mb-6 flex items-center space-x-4">
          <span className="text-green-500 text-2xl">&#10003;</span>
          <p className="text-lg text-gray-700">
            We've sent an email with a 6-digit verification code.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md mb-6 flex items-center space-x-4">
          <span className="text-yellow-500 text-2xl">&#9993;</span>
          <p className="text-lg text-gray-700">
            Consider checking your spam box if not found.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
              <p>{success}</p>
            </div>
          )}

          <div>
            <label htmlFor="verificationCode" className="block font-semibold text-gray-600">Verification Code</label>
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              value={verificationCode}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <button 
            type="submit" 
            className={`w-full p-3 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition duration-300 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <Link href="/" className="block text-center mt-6 text-gray-600 hover:text-gray-700 transition duration-300">
          I'll do this later
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;