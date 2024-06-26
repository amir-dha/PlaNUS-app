// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Modal, Button } from 'react-native';

// const AddTaskEventScreen = () => {
//   const [isAllDay, setIsAllDay] = useState(false);
//   const [repeatModalVisible, setRepeatModalVisible] = useState(false);
//   const [details, setDetails] = useState('');

//   const handleToggleSwitch = () => setIsAllDay(previousState => !previousState);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity>
//           <Text style={styles.headerButton}>Discard</Text>
//         </TouchableOpacity>
//         <TouchableOpacity>
//           <Text style={styles.headerButton}>Save</Text>
//         </TouchableOpacity>
//       </View>
//       <TextInput
//         style={styles.titleInput}
//         placeholder="Add Title"
//       />
//       <View style={styles.toggleContainer}>
//         <TouchableOpacity style={[styles.toggleButton, styles.selectedToggleButton]}>
//           <Text style={[styles.toggleText, styles.selectedToggleText]}>Task</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.toggleButton}>
//           <Text style={styles.toggleText}>Event</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.divider} />
//       <View style={styles.switchContainer}>
//         <Text style={styles.label}>All Day</Text>
//         <Switch
//           trackColor={{ false: "#767577", true: "#003882" }}
//           thumbColor={isAllDay ? "#f4f3f4" : "#f4f3f4"}
//           ios_backgroundColor="#3e3e3e"
//           onValueChange={handleToggleSwitch}
//           value={isAllDay}
//         />
//       </View>
//       <View style={styles.dateTimeContainer}>
//         <Text style={styles.label}>Due Date</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Sunday, 25 May 2024"
//         />
//         {!isAllDay && (
//           <TextInput
//             style={styles.input}
//             placeholder="23:59"
//           />
//         )}
//       </View>
//       <TouchableOpacity onPress={() => setRepeatModalVisible(true)}>
//         <Text style={styles.repeatText}>Does not repeat</Text>
//       </TouchableOpacity>
//       <TextInput
//         style={styles.detailsInput}
//         placeholder="Add details"
//         value={details}
//         onChangeText={setDetails}
//       />
//       <Modal
//         visible={repeatModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setRepeatModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Button title="Does not repeat" onPress={() => setRepeatModalVisible(false)} />
//             <Button title="Every day" onPress={() => setRepeatModalVisible(false)} />
//             <Button title="Every week" onPress={() => setRepeatModalVisible(false)} />
//             <Button title="Every month" onPress={() => setRepeatModalVisible(false)} />
//             <Button title="Every year" onPress={() => setRepeatModalVisible(false)} />
//             <Button title="Custom..." onPress={() => setRepeatModalVisible(false)} />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     paddingHorizontal: 20,
//     paddingTop: 40,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'centre',
//   },
//   headerButton: {
//     fontSize: 18,
//     color: '#003882',
//     fontFamily: 'Ubuntu-Bold',
//   },
//   titleInput: {
//     fontSize: 30,
//     color: '#003882',
//     fontFamily: 'Ubuntu-Medium',
//     marginTop: 20,
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'left',
//     alignItems: 'center',
//     marginTop: 10,
//     borderRadius: 25,
//   },
//   toggleButton: {
//     width: 60,
//     paddingVertical: 7,
//     backgroundColor: 'white',
//     borderColor: '#003882',
//     borderWidth: 1,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   selectedToggleButton: {
//     backgroundColor: 'rgba(0, 56, 130, 0.40)',
//   },
//   toggleText: {
//     color: '#003882',
//     fontSize: 15,
//     fontFamily: 'Ubuntu-Medium',
//   },
//   selectedToggleText: {
//     fontWeight: '500',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#e0e0e0',
//     marginVertical: 15,
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 5,
//     marginBottom: 5,
//   },
//   label: {
//     fontSize: 20,
//     color: '#003882',
//     fontFamily: 'Ubuntu-Medium',
//     marginBottom: 5,
//   },
//   dateTimeContainer: {
//     marginVertical: 20,
//   },
//   input: {
//     fontSize: 20,
//     color: '#003882',
//     fontFamily: 'Ubuntu-Medium',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//     marginBottom: 15,
//   },
//   repeatText: {
//     fontSize: 20,
//     color: '#003882',
//     fontFamily: 'Ubuntu-Medium',
//     marginVertical: 10,
//   },
//   detailsInput: {
//     fontSize: 20,
//     color: '#003882',
//     fontFamily: 'Ubuntu-Medium',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//     marginTop: 20,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 56, 130, 0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//   },
// });

// export default AddTaskEventScreen;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Modal, Button, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddTaskEventScreen = () => {
  const [isTask, setIsTask] = useState(true);
  const [isAllDay, setIsAllDay] = useState(false);
  const [repeatModalVisible, setRepeatModalVisible] = useState(false);
  const [details, setDetails] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [repeatOption, setRepeatOption] = useState('Does not repeat');

  const handleToggleSwitch = () => setIsAllDay(previousState => !previousState);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const handleRepeatOption = (option) => {
    setRepeatOption(option);
    setRepeatModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButtonContainer}>
          <Text style={styles.headerButton}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButtonContainer}>
          <Text style={styles.headerButton}>Save</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.titleInput}
        placeholder="Add Title"
      />
      <View style={styles.toggleContainer}>
        <TouchableOpacity style={[styles.toggleButton, isTask && styles.selectedToggleButton]} onPress={() => setIsTask(true)}>
          <Text style={[styles.toggleText, isTask && styles.selectedToggleText]}>Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleButton, !isTask && styles.selectedToggleButton]} onPress={() => setIsTask(false)}>
          <Text style={[styles.toggleText, !isTask && styles.selectedToggleText]}>Event</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
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
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.input}>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        {!isAllDay && (
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Text style={styles.input}>{time.toLocaleTimeString()}</Text>
          </TouchableOpacity>
        )}
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
      </View>
      <TouchableOpacity onPress={() => setRepeatModalVisible(true)}>
        <Text style={styles.repeatText}>{repeatOption}</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.detailsInput}
        placeholder="Add details"
        value={details}
        onChangeText={setDetails}
      />
      <Modal
        visible={repeatModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRepeatModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <TouchableOpacity onPress={() => handleRepeatOption('Does not repeat')} style={styles.modalOption}>
                <Text style={styles.modalOptionText}>Does not repeat</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRepeatOption('Every day')} style={styles.modalOption}>
                <Text style={styles.modalOptionText}>Every day</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRepeatOption('Every week')} style={styles.modalOption}>
                <Text style={styles.modalOptionText}>Every week</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRepeatOption('Every month')} style={styles.modalOption}>
                <Text style={styles.modalOptionText}>Every month</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRepeatOption('Every year')} style={styles.modalOption}>
                <Text style={styles.modalOptionText}>Every year</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRepeatOption('Custom...')} style={styles.modalOption}>
                <Text style={styles.modalOptionText}>Custom...</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    fontSize: 18,
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
    marginVertical: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    fontSize: 20,
    color: '#003882',
    fontFamily: 'Ubuntu-Medium',
  },
  dateTimeContainer: {
    marginVertical: 20,
  },
  input: {
    fontSize: 20,
    color: '#003882',
    fontFamily: 'Ubuntu-Medium',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 15,
  },
  repeatText: {
    fontSize: 20,
    color: '#003882',
    fontFamily: 'Ubuntu-Medium',
    marginVertical: 10,
  },
  detailsInput: {
    fontSize: 20,
    color: '#003882',
    fontFamily: 'Ubuntu-Medium',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 20,
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

export default AddTaskEventScreen;

