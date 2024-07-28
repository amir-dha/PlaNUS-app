import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

const colorOptions = ['#C8D79E', '#FFFBCB', '#FFC498', '#F8A5A5', '#A7A0C3', '#BEEEEC'];

const EditCourseSlotScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { courseData } = route.params;

  const [course, setCourse] = useState(courseData);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(course.color || '#e2e2e2');
  const [pendingColor, setPendingColor] = useState(course.color || '#e2e2e2');

  useEffect(() => {
    if (!course) {
      navigation.goBack();
    }
  }, [course, navigation]);

  const handleDeleteSlot = async () => {
    Alert.alert(
      "Delete Slot",
      `Are you sure you want to delete this slot?`,
      [
        {
          text: "No",
          onPress: () => console.log("Deletion canceled"),
        },
        {
          text: "Yes",
          onPress: async () => {
            setLoading(true);
            try {
              const user = auth.currentUser;
              const userDocRef = doc(db, 'users', user.uid);
              const slotDocRef = doc(userDocRef, 'courses', course.id);

              await deleteDoc(slotDocRef);

              setLoading(false);
              Alert.alert("Success", "Slot deleted successfully.");
              navigation.goBack();
            } catch (error) {
              setLoading(false);
              console.error("Error deleting slot: ", error);
              Alert.alert("Error", "There was an error deleting the slot. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleDeleteAllSlots = async () => {
    Alert.alert(
      "Delete Course",
      `Are you sure you want to delete this course?`,
      [
        {
          text: "No",
          onPress: () => console.log("Deletion canceled"),
        },
        {
          text: "Yes",
          onPress: async () => {
            setLoading(true);
            try {
              const user = auth.currentUser;
              const userDocRef = doc(db, 'users', user.uid);
              const coursesCollectionRef = collection(userDocRef, 'courses');

              const querySnapshot = await getDocs(coursesCollectionRef);
              const deletePromises = [];

              querySnapshot.forEach((doc) => {
                const docData = doc.data();
                if (docData.courseId === course.courseId) { // Use courseId to filter slots
                  deletePromises.push(deleteDoc(doc.ref));
                }
              });

              await Promise.all(deletePromises);

              setLoading(false);
              Alert.alert("Success", "Course deleted successfully.");
              navigation.goBack();
            } catch (error) {
              setLoading(false);
              console.error("Error deleting course: ", error);
              Alert.alert("Error", "There was an error deleting the course. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleColorSelect = async (color) => {
    setPendingColor(color);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      const userDocRef = doc(db, 'users', user.uid);
      const coursesCollectionRef = collection(userDocRef, 'courses');

      const querySnapshot = await getDocs(coursesCollectionRef);
      const updatePromises = [];

      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        if (docData.courseId === course.courseId) { // Use courseId to filter slots
          updatePromises.push(updateDoc(doc.ref, { color: pendingColor }));
        }
      });

      await Promise.all(updatePromises);

      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error("Error updating course color: ", error);
      Alert.alert("Error", "There was an error updating the course color. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#003882" />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={handleSave}>
              <Text style={styles.backButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <View style={styles.slotDetails}>
            <Text style={styles.detailText}>From: {new Date(course.startTime).toLocaleString()}</Text>
            <Text style={styles.detailText}>Until: {new Date(course.endTime).toLocaleString()}</Text>
            <Text style={styles.detailText}>Location: {course.location}</Text>
            {course.day && <Text style={styles.detailText}>Day: {course.day}</Text>}
          </View>
          <View style={styles.colorSection}>
            <Text style={styles.colorText}>Colour</Text>
            <View style={[styles.selectedColor, { backgroundColor: pendingColor }]} />
          </View>
          <View style={styles.colorOptionsContainer}>
            {colorOptions.map((color, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleColorSelect(color)}
                style={[styles.colorOption, { backgroundColor: color }]}
              />
            ))}
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSlot}>
              <Text style={styles.deleteButtonText}>Delete This Slot</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAllSlots}>
              <Text style={[styles.deleteButtonText, { marginBottom: 0 }]}>Delete Course</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#003882',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
    marginLeft: 10,
    marginTop: 30,
  },
  backButtonText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Ubuntu-Bold',
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Ubuntu-Bold',
    marginBottom: 20,
    marginTop: 5,
  },
  slotDetails: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Regular',
    marginBottom: 5,
    color: '#7e7e7e',
  },
  deleteButton: {
    backgroundColor: '#003882',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Ubuntu-Medium',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  colorSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorText: {
    fontSize: 20,
    color: '#003882',
    fontFamily: 'Ubuntu-Medium',
    marginVertical: 10,
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  selectedColor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditCourseSlotScreen;

