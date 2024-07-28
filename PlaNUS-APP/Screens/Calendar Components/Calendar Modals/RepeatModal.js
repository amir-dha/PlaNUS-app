import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const RepeatModal = ({ visible, onClose, onSelect }) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState('Does not repeat');

  const handleStartDateChange = (event, date) => {
    const selectedDate = date || startDate;
    setShowStartDatePicker(false);
    setStartDate(selectedDate);
  };

  const handleEndDateChange = (event, date) => {
    const selectedDate = date || endDate;
    setShowEndDatePicker(false);
    setEndDate(selectedDate);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleSave = () => {
    onSelect(selectedOption, startDate, endDate);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <ScrollView>
                {['Does not repeat', 'Every day', 'Every week', 'Every month', 'Every year'].map(option => (
                  <TouchableOpacity key={option} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
                    <Text style={styles.modalOptionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.datePickerContainer}>
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePickerButton}>
                  <Text style={styles.datePickerText}>Start Date: {startDate.toDateString()}</Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                  />
                )}
                <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePickerButton}>
                  <Text style={styles.datePickerText}>End Date: {endDate.toDateString()}</Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={handleEndDateChange}
                  />
                )}
              </View>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
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
  datePickerContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#003882',
    borderRadius: 5,
    marginVertical: 5,
  },
  datePickerText: {
    fontSize: 16,
    color: '#003882',
  },
  saveButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#003882',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default RepeatModal;