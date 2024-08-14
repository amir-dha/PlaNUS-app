import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchCourseData } from './Utils/NUSModsAPI';
import { db, auth } from '../../firebase';
import { addDoc, collection, doc } from 'firebase/firestore';

const CourseSelectScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [courseData, setCourseData] = useState(null);
  const [selectedLectureSlot, setSelectedLectureSlot] = useState(null);
  const [selectedTutorialSlot, setSelectedTutorialSlot] = useState(null);
  const [selectedLabSlot, setSelectedLabSlot] = useState(null);
  const [selectedSeminarSlot, setSelectedSeminarSlot] = useState(null);
  const [selectedRecitationSlot, setSelectedRecitationSlot] = useState(null);
  const [showLectureDropdown, setShowLectureDropdown] = useState(false);
  const [showTutorialDropdown, setShowTutorialDropdown] = useState(false);
  const [showLabDropdown, setShowLabDropdown] = useState(false);
  const [showSeminarDropdown, setShowSeminarDropdown] = useState(false);
  const [showRecitationDropdown, setShowRecitationDropdown] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#e2e2e2'); // default color for course border
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  const colorOptions = ['#C8D79E', '#FFFBCB', '#FFC498', '#F8A5A5', '#A7A0C3', '#BEEEEC'];

  const semesterStartDate = new Date('2024-08-12');
  const semesterEndDate = new Date('2024-11-15');

  useEffect(() => {
    if (searchQuery.length > 2) {
      fetchCourseData(searchQuery.toUpperCase()).then(data => {
        console.log('Fetched course data:', data); // Debugging: Log fetched course data
        setCourseData(data[0]);
      });
    } else {
      setCourseData(null);
    }
  }, [searchQuery]);

  const convert24HourTo12Hour = (time24) => {
    let hours24 = parseInt(time24.substring(0, 2));
    let minutes = time24.substring(2);

    let period = hours24 >= 12 ? 'PM' : 'AM';
    let hours12 = hours24 % 12 || 12; // Convert 0 to 12 for midnight

    return `${hours12}:${minutes} ${period}`;
  };

  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  const getDateForWeekAndDay = (week, dayString) => {
    const dayOfWeekMap = {
      'Sunday': 0,
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6
    };
    const dayOfWeek = dayOfWeekMap[dayString];

    const date = new Date(semesterStartDate);
    const firstDayOfWeek = semesterStartDate.getDate() - semesterStartDate.getDay() + dayOfWeek;

    date.setDate(firstDayOfWeek + (week - 1) * 7);

    return date;
  };

  const calculateDatesForSlot = (slotData, type, courseCode, color) => {
    const events = [];

    slotData.weeks.forEach(week => {
      const date = getDateForWeekAndDay(week, slotData.day);

      const startTimeString = slotData.startTime.padStart(4, '0');
      const endTimeString = slotData.endTime.padStart(4, '0');

      const startHour = parseInt(startTimeString.substring(0, 2));
      const startMinute = parseInt(startTimeString.substring(2));
      const endHour = parseInt(endTimeString.substring(0, 2));
      const endMinute = parseInt(endTimeString.substring(2));

      const start = new Date(date);
      start.setHours(startHour, startMinute);

      if (!isValidDate(start) || start < semesterStartDate || start > semesterEndDate) {
        console.error("Invalid or out-of-range start date:", start);
        return;
      }

      const end = new Date(start);
      end.setHours(endHour, endMinute);

      if (!isValidDate(end)) {
        console.error("Invalid end date:", end);
        return;
      }

      events.push({
        title: `${courseCode} ${type}`,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        location: slotData.venue,
        color: color // Use selected color
      });
    });

    return events;
  };

  const handleAddCourse = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const requiredSlots = {
      lectureSlots: selectedLectureSlot,
      tutorialSlots: selectedTutorialSlot,
      labSlots: selectedLabSlot,
      seminarSlots: selectedSeminarSlot,
      recitationSlots: selectedRecitationSlot
    };

    for (const [slotType, selectedSlot] of Object.entries(requiredSlots)) {
      if (courseData[slotType]?.length > 0 && !selectedSlot) {
        Alert.alert('Error', 'Please select a slot for all required fields');
        return;
      }
    }

    const selectedSlots = [
      { type: 'Lecture', slot: selectedLectureSlot },
      { type: 'Tutorial', slot: selectedTutorialSlot },
      { type: 'Lab', slot: selectedLabSlot },
      { type: 'Seminar', slot: selectedSeminarSlot },
      { type: 'Recitation', slot: selectedRecitationSlot }
    ].filter(slot => slot.slot);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const coursesCollectionRef = collection(userDocRef, 'courses');
      const events = [];

      selectedSlots.forEach(selectedSlot => {
        const slotData = courseData[selectedSlot.type.toLowerCase() + 'Slots'].find(slot => slot.classNo === selectedSlot.slot);

        if (!slotData) {
          console.error(`No slot data found for ${selectedSlot.type} ${selectedSlot.slot}`);
          return;
        }

        events.push(...calculateDatesForSlot(slotData, selectedSlot.type, courseData.courseCode, selectedColor));
      });

      for (const event of events) {
        await addDoc(coursesCollectionRef, event);
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error adding course: ", error);
    }
  };
  

  const renderSlotDropdown = (slots, selectedSlot, setSelectedSlot, placeholder, showDropdown, setShowDropdown) => (
    <View>
      <Text style={styles.label}>{placeholder}</Text>
      <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={styles.input}>
        <Text>{selectedSlot ? selectedSlot : `Select ${placeholder}`}</Text>
      </TouchableOpacity>
      {showDropdown && (
        <ScrollView style={styles.dropdown}>
          {slots.map(slot => (
            <TouchableOpacity key={slot.classNo} onPress={() => { setSelectedSlot(slot.classNo); setShowDropdown(false); }}>
              <Text style={styles.dropdownItem}>{`${slot.classNo} (${slot.day} ${convert24HourTo12Hour(slot.startTime)} - ${convert24HourTo12Hour(slot.endTime)})`}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButtonContainer} onPress={() => navigation.goBack()}>
          <Text style={styles.headerButton}>Back</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a course (e.g. CS1101S)"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {courseData && (
        <ScrollView>
          <Text style={styles.courseTitle}>{courseData.courseCode}: {courseData.courseTitle}</Text>
          {renderSlotDropdown(courseData.lectureSlots, selectedLectureSlot, setSelectedLectureSlot, 'Lecture Slot', showLectureDropdown, setShowLectureDropdown)}
          {renderSlotDropdown(courseData.tutorialSlots, selectedTutorialSlot, setSelectedTutorialSlot, 'Tutorial Slot', showTutorialDropdown, setShowTutorialDropdown)}
          {renderSlotDropdown(courseData.labSlots, selectedLabSlot, setSelectedLabSlot, 'Lab Slot', showLabDropdown, setShowLabDropdown)}
          {renderSlotDropdown(courseData.seminarSlots, selectedSeminarSlot, setSelectedSeminarSlot, 'Seminar Slot', showSeminarDropdown, setShowSeminarDropdown)}
          {renderSlotDropdown(courseData.recitationSlots, selectedRecitationSlot, setSelectedRecitationSlot, 'Recitation Slot', showRecitationDropdown, setShowRecitationDropdown)}
          {courseData.examDate && (
            <View>
              <Text style={styles.label}>Exam Date</Text>
              <Text>{new Date(courseData.examDate).toLocaleDateString()} at {new Date(courseData.examDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} for {courseData.examDuration} minutes</Text>
            </View>
          )}
          <View style={styles.colorSection}>
            <Text style={styles.colorText}>Colour</Text>
            <View style={[styles.selectedColor, { backgroundColor: selectedColor }]} />
          </View>
          <View style={styles.colorOptionsContainer}>
            {colorOptions.map((color, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedColor(color)}
                style={[styles.colorOption, { backgroundColor: color }]}
              />
            ))}
          </View>
          <TouchableOpacity onPress={handleAddCourse} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Course</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerButtonContainer: {
    backgroundColor: '#003882',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  headerButton: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'Ubuntu-Bold',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: 'Ubuntu-Regular',
  },
  courseTitle: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Regular',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 5,
    justifyContent: 'center',
    fontFamily: 'Ubuntu-Regular',
  },
  dropdown: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    fontFamily: 'Ubuntu-Regular',
  },
  addButton: {
    backgroundColor: '#003882',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Ubuntu-Regular',
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
});

export default CourseSelectScreen;

