import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';


//screen that's visible after logging in 
const HomeScreen = () => {
  const navigation = useNavigation(); 

  const handleLogout = async () => { 
    try {
        await signOut(auth);
        navigation.navigate('Welcome');
    } catch (error) {
        console.error('Error logging out: ', error); 
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name='log-out' size={24} color='#003882' /> 
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Home Screen Here</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems:'center',
    justifyContent:'center',
  },
  text: {
    color:'#003882', 
    fontFamily:'Ubuntu-Bold',
  },
  logoutButton: {
    position:'absolute',
    top: 50,
    right: 20,
    padding:6,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#e7e7e7',
    borderRadius:15,
    borderWidth: 2,
    borderColor:"#003882"
  },
  logoutText: {
    color:'#003882',
    fontFamily:'Ubuntu-Regular',
    fontSize:10,
  },
});