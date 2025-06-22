/**
 * Types for the application
 * 
 * This file contains common type definitions used throughout the application
 */

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  fullName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit?: number;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  database: DatabaseConfig;
  jwtSecret?: string;
}
