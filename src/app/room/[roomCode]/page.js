// pages/rooms/[roomCode].js
'use client'
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

const RoomPage = () => {
    const searchParams = useSearchParams();
    const roomCode = searchParams.get('roomCode');
    const { code } = useParams();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isOnlineListOpen, setIsOnlineListOpen] = useState(false);
    const [isTypingAllowed, setIsTypingAllowed] = useState(false);
    const [isSender, setIsSender] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.get(`https://cdg-server-v2.onrender.com/api/check-auth/${code}`, {
                    headers: {
                        Authorization: localStorage.getItem('password')
                    }
                });
                if (response.status !== 200) {
                    router.push('/join_room');
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setAuthError('(401: UNAUTHORIZED)\nYou are not authorized to access this room');
                    setIsLoading(false);
                } else if (error.response && error.response.status === 404) {
                    setAuthError('ERROR 404');
                    setIsLoading(false);
                } else {
                    setAuthError('Error checking room authenticity. Please try again.');
                    setIsLoading(false);
                }
            }
        };

        const fetchOnlineUsers = async () => {
            try {
                const response = await axios.get(`https://cdg-server-v2.onrender.com/api/online-users/${code}`);
                setOnlineUsers(response.data.onlineUsers);
            } catch (error) {
                console.error('Error fetching online users:', error);
            }
        };

        //checkAuthentication();
        //fetchOnlineUsers();

        const interval = setInterval(fetchOnlineUsers, 10000);

        return () => clearInterval(interval);
    }, [code, router]);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userInput.trim() !== '') {
            const newUserMessage = { sender: isSender ? localStorage.getItem('email') : onlineUsers.find(user => user !== localStorage.getItem('email')), message: userInput.trim() };
            const newMessages = [...messages, newUserMessage];
            setMessages(newMessages);
            setUserInput('');

            try {
                const response = await axios.post(`https://cdg-server-v2.onrender.com/api/send-message`, {
                    roomCode: code,
                    sender: isSender ? localStorage.getItem('email') : onlineUsers.find(user => user !== localStorage.getItem('email')),
                    message: userInput.trim(),
                    reply: isSender ? null : userInput.trim(),
                });
                console.log(response.data);
            } catch (error) {
                console.error('Error sending message:', error);
            }

            setIsTypingAllowed(!isSender);
            setIsSender(!isSender);
        }
    };

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const toggleOnlineList = () => {
        setIsOnlineListOpen(!isOnlineListOpen);
    };

    const handleOptionClick = (option) => {
        switch (option) {
            case 'changeRoomName':
                break;
            case 'copyRoomCode':
                navigator.clipboard.writeText(localStorage.getItem('roomCode'));
                alert('Room code copied to clipboard!');
                break;
            case 'downloadData':
                break;
            case 'deleteRoom':
                break;
            default:
                break;
        }
        setShowOptions(false);
    };

    /*if (isLoading) {
        return <p>Please wait while we check your room authenticity...</p>;
    }*/

    if (authError) {
        return <p>{authError}</p>;
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl">Chatting Portal (Room Code: {localStorage.getItem('roomCode')})</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button onClick={toggleOnlineList} className="bg-blue-500 px-4 py-2 rounded-full">
                            Online: {onlineUsers.length}
                        </button>
                        {isOnlineListOpen && (
                            <div className="absolute top-full bg-white shadow-lg rounded w-48 mt-2">
                                {onlineUsers.map((user, index) => (
                                    <div key={index} className="px-4 py-2 hover:bg-gray-200">
                                        {user === localStorage.getItem('email') ? `${user} (You)` : user}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <button onClick={toggleOptions} className="bg-blue-500 px-4 py-2 rounded-full">
                            Options
                        </button>
                        {showOptions && (
                            <div className="absolute top-full bg-white shadow-lg rounded w-48 mt-2">
                                <button onClick={() => handleOptionClick('changeRoomName')} className="block w-full px-4 py-2 hover:bg-gray-200">Change Room Name</button>
                                <button onClick={() => handleOptionClick('copyRoomCode')} className="block w-full px-4 py-2 hover:bg-gray-200">Copy Room Code</button>
                                <button onClick={() => handleOptionClick('downloadData')} className="block w-full px-4 py-2 hover:bg-gray-200">Download Chat Data</button>
                                <button onClick={() => handleOptionClick('deleteRoom')} className="block w-full px-4 py-2 hover:bg-gray-200">Delete Room</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-200">
                {messages.map((msg, index) => (
                    <div key={index} className={`my-2 p-2 rounded ${msg.sender === localStorage.getItem('email') ? 'bg-blue-500 self-start' : 'bg-gray-700 self-end'} text-white`}>
                        <span className="font-bold mr-2">{msg.sender}</span>
                        <span>{msg.message}</span>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-white shadow-md">
                <form onSubmit={handleSubmit} className="flex">
                    <input
                        type="text"
                        placeholder={isTypingAllowed ? (isSender ? "Type your message..." : "Waiting for response...") : "Waiting for response..."}
                        disabled={!isTypingAllowed}
                        value={userInput}
                        onChange={handleInputChange}
                        className="flex-1 p-2 border rounded mr-2"
                    />
                    <button type="submit" disabled={!isTypingAllowed} className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
                </form>
            </div>
        </div>
    );
    
};
export default RoomPage;
