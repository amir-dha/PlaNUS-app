import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import AccountButtonModal from './Modals/AccountButtonModal';


//screen that's visible after logging in 
const HomeScreen = () => {

  const navigation = useNavigation(); 
  const goToPlannerPage = () => {
    navigation.navigate('Planner'); 
    setAccountModalVisible(false);
  };
  
  //to handle AccountButtonModal
  const [accountModalVisible, setAccountModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      
      {/* toolbar with app logo, and account button */}
      <View style={styles.toolbar}>
        <Text style={[styles.text, {fontSize:24, fontFamily:'Ubuntu-Bold'}]}>
          PlaNUS
        </Text>
        {/* account button */}
        <TouchableOpacity onPress={() =>setAccountModalVisible(true)}>
          <FontAwesome5 name='user-circle' size={30} color='#003882'/>
        </TouchableOpacity>
      </View>

      <Text style={[styles.text, {fontSize:45, marginTop:350, color:'black'}]}>
        What's up?
      </Text>

      <TouchableOpacity
        style={[styles.buttonContainer, {marginTop: 55}]}
        // underlayColor={'#003882'}
        // activeOpacity={0.5}
        onPress={goToPlannerPage}>
        <Text style={[styles.text, {color:'white'}]}>Your Schedule</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonContainer}
        // underlayColor={'#003882'}
        // activeOpacity={0.5}
        onPress={() => {}}>
        <Text style={[styles.text, {color:'white'}]}>Future Semester Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonContainer}
        // underlayColor={'#003882'}
        // activeOpacity={0.5}
        onPress={() => navigation.navigate('EisenhowerMatrix')}>
        <Text style={[styles.text, {color:'white'}]}>Prioritize Your Task</Text>
      </TouchableOpacity>

      {/* account button modal is activated upon pressing account button */}
      <AccountButtonModal
        modalVisible={accountModalVisible} 
        setModalVisible={setAccountModalVisible} />
    </View>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems:'center',
    // justifyContent:'center',
  },
  text: {
    color:'#003882', 
    fontSize:18,
    fontFamily:'Ubuntu-Medium',
  },
  toolbar: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    backgroundColor: 'white',
    position: 'absolute',
    top: 30,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    width:'75%',
    backgroundColor:'#003882',
    marginTop:15,
    padding:18,
    borderRadius:25,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    
  },
});