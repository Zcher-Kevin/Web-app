# GitHub Best Practices for This Project

## Files to NEVER Push to GitHub

### 1. Environment Variables (.env files)

**NEVER commit these files:**

- `.env`
- `.env.local`
- `.env.development`
- `.env.production`
- Any file containing passwords, API keys, or secrets

**Why:** These files contain sensitive information like database passwords and API keys. If committed to a public repository, this information becomes public and can be used by malicious actors.

**Instead:**

- Use `.env.example` files that show the structure without real values
- Require team members to create their own local `.env` files

### 2. Dependency Directories

**NEVER commit these directories:**

- `node_modules/`

**Why:** These directories are huge, unnecessary, and platform-specific. They can be generated from package.json.

**Instead:**

- Commit package.json and package-lock.json
- Have users run `npm install` to generate their own node_modules

### 3. Build and Distribution Files

**NEVER commit these directories:**

- `/dist`
- `/build`
- Any compiled code

**Why:** These files are generated from source code and often contain platform-specific optimizations.

**Instead:**

- Build these files during your deployment process
- Document build procedures in README files

### 4. MySQL Password Reset Scripts

**NEVER commit these files:**

- `mysql-reset-wizard.sh`
- `mysql-complete-reset.sh`
- `create-mysql-user.sh`
- `reset-mysql-password.sh`
- `MYSQL_PASSWORD_HELP.md`

**Why:** These files may contain details about your database structure and security approach.

### 5. Large Data Files

**NEVER commit these files:**

- Database dumps
- Large data files (images, videos, etc.)
- Log files

**Why:** Git is not designed for large binary files and including them bloats your repository.

**Instead:**

- Use Git LFS if you must version large files
- Store large assets separately (S3, etc.)

## Best Practices for GitHub

### 1. Proper Branch Management

- Use a `main` branch for production-ready code
- Use a `development` branch for active development
- Create feature branches for new features
- Create bugfix branches for bug fixes
- Use pull requests to merge changes

### 2. Commit Messages

- Use clear, descriptive commit messages
- Start with a verb in the present tense (e.g., "Add login feature" not "Added login feature")
- Reference issue numbers when applicable

### 3. README Files

- Maintain up-to-date README files
- Include setup instructions
- Document API endpoints
- Explain the project structure

### 4. Security

- Regularly audit your repository for accidentally committed secrets
- Consider using a tool like git-secrets to prevent committing secrets
- Regularly update dependencies to address security vulnerabilities

### 5. Issues and Project Management

- Use GitHub Issues for bug tracking
- Use GitHub Projects for project management
- Label issues appropriately (bug, enhancement, etc.)
- Assign issues to team members

### 6. Continuous Integration

- Consider setting up GitHub Actions for:
  - Running tests
  - Linting code
  - Building the application
  - Deploying to staging/production

## Setting Up Your GitHub Repository

1. Create a new repository on GitHub
2. Initialize it with a README.md file
3. Clone it to your local machine
4. Copy your project files (excluding those mentioned above)
5. Commit and push your changes

```bash
# Create a local copy of your GitHub repository
git clone https://github.com/yourusername/your-repo-name.git

# Copy your project files (excluding node_modules, etc.)
cp -R /Users/kevin/Desktop/My-Projects/Web-app/* your-repo-name/

# Navigate to your repository
cd your-repo-name

# Add files to git
git add .

# Commit your changes
git commit -m "Initial commit"

# Push to GitHub
git push origin main
```

## Need Help?

If you're unsure whether a file should be committed to GitHub, err on the side of caution and don't commit it. You can always add it later if needed.
