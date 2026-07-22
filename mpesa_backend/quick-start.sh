#!/bin/bash
# Quick Start Script for M-Pesa Backend

echo "🚀 M-Pesa Backend - Quick Start"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Navigate to backend directory
cd "$(dirname "$0")/mpesa_backend" || exit

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "📝 Please edit .env with your M-Pesa credentials"
    fi
fi

echo ""
echo "🎯 Available Commands:"
echo "  npm start   - Start the server (production mode)"
echo "  npm run dev - Start the server (development mode)"
echo "  npm test    - Run tests"
echo ""
echo "📖 Documentation:"
echo "  - README.md - Overview and basic usage"
echo "  - DEPLOYMENT.md - Deployment options"
echo "  - ISSUES_AND_FIXES.md - Issues found and fixes applied"
echo ""
echo "🔧 Next Steps:"
echo "  1. Update .env with your M-Pesa credentials"
echo "  2. Run: npm run dev"
echo "  3. Test: curl http://localhost:3000/api/health"
echo ""
