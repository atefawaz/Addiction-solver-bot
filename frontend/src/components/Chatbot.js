import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Chatbot.module.css';
import botProfilePic from '../assets/A.png';

import { FaUser, FaSignOutAlt, FaCog, FaDownload, FaArrowUp } from 'react-icons/fa';

const ChatbotPage = () => {
  const [input, setInput] = useState(''); 
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [showDropdown, setShowDropdown] = useState(false); 
  const navigate = useNavigate(); 
  const username = localStorage.getItem('username') || ''; 

  const getFirstLetter = (name) => {
    if (!name) return ''; 
    return name.charAt(0).toUpperCase(); 
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/chat_history/${username}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  
          }
        });
        if (response.status === 401) {
          handleLogout();
        }

        const data = await response.json();
        console.log("Chat History Data:", data);  
        if (Array.isArray(data)) {
          setMessages(data); 
        } else {
          setMessages([]); 
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setMessages([]); 
      }
      setLoading(false); // Stop loading after fetching
    };

    fetchChatHistory(); // Fetch chat history on component mount
  }, [username]);

  // Function to send a message to the backend and get the response
  
  const sendMessage = async () => {
    if (input.trim() === '') return; 

    const userMessage = { sender: 'user', message: input }; // Updated to use "message"
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch(`http://localhost:8000/chatbot?prompt=${input}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Include JWT token
        },
      });

      if (response.status === 401) {
        // If the token is expired or invalid, navigate to login page
        handleLogout();
      }

      const data = await response.json();
      const botMessage = { sender: 'bot', message: data.response }; // Updated to use "message"

      // Append bot response to chat history
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Save both user and bot messages to the backend
      await fetch('http://localhost:8000/save_message/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, message: input, sender: 'user' }),
      });

      await fetch('http://localhost:8000/save_message/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, message: data.response, sender: 'bot' }),
      });

    } catch (error) {
      console.error('Error communicating with chatbot:', error);
    }

    // Clear input after sending
    setInput('');
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

  return (
    <div className={styles.chatbotContainer}>
      {/* Header with title and dropdown */}
      <div className={styles.header}>
        <h1>ADDICTION SOLVER BOT</h1>
        <div className={styles.dropdown}>
          <div className={styles.circle}>
            {/* Display the first letter of the username */}
            {getFirstLetter(username)}
          </div>
          <div className={styles.dropdownContent}>
            <div onClick={() => navigate('/profile')}>
              <FaUser className={styles.icon} /> Profile
            </div>
            <div onClick={handleLogout}>
              <FaSignOutAlt className={styles.icon} /> Logout
            </div>
            <div>
              <FaCog className={styles.icon} /> Settings
            </div>
            <div>
              <FaDownload className={styles.icon} /> Download App
            </div>
            <div>
              <FaArrowUp className={styles.icon} /> Upgrade My Plan
            </div>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className={styles.chatWindow}>
        {loading ? (
          <div>Loading chat history...</div>
        ) : (
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
                {/* Render bot message with HTML content */}
                {message.sender === 'bot' ? (
                  <p className={styles.botMessage}>{message.message}</p>
                ) : (
                  <p>{message.message}</p>  // Updated to use message.message
                )}
              </div>
            ))}
          </div>
        )}
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
    </div>
  );
};

export default ChatbotPage;
