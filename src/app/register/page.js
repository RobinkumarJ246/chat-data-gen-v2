'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const Register = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendWelcomeEmail = async () => {
    try {
      const emailResponse = await axios.post('https://cdg-server-v2.onrender.com/api/welcome-mail', {
        toEmail: formData.email,
        subject: 'Account creation success',
        htmlContent: `
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ChatDataGen</title>
          </head>
          <body style="font-family: Arial, sans-serif;">
            <!-- Header -->
            <header style="background-color: #f0f0f0; padding: 20px;">
                <h1 style="margin: 0; color: #333;">Welcome to ChatDataGen</h1>
            </header>
            <!-- Content -->
            <section style="padding: 20px;">
                <p>Hello ${formData.userName},</p>
                <p>Welcome to ChatDataGen! We're excited to have you on board.</p>
                <p>This webapp is created to help data scientists and AI model engineers to craft conversational datasets using simpler steps.</p>
                <p><ul>
                <li>Create/Join a room</li>
                <li>Have casual coversations crafting it for your dataset in any language</li>
                <li>Download the dataset in desired format in seconds</li>
                </ul>
                </p>
                <p>Its way simpler than you think to make one</p>
                <p>The platform is still in beta development and can have bugs and errors, so please let us know your valuable feedback and suggestions that will greatly improve our solution.</p>
                <p>We thank you once again for joining us in the early stage</p>
            </section>
            <!-- Footer -->
            <footer style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                <p style="margin: 0;">Best regards,<br> Innovatexcel team</p>
            </footer>
          </body>
        </html>
        `,
      });
    } catch (err) {
      console.error('Email sending error:', err);
      alert('Failed to send welcome email. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
  
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter and one number.');
      setIsLoading(false);
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await axios.post('https://cdg-server-v2.onrender.com/api/register', formData);
  
      if (response.status === 200) {
        setSuccess('Registration successful. Redirecting for verification...');
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', formData.userName);
        localStorage.setItem('email', formData.email);
        
        await sendWelcomeEmail();  // Sending welcome email
        
        setTimeout(() => {
          router.push('/verify_email');
        }, 3000);
      } else {
        alert(response.data.error || 'Registration is failed. Please try again later.');
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert('Email already exists. Please login instead.');
      } else {
        console.error('Registration error:', err);
        alert('Registration failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-center text-2xl font-bold mb-4">Register your account</h1>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-2" role="alert">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-2" role="alert">
              <p>{success}</p>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block font-semibold text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="userName" className="block font-semibold text-gray-600">User Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block font-semibold text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block font-semibold text-gray-600">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <button 
            type="submit" 
            className={`w-full p-2 rounded-md transition duration-300 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <Link href="/login" className=" w-full p-2 rounded-md block text-center mt-4 bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
          I already have an account
        </Link>
        <Link href="/" className="block text-center mt-4 text-gray-600 hover:text-gray-700 transition duration-300">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Register;