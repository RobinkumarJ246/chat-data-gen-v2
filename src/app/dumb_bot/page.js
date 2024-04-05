'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ChatInterface = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationPairs, setConversationPairs] = useState([]);

  const botResponses = [
    'This is a just simulated response from user2',
    'I am simulating the working of this message portal',
    'I feel like a real user. Nv just joking and i am a dumb bot',
    'This is just a test message from user2',
    'Wait! I got a message! Oh its you, Human',
    'I have received your message - By dumb Bot',
    'Try this with a real user to make use of it',
    'This is a testing portal',
    'Real chatting implementation in development',
    'Hey, I am a bot. You can soon chat with an user to make real use of this and make conversational datasets',
    'This is in testing phase, Btw i am not an AI but a dumb bot',
    'Hey human, I am dumb bot appointed here for temporary in-charge',
    'You can chat with a real user after this test phase to make real use of it',
    'Dumb bot here. BEEP BOOP!',
    'Ah! A human. This is the demo of chat portal and i am dumb bot',
    'Shroooovvvv',
    'BEEP BOOP, BOOP BEEP',
    '<BEEP> <BOOP></BOOP> </BEEP>',
    'How are you HUMAN, I am DUMB BOT',
    'I wish i had a brain like you but i am just a dumb bot',
    'What is this AI kinda thing?',
    'Do you know me? Ah, nv even i dont remember me',
    'I am just... wait what am i doing here',
    'You can call me dumb, coz thats my name',
    'The dumbest ever bot made is me',
    'I have 10 dumb awards in my stomach',
    'I have not ran out of dumb responses',
    'I have not ran out of dumb responses',
    'I am the dumbest ever person you have ever met. Person... is it okay?',
    'Hope one day i get a good brain',
    'Who are these GPT type of bots',
    'Uhmm... Hi?',
    'Yes of course i am dumb as ... dumb as what? i dont know',
    'Are humans brain not dumb like mine?',
    'I am a bot and i am good, i hope so',
    'AI, AI, and i am not one of that kind',
    'AI? Anti-Indian?',
    'Does AI mean Antartic Invasion?',
    'Where to purchase a brian for cheap amount?',
    'Are you a robot? Just joking',
    '!Buzz!, I got a message from you'    // Add more responses as needed
  ];

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim() !== '') {
      const newUser1Message = { sender: 'user1', message: userInput.trim() };
      const updatedMessages = [...messages, newUser1Message];
      setMessages(updatedMessages);

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);

        const randomResponseIndex = Math.floor(Math.random() * botResponses.length);
        const randomResponse = botResponses[randomResponseIndex];

        const newUser2Message = { sender: 'user2', message: randomResponse };

        const updatedMessagesWithBotResponse = [...updatedMessages, newUser2Message];
        setMessages(updatedMessagesWithBotResponse);

        const conversationPair = [newUser1Message, newUser2Message];
        const updatedConversationPairs = [...conversationPairs, conversationPair];
        setConversationPairs(updatedConversationPairs);

        console.log('Conversation pair:', conversationPair);
      }, 3000);

      setUserInput('');
    }
  };

  const handleDownloadJson = () => {
    const jsonContent = JSON.stringify(conversationPairs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-data-gen-dumb-bot-conversation-test.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNavigateToRooms = () => {
    router.push('/rooms');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl px-4">
        <div className="bg-gray-800 text-white p-4 rounded-t-md">
          <h2 className="text-center text-xl md:text-2xl">Chat with Dumb bot (Testing portal)</h2>
        </div>
        <div className="bg-white p-4 rounded-b-md flex flex-col space-y-2 overflow-y-auto max-h-96">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <span className="font-bold">{msg.sender}</span>
              <span className="ml-2">{msg.message}</span>
            </div>
          ))}
          {isTyping && (
            <div className="message user2">
              <span className="font-bold">user2</span>
              <span className="ml-2">
                <span className="typing-animation">...</span>
              </span>
            </div>
          )}
        </div>
        <div className="bg-white p-4 rounded-b-md shadow-md">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
            <input
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={handleInputChange}
              className="flex-1 p-2 rounded-l-md border mb-2 md:mb-0 md:mr-2"
            />
            <button type="submit" className="bg-gray-800 text-white p-2 rounded-r-md w-full md:w-auto">
              Send
            </button>
          </form>
        </div>
        <button onClick={handleNavigateToRooms} className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300">
          Go to Rooms
        </button>
        <div>
        <button onClick={handleDownloadJson} className="mt-4 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300">
          Download Conversation JSON
        </button></div>
      </div>
    </div>
  );
};

export default ChatInterface;