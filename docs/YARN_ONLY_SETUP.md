# 🧶 Yarn-Only Project Setup

This project is configured to use **Yarn exclusively** for package management. NPM and NPX are completely blocked to ensure consistency across all development environments.

## 🚫 NPM/NPX Blocking

### What's Blocked
- `npm install`, `npm i`, `npm add`, etc.
- `npx` commands
- Package-lock.json creation
- NPM cache usage

### How It's Blocked
1. **Package.json Configuration**
   - `"packageManager": "yarn@1.22.19"`
   - `"npm": "please-use-yarn"` in engines
   - Preinstall script that prevents npm usage

2. **NPM Configuration (.npmrc)**
   - Redirects npm operations to `/dev/null`
   - Disables all npm functionality
   - Forces npm commands to fail

3. **Yarn Configuration (.yarnrc)**
   - Enforces yarn-only usage
   - Optimizes yarn performance
   - Sets up offline caching

4. **Shell Function Blocking**
   - `setup-yarn-only.sh` creates npm/npx blocking functions
   - Provides helpful error messages with yarn alternatives
   - Logs blocked attempts to `.npm-block.log`

## ✅ Yarn Commands to Use

### 📦 Package Management
```bash
# Install all dependencies
yarn install

# Add a package
yarn add <package-name>

# Add a dev dependency
yarn add -D <package-name>

# Remove a package
yarn remove <package-name>

# Upgrade packages
yarn upgrade

# Upgrade a specific package
yarn upgrade <package-name>
```

### 🏃 Running Scripts
```bash
# Development server
yarn dev

# Build for production
yarn build

# Deploy (build + firebase deploy)
yarn deploy

# Run tests
yarn test

# Preview production build
yarn preview

# Run linting
yarn lint
```

### 🔧 Tools & Utilities
```bash
# Run a package (instead of npx)
yarn dlx <package-name>

# Create from template
yarn create <template-name>

# Check yarn version
yarn --version

# List installed packages
yarn list

# Show outdated packages
yarn outdated
```

## 🛠 Setup Instructions

### For New Team Members

1. **Install Yarn** (if not already installed):
   ```bash
   npm install -g yarn
   # or
   brew install yarn
   ```

2. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ancient-history-pwa
   ```

3. **Install dependencies**:
   ```bash
   yarn install
   ```

4. **Set up npm blocking** (optional but recommended):
   ```bash
   source ./setup-yarn-only.sh
   ```

### For Existing Projects Converting to Yarn-Only

1. **Remove npm artifacts**:
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. **Install with yarn**:
   ```bash
   yarn install
   ```

3. **Copy configuration files** from this project:
   - `.npmrc`
   - `.yarnrc`
   - `setup-yarn-only.sh`
   - Update `package.json` with yarn-only configurations

## 🔍 Troubleshooting

### "Please use yarn instead of npm" Error
This is expected! The project is configured to block npm usage. Use the equivalent yarn command instead.

### NPM Commands Still Work
If npm commands aren't being blocked:
1. Source the setup script: `source ./setup-yarn-only.sh`
2. Check that `.npmrc` exists and has the blocking configuration
3. Verify `package.json` has the preinstall script

### Yarn Installation Issues
1. Clear yarn cache: `yarn cache clean`
2. Delete `node_modules` and `yarn.lock`, then reinstall: `rm -rf node_modules yarn.lock && yarn install`
3. Check yarn version: `yarn --version` (should be >= 1.22.0)

## 📝 Blocked Attempts Log

All blocked npm/npx attempts are logged to `.npm-block.log` for debugging and monitoring purposes.

## 💡 Why Yarn-Only?

- **Consistent Lock Files**: `yarn.lock` provides deterministic installs
- **Better Performance**: Faster installs with better caching
- **Team Consistency**: Everyone uses the same package manager
- **Reliability**: Fewer dependency resolution issues
- **Modern Features**: Better workspace support and plugin system

## 🔗 Useful Links

- [Yarn Documentation](https://yarnpkg.com/getting-started)
- [Yarn CLI Commands](https://yarnpkg.com/cli)
- [Migrating from NPM](https://yarnpkg.com/getting-started/migration)
