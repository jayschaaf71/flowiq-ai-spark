#!/bin/bash

echo "🚀 Setting up FlowIQ development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local from template"
        echo "📝 Please update .env.local with your environment variables"
    else
        echo "❌ .env.example not found. Please create .env.local manually"
    fi
else
    echo "✅ .env.local already exists"
fi

# Run type check
echo "🔍 Running type check..."
npx tsc --noEmit --skipLibCheck

# Run linter
echo "🧹 Running linter..."
npm run lint

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your environment variables"
echo "2. Run 'npm run dev' to start development server"
echo "3. Create a feature branch: git checkout -b feature/your-feature"
echo "4. Make changes and create PR to develop branch"
echo ""
echo "Happy coding! 🚀" 