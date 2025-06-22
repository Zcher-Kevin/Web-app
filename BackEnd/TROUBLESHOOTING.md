# Troubleshooting Guide

This document catalogs common errors encountered during development of the backend server and their solutions.

## Table of Contents

1. [CORS Issues (HTTP 403 Forbidden)](#cors-issues-http-403-forbidden)
2. [Server Start-up Issues](#server-start-up-issues)
3. [Environment Variable Issues](#environment-variable-issues)
4. [Package Installation Issues](#package-installation-issues)
5. [MySQL Database Issues](#mysql-database-issues)

---

## CORS Issues (HTTP 403 Forbidden)

### Error

```
Access to localhost was denied
You don't have authorization to view this page.
HTTP ERROR 403
```

### Cause

The default CORS (Cross-Origin Resource Sharing) configuration was too restrictive, preventing frontend applications from accessing the backend API. This happens because browsers enforce a security feature called the Same-Origin Policy, which restricts how documents or scripts on one origin can interact with resources from another origin.

### Solution

Implemented a more permissive CORS configuration in `index.js`:

```javascript
// CORS Configuration - Very permissive for development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});
```

This configuration:

- Allows requests from any origin (`*`)
- Supports all common HTTP methods
- Allows necessary headers
- Properly handles OPTIONS preflight requests

### Notes for Production

For production environments, you should restrict CORS to specific trusted domains:

```javascript
const allowedOrigins = [
  "https://yourfrontendapp.com",
  "https://admin.yourapp.com",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  // Rest of CORS configuration
  next();
});
```

---

## Server Start-up Issues

### Error

```
npm error Missing script: "dev"
```

### Cause

When trying to run the server with `npm run dev`, the script was defined in `package.json` but nodemon was not properly installed or accessible.

### Solution

1. Installed nodemon globally:

   ```
   npm install -g nodemon
   ```

2. Updated the npm scripts in `package.json` to ensure they were correctly defined:

   ```json
   "scripts": {
     "start": "node index.js",
     "dev": "nodemon index.js",
     "test": "echo \"Error: no test specified\" && exit 1"
   }
   ```

3. Started the server directly with Node.js:
   ```
   node index.js
   ```

---

## Environment Variable Issues

### Error

The server was not correctly reading environment variables from the `.env` file.

### Cause

The environment configuration file was set up, but not properly integrated into the main application.

### Solution

1. Updated `index.js` to use the configuration from the config file:

   ```javascript
   const config = require("./config/env");

   // Initialize Express app
   const app = express();
   const PORT = config.port || 5000;
   ```

2. Ensured the `.env` file was correctly formatted:

   ```
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

3. Confirmed that dotenv was properly imported in the config file:
   ```javascript
   if (process.env.NODE_ENV !== "production") {
     require("dotenv").config();
   }
   ```

---

## Package Installation Issues

### Error

When running the application, it might complain about missing dependencies.

### Cause

Not all required packages were installed or listed in the package.json file.

### Solution

1. Ensured all required packages were listed in `package.json`:

   ```json
   "dependencies": {
     "cors": "^2.8.5",
     "dotenv": "^16.3.1",
     "express": "^5.1.0"
   },
   "devDependencies": {
     "nodemon": "^3.0.1"
   }
   ```

2. Installed all dependencies:

   ```
   npm install
   ```

3. If a specific package was missing, installed it individually:
   ```
   npm install package-name --save
   ```

---

## Testing Solutions

To test that the solutions worked correctly, a test HTML page was created (`test-backend.html`) that sends requests to various endpoints and displays the responses. This helps verify that:

1. The CORS issues are resolved
2. The API endpoints are functioning properly
3. The server is correctly processing requests and responses

Additionally, health check endpoints were added to verify server status:

```javascript
// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});
```

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Nodemon Documentation](https://nodemon.io/)
- [Dotenv Documentation](https://github.com/motdotla/dotenv)

---

## MySQL Database Issues

### Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

### Cause

This error occurs when the MySQL server is not running or the connection details (host, port, username, password) are incorrect.

### Solution

1. Ensure MySQL is installed and running:

   ```bash
   # Check if MySQL is running
   mysql.server status

   # Start MySQL if it's not running
   mysql.server start
   ```

2. Verify the connection details in your `.env` file:

   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=webappdb
   ```

3. Use the setup script to test and initialize the database:
   ```bash
   npm run setup-db
   ```

### MySQL Authentication Issues

If you've forgotten your MySQL username and password:

1. For macOS, you can try resetting the root password:

   ```bash
   # Stop MySQL server
   sudo mysql.server stop

   # Start MySQL in safe mode
   sudo mysqld_safe --skip-grant-tables &

   # Connect to MySQL (no password needed)
   mysql -u root

   # In MySQL prompt:
   mysql> USE mysql;
   mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   mysql> FLUSH PRIVILEGES;
   mysql> exit

   # Stop the safe mode MySQL and restart normally
   sudo killall mysqld
   sudo mysql.server start
   ```

2. Another option is to use the default root user with no password (which is the default in the `.env` file):

   ```
   DB_USER=root
   DB_PASSWORD=
   ```

3. If neither works, you may need to reinstall MySQL:
   ```bash
   # For Homebrew users
   brew uninstall mysql
   brew install mysql
   ```

### Error

```
ER_NOT_SUPPORTED_AUTH_MODE
```

### Cause

MySQL 8.0+ uses a new authentication method that may not be compatible with older clients.

### Solution

1. Change the authentication method for your user:

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
   FLUSH PRIVILEGES;
   ```

2. Or specify this authentication method in your connection:
   ```javascript
   const connection = mysql.createConnection({
     // other options
     authPlugins: {
       mysql_native_password: () =>
         require("mysql2/lib/auth_plugins/mysql_native_password"),
     },
   });
   ```
