
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';

interface MobileCapabilities {
  isNative: boolean;
  platform: string;
  isOnline: boolean;
  deviceInfo: any;
  keyboardHeight: number;
}

export const useMobileCapabilities = () => {
  const [capabilities, setCapabilities] = useState<MobileCapabilities>({
    isNative: false,
    platform: 'web',
    isOnline: true,
    deviceInfo: null,
    keyboardHeight: 0
  });

  useEffect(() => {
    const initializeCapabilities = async () => {
      const isNative = Capacitor.isNativePlatform();
      const platform = Capacitor.getPlatform();
      
      let deviceInfo = null;
      let networkStatus = { connected: true };

      if (isNative) {
        try {
          deviceInfo = await Device.getInfo();
          networkStatus = await Network.getStatus();
          
          // Configure status bar for mobile
          if (platform === 'ios' || platform === 'android') {
            await StatusBar.setBackgroundColor({ color: '#ffffff' });
            await StatusBar.setStyle({ style: Style.Light });
          }
        } catch (error) {
          console.log('Error initializing device capabilities:', error);
        }
      }

      setCapabilities({
        isNative,
        platform,
        isOnline: networkStatus.connected,
        deviceInfo,
        keyboardHeight: 0
      });
    };

    initializeCapabilities();

    // Listen for network changes
    let networkListener: any;
    
    const setupListeners = async () => {
      networkListener = await Network.addListener('networkStatusChange', (status) => {
        setCapabilities(prev => ({ ...prev, isOnline: status.connected }));
      });
    };

    // Listen for keyboard changes on mobile
    let keyboardShowListener: any;
    let keyboardHideListener: any;

    if (Capacitor.isNativePlatform()) {
      setupListeners();
      
      const setupKeyboardListeners = async () => {
        keyboardShowListener = await Keyboard.addListener('keyboardWillShow', (info) => {
          setCapabilities(prev => ({ ...prev, keyboardHeight: info.keyboardHeight }));
        });

        keyboardHideListener = await Keyboard.addListener('keyboardWillHide', () => {
          setCapabilities(prev => ({ ...prev, keyboardHeight: 0 }));
        });
      };
      
      setupKeyboardListeners();
    }

    return () => {
      networkListener?.remove();
      keyboardShowListener?.remove();
      keyboardHideListener?.remove();
    };
  }, []);

  return capabilities;
};
