'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const CreateRoom = () => {
    const router = useRouter();
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Added loading state

    const generateRoomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    const validatePassword = (pass) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,8}$/;
        return regex.test(pass);
    };

    const validateRoomName = (name) => {
        const regex = /^[a-zA-Z]{4,12}$/;
        return regex.test(name);
    };

    const handleCreateRoom = async () => {
        setIsLoading(true); // Set loading to true when submitting form

        if (!validatePassword(password)) {
            setError('Password must be 4 to 8 characters long and include at least one uppercase letter, one number, and one symbol.');
            setIsLoading(false); // Reset loading
            return;
        }

        if (!validateRoomName(roomName)) {
            setError('Room name must be between 4 to 12 characters and contain only alphabets.');
            setIsLoading(false); // Reset loading
            return;
        }

        const code = generateRoomCode();
        localStorage.setItem('roomCode', code);
        console.log(localStorage.getItem('roomCode'));  // Use localStorage to set the room code

        const roomData = {
            email : localStorage.getItem('email'),
            roomCode: code,
            roomName: roomName,
            password: password
        };

        try {
            const response = await axios.post('https://cdg-server-v2.onrender.com/api/save-room', roomData);
            if (response.status === 200) {
                console.log(`Room Code: ${code}`);
                router.push(`/room/${encodeURIComponent(code)}`);  // Navigate to the created room page
            }
        } catch (error) {
            console.error('Error creating room:', error);
            setError('Error creating room. Please try again.');
        } finally {
            setIsLoading(false); // Reset loading
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full md:max-w-md">
                <h2 className="text-center text-2xl font-bold mb-4">Create a Room</h2>
                {error && (
                    <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-2" role="alert">
                        <p>{error}</p>
                    </div>
                )}
                <div className="mb-4">
                    <label htmlFor="roomName" className="block text-gray-600">Room Name:</label>
                    <input
                        type="text"
                        id="roomName"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-600">Set a password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError('');
                        }}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <button 
                    className={`w-full p-2 rounded-md transition duration-300 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    onClick={handleCreateRoom}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Room'}
                </button>
            </div>
        </div>
    );
};

export default CreateRoom;