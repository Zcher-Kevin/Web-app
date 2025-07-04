# Web Application Backend Documentation

This document provides a comprehensive overview of the TypeScript files within the backend folder of our web application. It explains how the files are connected to each other and details their functionality.

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
   - [Entry Point](#entry-point)
   - [Configuration](#configuration)
   - [Database](#database)
   - [Models](#models)
   - [Controllers](#controllers)
   - [Routes](#routes)
   - [Middleware](#middleware)
   - [Types](#types)
   - [Utility Scripts](#utility-scripts)
4. [Data Flow](#data-flow)
5. [Code Examples](#code-examples)

## Overview

The backend is built with Node.js and Express using TypeScript, following the MVC (Model-View-Controller) architectural pattern. It uses MySQL for database storage with the mysql2 library. The application is structured to be modular, maintainable, and scalable.

## Project Structure

```
BackEnd/
├── src/
│   ├── index.ts                  # Main entry point
│   ├── config/
│   │   └── env.ts                # Environment configuration
│   ├── controllers/
│   │   └── userController.ts     # User-related request handling
│   ├── database/
│   │   ├── connection.ts         # Database connection setup
│   │   └── init.ts               # Database initialization
│   ├── middleware/
│   │   └── auth.ts               # Authentication middleware
│   ├── models/
│   │   └── User.ts               # User model with database operations
│   ├── public/                   # Static files (empty)
│   ├── routes/
│   │   └── api.ts                # API route definitions
│   ├── scripts/
│   │   └── setup-db.ts           # Database setup utility
│   └── types/
│       └── index.ts              # TypeScript type definitions
```

## Core Components

### Entry Point

**File**: `src/index.ts`

This is the main entry point for the Express server. It:

- Initializes the Express application
- Configures middleware (CORS, body parsers, static files)
- Connects routes to their handlers
- Initializes the database
- Starts the server on the configured port

Key connections:

- Imports configuration from `config/env.ts`
- Imports API routes from `routes/api.ts`
- Uses database functions from `database/connection.ts` and `database/init.ts`

### Configuration

**File**: `src/config/env.ts`

Manages environment variables and configuration settings. It:

- Loads environment variables from `.env` files in development
- Defines configuration settings for the server, database, and other components
- Exports a centralized configuration object

Key connections:

- Imports types from `types/index.ts`
- Used by `index.ts`, `database/connection.ts`, and other files needing configuration

### Database

#### Connection Setup

**File**: `src/database/connection.ts`

Establishes and manages the connection to the MySQL database. It:

- Creates a connection pool using mysql2
- Provides a function to test the database connection
- Exports the connection pool for use by models

Key connections:

- Imports configuration from `config/env.ts`
- Exports the pool used by `models/User.ts` and other model files

#### Database Initialization

**File**: `src/database/init.ts`

Creates the necessary database tables if they don't exist. It:

- Defines SQL queries to create users, products, orders, and order items tables
- Provides a function to initialize all tables and verify their creation
- Sets up relationships between tables

Key connections:

- Imports the connection pool from `database/connection.ts`
- Used by `index.ts` during server startup
- Used by `scripts/setup-db.ts` for database setup

### Models

#### User Model

**File**: `src/models/User.ts`

Defines the User model structure and database operations. It:

- Implements CRUD operations (Create, Read, Update, Delete) for user data
- Maps database rows to TypeScript objects
- Handles database errors and provides clean interfaces for controllers

Key connections:

- Imports the connection pool from `database/connection.ts`
- Imports User type from `types/index.ts`
- Used by `controllers/userController.ts`

### Controllers

#### User Controller

**File**: `src/controllers/userController.ts`

Handles all user-related business logic and request processing. It:

- Implements handler functions for user routes (get all, get by ID, create, update, delete)
- Validates input data before passing to models
- Formats API responses with appropriate status codes and messages

Key connections:

- Imports User model from `models/User.ts`
- Imports User type from `types/index.ts`
- Used by `routes/api.ts`

### Routes

**File**: `src/routes/api.ts`

Defines all API routes and connects them to their respective controllers. It:

- Creates an Express router
- Defines endpoints for user operations
- Groups related routes with clear naming conventions

Key connections:

- Imports user controller from `controllers/userController.ts`
- Exported and used by `index.ts`

### Middleware

#### Authentication Middleware

**File**: `src/middleware/auth.ts`

Handles user authentication for protected routes. It:

- Verifies authentication tokens from request headers
- Attaches user information to the request object
- Returns appropriate error responses for unauthenticated requests

Key connections:

- Extends Express Request interface with user property
- Can be imported by `routes/api.ts` for protected routes (not currently used)

### Types

**File**: `src/types/index.ts`

Contains common TypeScript interface definitions used throughout the application. It defines:

- User interface
- Database configuration interface
- Application configuration interface

Key connections:

- Imported by many files including models, controllers, and configuration

### Utility Scripts

#### Database Setup

**File**: `src/scripts/setup-db.ts`

A utility script for setting up and testing the MySQL database. It:

- Tests the raw connection to MySQL
- Creates the database if it doesn't exist
- Tests the connection with the database
- Initializes database tables

Key connections:

- Imports configuration from `config/env.ts`
- Imports functions from `database/connection.ts` and `database/init.ts`

## Data Flow

The application follows a typical MVC flow:

1. **Request** comes to `index.ts` which routes it to the appropriate handler in `routes/api.ts`
2. **Route handler** calls the corresponding method in a controller (e.g., `userController.ts`)
3. **Controller** processes the request, validates data, and calls methods on models (e.g., `User.ts`)
4. **Model** performs database operations using the connection pool from `connection.ts`
5. **Response** flows back from the model to the controller, which formats it and sends it back to the client

## Code Examples

### Creating a User

Here's how data flows when creating a new user:

1. A POST request is sent to `/api/users`
2. The request is routed to `userController.createUser` in `controllers/userController.ts`
3. The controller validates the input data and calls `User.create` in `models/User.ts`
4. The User model executes an SQL INSERT query using the connection pool
5. The controller receives the result and sends a 201 response with the created user data

```typescript
// Example: Creating a user through the API
// POST /api/users
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "fullName": "John Doe"
}
```

### Database Initialization

During server startup, the database is initialized:

1. `index.ts` calls `initializeDatabase` from `database/init.ts`
2. The function executes SQL CREATE TABLE queries if the tables don't exist
3. It verifies that all tables were created correctly

This ensures the database schema is always up-to-date when the server starts.

---

This backend implementation demonstrates a well-organized Node.js application using TypeScript with clear separation of concerns. The modular structure makes it easy to extend with new features or modify existing functionality.
