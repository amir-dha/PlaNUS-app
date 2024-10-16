
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import RepeatModal from './Calendar Modals/RepeatModal';
import NotificationModal from './Calendar Modals/NotificationModal';
import venuesList from './Utils/venuesList';
import { addDoc, collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTaskEventScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { isTaskInitial, eventData } = route.params;

  const [isTask, setIsTask] = useState(isTaskInitial);
  const [isAllDay, setIsAllDay] = useState(eventData ? eventData.isAllDay : false);
  const [repeatModalVisible, setRepeatModalVisible] = useState(false);
  const [title, setTitle] = useState(eventData ? eventData.title : '');
  const [details, setDetails] = useState(eventData ? eventData.details : '');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [startDate, setStartDate] = useState(eventData ? new Date(eventData.startTime) : new Date());
  const [endDate, setEndDate] = useState(eventData ? new Date(eventData.endTime) : new Date());
  const [startTime, setStartTime] = useState(eventData ? new Date(eventData.startTime) : new Date());
  const [endTime, setEndTime] = useState(eventData ? new Date(eventData.endTime) : new Date());
  const [repeatOption, setRepeatOption] = useState(eventData ? eventData.repeatOption : 'Does not repeat');
  const [notifications, setNotifications] = useState(eventData ? eventData.notifications : []);
  const [notificationOptionsVisible, setNotificationOptionsVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(eventData ? eventData.color : '#d1c4e9');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [location, setLocation] = useState(eventData ? eventData.location : '');

  const handleToggleSwitch = () => setIsAllDay(previousState => !previousState);

  useEffect(() => {
    setVenues(venuesList);
  }, []);

  //ios changes for notifications dont seem to work 
  // useEffect(() => {
  //   registerForPushNotificationsAsync(); 
  // })

  // const registerForPushNotificationsAsync = async () => {
  //   let token;
  //   const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;

  //   if (existingStatus !== 'granted') {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     finalStatus = status;
  //   }

  //   if (finalStatus !== 'granted') {
  //     Alert.alert('Failed to get push token for push notification!');
  //     return;
  //   }

  //   token = (await Notifications.getExpoPushTokenAsync()).data;
  //   console.log("Notification Token:", token);

  //   // Save the token to your server or use it to send notifications
  // };

  const filterVenues = (input) => {
    if (input.length > 0) {
      const filtered = venues.filter(venue => venue.toLowerCase().startsWith(input.toLowerCase()));
      setFilteredVenues(filtered);
    } else {
      setFilteredVenues([]);
    }
  };

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
    if (isTask) {
      setEndDate(currentDate);
    }
    if (isAllDay) {
      const newEndDate = new Date(currentDate);
      newEndDate.setHours(23, 59, 59, 999);
      setEndTime(newEndDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const onStartTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentTime);
    if (isAllDay) {
      const newEndDate = new Date(startDate);
      newEndDate.setHours(23, 59, 59, 999);
      setEndTime(newEndDate);
    }
  };

  const onEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentTime);
  };

  const handleRepeatOption = (option) => {
    setRepeatOption(option);
    setRepeatModalVisible(false);
  };

  const addNotification = (notification) => {
    setNotifications([...notifications, notification]);
    setNotificationOptionsVisible(false);
  };

  const removeNotification = (index) => {
    const newNotifications = [...notifications];
    newNotifications.splice(index, 1);
    setNotifications(newNotifications);
  };

  const colorOptions = ['#C8D79E', '#FFFBCB', '#FFC498', '#F8A5A5', '#A7A0C3', '#BEEEEC'];

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setColorPickerVisible(false);
  };

  const handleDiscard = () => {
    navigation.goBack();
  };

  const handleLocationSelect = (venue) => {
    setLocation(venue);
    setFilteredVenues([]);
  };

  const cancelNotifications = async (docId) => {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const filteredNotifications = scheduledNotifications.filter(
      (notification) => notification.content.data.docId === docId
    );
    for (const notification of filteredNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  };

  const scheduleNotification = async (notificationTime, title, body, docId) => {
    const settings = await AsyncStorage.getItem('settings');
    const { notificationsEnabled } = JSON.parse(settings);
    
    if (!notificationsEnabled) {
      return; // Don't schedule notifications if they are disabled
    }
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: 'default',
        data: { docId: docId },
      },
      trigger: { date: notificationTime },
    });
  };

  const generateRepeatedEvents = (event, repeatOption) => {
    const events = [];
    const { startTime, endTime } = event;
    let currentStartTime = new Date(startTime);
    let currentEndTime = new Date(endTime);

    const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const addMonths = (date, months) => {
      const result = new Date(date);
      result.setMonth(result.getMonth() + months);
      return result;
    };

    const addYears = (date, years) => {
      const result = new Date(date);
      result.setFullYear(result.getFullYear() + years);
      return result;
    };

    // Start generating events from the next occurrence
    switch (repeatOption) {
      case 'Every day':
        currentStartTime = addDays(currentStartTime, 1);
        currentEndTime = addDays(currentEndTime, 1);
        break;
      case 'Every week':
        currentStartTime = addDays(currentStartTime, 7);
        currentEndTime = addDays(currentEndTime, 7);
        break;
      case 'Every month':
        currentStartTime = addMonths(currentStartTime, 1);
        currentEndTime = addMonths(currentEndTime, 1);
        break;
      case 'Every year':
        currentStartTime = addYears(currentStartTime, 1);
        currentEndTime = addYears(currentEndTime, 1);
        break;
      default:
        return events;
    }

    for (let i = 0; i < 49; i++) { // Limit to 49 repetitions to prevent infinite loops
      const newEvent = {
        ...event,
        startTime: new Date(currentStartTime).toISOString(),
        endTime: new Date(currentEndTime).toISOString()
      };

      events.push(newEvent);

      switch (repeatOption) {
        case 'Every day':
          currentStartTime = addDays(currentStartTime, 1);
          currentEndTime = addDays(currentEndTime, 1);
          break;
        case 'Every week':
          currentStartTime = addDays(currentStartTime, 7);
          currentEndTime = addDays(currentEndTime, 7);
          break;
        case 'Every month':
          currentStartTime = addMonths(currentStartTime, 1);
          currentEndTime = addMonths(currentEndTime, 1);
          break;
        case 'Every year':
          currentStartTime = addYears(currentStartTime, 1);
          currentEndTime = addYears(currentEndTime, 1);
          break;
        default:
          return events;
      }
    }

    return events;
  };

  const saveTaskEvent = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const startDateTime = new Date(startDate);
    if (!isAllDay) {
      startDateTime.setHours(startTime.getHours(), startTime.getMinutes());
    } else {
      startDateTime.setHours(0, 0, 0, 0);
    }

    const endDateTime = new Date(endDate);
    if (!isAllDay) {
      endDateTime.setHours(endTime.getHours(), endTime.getMinutes());
    } else {
      endDateTime.setHours(23, 59, 59, 999);
    }

    const eventDataToSave = {
      title: title,
      details: details,
      isTask: isTask,
      isAllDay: isAllDay,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      repeatOption: repeatOption,
      notifications: notifications,
      color: isTask ? '#e2e2e2' : selectedColor,
      location: location,
      date: startDateTime.toISOString(),
      userId: user.uid
    };

    console.log("Event data to save:", eventDataToSave);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      let docRef;
      if (eventData && eventData.id) {
        docRef = doc(collection(userDocRef, isTask ? "tasks" : "events"), eventData.id);
        await updateDoc(docRef, eventDataToSave);
      } else {
        docRef = await addDoc(collection(userDocRef, isTask ? "tasks" : "events"), eventDataToSave);
      }

      // Cancel previous notifications
      await cancelNotifications(eventData ? eventData.id : docRef.id);

      // Schedule notifications
      const notificationTitle = isTask ? `Task: ${title}` : `Event: ${title}`;
      const notificationBody = isTask
        ? `Due on ${endDateTime.toDateString()} at ${endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`
        : `Starts on ${startDateTime.toDateString()} at ${startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;

      if (isTask) {
        const urgentNotificationTime = new Date(endDateTime);
        urgentNotificationTime.setDate(urgentNotificationTime.getDate() - 1); // 24 hours before
        await scheduleNotification(urgentNotificationTime, notificationTitle, notificationBody, eventData ? eventData.id : docRef.id);
      }

      for (const notification of notifications) {
        let notificationTime;
        switch (notification) {
          case '30 minutes before':
            notificationTime = new Date(isTask ? endDateTime : startDateTime);
            notificationTime.setMinutes(notificationTime.getMinutes() - 30);
            break;
          case '5 minutes before':
            notificationTime = new Date(isTask ? endDateTime : startDateTime);
            notificationTime.setMinutes(notificationTime.getMinutes() - 5);
            break;
          case '10 minutes before':
            notificationTime = new Date(isTask ? endDateTime : startDateTime);
            notificationTime.setMinutes(notificationTime.getMinutes() - 10);
            break;
          case '1 hour before':
            notificationTime = new Date(isTask ? endDateTime : startDateTime);
            notificationTime.setHours(notificationTime.getHours() - 1);
            break;
          case '1 day before':
            notificationTime = new Date(isTask ? endDateTime : startDateTime);
            notificationTime.setDate(notificationTime.getDate() - 1);
            break;
          default:
            break;
        }
        await scheduleNotification(notificationTime, notificationTitle, notificationBody, eventData ? eventData.id : docRef.id);
      }

      // Generate and save repeated events/tasks
      const eventsToSave = generateRepeatedEvents(eventDataToSave, repeatOption);
      console.log("Generated repeated events:", eventsToSave);

      // Save each event as a separate document
      for (const event of eventsToSave) {
        await addDoc(collection(userDocRef, isTask ? "tasks" : "events"), event);
        console.log("Event saved:", event);
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error saving document: ", error);
    }
  };

  const handleDelete = async () => {
    if (eventData && eventData.id) {
      try {
        const user = auth.currentUser;
        const userDocRef = doc(db, 'users', user.uid);
        const docRef = doc(collection(userDocRef, isTask ? "tasks" : "events"), eventData.id);
        await deleteDoc(docRef);
        await cancelNotifications(eventData.id); // Cancel notifications when event/task is deleted
        navigation.goBack();
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    } else {
      Alert.alert("Error", "No event/task selected to delete.");
    }
  };

  const switchToTask = () => {
    setIsTask(true);
  };

  const switchToEvent = () => {
    setIsTask(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButtonContainer}
          onPress={handleDiscard}
        >
          <Text style={styles.headerButton}>Discard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButtonContainer}
          onPress={saveTaskEvent}
        >
          <Text style={styles.headerButton}>Save</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <TextInput
          style={styles.titleInput}
          placeholder="Add Title"
          value={title}
          onChangeText={setTitle}
        />
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isTask && styles.selectedToggleButton]}
            onPress={switchToTask}
          >
            <Text style={[styles.toggleText, isTask && styles.selectedToggleText]}>Task</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isTask && styles.selectedToggleButton]}
            onPress={switchToEvent}
          >
            <Text style={[styles.toggleText, !isTask && styles.selectedToggleText]}>Event</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        {isTask ? (
          <>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>All Day</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#003882" }}
                thumbColor={isAllDay ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={handleToggleSwitch}
                value={isAllDay}
              />
            </View>
            <View style={styles.dateTimeContainer}>
              <Text style={styles.label}>Due Date</Text>
              <View style={styles.dateTimeRow}>
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                  <Text style={styles.input}>{startDate.toDateString()}</Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onStartDateChange}
                  />
                )}
                {!isAllDay && (
                  <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                    <Text style={styles.input}>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </TouchableOpacity>
                )}
                {showEndTimePicker && (
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="default"
                    onChange={onEndTimeChange}
                  />
                )}
              </View>
            </View>
            <TouchableOpacity onPress={() => setRepeatModalVisible(true)}>
              <Text style={[styles.repeatText, styles.underline]}>{repeatOption}</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TextInput
              style={styles.detailsInput}
              placeholder="Add details"
              value={details}
              onChangeText={setDetails}
            />
          </>
        ) : (
          <>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>All Day</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#003882" }}
                thumbColor={isAllDay ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={handleToggleSwitch}
                value={isAllDay}
              />
            </View>
            <View style={styles.dateTimeContainer}>
              <Text style={styles.label}>Start Date</Text>
              <View style={styles.dateTimeRow}>
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                  <Text style={styles.input}>{startDate.toDateString()}</Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onStartDateChange}
                  />
                )}
                {!isAllDay && (
                  <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
                    <Text style={styles.input}>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </TouchableOpacity>
                )}
                {showStartTimePicker && (
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="default"
                    onChange={onStartTimeChange}
                  />
                )}
              </View>
              <Text style={styles.label}>End Date</Text>
              <View style={styles.dateTimeRow}>
                <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                  <Text style={styles.input}>{endDate.toDateString()}</Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={onEndDateChange}
                  />
                )}
                {!isAllDay && (
                  <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                    <Text style={styles.input}>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </TouchableOpacity>
                )}
                {showEndTimePicker && (
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="default"
                    onChange={onEndTimeChange}
                  />
                )}
              </View>
            </View>
            <TouchableOpacity onPress={() => setRepeatModalVisible(true)}>
              <Text style={[styles.repeatText, styles.underline]}>{repeatOption}</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TextInput
              style={styles.detailsInput}
              placeholder="Add Location"
              value={location}
              onChangeText={(text) => {
                setLocation(text);
                filterVenues(text);
              }}
            />
            {filteredVenues.length > 0 && (
              <View style={styles.dropdown}>
                {filteredVenues.map((venue, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleLocationSelect(venue)}
                    style={styles.dropdownItem}
                  >
                    <Text>{venue}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TextInput
              style={styles.detailsInput}
              placeholder="Add details"
              value={details}
              onChangeText={setDetails}
            />
            <View style={styles.divider} />
            <TouchableOpacity onPress={() => setNotificationOptionsVisible(true)}>
              <Text style={styles.notificationText}>Add Notification</Text>
            </TouchableOpacity>
            {notifications.map((notification, index) => (
              <View key={index} style={styles.notificationContainer}>
                <Text style={styles.notificationText}>{notification}</Text>
                <TouchableOpacity onPress={() => removeNotification(index)}>
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.colorSection}>
              <Text style={styles.colorText}>Colour</Text>
              <View style={[styles.selectedColor, { backgroundColor: selectedColor }]} />
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
          </>
        )}
      </ScrollView>
      {eventData && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
      <RepeatModal
        visible={repeatModalVisible}
        onClose={() => setRepeatModalVisible(false)}
        onSelect={handleRepeatOption}
      />
      <NotificationModal
        visible={notificationOptionsVisible}
        onClose={() => setNotificationOptionsVisible(false)}
        onAdd={addNotification}
      />
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
  },
  headerButton: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'Ubuntu-Bold',
  },
  titleInput: {
    fontSize: 30,
    color: '#003882',
    fontFamily: 'Ubuntu-Medium',
    marginTop: 20,
    borderBottomWidth: 0,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  toggleButton: {
    width: 80,
    paddingVertical: 7,
    backgroundColor: 'white',
    borderColor: '#003882',
    borderWidth: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedToggleButton: {
    backgroundColor: 'rgba(0, 56, 130, 0.40)',
  },
  toggleText: {
    color: '#003882',
    fontSize: 15,
    fontFamily: 'Ubuntu-Medium',
  },
  selectedToggleText: {
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    fontSize: 21,
    color: '#003882',
    fontFamily: 'Ubuntu-Medium',
  },
  dateTimeContainer: {
    marginVertical: 10,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    fontSize: 20,
    color: '#003882',
    fontFamily: 'Ubuntu-Medium',
  },
  repeatText: {
    fontSize: 21,
    color: '#003882',
    fontFamily: 'Ubuntu-Medium',
    marginVertical: 10,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  detailsInput: {
    fontSize: 20,
    color: '#003882',
    fontFamily: 'Ubuntu-Medium',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 10,
  },
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 20,
    color: '#003882',
    fontFamily: 'Ubuntu-Medium',
    marginVertical: 10,
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
  dropdown: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    maxHeight: 150,
    overflow: 'scroll',
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  deleteButton: {
    backgroundColor: '#003882',
    padding: 10,
    borderRadius: 20,
    borderColor:'#e2e2e2',
    borderWidth:3,
    alignItems: 'center',
    marginVertical: 50,
  },
  deleteButtonText: {
    color: 'white',
    fontFamily: 'Ubuntu-Medium',
    fontSize: 18,
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  taskIcon: {
    marginRight: 8,
  }
});

export default AddTaskEventScreen;


