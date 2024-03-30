// pages/profile.js

'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const router = useRouter();

  const handleNavigateToHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl px-4 py-8">
        {/* Profile Picture and User Information */}
        <div className="bg-white p-6 rounded-md shadow-md flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <img 
            src="./src/assets/avatar.jpg"
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0"
          />
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h2 className="text-xl font-semibold">CDG User</h2>
            <p className="text-gray-600">No subscription</p>
            <div className="flex space-x-4 mt-4">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Edit Profile
              </button>
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Additional User Details */}
        <div className="bg-white mt-8 p-6 rounded-md shadow-md w-full">
          <h3 className="text-lg font-semibold mb-4">Danger Zone</h3>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
            >
              Delete account
            </button>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 mt-4 md:mt-0"
            >
              Temp-Disable account
            </button>
          </div>
        </div>

        {/* Navigation Button */}
        <button 
          onClick={handleNavigateToHome} 
          className="mt-8 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 w-full md:w-auto"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Profile;