import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SectionList, ScrollView, StatusBar, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from '../../firebase';
import AccountButtonModal from '../Home/Modals/AccountButtonModal';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const PlannerPage = () => {
  const navigation = useNavigation();
  const LIST_ITEM_HEIGHT = 40;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); 
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showDropdown, setShowDropdown] = useState(false);
  const [viewType, setViewType] = useState('List');
  const [addEventModalVisible, setAddEventModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false); 
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const tasksQuery = query(collection(db, "tasks"), where("userId", "==", user.uid), orderBy("startTime"));
    const eventsQuery = query(collection(db, "events"), where("userId", "==", user.uid), orderBy("startTime"));

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      if (!snapshot.empty) {
        const tasksData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'task' }));
        setTasks(tasksData);
      } else {
        setTasks([]);
      }
    });

    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const eventsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'event' }));
        setEvents(eventsData);
      } else {
        setEvents([]);
      }
    });

    return () => {
      unsubscribeTasks();
      unsubscribeEvents();
    };
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const dataByDate = {};
    const combinedData = [...tasks, ...events];

    combinedData.forEach(item => {
      const dateKey = new Date(item.date).toDateString();
      if (!dataByDate[dateKey]) {
        dataByDate[dateKey] = [];
      }
      dataByDate[dateKey].push(item);
    });

    const allDays = [];
    const date = new Date(selectedYear, selectedMonth, 1);
    while (date.getMonth() === selectedMonth) {
      allDays.push(new Date(date).toDateString());
      date.setDate(date.getDate() + 1);
    }

    const sections = allDays.map(dateKey => ({
      title: new Date(dateKey).toDateString(),
      data: (dataByDate[dateKey] || []).sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    }));

    setDays(sections);
  }, [tasks, events, selectedMonth, selectedYear]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const changeMonth = (month) => {
    setSelectedMonth(month);
  };

  const displayGrid = () => {
    setViewType('Grid'); 
  };
  const displayList = () => {
    setViewType('List');
  };

  const listViewRef = useRef(null);

  const handleDatePress = (day) => {
    const newDate = new Date(selectedYear, selectedMonth, day);
    setSelectedDate(newDate);
    setViewType('List'); 

    const dateIndex = days.findIndex(d => new Date(d.title).getDate() === day); 
    setTimeout(() => {
      if (listViewRef.current && dateIndex !== -1) {
        listViewRef.current.scrollToLocation({
          sectionIndex: dateIndex,
          itemIndex: 0,
          animated: true,
        });
      }
    }, 100);
  };

  const warningColor = (endTime) => {
    let color = '';
    const currentTime = new Date();
    const taskEndTime = new Date(endTime);

    const diffInMilliseconds = taskEndTime - currentTime;
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    if (diffInHours <= 0) {
      color = 'black';
    } else if (diffInHours > 0 && diffInHours <= 24) {
      color = 'red';
    } else if (diffInHours > 24 && diffInHours <= 72) {
      color = '#ff5b00';
    } else {
      color = 'green';
    }

    return color;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskEventButton}
      onPress={() => handleEventPress(item)}
    >
      <View style={styles.eventContainer}>
        <View style={styles.verticalLine} />
        <View style={[item.type === 'event' ? styles.eventItem : styles.taskItem, { backgroundColor: item.color }]}>
          <View style={styles.eventTextContainer}>
            {item.isTask ? (
              <View style={styles.taskEventBlockContainer}>
                <FontAwesome name='circle' size={15} color={warningColor(item.endTime)} style={styles.taskIcon} />
                <Text style={styles.eventText}>{item.title}</Text>
              </View>
            ) : (
              <Text style={styles.eventText}>{item.title}</Text>
            )}
            {item.location && <Text style={styles.locationText}>{item.location}</Text>}
          </View>
          <Text style={styles.eventTime}>
            {item.isTask 
              ? item.isAllDay ? '' : `${new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : `${new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            }
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDay = ({ item }) => (
    <TouchableOpacity style={styles.dayContainer} onPress={() => handleDatePress(item.day)} disabled={!item.day}>
      <Text>{item.day}</Text>
      {item.tasks && item.tasks.map((task, index) => (
        <View key={index} style={[styles.task, { backgroundColor: task.color }]}>
          <Text style={styles.taskText}>{task.name}</Text>
        </View>
      ))}
    </TouchableOpacity>
  );

  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const daysArray = [
    ...Array.from({ length: firstDayOfMonth }, () => ({ day: null, tasks: [] })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      tasks: []
    }))
  ];

  const goToEvent = () => {
    setAddEventModalVisible(false); 
    navigation.navigate('AddTaskEventScreen', { isTaskInitial: false });
  };
  const goToTask = () => {
    setAddEventModalVisible(false); 
    navigation.navigate('AddTaskEventScreen', { isTaskInitial: true });
  };

  const handleEventPress = (event) => {
    navigation.navigate('AddTaskEventScreen', { 
      isTaskInitial: event.type === 'task', 
      eventData: event
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>{`${new Date(selectedYear, selectedMonth).toLocaleString('en-GB', { month: 'short' })} ${selectedYear}`}</Text>

        <TouchableOpacity onPress={toggleDropdown} style={styles.iconButton}>
          <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setAddEventModalVisible(true)} style={styles.iconButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setAccountModalVisible(true)} style={styles.iconButton}>
          <FontAwesome5 name='user-circle' size={24} color="white" />
        </TouchableOpacity>
      </View>

      {showDropdown && (
        <View style={styles.dropdown}>
          <View style={styles.navigationContainer}>
            <TouchableOpacity 
              onPress={displayGrid}
              style={[styles.navigationButton, viewType === 'Grid' && styles.selectedView]}
            >
              <Text style={styles.navigationText}>Grid</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={displayList}
              style={[styles.navigationButton, viewType === 'List' && styles.selectedView]}
            >
              <Text style={styles.navigationText}>List</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
              <TouchableOpacity 
                key={month} 
                onPress={() => changeMonth(index)}
                style={[styles.monthButton, selectedMonth === index && styles.selectedMonthButton]}
              >
                <Text style={[styles.monthText, selectedMonth === index && styles.selectedMonthButtonText]}>{month}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {viewType === 'List' ? (
        <SectionList
          ref={listViewRef}
          sections={days}
          keyExtractor={(item, index) => item.id || index.toString()}
          getItemLayout={(data, index) => (
            {length: LIST_ITEM_HEIGHT, offset: LIST_ITEM_HEIGHT * index, index}
          )}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise(resolve => setTimeout(resolve, 500)); 
            wait.then(() => {
              listViewRef.current?.scrollToLocation({
                sectionIndex: 0, 
                itemIndex: info.index, 
                animated: true});
            });
          }}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          style={styles.list}
        />
      ) : (
        <View style={styles.gridContainer}>
          <View style={styles.daysOfWeekContainer}>
            {daysOfWeek.map((day, index) => (
              <Text key={index} style={styles.dayOfWeekText}>{day}</Text>
            ))}
          </View>
          <FlatList
            data={daysArray}
            renderItem={renderDay}
            keyExtractor={(item, index) => index.toString()}
            numColumns={7}
          />
        </View>
      )}

      <Modal
        visible={addEventModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setAddEventModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setAddEventModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={goToTask} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>TASK</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToEvent} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>EVENT</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <AccountButtonModal
        modalVisible={accountModalVisible} 
        setModalVisible={setAccountModalVisible} 
      />
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
  dropdown: {
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  monthText: {
    fontFamily: 'Ubuntu-Medium',
  },
  monthButton: {
    marginHorizontal: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#003882',
    backgroundColor: 'white',
  },
  selectedMonthButton: {
    backgroundColor: 'rgba(0, 56, 130, 0.2)',
  },
  selectedMonthButtonText: {
    color: 'white',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderRadius: 5,
  },
  navigationButton: {
    width: '50%',
    backgroundColor: '#e2e2e2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e4e4e4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationText: {
    fontSize: 18,
    color: 'black',
    marginHorizontal: 20,
    fontFamily: 'Ubuntu-Medium',
  },
  selectedView: {
    backgroundColor: 'rgba(0, 56, 130, 0.2)',
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
    width:'100%',
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
    borderRadius: 30,
    marginVertical: 5,
    height:60,
  },
  taskItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginVertical: 5,
  },
  eventTextContainer: {
    flex: 1,
  },
  eventText: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Ubuntu-Medium',
  },
  locationText: {
    fontSize: 15,
    color: 'grey',
    fontFamily: 'Ubuntu-Medium',
  },
  eventTime: {
    fontSize: 14,
    color: 'black',
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
  dayContainer: {
    width: '14%',
    height: 100, 
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#e2e2e2',
    padding: 5,
    margin: 1,
  },
  task: {
    marginTop: 5,
    padding: 2,
    borderRadius: 5,
  },
  taskText: {
    fontSize: 10,
    fontFamily: 'Ubuntu-Regular',
    color: 'white',
  },
  gridContainer: {
    flexGrow: 1,
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  dayOfWeekText: {
    width: '14.28%', 
    textAlign: 'center',
    fontWeight: 'bold',
  },
  taskEventBlockContainer: {
    flexDirection: 'row',
    alignItems:'center',
  },
  taskIcon: {
    marginRight: 8,
  }
});
