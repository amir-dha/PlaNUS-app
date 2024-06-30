// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Modal } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// // const months = [
// //   'January', 'February', 'March', 'April', 'May', 'June',
// //   'July', 'August', 'September', 'October', 'November', 'December'
// // ];

// const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// const GridScreenModal = ({ visible, onClose }) => {

//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); 
//   const [selectedNavigation, setSelectedNavigation] = useState('Grid');
//   const navigation = useNavigation();

//   const handleMonthPress = (index) => {
//     setSelectedMonth(index);
//   };

//   const handleDatePress = (date) => {
//     navigation.navigate('List', { date });
//   };

//   const goToListView = () => {
//     navigation.navigate('List');
//     setSelectedNavigation('List');
//   };

//   const goToGridView = () => {
//     navigation.navigate('Grid');
//     setSelectedNavigation('Grid');
//   };

//   const renderDay = ({ item }) => (
//     <TouchableOpacity style={styles.dayContainer} onPress={() => handleDatePress(item.day)} disabled={!item.day}>
//       <Text>{item.day}</Text>
//       {item.tasks && item.tasks.map((task, index) => (
//         <View key={index} style={[styles.task, { backgroundColor: task.color }]}>
//           <Text style={styles.taskText}>{task.name}</Text>
//         </View>
//       ))}
//     </TouchableOpacity>
//   );

//   const firstDayOfMonth = new Date(2024, selectedMonth, 1).getDay();
//   const daysInMonth = new Date(2024, selectedMonth + 1, 0).getDate();
//   const daysArray = [
//     ...Array.from({ length: firstDayOfMonth }, () => ({ day: null, tasks: [] })),
//     ...Array.from({ length: daysInMonth }, (_, i) => ({
//       day: i + 1,
//       tasks: [] // Populate this with tasks for the specific day
//     }))
//   ];

//   return (
//     <Modal
//       visible={visible}
//       animationType='none'
//       onRequestClose={onClose}
//       transparent={false}
//     >
//       <View style={styles.modalContainer}>
//         {/* header containing month and other feature buttons
//         <View style={styles.header}>
//           <View style={styles.calendarHeader}>
//             <TouchableOpacity style={styles.backButton} onPress={onClose}>
//               <Ionicons name='chevron-back' size={24} color='white'/>
//             </TouchableOpacity>
//             <Text style={styles.selectedMonthText}>{months[selectedMonth]} {selectedYear}</Text>
//           </View>
//         </View> */}

//         {/* Grid and List buttons that direct to the named screen */}
//         {/* <View style={styles.navigtionButtonContainer}>
//           <TouchableOpacity 
//             onPress={goToGridView}
//             style={[
//               styles.navigationButton,
//               selectedNavigation === 'Grid' && styles.selectedNavigationButton
//             ]} 
//           >
//             <Text style={styles.navigationButtonText}>Grid</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             onPress={goToListView}
//             style={[
//               styles.navigationButton,
//               selectedNavigation === 'List' && styles.selectedNavigationButton
//             ]}
//           >
//             <Text style={styles.navigationButtonText}>List</Text>
//           </TouchableOpacity>
//         </View> */}

//         {/* scrollable list of all the months */}
//         {/* <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false} 
//           contentContainerStyle={styles.monthSelector}
//         >
//           {months.map((month, index) => (
//             <TouchableOpacity
//               key={index}
//               onPress={() => handleMonthPress(index)}
//               style={[
//                 styles.monthButton,
//                 selectedMonth === index && styles.selectedMonthButton
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.monthButtonText,
//                   selectedMonth === index && styles.selectedMonthButtonText
//                 ]}
//               >
//                 {month.substring(0, 3)} 
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView> */}
//         <View style={styles.daysOfWeekContainer}>
//           {daysOfWeek.map((day, index) => (
//             <Text key={index} style={styles.dayOfWeekText}>{day}</Text>
//           ))}
//         </View>
//         <FlatList
//           data={daysArray}
//           renderItem={renderDay}
//           keyExtractor={(item, index) => index.toString()}
//           numColumns={7}
//         />
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor:'white',
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'white',
//     marginTop: 200, // Adjust based on your needs
//   },
//   header: {
//     width:'100%',
//     flex:1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal:10,
//     paddingVertical:10,
//     marginBottom: 10,
//     backgroundColor:'#003882',
//     zIndex:1,
//   },
//   calendarHeader: {
//     flexDirection: 'row',
//     justifyContent:'center',
//     alignItems:'center',
//   },
//   backButton: {
//     marginRight: 10,
//   },
//   backButtonText: {
//     fontSize: 24,
//     color: 'white',
//   },
//   selectedMonthText: {
//     fontSize: 24,
//     color: 'white',
//     fontFamily:'Ubuntu-Bold',
//   },
//   navigtionButtonContainer: {
//     flexDirection:'row',
//     justifyContent:'space-around',
//     alignItems:'center',
//     zIndex:1,
//     marginTop:10,
//     marginBottom:10,
//   },
//   navigationButton: {
//     width:'50%',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#e2e2e2',
//     borderWidth:1,
//     borderColor:'#e7e7e7',
//   },
//   navigationButtonText: {
//     fontFamily:'Ubuntu-Medium',
//     fontSize:20,

//   },
//   selectedNavigationButton: {
//     backgroundColor: 'rgba(0, 56, 130, 0.2)',
//   },
//   monthSelector: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 10,
//     marginTop:10,
//   },
//   monthButton: {
//     marginHorizontal: 5,
//     paddingVertical: 5,
//     paddingHorizontal: 20,
//     borderRadius:20,
//     borderWidth:1,
//     borderColor:'#003882'
//   },
//   selectedMonthButton: {
//     backgroundColor: 'rgba(0, 56, 130, 0.2)',
//   },
//   monthButtonText: {
//     fontSize: 16,
//     fontFamily:'Ubuntu-Regular',
//     color: '#003882',
//   },
//   selectedMonthButtonText: {
//     fontFamily:'Ubuntu-Bold',
//   },
//   daysOfWeekContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 10,
//   },
//   dayOfWeekText: {
//     width: '14.28%', 
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   dayContainer: {
//     width: '14%',
//     height: 100, 
//     justifyContent: 'flex-start',
//     alignItems: 'flex-start',
//     backgroundColor: '#e2e2e2', // Background color for the day container
//     padding:5,
//     margin: 1, // Margin to create space between cells
//   },
//   columnWrapper: {
//     justifyContent: 'space-around',
//   },
//   gridContainer: {
//     flexGrow: 1, // Ensure the grid takes up the remaining space
//   },
//   task: {
//     marginTop: 5,
//     padding: 2,
//     borderRadius: 5,
//   },
//   taskText: {
//     fontSize: 10,
//     fontFamily:'Ubuntu-Regular',
//     color: 'white',
//   },
// });

// export default GridScreenModal;
