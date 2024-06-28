import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SectionList, ScrollView, StatusBar, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { generateMonthDays } from './Utils/generateMonthDays';

const PlannerPage = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [viewType, setViewType] = useState('list');
  const [addEventModalVisible, setAddEventModalVisible] = useState(false);

  useEffect(() => {
    setDays(generateMonthDays(selectedDate.getMonth(), selectedDate.getFullYear()));
  }, [selectedDate]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const changeMonth = (month) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), month));
    setShowDropdown(false);
  };

  const formattedDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-GB', options);
  };

  const events = days.map((day) => {
    const date = new Date(day);
    if (date.getDate() === 26 && date.getMonth() === 5) {
      return {
        title: formattedDate(day),
        data: [
          { event: 'CS1231S Lecture', time: '14:00 - 16:00', location: 'E-Learning', type: 'event' },
          { event: 'MA1521 Assignment 1', time: '23:59', type: 'task' }
        ],
      };
    }
    if (date.getDate() === 27 && date.getMonth() === 5) {
      return {
        title: formattedDate(day),
        data: [
          { event: 'CS1231S Lecture', time: '14:00 - 16:00', location: 'E-Learning', type: 'event' },
          { event: 'MA1521 Assignment 1', time: '23:59', type: 'task' }
        ],
      };
    }
    return {
      title: formattedDate(day),
      data: [],
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{selectedDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</Text>
        <TouchableOpacity onPress={toggleDropdown} style={styles.iconButton}>
          <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAddEventModalVisible(true)} style={styles.iconButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {showDropdown && (
        <View style={styles.dropdown}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('CalendarGrid')}>
              <Text style={[styles.toggleText, viewType === 'grid' && styles.selectedToggleText]}>GRID</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewType('list')}>
              <Text style={[styles.toggleText, viewType === 'list' && styles.selectedToggleText]}>LIST</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
              <TouchableOpacity key={month} onPress={() => changeMonth(index)}>
                <Text style={styles.monthText}>{month}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <SectionList
        sections={events}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <View style={styles.verticalLine} />
            <View style={item.type === 'event' ? styles.eventItem : styles.taskItem}>
              <View style={styles.eventTextContainer}>
                <Text style={styles.eventText}>{item.event}</Text>
                {item.location && <Text style={styles.locationText}>{item.location}</Text>}
              </View>
              <Text style={styles.eventTime}>{item.time}</Text>
            </View>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        style={styles.list}
      />

      <Modal
        visible={addEventModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAddEventModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setAddEventModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('AddTaskEventScreen', { isTaskInitial: true })} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>TASK</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AddTaskEventScreen', { isTaskInitial: false })} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>EVENT</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PlannerPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#003882',
    height: 70, // Adjusted height
  },
  title: {
    color: 'white',
    fontFamily: 'Ubuntu-Bold',
    fontSize: 20,
    marginRight: 60, // Adjusted margin
  },
  iconButton: {
    padding: 5,
    marginRight: 1,
    marginLeft: 1,
  },
  dropdown: {
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  monthText: {
    marginHorizontal: 5,
    padding: 5,
    borderRadius: 12,
    backgroundColor: 'white',
    borderColor: '#003882',
    borderWidth: 1,
    fontFamily: 'Ubuntu-Medium',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  toggleText: {
    fontSize: 20,
    color: 'black',
    marginHorizontal: 20,
    fontFamily: 'Ubuntu-Medium',
  },
  selectedToggleText: {
    fontWeight: 'bold',
    fontFamily: 'Ubuntu-Medium',
  },
  list: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    fontSize: 20,
    backgroundColor: 'white',
    padding: 10,
    color: '#003882',
    fontFamily: 'Ubuntu-Medium',
  },
  eventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  verticalLine: {
    width: 2,
    backgroundColor: '#003882',
    alignSelf: 'stretch',
    marginRight: 10,
    marginLeft: 6,
  },
  eventItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 15,
    marginVertical: 5,
  },
  taskItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffe0b2',
    borderRadius: 15,
    marginVertical: 5,
  },
  eventTextContainer: {
    flex: 1,
  },
  eventText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Ubuntu-Medium',
  },
  locationText: {
    fontSize: 12,
    color: 'grey',
    fontFamily: 'Ubuntu-Medium',
  },
  eventTime: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Ubuntu-Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 56, 130, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalOption: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#003882',
    fontFamily: 'Ubuntu-Medium',
  },
});