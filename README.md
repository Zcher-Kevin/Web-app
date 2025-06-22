# Web Application Project

This is a full-stack web application with a React frontend and Express/MySQL backend.

## Project Structure

```
Web-app/
├── BackEnd/           # Express.js server with MySQL
├── FrontEnd/          # React frontend (Vite + TypeScript)
└── .gitignore         # Root-level gitignore file
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd BackEnd
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your MySQL credentials
   ```

4. Set up the database:

   ```bash
   npm run setup-db
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd FrontEnd
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
