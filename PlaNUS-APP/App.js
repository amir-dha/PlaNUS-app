import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import LoginScreen from './Screens/Authentication Screens/LoginScreen';
import WelcomeScreen from './Screens/Authentication Screens/WelcomeScreen';
import SignupScreen from './Screens/Authentication Screens/SignupScreen';
import HomeScreen from './Screens/Home/HomeScreen';
import SettingScreen from './Screens/Account/Settings/SettingScreen';
import AccountScreen from './Screens/Account/Settings/AccountScreen';
import PlannerPage from './Screens/Calendar Components/PlannerPage';
import AddTaskEventScreen from './Screens/Calendar Components/AddTaskEvent';
import EisenhowerMatrix from './Screens/EisenhowerMatrix/EisenhowerMatrix';
import SemesterPlan from './Screens/SemesterPlan/SemesterPlan';
import CourseSelectScreen from './Screens/Calendar Components/CourseSelectScreen';
import EditCourseSlotScreen from './Screens/Calendar Components/EditCourseSlotScreen';

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    const projectId = Constants.expoConfig.extra.eas.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log(token);
    return token;
  } else {
    alert('Must use physical device for Push Notifications');
  }
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Ubuntu-Regular': require('./assets/Fonts/Ubuntu/Ubuntu-Regular.ttf'),
      'Ubuntu-Bold': require('./assets/Fonts/Ubuntu/Ubuntu-Bold.ttf'),
      'Ubuntu-Medium': require('./assets/Fonts/Ubuntu/Ubuntu-Medium.ttf'),
      'Ubuntu-Italic': require('./assets/Fonts/Ubuntu/Ubuntu-Italic.ttf')
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Welcome" component={WelcomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Signup" component={SignupScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Setting" component={SettingScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Account" component={AccountScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Planner" component={PlannerPage} />
        <Stack.Screen options={{ headerShown: false }} name="AddTaskEventScreen" component={AddTaskEventScreen} />
        <Stack.Screen options={{ headerShown: false }} name="EisenhowerMatrix" component={EisenhowerMatrix} />
        <Stack.Screen options={{ headerShown: false }} name="SemesterPlan" component={SemesterPlan} />
        <Stack.Screen options={{ headerShown: false }} name="CourseSelectScreen" component={CourseSelectScreen} />
        <Stack.Screen options={{ headerShown: false }} name="EditCourseSlotScreen" component={EditCourseSlotScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
