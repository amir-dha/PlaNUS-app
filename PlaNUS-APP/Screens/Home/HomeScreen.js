import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/core';
import React, { useState, useEffect } from 'react';
import AccountButtonModal from './Modals/AccountButtonModal';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// screen that's visible after logging in 
const HomeScreen = () => {

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const fetchUsername = async () => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username || '');
      }
    }
  };

  useEffect(() => {
    fetchUsername();
  }, [user, isFocused]);

  const goToPlannerPage = () => {
    navigation.navigate('Planner');
    setAccountModalVisible(false);
  };

  const goToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>

      {/* toolbar with app logo, and account button */}
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={goToHome}>
          <Text style={[styles.text, { fontSize: 24, fontFamily: 'Ubuntu-Bold' }]}>
            PlaNUS
          </Text>
        </TouchableOpacity>
        {/* account button */}
        <TouchableOpacity onPress={() => setAccountModalVisible(true)}>
          <FontAwesome5 name='user-circle' size={30} color='#003882' />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={[styles.text, { fontSize: 30, color: 'black', textAlign: 'center' }]}>
          {username ? `Hello ${username}!` : 'Hello!'}
        </Text>

        <Text style={[styles.text, { fontSize: 45, color: 'black' }]}>
          What's up?
        </Text>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={goToPlannerPage}>
          <Text style={[styles.text, { color: 'white' }]}>Your Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => { }}>
          <Text style={[styles.text, { color: 'white' }]}>Future Semester Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate('EisenhowerMatrix')}>
          <Text style={[styles.text, { color: 'white' }]}>Prioritize Your Task</Text>
        </TouchableOpacity>
      </View>

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
    alignItems: 'center',
  },
  text: {
    color: '#003882',
    fontSize: 18,
    fontFamily: 'Ubuntu-Medium',
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: 250,
    backgroundColor: '#003882',
    marginTop: 15,
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
