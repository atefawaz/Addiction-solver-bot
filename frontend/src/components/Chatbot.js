import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Chatbot.module.css';
import botProfilePic from '../assets/A.png';
import { FaUser, FaSignOutAlt, FaCog, FaDownload, FaArrowUp } from 'react-icons/fa';
import { marked } from 'marked'; // Importing the marked library

const ChatbotPage = () => {
  const [input, setInput] = useState(''); // State for user input
  const [messages, setMessages] = useState([]); // Initialize messages as an empty array
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const [showSettings, setShowSettings] = useState(false); // State for showing settings popup
  const navigate = useNavigate(); // useNavigate hook for navigation
  const username = localStorage.getItem('username') || ''; // Get username from localStorage or set to empty string

  // Get the first letter of the username in uppercase
  const getFirstLetter = (name) => {
    if (!name) return ''; // Handle case when name is undefined or empty
    return name.charAt(0).toUpperCase(); // Return the first letter in uppercase
  };

  // Fetch chat history when the component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8000/chat_history/${username}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // JWT token for protected route
          }
        });

        const data = await response.json();
        if (Array.isArray(data)) {
          setMessages(data); // Ensure data is an array
        } else {
          setMessages([]); // Default to an empty array if data is not an array
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory(); // Fetch chat history on component mount
  }, [username]);

  const sendMessage = async () => {
    if (input.trim() === '') return; // Ignore empty messages

    const userMessage = { sender: 'user', message: input }; 
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch(`http://localhost:8000/chatbot?prompt=${input}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        },
      });

      if (response.status === 401) {
        handleLogout();
      }

      const data = await response.json();
      
      // Convert response to HTML using marked
      const botMessage = { sender: 'bot', message: marked(data.response) }; 
  
      // Append bot response to chat history
      setMessages((prevMessages) => [...prevMessages, botMessage]);
  
    } catch (error) {
      console.error('Error communicating with chatbot:', error);
    }
  
    setInput(''); // Clear input after sending
  };

  // Handle enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  // Function to toggle the dropdown menu
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Function to clear chat (from both frontend and backend)
  const clearChat = async () => {
    // Clear messages in the frontend
    setMessages([]);

    // Call the backend API to clear chat in the database
    try {
      const response = await fetch(`http://localhost:8000/clear_chat/${username}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log("Chat history cleared in the database.");
      } else {
        console.error("Failed to clear chat history from the database.");
      }
    } catch (error) {
      console.error("Error clearing chat from the database:", error);
    }

    setShowSettings(false); // Close the settings popup
  };

  // Function to toggle settings popup
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className={styles.chatbotContainer}>
      {/* Header with title and dropdown */}
      <div className={styles.header}>
        <h1>ADDICTION SOLVER BOT</h1>
        <div className={styles.dropdown}>
          <div className={styles.circle} onClick={toggleDropdown}>
            {/* Display the first letter of the username */}
            {getFirstLetter(username)}
          </div>
          {showDropdown && (  // Conditionally render dropdown based on showDropdown state
            <div className={styles.dropdownContent}>
              <div onClick={() => navigate('/profile')}>
                <FaUser className={styles.icon} /> Profile
              </div>
              <div onClick={handleLogout}>
                <FaSignOutAlt className={styles.icon} /> Logout
              </div>
              <div onClick={toggleSettings}>
                <FaCog className={styles.icon} /> Settings
              </div>
              <div>
                <FaDownload className={styles.icon} /> Download App
              </div>
              <div>
                <FaArrowUp className={styles.icon} /> Upgrade My Plan
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={styles.chatWindow}>
        <div className={styles.messages}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.sender === 'bot' ? styles.botMessage : styles.userMessage
              }`}
            >
              {message.sender === 'bot' && (
                <img src={botProfilePic} alt="Bot Profile" className={styles.botProfilePic} />
              )}
              {/* Render bot message with HTML content using dangerouslySetInnerHTML */}
              {message.sender === 'bot' ? (
                <div
                  className={styles.botMessage}
                  dangerouslySetInnerHTML={{ __html: message.message }}  // Render bot message as HTML
                />
              ) : (
                <p>{message.message}</p>  // Render user message as plain text
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.chatInput}
          placeholder="Type your message..."
        />
      </div>

      {/* Settings Popup */}
      {showSettings && (
        <div className={styles.settingsPopup}>
          <div className={styles.settingsPopupContent}>
            <button className={styles.closePopup} onClick={toggleSettings}>X</button>
            <h2>Settings</h2>
            <div className={styles.popupOption} onClick={clearChat} style={{ color: 'red' }}>Clear Chat</div>
            <div className={styles.popupOption}>Reset Settings</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotPage;
