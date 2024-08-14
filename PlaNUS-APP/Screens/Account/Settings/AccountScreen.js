import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';

const AccountScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');
  const [image, setImage] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Year 1', value: '1' },
    { label: 'Year 2', value: '2' },
    { label: 'Year 3', value: '3' },
    { label: 'Year 4', value: '4' },
    { label: 'Year 5', value: '5' },
  ]);
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const user = auth.currentUser;
  const [originalData, setOriginalData] = useState({});

  const supportEmail = "planusorbital24@gmail.com"; // Replace with your support email

  const fetchUserData = async () => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUsername(userData.username);
        setEmail(userData.email);
        setYear(userData.year);
        setImage(userData.image);
        setOriginalData(userData);
      } else {
        console.log("No such document!");
      }
    }
    setInitializing(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const source = result.assets[0].uri;
      setImage(source);
      uploadImage(source);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setImage(downloadURL);
      await setDoc(doc(db, 'users', user.uid), { image: downloadURL }, { merge: true });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateProfile(user, {
        displayName: username,
      });
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email: user.email,
        year,
        image,
      }, { merge: true });
      setOriginalData({ username, email: user.email, year, image });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setUsername(originalData.username);
    setEmail(originalData.email);
    setYear(originalData.year);
    setImage(originalData.image);
    navigation.goBack();
  };

  if (initializing) {
    return <Text>Loading...</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={handleImagePick}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="person-circle-outline" size={100} color="gray" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          editable={false} // Make email field read-only
        />
        <Text style={styles.label}>Year</Text>
        <DropDownPicker
          open={open}
          value={year}
          items={items}
          setOpen={setOpen}
          setValue={setYear}
          setItems={setItems}
          containerStyle={{ marginBottom: 20, width: '100%' }}
          style={styles.dropdown}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contactContainer}>
        <Text style={styles.contactText}>
          If you have any queries or wish to delete your account, please contact us at:
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL(`mailto:${supportEmail}`)}>
          <Text style={styles.contactEmail}>{supportEmail}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Ubuntu-Medium',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
    width: '100%',
  },
  dropdown: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, // Add margin at the bottom for spacing above contact text
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#003882',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Ubuntu-Medium',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Ubuntu-Medium',
  },
  cancelButtonText: {
    color: 'black',
    fontSize: 16,
  },
  contactContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  contactText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  contactEmail: {
    fontSize: 16,
    color: '#003882',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default AccountScreen;
