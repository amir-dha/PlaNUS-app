// withAutoLogout.js

import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebase';
import { useNavigation } from '@react-navigation/native';

const AUTO_LOGOUT_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const withAutoLogout = (WrappedComponent) => {
  return (props) => {
    const navigation = useNavigation();

    useEffect(() => {
      const checkAutoLogout = async () => {
        const lastActivity = await AsyncStorage.getItem('lastActivity');
        if (lastActivity) {
          const lastActivityTime = JSON.parse(lastActivity);
          const currentTime = Date.now();
          if (currentTime - lastActivityTime > AUTO_LOGOUT_TIME) {
            handleLogout();
          }
        }
      };

      const handleLogout = async () => {
        await auth.signOut();
        await AsyncStorage.removeItem('lastActivity');
        navigation.navigate('Login'); // Navigate to your login screen
      };

      const interval = setInterval(checkAutoLogout, 60 * 1000); // Check every minute

      return () => clearInterval(interval);
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAutoLogout;
