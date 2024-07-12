
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';

const logo = require('../../assets/logo.png'); 

const LoginScreen = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigation = useNavigation();

  const isValidEmail = email => {
    const regex = /^[a-zA-Z0-9._%+-]+@u\.nus\.edu$/;
    const isValid = regex.test(email);
    console.log(`Email validation for ${email}: ${isValid}`);
    return isValid;
  };

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      alert('Invalid email. Not an NUS Student email.');
      return;
    }

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      if (!user.emailVerified) {
        Alert.alert('Email not verified', 'Please verify your email before logging in.');
        return;
      }

      console.log("Logged in with:", user.email);
      navigation.navigate("Home");
    } catch (error) {
      console.log(`Error code: ${error.code}`);
      console.error('Login error:', error); // Added error logging
      switch (error.code) {
        case 'auth/user-not-found':
          alert('The account does not exist.');
          break;
        case 'auth/invalid-credential':
          alert('Invalid email or password. Try again.');
          break;
        default:
          alert(error.message);
      }
    }
  };

  const handleForgetPassword = () => {
    if (!isValidEmail(email)) {
      alert('Invalid email. Not an NUS Student email.');
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Password reset email sent. Please check your inbox.');
      })
      .catch(error => {
        console.error('Error sending password reset email:', error);
        switch (error.code) {
          case 'auth/user-not-found':
            alert('The account does not exist.');
            break;
          default:
            alert('Failed to send password reset email. Please try again.');
        }
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior='padding'
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name='chevron-back' size={24} color='white' />
      </TouchableOpacity>
      <Image 
        source={logo}
        style={styles.image}
      />

      <Text style={styles.headerText}>Welcome Back!</Text>  

      <View style={styles.inputContainer}>
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
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonInput}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleForgetPassword}
          style={styles.button}
        >
          <Text style={styles.buttonInput}>Forget Password</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems:'center',
    padding: 40,
    backgroundColor:'#003882',
  },
  image: {
    width:150, 
    height:100,
    marginBottom: 30,
    marginLeft:20,
  },
  headerText: {
    color:'white', 
    fontSize: 40,
    fontFamily:'Ubuntu-Regular',
    textAlign:'center',
    marginBottom: 20,
  },
  inputContainer: {
    width:'80%',
  },
  input: {
    backgroundColor:'white',
    paddingVertical:10,
    paddingHorizontal:15,
    borderRadius:25,
    marginBottom:15,
    alignItems:'center',
    fontFamily:'Ubuntu-Regular',
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
  buttonContainer:{
    width:'60%',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 30,
  },
  button: {
    backgroundColor:'white',
    width:'100%',
    padding:12,
    alignItems:'center',
    borderRadius:25,
    borderWidth:2,
    borderColor:'#e7e7e7',
    marginTop: 10,
  },
  buttonInput: {
    color:'#003882',
    fontSize:16,
    fontFamily:'Ubuntu-Bold',
  },
  backButton: {
    position:'absolute',
    top: 50,
    left: 20,
  },
});
