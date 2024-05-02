'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        <Link href="/rooms" className="flex items-center text-white cursor-pointer">
            <span className="text-2xl">&#128172;</span>
            <span className="ml-2">Generate Data</span>
          </Link>
          <div className="flex items-center text-white">
            <span className="text-2xl">&#128228;</span>
            <span className="ml-2">Manage Data</span>
          </div>
          {isLoggedIn && (
            <Link href="/" className="flex items-center text-white">
              <span className="text-2xl">&#9881;</span>
              <span className="ml-2">Profile</span>
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
                <span className="ml-2">Sign In</span>
              </Link>
            </>
          ) : (
            <Link href="/" onClick={handleLogout} className="flex items-center text-white">
              <span className="text-2xl">&#128682;</span>
              <span className="ml-2">Logout</span>
            </Link>
            
          )
          }
          <Link href = "/about" className="flex items-center text-white">
            <span className="text-2xl">&#9432;</span>
            <span className="ml-2">About us</span>
          </Link>
        </div>
      </div>
      <main className="flex-1 p-4">
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
    </div>
  );
};

export default Home;