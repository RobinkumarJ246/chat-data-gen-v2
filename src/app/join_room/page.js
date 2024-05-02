'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const JoinRoom = () => {
    const router = useRouter();
    const [roomCode, setRoomCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);  // Added loading state

    const handleJoinRoom = async () => {
        if (!roomCode.trim()) {
            setPasswordError('Room code cannot be empty.');
            return;
        }
    
        const roomData = {
            roomCode: roomCode,
            password: password
        };

        setIsLoading(true);  // Set loading to true when submitting form
    
        try {
            const response = await axios.post('https://chat-data-gen-server.onrender.com/api/join-room', roomData, {
              headers: {
                email: localStorage.getItem('email') // Assuming email is stored in localStorage
              }
            });
            
            if (response.status === 200) {
                localStorage.setItem('roomCode', roomCode);
                localStorage.setItem('password', password);
                router.push(`/room/${roomCode}`);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setPasswordError('Invalid Room Code or Password');
            } else if (error.response && error.response.status === 404) {
                setPasswordError('No rooms found for the Room Code');
            } else {
                console.error('Error joining room:', error);
                setPasswordError('Invalid room code or password.');
            }
        } finally {
            setIsLoading(false);  // Set loading to false after request is complete
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full md:max-w-md">
                <h2 className="text-center text-2xl font-bold mb-4">Join a Room</h2>
                <div className="mb-4">
                    <label htmlFor="roomCode" className="block text-gray-600">Room Code:</label>
                    <input
                        type="text"
                        id="roomCode"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="joinPassword" className="block text-gray-600">Password:</label>
                    <input
                        type="password"
                        id="joinPassword"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (passwordError) setPasswordError('');
                        }}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                {passwordError && (
                    <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                        <p>{passwordError}</p>
                    </div>
                )}
                <button
                    className={`w-full p-2 rounded-md transition duration-300 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    onClick={handleJoinRoom}
                    disabled={isLoading}
                >
                    {isLoading ? 'Joining...' : 'Join Room'}
                </button>
            </div>
        </div>
    );
};

export default JoinRoom;