
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Modal, FlatList, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase'; // Adjust the import based on your file structure
import AccountButtonModal from '../Home/Modals/AccountButtonModal';
import moduleData from './extractedModules.js'; // Import the module data

const SemesterPlan = () => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const initialSemesterState = useMemo(() => Array(10).fill().map((_, index) => ({ id: index, module: '', credits: '0', color: '#DEFFED' })), []);
  const initialPlan = useMemo(() => ({
    Y1: { S1: [...initialSemesterState], S2: [...initialSemesterState], ST1: [...initialSemesterState], ST2: [...initialSemesterState] },
    Y2: { S1: [...initialSemesterState], S2: [...initialSemesterState], ST1: [...initialSemesterState], ST2: [...initialSemesterState] },
    Y3: { S1: [...initialSemesterState], S2: [...initialSemesterState], ST1: [...initialSemesterState], ST2: [...initialSemesterState] },
    Y4: { S1: [...initialSemesterState], S2: [...initialSemesterState], ST1: [...initialSemesterState], ST2: [...initialSemesterState] },
    Y5: { S1: [...initialSemesterState], S2: [...initialSemesterState], ST1: [...initialSemesterState], ST2: [...initialSemesterState] },
  }), [initialSemesterState]);

  const [plan, setPlan] = useState(initialPlan);
  const [totalModules, setTotalModules] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [modalVisible, setModalVisible] = useState({ visible: false, year: '', semester: '', id: null });
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [focusedInput, setFocusedInput] = useState({ year: '', semester: '', id: null });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    console.log('Authenticated user UID:', user.uid);
    const docRef = doc(db, 'users', user.uid, 'plans', 'academicPlan');
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        console.log("Document data fetched:", doc.data());
        setPlan(doc.data().plan || initialPlan);
      } else {
        console.log("No such document!");
        setPlan(initialPlan);
      }
    });

    return () => unsubscribe();
  }, [initialPlan]);

  const savePlanData = useCallback(async (updatedPlan) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid, 'plans', 'academicPlan');
        console.log('Saving to path:', `users/${user.uid}/plans/academicPlan`);
        await setDoc(docRef, { plan: updatedPlan });
        console.log('Plan data saved:', updatedPlan);
      } else {
        console.log('User not authenticated, unable to save data');
      }
    } catch (error) {
      console.error('Error saving plan data: ', error);
    }
  }, []);

  useEffect(() => {
    const calculateOverallTotals = () => {
      let modules = 0;
      let credits = 0;
      Object.values(plan).forEach(year => {
        Object.values(year).forEach(semester => {
          modules += semester.filter(item => item.module).length;
          credits += semester.reduce((sum, item) => sum + (parseInt(item.credits) || 0), 0);
        });
      });
      console.log('Calculated totals - Modules:', modules, 'Credits:', credits);
      setTotalModules(modules);
      setTotalCredits(credits);
    };

    calculateOverallTotals();
  }, [plan]);

  const handleModuleChange = useCallback((year, semester, id, value) => {
    console.log(`Changing module for ${year} ${semester} ${id} to ${value}`);
    const updatedPlan = { ...plan };
    const semesterData = updatedPlan[year][semester].map(item => item.id === id ? { ...item, module: value } : item);
    updatedPlan[year][semester] = semesterData;
    setPlan(updatedPlan);

    const filteredSuggestions = moduleData.filter(module => 
      module.moduleCode.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
    setFocusedInput({ year, semester, id });
  }, [plan]);

  const handleCreditsChange = useCallback((year, semester, id, value) => {
    console.log(`Changing credits for ${year} ${semester} ${id} to ${value}`);
    const updatedPlan = { ...plan };
    const semesterData = updatedPlan[year][semester].map(item => item.id === id ? { ...item, credits: value } : item);
    updatedPlan[year][semester] = semesterData;
    setPlan(updatedPlan);
  }, [plan]);

  const handleBlur = useCallback((year, semester, id) => {
    console.log(`Blur event for ${year} ${semester} ${id}`);
    savePlanData(plan);
  }, [plan, savePlanData]);

  const handleSelectSuggestion = useCallback((year, semester, id, suggestion) => {
    console.log(`Selecting suggestion for ${year} ${semester} ${id}`, suggestion);
    const updatedPlan = { ...plan };
    const semesterData = updatedPlan[year][semester].map(item => 
      item.id === id ? { ...item, module: suggestion.moduleCode, credits: suggestion.moduleCredit } : item
    );
    updatedPlan[year][semester] = semesterData;
    setPlan(updatedPlan);
    setSuggestions([]);
    setFocusedInput({ year: '', semester: '', id: null });
    savePlanData(updatedPlan);
  }, [plan, savePlanData]);

  const handleColorChange = useCallback((color) => {
    const { year, semester, id } = modalVisible;
    console.log(`Changing color for ${year} ${semester} ${id} to ${color}`);
    const updatedPlan = { ...plan };
    const semesterData = updatedPlan[year][semester].map(item =>
      item.id === id ? { ...item, color } : item
    );
    updatedPlan[year][semester] = semesterData;
    setPlan(updatedPlan);
    setModalVisible({ ...modalVisible, visible: false });
    savePlanData(updatedPlan);
  }, [modalVisible, plan, savePlanData]);

  const calculateTotal = useCallback((year, semester) => {
    const modules = plan[year][semester].filter(item => item.module).length;
    const credits = plan[year][semester].reduce((sum, item) => sum + (parseInt(item.credits) || 0), 0);
    return { modules, credits };
  }, [plan]);

  const sortedYears = useMemo(() => Object.keys(plan).sort(), [plan]);
  const renderYear = (year) => {
    const sortedSemesters = useMemo(() => Object.keys(plan[year]).sort((a, b) => {
      const order = { S1: 1, S2: 2, ST1: 3, ST2: 4 };
      return order[a] - order[b];
    }), [plan[year]]);

    return (
      <View key={year} style={styles.yearContainer}>
        <Text style={styles.yearLabel}>{`Year ${year.slice(1)}`}</Text>
        {sortedSemesters.map(semester => renderSemester(year, semester))}
      </View>
    );
  };

  const renderSemester = (year, semester) => {
    const total = calculateTotal(year, semester);
    return (
      <View key={semester} style={styles.semesterRow}>
        <View style={styles.semesterLabelContainer}>
          <Text style={styles.semesterLabel}>{`${year}${semester}`}</Text>
        </View>
        <ScrollView horizontal={!isLandscape} contentContainerStyle={styles.modulesContainer}>
          {plan[year][semester].map((item, index) => (
            <View key={index} style={[styles.moduleColumn, { backgroundColor: item.color || '#DEFFED' }]}>
              <TextInput
                style={styles.moduleInput}
                placeholder="Mod"
                value={item.module}
                onChangeText={(value) => handleModuleChange(year, semester, item.id, value)}
                onBlur={() => handleBlur(year, semester, item.id)}
                onFocus={() => setFocusedInput({ year, semester, id: item.id })}
              />
              {focusedInput.year === year && focusedInput.semester === semester && focusedInput.id === item.id && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.moduleCode}
                    renderItem={({ item: suggestion }) => (
                      <TouchableOpacity
                        onPress={() => handleSelectSuggestion(year, semester, item.id, suggestion)}
                        style={styles.suggestionItem}
                      >
                        <Text>{suggestion.moduleCode}</Text>
                      </TouchableOpacity>
                    )}
                    style={styles.suggestionsContentContainer}
                  />
                </View>
              )}
              <TextInput
                style={styles.creditsInput}
                placeholder="Credits"
                value={item.credits}
                keyboardType="numeric"
                onChangeText={(value) => handleCreditsChange(year, semester, item.id, value)}
                onBlur={() => handleBlur(year, semester, item.id)}
              />
              <TouchableOpacity
                style={styles.colorPickerIcon}
                onPress={() => setModalVisible({ visible: true, year, semester, id: item.id })}
              >
                <FontAwesome5 name="palette" size={15} color="black" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View style={styles.totalContainer}>
          <View style={[styles.totalBox, styles.noBottomBorder]}>
            <Text>{total.modules}</Text>
          </View>
          <View style={styles.totalBox}>
            <Text>{total.credits}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>My Academic Plan</Text>
        <TouchableOpacity onPress={() => setAccountModalVisible(true)} style={styles.iconButton}>
          <FontAwesome5 name='user-circle' size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.overallTotalsContainer}>
        <View style={styles.overallTotalBox}>
          <Text style={styles.overallTotalLabel}>Total Modules</Text>
          <Text style={styles.overallTotalValue}>{totalModules}</Text>
        </View>
        <View style={styles.overallTotalBox}>
          <Text style={styles.overallTotalLabel}>Total Credits</Text>
          <Text style={styles.overallTotalValue}>{totalCredits}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {sortedYears.map(year => renderYear(year))}
      </ScrollView>
      <AccountButtonModal modalVisible={accountModalVisible} setModalVisible={setAccountModalVisible} />

      <Modal
        visible={modalVisible.visible}
        transparent={true}
        onRequestClose={() => setModalVisible({ ...modalVisible, visible: false })}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible({ ...modalVisible, visible: false })}>
          <View style={styles.modalContainer}>
            {['#FFDEDE', '#FFEBDE', '#FFF5DE', '#F5FFDE', '#DEFFED', '#DEFFF5', '#DEF9FF', '#DEEBFF', '#E1DEFF', '#EBDEFF', '#FFDEF2'].map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.colorOption, { backgroundColor: color }]}
                onPress={() => handleColorChange(color)}
              />
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

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
  scrollContainer: {
    padding: 10,
  },
  yearContainer: {
    marginBottom: 20,
  },
  yearLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  semesterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  semesterLabelContainer: {
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -15,
  },
  semesterLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    transform: [{ rotate: '270deg' }],
  },
  modulesContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  moduleColumn: {
    width: 80,
    padding: 5,
    borderRadius: 10,
    marginRight: 10,
    position: 'relative',
  },
  moduleInput: {
    borderBottomWidth: 1,
    marginBottom: 5,
    marginTop: 5,
    textAlign: 'center',
  },
  creditsInput: {
    height: 20,
    textAlign: 'center',
  },
  colorPickerIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  totalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 70,
    backgroundColor: '#e2e2e2',
    borderRadius: 10,
    marginLeft: 5,
  },
  totalBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: '100%',
  },
  noBottomBorder: {
    borderBottomWidth: 0,
  },
  overallTotalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  overallTotalBox: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  overallTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  overallTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 250,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: 1,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  suggestionsContentContainer: {
    paddingBottom: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default SemesterPlan;
