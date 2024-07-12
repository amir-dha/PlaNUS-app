
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, updateProfile, signInWithEmailAndPassword, signOut, reload } from 'firebase/auth';
import { useNavigation, useFocusEffect } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = require('../../assets/logo.png');

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [resendAllowed, setResendAllowed] = useState(true);
  const [resendTimer, setResendTimer] = useState(60);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      // Clear fields when the screen gains focus
      setEmail('');
      setUsername('');
      setPassword('');
      return () => {
        // Optionally clear AsyncStorage when the screen loses focus
        AsyncStorage.removeItem('email');
        AsyncStorage.removeItem('username');
        AsyncStorage.removeItem('password');
      };
    }, [])
  );

  useEffect(() => {
    const loadStoredData = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedUsername = await AsyncStorage.getItem('username');
      const storedPassword = await AsyncStorage.getItem('password');
      const storedResendTimer = await AsyncStorage.getItem('resendTimer');

      if (storedEmail) setEmail(storedEmail);
      if (storedUsername) setUsername(storedUsername);
      if (storedPassword) setPassword(storedPassword);
      if (storedResendTimer) setResendTimer(parseInt(storedResendTimer, 10));
    };

    loadStoredData();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await reload(user); // Ensure we get the latest user state
        if (user.emailVerified) {
          console.log("User verified");
          setEmail('');
          setUsername('');
          setPassword('');
          await AsyncStorage.removeItem('email');
          await AsyncStorage.removeItem('username');
          await AsyncStorage.removeItem('password');
        } else {
          setCurrentUser(user);
        }
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendAllowed(true);
            AsyncStorage.removeItem('resendTimer');
            return 0;
          }
          AsyncStorage.setItem('resendTimer', (prev - 1).toString());
          return prev - 1;
        });
      }, 1000);
    }
  }, [resendTimer]);

  useEffect(() => {
    const storeData = async () => {
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
    };
    storeData();
  }, [email, username, password]);

  const isValidEmail = email => {
    const regex = /^[a-zA-Z0-9._%+-]+@u\.nus\.edu$/;
    return regex.test(email);
  };

  const isStrongPassword = password => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
  };

  const handleSignup = async () => {
    if (!isValidEmail(email)) {
      alert('Invalid email. Not an NUS Student email.');
      return;
    }
    if (!isStrongPassword(password)) {
      alert('Password is too weak. Please choose a stronger password.');
      return;
    }

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      setCurrentUser(user);

      await updateProfile(user, {
        displayName: username,
      });

      await sendEmailVerification(user);
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        username: username,  // Save the username
        year: '', // Default year, can be updated later
        image: '', // Default image, can be updated later
      });
      console.log('User registered and data saved'); 

      await signOut(auth);

      Alert.alert(
        "Email Verification",
        "Please check your email to verify your account. If you haven't received the email, please check your spam folder or click Resend Verification Email.",
        [{ text: "OK" }]
      );

      setResendAllowed(false);
      setResendTimer(60); // Set the timer to 60 seconds

      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendAllowed(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(async () => {
        try {
          await signInWithEmailAndPassword(auth, email, password); // Re-authenticate to refresh the token
          const user = auth.currentUser;
          await reload(user); // Ensure we have the latest state
          if (!user.emailVerified) {
            await deleteDoc(doc(db, 'users', user.uid));
            await user.delete();
            Alert.alert(
              "Account Deleted",
              "Your account was deleted because the email was not verified within 30 minutes. Please sign up again."
            );
          }
        } catch (error) {
          console.error("Error during account deletion process:", error);
        }
      }, 30 * 60 * 1000); // 30 minutes
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          alert('An account with this email already exists.');
          break;
        case 'auth/invalid-email':
          alert('Invalid email. Not an NUS Student email.');
          break;
        case 'auth/weak-password':
          alert('Password is too weak. Please choose a stronger password.');
          break;
        default:
          alert(error.message);
      }
    }
  };

  const handleResendVerificationEmail = async () => {
    if (currentUser) {
      try {
        await signInWithEmailAndPassword(auth, currentUser.email, password);
        await sendEmailVerification(currentUser);
        alert('Verification email resent. Please check your inbox.');
        await signOut(auth);
        setResendAllowed(false);
        setResendTimer(60); // Reset the timer to 60 seconds

        const interval = setInterval(() => {
          setResendTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setResendAllowed(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error) {
        console.error('Error resending verification email:', error);
        if (error.code === 'auth/too-many-requests') {
          alert('Too many requests. Please wait a moment before trying again.');
        } else {
          alert('Failed to resend verification email. Please try again.');
        }
      }
    } else {
      alert('User information is not available for resending email.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name='chevron-back' size={24} color='white' />
      </TouchableOpacity>

      <Image source={logo} style={styles.image} />

      <Text style={styles.headerText}>Welcome!</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Username'
          value={username}
          onChangeText={text => setUsername(text)}
          style={styles.input}
          autoCapitalize='none'
        />
        <TextInput
          placeholder='Email ending with @u.nus.edu'
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          autoCapitalize='none'
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder='Password'
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.passwordInput}
            autoCapitalize='none'
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
            <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color='black' />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignup} style={styles.button}>
          <Text style={styles.buttonInput}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleResendVerificationEmail}
          style={[styles.button, !resendAllowed && { backgroundColor: '#e7e7e7' }]}
          disabled={!resendAllowed}
        >
          <Text style={[styles.buttonInput, !resendAllowed && { color: '#A9A9A9' }]}>
            Resend Verification Email
          </Text>
        </TouchableOpacity>
        {!resendAllowed && <Text style={styles.timerText}>{resendTimer}s</Text>}
      </View>

      <Text style={styles.passwordInstructions}>
        Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character.
      </Text>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#003882',
  },
  image: {
    width: 150,
    height: 100,
    marginBottom: 30,
    marginLeft: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 40,
    fontFamily: 'Ubuntu-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
    fontFamily: 'Ubuntu-Regular',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Ubuntu-Regular',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: 'white',
    width: '100%',
    padding: 12,
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e7e7e7',
    marginTop: 10,
  },
  buttonInput: {
    color: '#003882',
    fontSize: 16,
    fontFamily: 'Ubuntu-Bold',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  timerText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  passwordInstructions: {
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
  },
});
