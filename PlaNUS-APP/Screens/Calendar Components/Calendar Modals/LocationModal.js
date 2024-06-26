// import React from 'react';
// import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';

// const LocationModal = ({ visible, onClose, venues, onFilter, onSelect }) => {
//   return (
//     <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <TextInput
//               style={styles.detailsInput}
//               placeholder="Search NUS Venues"
//               onChangeText={onFilter}
//             />
//             <FlatList
//               data={venues}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item }) => (
//                 <TouchableOpacity onPress={() => onSelect(item)}>
//                   <Text style={styles.modalOptionText}>{item}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
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
//   modalOptionText: {
//     fontSize: 18,
//     color: '#003882',
//   },
//   detailsInput: {
//     fontSize: 20,
//     color: '#003882',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//     marginBottom: 10,
//   },
// });

// export default LocationModal;
// LocationModal.js
import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';

const LocationModal = ({ visible, onClose, venues, onFilter, onSelect }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.header}>Search NUS Venues</Text>
              <FlatList
                data={venues}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => onSelect(item)}>
                    <View style={styles.venueItem}>
                      <Text style={styles.venueText}>{item}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  venueItem: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  venueText: {
    fontSize: 16,
    color: '#003882',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
  },
});

export default LocationModal;

