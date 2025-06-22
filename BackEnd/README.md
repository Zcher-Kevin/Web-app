# Web App Backend

This is the backend server for the web application. It provides API endpoints for the frontend to interact with.

## TypeScript Backend

The backend has been converted to TypeScript for better type safety, code completion, and maintainability.

## Project Structure

```
BackEnd/
├── src/                  # Source code
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── database/         # Database connection and initialization
│   ├── middleware/       # Custom middleware functions
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── scripts/          # Utility scripts
│   ├── types/            # TypeScript type definitions
│   ├── public/           # Static files
│   └── index.ts          # Main entry point
├── dist/                 # Compiled JavaScript (generated)
├── .env                  # Environment variables (not committed)
├── .gitignore            # Git ignore file
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project dependencies
├── TROUBLESHOOTING.md    # Troubleshooting guide
└── README.md             # Project documentation
```

## Scripts

- `npm start` - Starts the production server
- `npm run dev` - Starts the development server with auto-reload
- `npm run build` - Builds the TypeScript code to JavaScript
- `npm run setup-db` - Sets up the MySQL database and creates tables

## TypeScript Benefits

- **Static Type Checking:** Catches type-related errors during development
- **Improved Tooling:** Better code completion, refactoring, and navigation
- **Self-Documenting Code:** Types serve as documentation
- **Enhanced Maintainability:** Easier to understand and refactor code
- **Better Collaboration:** Clear interfaces for team development

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file (use `.env.example` as a template)

3. Set up the database:

   ```bash
   npm run setup-db
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm start
   ```
