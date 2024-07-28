// import React from 'react';
// import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';

// const NotificationModal = ({ visible, onClose, onAdd }) => {
//   return (
//     <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <ScrollView>
//               {['30 minutes before', '5 minutes before', '10 minutes before', '1 hour before', '1 day before'].map(notification => (
//                 <TouchableOpacity key={notification} onPress={() => onAdd(notification)} style={styles.modalOption}>
//                   <Text style={styles.modalOptionText}>{notification}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
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
//   modalOption: {
//     width: '100%',
//     padding: 15,
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   modalOptionText: {
//     fontSize: 18,
//     color: '#003882',
//   },
// });

// export default NotificationModal;
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';

const NotificationModal = ({ visible, onClose, onAdd }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              {['30 minutes before', '5 minutes before', '10 minutes before', '1 hour before', '1 day before'].map(notification => (
                <TouchableOpacity key={notification} onPress={() => onAdd(notification)} style={styles.modalOption}>
                  <Text style={styles.modalOptionText}>{notification}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  },
});

export default NotificationModal;
