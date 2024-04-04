'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Rooms = () => {

  const [headerText, setHeaderText] = useState('');

  useEffect(() => {
    const text = "How do you want to get started?";
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setHeaderText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white shadow-md rounded-lg m-4 p-4">
      <div className="text-center mb-4 animate-fade-in">
        <h1 className="text-4xl font-bold">{headerText}</h1>
      </div>
      <div className="flex flex-col md:flex-row">
        <Link href="/create-room" className="flex justify-center mb-4 md:mb-0 md:mr-4 mt-4">
          <button className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition duration-300">
            Create a Room
          </button>
        </Link>
        <Link href= "/join-room" className="flex justify-center mb-4 md:mb-0 md:mr-4 mt-4">
          <button className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition duration-300">
            Join a Room
          </button>
        </Link>
        <div className="flex justify-center">
        <Link href= "/dumb_bot" className="flex justify-center mb-4 md:mb-0 md:mr-4 mt-4">
          <button className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition duration-300">
            Try with Dumb Bot
          </button>
        </Link>
        </div>
        <Link href= "/" className="flex justify-center mb-4 md:mb-0 md:mr-4 mt-4">
          <button className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition duration-300">
            Back to home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Rooms;