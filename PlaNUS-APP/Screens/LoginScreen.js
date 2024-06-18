import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';

const logo = require('../assets/logo.png'); 

const LoginScreen = () => {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    //Navigate to HomeScreen once Login button has been pressed
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
               navigation.navigate("Home");
            }
        });
        return unsubscribe; 
    }, []);

    const isValidEmail = email => {
        const regex = /^e\d{7}@u\.nus\.edu$/;
        const isValid = regex.test(email);
        console.log(`Email validation for ${email}: ${isValid}`);
        return isValid;
      };

    const handleLogin = () => {
        if (!isValidEmail(email)) {
            alert('Invalid email. Not an NUS Student email.');
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
         const user = userCredentials.user; 
        })
        .catch(error => {
            console.log(`Error code: ${error.code}`);
            console.error('Login error:', error); // Added error logging
            switch (error.code) {
                case 'auth/user-not-found':
                    alert('The account does not exist.');
                    break;
                case 'auth/invalid-credential':
                    alert('Invalid email or password. Try again.');
                    break;
                // case 'auth/wrong-password': 
                //     alert('Incorrect password. Please try again.');
                    // break;
                default:
                    alert(error.message);
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
            <Ionicons name='chevron-back' size = {24} color='white' />
        </TouchableOpacity>
        <Image 
            source={logo}
            style={styles.image}
        />

        <Text style={styles.headerText}>Welcome Back!</Text>  

        <View style={styles.inputContainer}>
            <TextInput
                placeholder='Email'
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
                autoCapitalize='none'
            />
            <TextInput
                placeholder='Password'
                value={password}
                onChangeText={text => setPassword(text)}
                style={styles.input}
                autoCapitalize='none'
                secureTextEntry
            />
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={handleLogin}
                style={styles.button}
            >
                <Text style={styles.buttonInput}>Log In</Text>
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