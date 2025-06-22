# MySQL Installation Guide for macOS

This guide will help you install and set up MySQL on macOS for the web application backend.

## Installing MySQL

### Option 1: Using Homebrew (Recommended)

1. Install Homebrew (if not already installed):

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install MySQL:

   ```bash
   brew install mysql
   ```

3. Start MySQL service:

   ```bash
   brew services start mysql
   ```

4. Secure MySQL installation:
   ```bash
   mysql_secure_installation
   ```
   - Follow the prompts to set a root password
   - Answer 'Y' to all security questions

### Option 2: Using the Official MySQL Installer

1. Download the MySQL Community Server from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
2. Follow the installation instructions
3. Remember the temporary password that is generated during installation

## Verifying the Installation

Check if MySQL is running:

```bash
brew services list
```

or

```bash
mysql.server status
```

## Connecting to MySQL

Connect to MySQL using the command line:

```bash
mysql -u root -p
```

Enter your password when prompted.

## Setting Up the Database

1. In the MySQL prompt, create a database:

   ```sql
   CREATE DATABASE webappdb;
   ```

2. Create a user (optional):

   ```sql
   CREATE USER 'webapp_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON webappdb.* TO 'webapp_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. Exit MySQL:
   ```sql
   EXIT;
   ```

## Configuring the Application

Update the `.env` file with your MySQL credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=webappdb
```

## Troubleshooting

If you forgot your MySQL root password:

1. Stop MySQL:

   ```bash
   sudo mysql.server stop
   ```

2. Start MySQL in safe mode:

   ```bash
   sudo mysqld_safe --skip-grant-tables &
   ```

3. Connect to MySQL (no password needed):

   ```bash
   mysql -u root
   ```

4. Reset the password:

   ```sql
   USE mysql;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. Stop the safe mode MySQL and restart normally:
   ```bash
   sudo killall mysqld
   sudo mysql.server start
   ```

## Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MySQL Workbench](https://www.mysql.com/products/workbench/) - A GUI tool for MySQL
- [MySQL Tutorial](https://www.mysqltutorial.org/)
