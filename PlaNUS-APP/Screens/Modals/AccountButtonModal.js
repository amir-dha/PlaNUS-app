import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/core';

const AccountButtonModal = ({modalVisible, setModalVisible}) => {
    const navigation = useNavigation(); 
    
    const goToInformation = () => {
        navigation.navigate('Information');
        setModalVisible(false);
    };
    const goToAccount = () => {
        navigation.navigate('Account'); 
        setModalVisible(false);
    }
    //log out function
    const handleLogout = async () => { 
        try {
            await signOut(auth);
            navigation.navigate('Welcome');
        } catch (error) {
            console.error('Error logging out: ', error); 
        }
    };

  return (
    <Modal
        animationType={'none'}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
    >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalBackground}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalView}>

                        {/* close button */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Ionicons name='close' size={20} color='black'/>
                        </TouchableOpacity>

                        {/* Buttons to toggle to different screens/log out */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={goToAccount}
                        >
                            <Text style={styles.text}>Account</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={goToInformation}
                        >
                            <Text style={styles.text}>Information</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogout}
                        >
                            <Text style={styles.text}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
  )
}

export default AccountButtonModal

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent:'flex-start',
        alignItems:'flex-end',
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    modalView: {
        width:200,
        backgroundColor:'white',
        borderRadius:10,
        padding:20,
        paddingTop:40, //extra padding for close button
        alignItems:'center', 
        shadowColor:'#000', 
        shadowOffset:{width:0, height:2},
        shadowOpacity:0.25,
        shadowRadius:4, 
        elevation:5, 
        marginTop:110,
        marginRight:10,
    }, 
    button: {
        backgroundColor:'white', 
        padding:10,
        borderRadius:5,
        width:'100%', 
        alignItems:'flex-start',
    },
    text: {
        color:'#003882', 
        fontSize:18,
        fontFamily:'Ubuntu-Regular',
    }, 
    divider: {
        width:'100%', 
        height:1, 
        backgroundColor:'#7e7e7e', 
        marginVertical:10,
    }, 
    closeButton: {
        position:'absolute',
        top:10,
        right:10, 
        zIndex:1, //ensures close button is on top
    },
});