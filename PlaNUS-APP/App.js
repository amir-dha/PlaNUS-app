import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react'; 
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import LoginScreen from './Screens/LoginScreen';
import WelcomeScreen from './Screens/WelcomeScreen';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import SignupScreen from './Screens/SignupScreen';
import HomeScreen from './Screens/HomeScreen';

const Stack = createNativeStackNavigator(); 

function App() {

  //to use external font 
  const [fontsLoaded, setFontsLoaded] = useState(false); 
  
  //function to load fonts 
  const loadFonts = async () => {
    await Font.loadAsync({
      'Ubuntu-Regular': require('./assets/Fonts/Ubuntu/Ubuntu-Regular.ttf'),
      'Ubuntu-Bold': require('./assets/Fonts/Ubuntu/Ubuntu-Bold.ttf')
    });
    setFontsLoaded(true); 
  }; 

  useEffect(() => {
    async function prepare() {
      try {
        // Prevent the splash screen from auto-hiding
        await SplashScreen.preventAutoHideAsync();
        // Load fonts and any other async tasks
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide the splash screen after fonts have been loaded
        await SplashScreen.hideAsync();
      }
    }

    prepare();
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});