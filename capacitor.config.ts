import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7e1fd4ae99ff4361b2ea69b832f99084',
  appName: 'flowiq-ai-spark',
  webDir: 'dist',
  server: {
    url: 'https://7e1fd4ae-99ff-4361-b2ea-69b832f99084.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;