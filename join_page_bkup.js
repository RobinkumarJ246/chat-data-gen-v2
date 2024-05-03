'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const JoinRoom = () => {
    const router = useRouter();
    const [roomCode, setRoomCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState('Sender');
    const [currentPage, setCurrentPage] = useState(1);
  
    const handleJoinRoom = async () => {
      if (!roomCode.trim()) {
        setPasswordError('Room code cannot be empty.');
        return;
      }
  
      const roomData = { roomCode: roomCode, password: password };
      setIsLoading(true);
  
      try {
        const response = await axios.post('https://chat-data-gen-server.onrender.com/api/join-room', roomData, {
          headers: {
            email: localStorage.getItem('email')
          }
        });
  
        if (response.status === 200) {
          localStorage.setItem('roomCode', roomCode);
          localStorage.setItem('password', password);
          localStorage.setItem('role', role); // Save the role in localStorage
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
        setIsLoading(false);
      }
    };
  
    const handleShowInstructions = () => {
        setCurrentPage(1); // Show the first page of instructions
      };
    
      const handleNextPage = () => {
        setCurrentPage(currentPage + 1); // Navigate to the next page
      };
    
      const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1); // Navigate to the previous page
      };
    
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-full md:max-w-md">
            <h2 className="text-center text-2xl font-bold mb-4">Join a Room</h2>
            <div className="mb-4">
              <label htmlFor="roomCode" className="block text-gray-600">
                Room Code:
              </label>
              <input
                type="text"
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="joinPassword" className="block text-gray-600">
                Password:
              </label>
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
            <div className="mb-4">
              <label className="block text-gray-600">Join as:</label>
              <div className="flex items-center space-x-4">
                <div>
                  <input
                    type="radio"
                    id="senderRadio"
                    name="role"
                    value="Sender"
                    checked={role === 'Sender'}
                    onChange={() => setRole('Sender')}
                    className="form-radio h-5 w-5 text-blue-500 transition duration-150 ease-in-out"
                  />
                  <label htmlFor="senderRadio" className="ml-2 text-gray-700">
                    Sender
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="replierRadio"
                    name="role"
                    value="Replier"
                    checked={role === 'Replier'}
                    onChange={() => setRole('Replier')}
                    className="form-radio h-5 w-5 text-blue-500 transition duration-150 ease-in-out"
                  />
                  <label htmlFor="replierRadio" className="ml-2 text-gray-700">
                    Replier
                  </label>
                </div>
              </div>
            </div>
            {passwordError && (
              <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                <p>{passwordError}</p>
              </div>
            )}
            <button
              className={`w-full p-2 rounded-md transition duration-300 ${
                isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              onClick={handleJoinRoom}
              disabled={isLoading}
            >
              {isLoading ? 'Joining...' : 'Join Room'}
            </button>
            <div className="mt-4">
              <button
                onClick={handleShowInstructions}
                className="w-full p-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition duration-300"
              >
                Show Instructions
              </button>
            </div>
          </div>
    
          {/* Instructions Dialog */}
          <InstructionsDialog
            currentPage={currentPage}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            onClose={() => setCurrentPage(0)} // Add this prop
          />
        </div>
      );
    };
    
    const InstructionsDialog = ({ currentPage, onNextPage, onPreviousPage, onClose }) => {
      return (
        <>

{currentPage === 1 && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-md overflow-y-auto max-h-full w-full md:max-w-md">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Instructions (Page 1 of 7)</h2>
                  <p>Welcome to ChatDataGenerator! Before getting started make sure your read these instructions</p><br></br>
                  <p><ul className="list-disc list-inside">
                    <li>Two participants are needed to start the conversation: <strong>Sender</strong> and <strong>Replier</strong>.</li>
                    <li>You can choose your role at the creation or joining page of the room.</li>
                    <li>This can be changed at any time to swap the roles and keep the same conversation up.</li> <li>The Replier must send suitable and
                    best replies possible to the Sender's messages.</li>
                    </ul></p>
                </div>
                <div className="bg-gray-100 px-4 py-2 flex justify-end">
                  <button
                    onClick={onNextPage}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentPage === 2 && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-md overflow-y-auto max-h-full w-full md:max-w-md">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Instructions (Page 2 of 7)</h2>
        <h3 className="text-lg font-semibold mb-2">Participant Selection:</h3>
        <ul className="list-disc list-inside">
          <li><strong>Diverse Backgrounds</strong>: We encourage participants from different age groups, genders, cultures, and educational backgrounds to join.</li>
          <li><strong>Varied Interests</strong>: Participants with varied interests and expertise will help to ensure a broad range of topics and discussions.</li>
          <li><strong>Communication Skills</strong>: Please ensure you have good communication skills and are comfortable engaging in meaningful conversations.</li>
        </ul>
        <br />
      </div>
      <div className="bg-gray-100 px-4 py-2 flex justify-between">
        <button
          onClick={onPreviousPage}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Previous
        </button>
        <button
          onClick={onNextPage}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  </div>
)}

{currentPage === 3 && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-md overflow-y-auto max-h-full w-full md:max-w-md">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Instructions (Page 3 of 7)</h2>
        <h3 className="text-lg font-semibold mb-2">Conversation Guidelines:</h3>
        <ul className="list-disc list-inside">
          <li><strong>Topic Flexibility</strong>: While we provide suggested topics, feel free to bring in your own perspectives, ideas, and related subtopics.</li>
          <li><strong>Focused Discussions</strong>: Please stick to the provided topic or theme to ensure the conversations are relevant and coherent.</li>
          <li><strong>Natural Interaction</strong>: Engage in natural, spontaneous interactions rather than scripted or forced exchanges. Initiate and respond to conversations as you would in real-life situations.</li>
          <li><strong>Language Styles</strong>: We welcome conversations in Tanglish, Hinglish, Manglish, and other hybrid languages. Please ensure the language used is authentic and fluent.</li>
          <li><strong>Room Creation</strong>: For small organizations with 10 members, we recommend creating 5 rooms with 2 members in each room. Start conversing in the desired language form in a natural and coherent way.</li>
        </ul>
      </div>
      <div className="bg-gray-100 px-4 py-2 flex justify-between">
        <button
          onClick={onPreviousPage}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Previous
        </button>
        <button
          onClick={onNextPage}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  </div>
)}

{currentPage === 4 && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-md overflow-y-auto max-h-full w-full md:max-w-md">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Instructions (Page 4 of 7)</h2>
        <br />
        <h3 className="text-lg font-semibold mb-2">Duration and Structure:</h3>
        <ul className="list-disc list-inside">
          <li><strong>Extended Conversations</strong>: We encourage you to engage in longer conversations with multiple exchanges to generate more in-depth and varied interactions.</li>
          <li><strong>Regular Engagement</strong>: Please participate regularly to maintain momentum and quality in the conversations.</li>
        </ul>
      </div>
      <div className="bg-gray-100 px-4 py-2 flex justify-between">
        <button
          onClick={onPreviousPage}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Previous
        </button>
        <button
          onClick={onNextPage}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  </div>
)}

{currentPage === 5 && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-md overflow-y-auto max-h-full w-full md:max-w-md">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Instructions (Page 5 of 7)</h2>
        <br />
        <h3 className="text-lg font-semibold mb-2">Security and Content Guidelines:</h3>
        <ul className="list-disc list-inside">
          <li><strong>No Vulgar or Abusive Content</strong>: Conversations must not contain any vulgar, abusive, or harmful content.</li>
          <li><strong>Respect Privacy</strong>: Avoid sharing personal or sensitive information that could compromise privacy and security.</li>
          <li><strong>Ethical Considerations</strong>: Please be aware that your conversations will be used for training or fine-tuning a language model. By participating, you consent to your data being used for this purpose.</li>
        </ul>
      </div>
      <div className="bg-gray-100 px-4 py-2 flex justify-between">
        <button
          onClick={onPreviousPage}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Previous
        </button>
        <button
          onClick={onNextPage}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  </div>
)}
    
          {/* Page 3 */}
          {currentPage === 6 && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-md overflow-y-auto max-h-full w-full md:max-w-md">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Instructions (Page 6 of 7)</h2>
                  <p>Do's and Don'ts:</p>
                  <ul className="list-disc list-inside">
                    <li>Stick to a topic for a good dataset quality.</li>
                    <li>Use colloquial languages freely and naturally.</li>
                    <li>Never give out personal information.</li>
                  </ul>
                </div>
                <div className="bg-gray-100 px-4 py-2 flex justify-between">
                  <button
                    onClick={onPreviousPage}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                  >
                    Previous
                  </button>
                  <button
                    onClick={onNextPage}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
    
          {/* Page 3 */}
          {currentPage === 7 && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-md overflow-y-auto max-h-full w-full md:max-w-md">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Instructions (Page 7 of 7)</h2>
                  <p>By clicking <strong>Continue</strong> you confirm that you have read and agree to the above instructions.</p>
                </div>
                <div className="bg-gray-100 px-4 py-2 flex justify-between">
                  <button
                    onClick={onPreviousPage}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                  >
                    Previous
                  </button>
                  <button
                    onClick={onClose} // Use the onClose function here
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    };
    
    export default JoinRoom;