import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5 for the user circle icon
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../firebase'; // adjust the path as needed
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AccountButtonModal from '../Home/Modals/AccountButtonModal'; // Import the AccountButtonModal

const EisenhowerMatrix = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const [tasks, setTasks] = useState({
    urgentImportant: '',
    notUrgentImportant: '',
    urgentNotImportant: '',
    notUrgentNotImportant: '',
  });
  const [accountModalVisible, setAccountModalVisible] = useState(false); // State for account modal visibility

  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        const docRef = doc(db, 'users', user.uid, 'eisenhowerTasks', 'tasks');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTasks(docSnap.data());
        }
      };

      fetchTasks();
    }
  }, [user]);

  const handleTaskChange = (type, value) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [type]: value,
    }));
  };

  const saveTasks = async () => {
    if (user) {
      const docRef = doc(db, 'users', user.uid, 'eisenhowerTasks', 'tasks');
      await setDoc(docRef, tasks);
    }
  };

  useEffect(() => {
    const saveOnExit = navigation.addListener('blur', saveTasks);
    return saveOnExit;
  }, [navigation, tasks, user]);

  // Save tasks when the component is unmounted
  useEffect(() => {
    return () => {
      saveTasks();
    };
  }, [tasks, user]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Prioritize My Tasks</Text>
        <TouchableOpacity onPress={() => setAccountModalVisible(true)} style={styles.iconButton}>
          <FontAwesome5 name='user-circle' size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.labelsContainer}>
        <Text style={[styles.horizontalLabel, { left: '25%' }]}>Urgent</Text>
        <Text style={[styles.horizontalLabel, { right: '25%' }]}>Not Urgent</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.matrixContainer}>
          <View style={styles.verticalLabels}>
            <Text style={[styles.verticalLabel, { top: '33%' }]}>Important</Text>
            <Text style={[styles.verticalLabel, { bottom: '10%' }]}>Not Important</Text>
          </View>
          <View style={styles.quadrantsContainer}>
            <View style={styles.quadrantRow}>
              <View style={[styles.quadrant, styles.urgentImportant]}>
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder="Add tasks"
                  value={tasks.urgentImportant}
                  onChangeText={(value) => handleTaskChange('urgentImportant', value)}
                  onBlur={saveTasks}
                />
              </View>
              <View style={[styles.quadrant, styles.notUrgentImportant]}>
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder="Add tasks"
                  value={tasks.notUrgentImportant}
                  onChangeText={(value) => handleTaskChange('notUrgentImportant', value)}
                  onBlur={saveTasks}
                />
              </View>
            </View>
            <View style={styles.quadrantRow}>
              <View style={[styles.quadrant, styles.urgentNotImportant]}>
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder="Add tasks"
                  value={tasks.urgentNotImportant}
                  onChangeText={(value) => handleTaskChange('urgentNotImportant', value)}
                  onBlur={saveTasks}
                />
              </View>
              <View style={[styles.quadrant, styles.notUrgentNotImportant]}>
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder="Add tasks"
                  value={tasks.notUrgentNotImportant}
                  onChangeText={(value) => handleTaskChange('notUrgentNotImportant', value)}
                  onBlur={saveTasks}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <AccountButtonModal
        modalVisible={accountModalVisible} 
        setModalVisible={setAccountModalVisible} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    marginTop: 47,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#003882',
    height: 70,
  },
  title: {
    color: 'white',
    fontFamily: 'Ubuntu-Bold',
    fontSize: 25,
    marginRight: 60,
  },
  iconButton: {
    padding: 5,
    marginRight: 1,
    marginLeft: 1,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 10,
    marginLeft: 35,
    marginRight: 20,
    marginTop: 40,
  },
  horizontalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003882',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  matrixContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  verticalLabels: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    position: 'absolute',
    left: -40,
    marginTop: -80,
    height: '100%',
  },
  verticalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003882',
    transform: [{ rotate: '270deg' }],
  },
  quadrantsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginLeft: 10,
  },
  quadrantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quadrant: {
    flex: 1,
    height: 350,
    margin: 10,
    borderRadius: 15,
    padding: 10,
  },
  urgentImportant: {
    backgroundColor: '#FFCBC1',
  },
  notUrgentImportant: {
    backgroundColor: '#ACE7FF',
  },
  urgentNotImportant: {
    backgroundColor: '#F5FAC1',
  },
  notUrgentNotImportant: {
    backgroundColor: '#C7F6D4',
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
  },
});

export default EisenhowerMatrix;
