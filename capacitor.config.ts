<<<<<<< HEAD
=======

>>>>>>> 6f7bee8b8b951f326293fb96ab1eee0d2404c638
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flowiq.provider',
  appName: 'FlowIQ Provider',
<<<<<<< HEAD
  webDir: 'dist'
=======
  webDir: 'dist',
  server: {
    url: 'https://7e1fd4ae-99ff-4361-b2ea-69b832f99084.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF'
    }
  },
  ios: {
    scheme: 'FlowIQ Provider'
  }
>>>>>>> 6f7bee8b8b951f326293fb96ab1eee0d2404c638
};

export default config;
