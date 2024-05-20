'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const getStoredValue = (key, defaultValue) => {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem(key);
    return storedValue ? storedValue : defaultValue;
  }
  return defaultValue;
};

const Profile = () => {
  const router = useRouter();
  const [displayname, setDisplayname] = useState('CDG USER');
  const [username, setUsername] = useState('CDG USER');
  const [email, setEmail] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const achievements = [
    {
      badge: '/achievements/room_owner.png',
      name: 'Room owner',
      description: 'Awarded for creating your very first room.'
    },
    {
      badge: '/achievements/first_wordsmith.png',
      name: 'Room owner',
      description: 'Awarded for chatting in the room for the first time.'
    }
  ];

  const handleNavigateToHome = () => {
    router.push('/');
  };

  useEffect(() => {
    const storedDisplayname = getStoredValue('displayName', 'CDG USER');
    const storedEmail = getStoredValue('email', '');
    const storedUsername = getStoredValue('userName', 'cdguser');

    setDisplayname(storedDisplayname);
    setUsername(storedUsername);
    setEmail(storedEmail);
  }, []);

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
  };

  const closeDialog = () => {
    setSelectedAchievement(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl px-4 py-8">
        {/* Profile Picture and User Information */}
        <div className="bg-white p-6 rounded-md shadow-md flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-500">
            <Image src="/avatar.jpg" layout="fill" objectFit="cover" alt="Profile Picture" priority sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 60vw" />
          </div>
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h2 className="text-xl font-semibold">{displayname}</h2>
            <h2 className="text-blue-600 text-l font-semibold">@{username}</h2>
            <h4 className="text-l text-gray-700 font-semibold">{email}</h4>
            <p className="text-gray-600">No subscription</p>
            <div className="flex space-x-4 mt-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                Edit Profile
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">
                Logout
              </button>
            </div>
          </div>
        </div>
        {/* Achievements Section */}
        <div className="bg-white mt-8 p-6 rounded-md shadow-md w-full">
          <h3 className="text-lg font-semibold mb-4">Achievements</h3>
          <div className="max-h-72 overflow-y-auto">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer mb-4"
                onClick={() => handleAchievementClick(achievement)}
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <Image src={achievement.badge} layout="fill" objectFit="cover" alt={achievement.name} />
                </div>
                <p className="text-center mt-2 text-sm md:text-md font-semibold">{achievement.name}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Additional User Details */}
        <div className="bg-white mt-8 p-6 rounded-md shadow-md w-full">
          <h3 className="text-lg font-semibold mb-4">Danger Zone</h3>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">
              Delete account
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 mt-4 md:mt-0">
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
      {/* Achievement Dialog */}
      {selectedAchievement && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">{selectedAchievement.name}</h3>
            <p className="mb-4">{selectedAchievement.description}</p>
            <button
              onClick={closeDialog}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;