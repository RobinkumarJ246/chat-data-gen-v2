'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Script from 'next/script';

const Home = () => {
  const router = useRouter();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // Check if user is logged in from local storage
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false'); // Update local storage
    console.log('Logged out');
    router.push('/');
  };

  const toggleSideMenu = () => {
    setShowSideMenu(!showSideMenu);
  };

  const handleGenerateData = () => {
    if (!isLoggedIn) {
      // If user is not logged in, show the login prompt
      setShowLoginPrompt(true);
    } else {
      // Otherwise, proceed with generating data
      router.push('/rooms');
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
            <Link href="/" className="text-white">
              Chat Data Generator
            </Link>
          </div>
          <button className="text-white text-2xl" onClick={toggleSideMenu}>
            ☰
          </button>
        </nav>
      </header>
      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-gray-800 text-white p-4 transition-transform transform ${
          showSideMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3>Menu</h3>
          <button className="text-white text-2xl" onClick={toggleSideMenu}>
            &times;
          </button>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-white cursor-pointer" onClick={handleGenerateData}>
            <span className="text-2xl">&#128172;</span>
            <span className="ml-2">Generate Data</span>
          </div>
          <div className="flex items-center text-white">
            <span className="text-2xl">&#128228;</span>
            <span className="ml-2">Manage Data</span>
          </div>
          {isLoggedIn && (
            <Link href="/profile" className="flex items-center text-white">
              <span className="text-2xl">&#9881;</span>
              <span className="ml-2">Settings</span>
            </Link>
          )}
          {!isLoggedIn ? (
            <>
            <Link href="/register" className="flex items-center text-white">
            <span className="text-2xl">&#128100;</span>
            <span className="ml-2">Register</span>
          </Link>
          <Link href="/login" className="flex items-center text-white">
            <span className="text-2xl">&#128273;</span>
            <span className="ml-2">Login</span>
          </Link>
              
            </>
          ) : (
            <div className="flex items-center text-white" onClick={handleLogout}>
              <span className="text-2xl">&#128682;</span>
              <span className="ml-2">Logout</span>
            </div>
          )}
          <Link href="/about" className="flex items-center text-white">
            <span className="text-2xl">&#9432;</span>
            <span className="ml-2">About</span>
          </Link>
        </div>
      </div>
      <main className="flex-1 p-4">
        {/* Main Content */}
            <section>
        <Script
        src="https://deflekt.ai/webbot/9cb9a73d-2739-4ff3-976e-ff9e339994bf/embed.js"
        strategy="lazyOnload"
      />
        </section>
        <section className="text-center mb-8">
          <h1 className="text-4xl font-bold">Welcome to Chat Data Generator</h1>
          <h4 className="mb-4">Version: 1.1 (BETA)</h4>
          <p>Generate high-quality, custom chat datasets for training your conversational AI models.</p>
        </section>
        <section className="flex justify-around flex-wrap">
          <div className="bg-gray-200 p-8 rounded-lg shadow-md m-4">
            <h2 className="text-2xl font-bold">Customizable Datasets</h2>
            <p>Create datasets tailored to your specific use case and domain, with flexible options for controlling the content and style.</p>
          </div>
          <div className="bg-gray-200 p-8 rounded-lg shadow-md m-4">
            <h2 className="text-2xl font-bold">Natural Conversations</h2>
            <p>Our advanced algorithms ensure that the generated conversations are natural, coherent, and context-aware.</p>
          </div>
          <div className="bg-gray-200 p-8 rounded-lg shadow-md m-4">
            <h2 className="text-2xl font-bold">Dataset in any language</h2>
            <p>Generate datasets in any language including casual languages with flexibility.</p>
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2024 Chat Data Generator. All rights reserved.</p>
        <p>For contact mail at innovatexcel.team@gmail.com</p>
      </footer>
      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-red-500">Authentication required</h2>
            <h4 className="text-xl font-normal mb-4">Please login to your account</h4>
            <div className="flex justify-center">
              <button onClick={() => setShowLoginPrompt(false)} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg mr-2 hover:bg-gray-600">
                Close
              </button>
              <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
