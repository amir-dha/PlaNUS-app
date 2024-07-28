
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, AppState, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import AsyncStorage from '@react-native-async-storage/async-storage';
import timeZones from './Utils/timezones';

const Settings = () => {
  const navigation = useNavigation(); // Initialize useNavigation
  const [timeZone, setTimeZone] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lockScreenNotifications, setLockScreenNotifications] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await AsyncStorage.getItem('settings');
      if (settings) {
        const { timeZone, notificationsEnabled, lockScreenNotifications } = JSON.parse(settings);
        setTimeZone(timeZone);
        setNotificationsEnabled(notificationsEnabled);
        setLockScreenNotifications(lockScreenNotifications);
      }
    };
    loadSettings();
    updateTimeZone();
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      updateTimeZone();
    }
  };

  const updateTimeZone = () => {
    const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const matchedTimeZone = timeZones.find(tz => tz.utc.includes(deviceTimeZone));
    if (matchedTimeZone) {
      setTimeZone(matchedTimeZone.text);
      saveSettings(matchedTimeZone.text, notificationsEnabled, lockScreenNotifications);
    }
  };

  const handleRefresh = () => {
    updateTimeZone();
    Alert.alert('Time Zone Updated', 'The time zone has been updated based on your device.');
  };

  const handleNotificationsChange = (value) => {
    setNotificationsEnabled(value);
    saveSettings(timeZone, value, lockScreenNotifications);
  };

  const handleLockScreenNotificationsChange = (value) => {
    setLockScreenNotifications(value);
    saveSettings(timeZone, notificationsEnabled, value);
  };

  const saveSettings = async (timeZone, notificationsEnabled, lockScreenNotifications) => {
    await AsyncStorage.setItem('settings', JSON.stringify({ timeZone, notificationsEnabled, lockScreenNotifications }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.setting}>
        <Text style={styles.label}>Time Zone</Text>
        <Text style={styles.timeZone}>{timeZone}</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.horizontalSetting}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={handleNotificationsChange} />
      </View>

      <View style={styles.horizontalSetting}>
        <Text style={styles.label}>Lock Screen Notifications</Text>
        <Switch value={lockScreenNotifications} onValueChange={handleLockScreenNotificationsChange} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#003882',
    borderRadius: 15,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
  },
  setting: {
    marginBottom: 20,
  },
  horizontalSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    color: '#003882',
    fontSize: 18,
    marginBottom: 10,
  },
  timeZone: {
    color: '#333333',
    fontSize: 16,
    paddingVertical: 12,
  },
  refreshButton: {
    padding: 10,
    backgroundColor: '#003882',
    borderRadius: 15,
    marginTop: 10,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Settings;
