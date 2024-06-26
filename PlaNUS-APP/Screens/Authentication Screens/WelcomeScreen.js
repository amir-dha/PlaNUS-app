import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react'; 
import { useNavigation } from '@react-navigation/core';

const logo = require('../../assets/logo.png'); 

const WelcomeScreen = () => {

  const navigation = useNavigation();
  const goToLogin = () => navigation.navigate('Login');
  const goToSignup = () => navigation.navigate('Signup'); 
 
  return (
    <View style={styles.container}>
      {/* PlaNUS Logo */}
      <Image 
        source={logo}
        style={styles.image}
      />

      <Text style={styles.headerText}>PlaNUS</Text>
      <Text style={styles.text}>One Platform, All Your Plans</Text>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={goToLogin}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Signup Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={goToSignup}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems:'center',
    padding: 40, 
    backgroundColor: '#003882'
  }, 
  image: {
    width:150,
    height:100,
    marginBottom: 30,
    marginLeft:20,
  }, 
  headerText: {
    color:'white', 
    fontSize: 50,
    fontFamily:'Ubuntu-Bold',
    textAlign:'center',
    marginBottom: 5,
    textShadowColor:'#444444',
    textShadowOffset: {width:2, height: 2}, 
    textShadowRadius:5,
  },
  text: {
    color:'white', 
    fontSize:17,
    fontFamily:'Ubuntu-Bold',
    textAlign:'center',
    marginBottom: 40,
    textShadowColor:'#444444',
    textShadowOffset:{width:2, height:2}, 
    textShadowRadius:5,
  }, 
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 120, 
    borderRadius: 15, 
    marginTop:15,
    borderWidth: 3,
    borderColor: '#ffcc00',
  },
  buttonText: {
    color: '#003882',
    fontSize: 16,
    fontFamily: 'Ubuntu-Regular',
  },
});