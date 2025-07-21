
#!/bin/bash

echo "🧹 Cleaning up existing Capacitor state..."
rm -rf node_modules/.capacitor
rm -rf ios

echo "🏗️ Building the web project..."
npm run build

echo "📱 Adding iOS platform..."
npx cap add ios

echo "🔄 Syncing project with iOS platform..."
npx cap sync

echo "✅ iOS platform setup complete!"
echo ""
echo "Next steps:"
echo "1. Open ios/App.xcworkspace in Xcode"
echo "2. Select your target device/simulator"
echo "3. Click the Play button to build and run"
echo ""
echo "Note: Always open App.xcworkspace, NOT App.xcodeproj"
