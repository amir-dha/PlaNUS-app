import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import timeZones from '../Utils/timezones';

const Settings = () => {
  const navigation = useNavigation();
  const [startOfWeek, setStartOfWeek] = useState('Sunday');
  const [useDeviceTimeZone, setUseDeviceTimeZone] = useState(true);
  const [timeZone, setTimeZone] = useState('Asia/Singapore (GMT+08:00)');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lockScreenNotifications, setLockScreenNotifications] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await AsyncStorage.getItem('settings');
      if (settings) {
        const { startOfWeek, timeZone, useDeviceTimeZone, notificationsEnabled, lockScreenNotifications } = JSON.parse(settings);
        setStartOfWeek(startOfWeek);
        setTimeZone(timeZone);
        setUseDeviceTimeZone(useDeviceTimeZone);
        setNotificationsEnabled(notificationsEnabled);
        setLockScreenNotifications(lockScreenNotifications);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (useDeviceTimeZone) {
      const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const matchedTimeZone = timeZones.find(tz => tz.value.includes(deviceTimeZone));
      if (matchedTimeZone) {
        setTimeZone(matchedTimeZone.value);
        saveSettings(startOfWeek, matchedTimeZone.value, useDeviceTimeZone, notificationsEnabled, lockScreenNotifications);
      }
    }
  }, [useDeviceTimeZone]);

  const handleTimeZoneChange = (itemValue) => {
    setTimeZone(itemValue);
    setUseDeviceTimeZone(false);
    saveSettings(startOfWeek, itemValue, false, notificationsEnabled, lockScreenNotifications);
  };

  const handleStartOfWeekChange = (itemValue) => {
    setStartOfWeek(itemValue);
    saveSettings(itemValue, timeZone, useDeviceTimeZone, notificationsEnabled, lockScreenNotifications);
  };

  const handleUseDeviceTimeZoneChange = (value) => {
    setUseDeviceTimeZone(value);
    if (value) {
      const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const matchedTimeZone = timeZones.find(tz => tz.value.includes(deviceTimeZone));
      if (matchedTimeZone) {
        setTimeZone(matchedTimeZone.value);
        saveSettings(startOfWeek, matchedTimeZone.value, value, notificationsEnabled, lockScreenNotifications);
      }
    } else {
      saveSettings(startOfWeek, timeZone, value, notificationsEnabled, lockScreenNotifications);
    }
  };

  const handleNotificationsChange = (value) => {
    setNotificationsEnabled(value);
    saveSettings(startOfWeek, timeZone, useDeviceTimeZone, value, lockScreenNotifications);
  };

  const handleLockScreenNotificationsChange = (value) => {
    setLockScreenNotifications(value);
    saveSettings(startOfWeek, timeZone, useDeviceTimeZone, notificationsEnabled, value);
  };

  const saveSettings = async (startOfWeek, timeZone, useDeviceTimeZone, notificationsEnabled, lockScreenNotifications) => {
    await AsyncStorage.setItem('settings', JSON.stringify({ startOfWeek, timeZone, useDeviceTimeZone, notificationsEnabled, lockScreenNotifications }));
    Alert.alert('Settings Saved', 'Your settings have been updated.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          saveSettings(startOfWeek, timeZone, useDeviceTimeZone, notificationsEnabled, lockScreenNotifications);
          navigation.goBack();
        }} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.setting}>
        <Text style={styles.label}>Start of the week</Text>
        <Picker
          selectedValue={startOfWeek}
          style={styles.picker}
          onValueChange={handleStartOfWeekChange}
        >
          <Picker.Item label="Sunday" value="Sunday" />
          <Picker.Item label="Monday" value="Monday" />
          <Picker.Item label="Saturday" value="Saturday" />
        </Picker>
      </View>

      <View style={styles.horizontalSetting}>
        <Text style={styles.label}>Use device's time zone</Text>
        <Switch
          value={useDeviceTimeZone}
          onValueChange={handleUseDeviceTimeZoneChange}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.label}>Time zone</Text>
        {useDeviceTimeZone ? (
          <Text style={styles.timeZone}>{timeZone}</Text>
        ) : (
          <Picker
            selectedValue={timeZone}
            style={styles.picker}
            onValueChange={handleTimeZoneChange}
          >
            {timeZones.map((tz) => (
              <Picker.Item key={tz.value} label={tz.label} value={tz.value} />
            ))}
          </Picker>
        )}
      </View>

      <View style={styles.horizontalSetting}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationsChange}
        />
      </View>

      <View style={styles.horizontalSetting}>
        <Text style={styles.label}>Lock Screen Notifications</Text>
        <Switch
          value={lockScreenNotifications}
          onValueChange={handleLockScreenNotificationsChange}
        />
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
  picker: {
    height: 50,
    color: '#003882',
    backgroundColor: '#f0f0f0',
  },
  timeZone: {
    color: '#cccccc',
    fontSize: 16,
    paddingVertical: 12,
  },
});

export default Settings;



