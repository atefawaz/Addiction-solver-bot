import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'; // Import necessary components
import styles from '../src/styles/Home.css'
import logo from './assets/logo.png'; 
import social from './assets/social.png'; 

// Placeholder components for Login and Signup
function Login() {
  return <h2>Login Page</h2>;
}

function Signup() {
  return <h2>Signup Page</h2>;
}

// Main Home component that contains the layout
function Home() {
  const navigate = useNavigate(); 

  return (
    <div>
      {/* Logo at the top */}
      <div className="logo-container">
        <img src={logo} alt="Addiction Solver Logo" className="logo" />
      </div>

      <div className="card">
  <div className="moving-text-container">
    <div className="moving-text">
      Break Free from Addiction, One Chat at a Time! <br />
      24/7 Support for Your Recovery Journey. <br />
      Your Personal AI-Powered Recovery Assistant. <br />
      Start Now, Feel Better Tomorrow. <br />
      Confidential Help, Anytime, Anywhere.
    </div>
  </div>
  {/* Use navigate to redirect to signup */}
  <button onClick={() => navigate('/signup')}>
    click to start
  </button>
</div>


      
      <br />
      <br />

{/* About Section */}
<div className="about-section">
  <h1>Addiction Solver BOT</h1>
  <p>
    Addiction Solver is an AI-powered chatbot designed to provide support and resources
    for individuals seeking help with addiction. We are committed to guiding users through
    their journey towards recovery with the help of cutting-edge technology.
  </p>
  {/* Add your image below */}
  <img src={social} alt="Addiction Help" className="about-image" />
</div>

      {/* Footer Section */}
      <footer id="footer">
        <div className="col col1">
          <h3>Addiction Solver CHATBOT</h3>
          <div className="social">
            <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="link">
              <img src="https://cdn.vectorstock.com/i/1000v/48/43/google-symbol-logo-black-and-white-design-vector-46334843.jpg" alt="Google" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="link">
              <img src="https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1726790400&semt=ais_hybrid" alt="Twitter" />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="link">
              <img src="https://i.pinimg.com/736x/11/de/ee/11deee130829af292f99e25b4d60b687.jpg" alt="YouTube" />
            </a>
          </div>
          <p style={{ color: '#818181', fontSize: 'smaller' }}> © ATEF FAWAZ</p>
        </div>

        <div className="col col2">
          <p>Our mission</p>
          <p>Privacy Policy</p>
          <p>Terms of service</p>
        </div>

        <div className="col col3">
          {/* Use Link for internal routing */}
          <p><Link to="/login">Login</Link></p>
          <p><Link to="/signup">Sign up</Link></p>
          <p><Link to="/join">Join our team</Link></p>
          <p><Link to="/partner">Partner with us</Link></p>
        </div>

        <div className="backdrop"></div>
      </footer>
    </div>
  );
}

export default Home;
