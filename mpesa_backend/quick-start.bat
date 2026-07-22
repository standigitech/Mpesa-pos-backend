@echo off
REM Quick Start Script for M-Pesa Backend (Windows)

echo.
echo 🚀 M-Pesa Backend - Quick Start
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install it first.
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ NPM version:
npm --version

REM Navigate to backend directory
cd /d "%~dp0mpesa_backend" || exit /b 1

REM Check if dependencies are installed
if not exist "node_modules" (
    echo.
    echo 📦 Installing dependencies...
    call npm install
)

REM Check if .env exists
if not exist ".env" (
    echo.
    echo ⚠️  .env file not found. Creating from .env.example...
    if exist ".env.example" (
        copy .env.example .env
        echo 📝 Please edit .env with your M-Pesa credentials
    )
)

echo.
echo 🎯 Available Commands:
echo   npm start   - Start the server
echo   npm run dev - Start in development mode
echo   npm test    - Run tests
echo.
echo 📖 Documentation:
echo   - README.md - Overview and basic usage
echo   - DEPLOYMENT.md - Deployment options
echo   - ISSUES_AND_FIXES.md - Issues found and fixes
echo.
echo 🔧 Next Steps:
echo   1. Update .env with your M-Pesa credentials
echo   2. Run: npm start
echo   3. Test: curl http://localhost:3000/api/health
echo.
pause
