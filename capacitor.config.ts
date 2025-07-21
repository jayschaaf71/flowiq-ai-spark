
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flowiq.provider',
  appName: 'FlowIQ Provider',
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
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav"
    },
    Camera: {
      permissions: ["camera", "photos"]
    },
    Filesystem: {
      permissions: ["ExternalStorage"]
    },
    Device: {
      permissions: ["DeviceInfo"]
    }
  },
  ios: {
    backgroundColor: '#ffffff',
    scheme: 'FlowIQ'
  },
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;
