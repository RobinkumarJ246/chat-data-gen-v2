'use client'

import React, { useState, useEffect } from 'react';
const ChatRoom = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState({ onlineUsers: [], onlineCount: 0, sender: null, replier: null });
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const roomCode = typeof window !== 'undefined' ? localStorage.getItem('roomCode') : null;
  const username = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
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
        setMessages((prevMessages) => [...prevMessages, { content: data.content, username: data.username }]);
      } else if (data.type === 'userInfo') {
        setOnlineUsers({ onlineUsers: data.onlineUsers, onlineCount: data.onlineCount, sender: data.sender, replier: data.replier });
      } else if (data.type === 'existingMessages') {
        setMessages(data.messages.map(msg => ({ content: msg.content, username: msg.username })));
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

  const downloadMessages = (withUsername, format) => {
    let dataToDownload = [];

    if (format === 'json') {
      if (messages.length >= 2) {
        const firstPair = { message: messages[0].content, reply: messages[1].content };
        dataToDownload.push(withUsername ? { ...firstPair, username: messages[0].username } : firstPair);

        for (let i = 2; i < messages.length; i += 2) {
          const messageObj = { message: messages[i].content };
          if (messages[i + 1]) {
            messageObj.reply = messages[i + 1].content;
            if (withUsername) messageObj.username = messages[i].username;
          }
          dataToDownload.push(messageObj);
        }
      } else if (messages.length === 1) {
        const messageObj = { message: messages[0].content };
        if (withUsername) messageObj.username = messages[0].username;
        dataToDownload.push(messageObj);
      }

      const jsonData = JSON.stringify(dataToDownload);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chat_messages.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (format === 'csv') {
      const csvContent = generateCSV(withUsername);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chat_messages.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const generateCSV = (withUsername) => {
    let csvContent = 'message,reply';
    if (withUsername) csvContent += ',username';
    csvContent += '\n';

    for (let i = 0; i < messages.length; i += 2) {
      const messageObj = { message: messages[i].content, reply: '' };
      if (messages[i + 1]) {
        messageObj.reply = messages[i + 1].content;
      }
      if (withUsername) messageObj.username = messages[i].username;
      csvContent += `"${sanitizeCSVField(messageObj.message)}","${sanitizeCSVField(messageObj.reply)}"`;
      if (withUsername) csvContent += `,"${messageObj.username}"`;
      csvContent += '\n';
    }

    return csvContent;
  };

  const sanitizeCSVField = (field) => {
    return field.replace(/"/g, '""');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex items-center justify-between p-4 bg-white">
        <h1 className="text-2xl font-bold">Chat Room: {roomCode}</h1>
        <div className="relative flex items-center">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            {showMenu ? 'Hide Menu' : 'Show Menu'}
          </button>
          {showMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
              <div className="p-4">
                <p>Sender: {onlineUsers.sender}</p>
                <p>Replier: {onlineUsers.replier}</p>
                <p>Online Users: {onlineUsers.onlineCount}</p>
              </div>
              <div className="mb-4">
              <button
          onClick={() => {
          setShowDownloadDialog(true);
          setShowMenu(false); // Close the menu
        }}
          className="px-4 py-2 ml-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
        >
          Download Chat
        </button>
        </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map(({ content, username }, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <span className="font-bold">{username}: </span>
              {content}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center p-4 bg-white">
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
        {/*}<button
          onClick={() => setShowDownloadDialog(true)}
          className="px-4 py-2 ml-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
        >
          Download Chat
        </button>{*/}
      </div>
      {showDownloadDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white rounded-lg p-8">
            <button
              onClick={() => {
                setShowDownloadDialog(false);
                downloadMessages(true, 'json');
              }}
              className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 mb-4"
            >
              Download as JSON with username
            </button>
            <button
              onClick={() => {
                setShowDownloadDialog(false);
                downloadMessages(false, 'json');
              }}
              className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 mb-4"
            >
              Download as JSON without username
            </button>
            <button
              onClick={() => {
                setShowDownloadDialog(false);
                downloadMessages(true, 'csv');
              }}
              className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 mb-4"
            >
              Download as CSV with username
            </button>
            <button
              onClick={() => {
                setShowDownloadDialog(false);
                downloadMessages(false, 'csv');
              }}
              className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 mb-4"
            >
              Download as CSV without username
            </button>
            <button
              onClick={() => setShowDownloadDialog(false)}
              className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;