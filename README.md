# Addiction Solver Bot

This is a chatbot application built to help users with addiction-related queries. The project consists of a FastAPI backend and a React frontend. Users can chat with the bot, which responds to addiction-related queries using the LLaMA model, and the chat history is saved in a SQLite database.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Available Endpoints](#available-endpoints)
- [Troubleshooting](#troubleshooting)
- [Project vision](#Project-Vision)


## Prerequisites

Before you begin, make sure you have the following installed:

- Python 3.8 or higher
- Node.js and npm (for frontend)
- SQLite (installed by default with Python)
- FastAPI

### Python Packages

- `fastapi`
- `uvicorn`
- `sqlalchemy`
- `jose`
- `passlib`
- `pydantic`

### Node.js Packages

- `react`
- `react-router-dom`
- `react-icons`

## Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/atefawaz/Addiction-solver-bot.git
   cd app
   ```

2. **Create a virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install the required Python packages:**

   ```bash
   pip install -r requirements.txt
   ```

   If `requirements.txt` is missing, manually install packages:

   ```bash
   pip install fastapi uvicorn sqlalchemy jose passlib pydantic
   ```

4. **Create the SQLite database:**

   In the root directory of the backend, the database (`chat.db`) will be created automatically when you run the server.

5. **Run the FastAPI server:**

   ```bash
   uvicorn main:app --reload
   ```

   The backend will be running on [http://localhost:8000](http://localhost:8000).

## Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install the required Node.js packages:**

   ```bash
   npm install
   ```

3. **Start the React development server:**

   ```bash
   npm start
   ```

   The frontend will be running on [http://localhost:3000](http://localhost:3000).

## Running the Application

Once both the backend and frontend are running, you can interact with the chatbot:

1. Open the frontend in your browser: [http://localhost:3000](http://localhost:3000)
2. Log in or register a new account.
3. Start chatting with the bot. It responds only to addiction-related queries.
4. Chat history is saved automatically for each user.

## Available Endpoints

### Backend API Endpoints

- **`POST /register`** – Register a new user.
- **`POST /login`** – Log in and receive a JWT token.
- **`POST /logout`** – Logout by blacklisting the JWT token.
- **`POST /save_message`** – Save a chat message (user or bot).
- **`GET /chat_history/{username}`** – Retrieve chat history for a specific user.
- **`POST /chatbot?prompt={input}`** – Send a prompt to the chatbot and receive a response.
- **`DELETE /clear_chat/{username}`** – Clear all chat history for a specific user.

## Troubleshooting

### Common Issues

1. **CORS Error in Frontend**:
   If you're getting a CORS error in the frontend, ensure that CORS is correctly configured in `main.py`:
   ```python
   app.add_middleware(
     CORSMiddleware,
     allow_origins=["http://localhost:3000"],  # Adjust this if your frontend is hosted elsewhere
     allow_credentials=True,
     allow_methods=["*"],
     allow_headers=["*"],
   )
   ```

2. **Authentication Failure**:
   - Ensure you're passing the correct JWT token in the `Authorization` header.
   - If the token is expired, log in again to get a new one.

3. **Backend Not Running**:
   If you see a `connection refused` error, ensure that the FastAPI server is running on port 8000 by executing:
   ```bash
   uvicorn main:app --reload
   ```

4. **Frontend Build Issues**:
   If you encounter build issues or missing dependencies, try removing `node_modules` and reinstalling dependencies:
   ```bash
   rm -rf node_modules
   npm install
   ```

### Useful Commands

- **Run Backend Tests**:
  Add tests in the `tests` folder and run:
  ```bash
  pytest
  ```

- **Build Frontend for Production**:
  Build the React app for production:
  ```bash
  npm run build
  ```

Here’s a refined version suitable for your README file:

---

## Project Vision

The goal of this project is to create a truly unique addiction recovery chatbot that offers more than just basic responses. Unlike existing solutions, this chatbot provides **real-time, live chat support**, allowing users to engage in ongoing conversations and receive personalized guidance throughout their recovery journey. This innovation has never been done in quite this way before, making it a standout feature of the project.

In the future, the chatbot will also include **daily progress tracking** to monitor users' recovery and provide tailored advice and encouragement based on their individual needs. By incorporating real-time communication and daily updates, the chatbot will become a reliable companion, offering continuous support and meaningful interaction, making sure users stay on the right path. The vision is to empower individuals with the guidance they need to overcome addiction, through an interactive, evolving, and innovative digital assistant that grows with them every step of the way.

---

