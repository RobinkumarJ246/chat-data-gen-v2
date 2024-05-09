'use client'
import React, { useState, useEffect } from 'react';

const ChatRoom = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState({ onlineUsers: [], onlineCount: 0, sender: null, replier: null });
  const roomCode = typeof window !== 'undefined' ? localStorage.getItem('roomCode') : null;
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

  useEffect(() => {
    const ws = new WebSocket('wss://cdg-ws-python.onrender.com/ws');
    ws.onopen = () => {
      console.log('WebSocket connection established');
      ws.send(JSON.stringify({ roomCode, username, role }));
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages((prevMessages) => [...prevMessages, data.content]);
      } else if (data.type === 'userInfo') {
        setOnlineUsers({ onlineUsers: data.onlineUsers, onlineCount: data.onlineCount, sender: data.sender, replier: data.replier });
      } else if (data.type === 'existingMessages') {
        setMessages(data.messages);
      }
    };
    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    ws.timeout = 10000; // 10 seconds
    setSocket(ws);
    return () => {
      ws.close();
    };
  }, [roomCode, username, role]);

  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && roomCode && username && socket && socket.readyState === WebSocket.OPEN) {
      console.log('Sending message to server:', { roomCode, newMessage, username, role });
      socket.send(JSON.stringify({ roomCode, content: newMessage, username, role }));
      setNewMessage('');
    } else {
      console.log('Cannot send message. Please check if the WebSocket connection is open and roomCode is set.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex items-center justify-between p-4 bg-white">
        <h1 className="text-2xl font-bold">Chat Room: {roomCode}</h1>
        <div>
          <p>Sender: {onlineUsers.sender}</p>
          <p>Replier: {onlineUsers.replier}</p>
          <p>Online Users: {onlineUsers.onlineCount}</p>
        </div>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              {msg}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center p-4 bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={handleMessageChange}
          placeholder="Enter your message"
          className="flex-grow mr-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;