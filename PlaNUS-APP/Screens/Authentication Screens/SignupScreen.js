// import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { auth } from '../../firebase';
// import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
// import { useNavigation } from '@react-navigation/core';
// import { Ionicons } from '@expo/vector-icons';

// const logo = require('../../assets/logo.png'); 

// const SignupScreen = () => {
//   const [email, setEmail] = useState(''); 
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState(''); 

//   const navigation = useNavigation();

//     //Navigate to LoginScreen once signed in 
//     //(but its going straight to homescreen)
//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, user => {
//             if(user) {
//                 navigation.navigate("Login");
//             }
//         });
//         return unsubscribe; 
//     }, []);

//     const isValidEmail = email => {
//         const regex = /^e\d{7}@u\.nus\.edu$/;
//         const isValid = regex.test(email);
//         console.log(`Email validation for ${email}: ${isValid}`);
//         return isValid;
//     }; 

//     const isStrongPassword = (password) => {
//         const minLength = 8;
//         const hasUpperCase = /[A-Z]/.test(password);
//         const hasLowerCase = /[a-z]/.test(password);
//         const hasDigit = /[0-9]/.test(password);
//         const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//         const isValid = password.length >= minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
//         console.log(`Password validation: ${isValid}`);
//         return isValid;
//     };

//     const handleSignup = () => {
//     //handle the case where a non NUS email is used to sign up 
//     if (!isValidEmail) {
//         alert('Invalid email. Not an NUS Student email.'); 
//         return;
//     } else if (!isStrongPassword) {
//         alert('Password is too weak. Please choose a stronger password.');
//         return;
//     } else {
//         createUserWithEmailAndPassword(auth, email, password)
//         .then(userCredentials => {
//             const user = userCredentials.user; 
//             console.log(username);
//         })
//         .catch(error => {
//             switch (error.code) {
//                 case 'auth/email-already-in-use':
//                     alert('An account with this email already exists.');
//                     break;
//                 case 'auth/invalid-email':
//                     alert('Invalid email. Not an NUS Student email.');
//                     break;
//                 case 'auth/weak-password':
//                     alert('Password is too weak. Please choose a stronger password.');
//                     break;
//                 default:
//                     alert(error.message);
//             }
//         });
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//     style={styles.container}
//     behavior='padding'
// >
//     <TouchableOpacity 
//         style={styles.backButton}
//         onPress={() => navigation.goBack()}
//     >
//         <Ionicons name='chevron-back' size={24} color='white' />
//     </TouchableOpacity>
    
//     <Image 
//         source={logo}
//         style={styles.image}
//     />

//     <Text style={styles.headerText}>Welcome!</Text>  

//     <View style={styles.inputContainer}>
//         <TextInput
//             placeholder='Username'
//             value={username}
//             onChangeText={text => setUsername(text)}
//             style={styles.input}
//             autoCapitalize='none'
//         />
//         <TextInput
//             placeholder='Email'
//             value={email}
//             onChangeText={text => setEmail(text)}
//             style={styles.input}
//             autoCapitalize='none'
//         />
//         <TextInput
//             placeholder='Password'
//             value={password}
//             onChangeText={text => setPassword(text)}
//             style={styles.input}
//             autoCapitalize='none'
//             secureTextEntry
//         />
//     </View>

//     <View style={styles.buttonContainer}>
//         <TouchableOpacity
//             onPress={handleSignup}
//             style={styles.button}
//         >
//             <Text style={styles.buttonInput}>Sign Up</Text>
//         </TouchableOpacity>
//     </View>
// </KeyboardAvoidingView>
//   )
// }

// export default SignupScreen

// const styles = StyleSheet.create({
//   container: {
//       flex: 1, 
//       justifyContent: 'center', 
//       alignItems:'center',
//       padding: 40,
//       backgroundColor:'#003882',
//   },
//   image: {
//       width:150, 
//       height:100,
//       marginBottom: 30,
//       marginLeft:20,
//   },
//   headerText: {
//       color:'white', 
//       fontSize: 40,
//       fontFamily:'Ubuntu-Regular',
//       textAlign:'center',
//       marginBottom: 20,
//   },
//   inputContainer: {
//       width:'80%',
//   },
//   input: {
//       backgroundColor:'white',
//       paddingVertical:10,
//       paddingHorizontal:15,
//       borderRadius:25,
//       marginBottom:15,
//       alignItems:'center',
//       fontFamily:'Ubuntu-Regular',
//   }, 
//   buttonContainer:{
//       width:'60%',
//       justifyContent:'center',
//       alignItems:'center',
//       marginTop: 30,
//   },
//   button: {
//       backgroundColor:'white',
//       width:'100%',
//       padding:12,
//       alignItems:'center',
//       borderRadius:25,
//       borderWidth:2,
//       borderColor:'#e7e7e7',
//   },
//   buttonInput: {
//       color:'#003882',
//       fontSize:16,
//       fontFamily:'Ubuntu-Bold',
//   },
//   backButton: {
//     position:'absolute', 
//     top: 50,
//     left:20,
//   },
//   });

// import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { auth, db } from '../../firebase';
// import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import { useNavigation } from '@react-navigation/core';
// import { Ionicons } from '@expo/vector-icons';

// const logo = require('../../assets/logo.png');

// const SignupScreen = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const navigation = useNavigation();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, user => {
//       if (user) {
//         navigation.navigate("Login");
//       }
//     });
//     return unsubscribe;
//   }, []);

//   const isValidEmail = email => {
//     const regex = /^e\d{7}@u\.nus\.edu$/;
//     const isValid = regex.test(email);
//     console.log(`Email validation for ${email}: ${isValid}`);
//     return isValid;
//   };

//   const isStrongPassword = password => {
//     const minLength = 8;
//     const hasUpperCase = /[A-Z]/.test(password);
//     const hasLowerCase = /[a-z]/.test(password);
//     const hasDigit = /[0-9]/.test(password);
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//     const isValid = password.length >= minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
//     console.log(`Password validation: ${isValid}`);
//     return isValid;
//   };

//   const handleSignup = async () => {
//     if (!isValidEmail(email)) {
//       alert('Invalid email. Not an NUS Student email.');
//       return;
//     }
//     if (!isStrongPassword(password)) {
//       alert('Password is too weak. Please choose a stronger password.');
//       return;
//     }

//     try {
//       const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredentials.user;

//       // Save user data to Firestore
//       await setDoc(doc(db, 'users', user.uid), {
//         email: email,
//         year: '', // Default year, can be updated later
//         image: '' // Default image, can be updated later
//       });

//       navigation.navigate('Account'); // Navigate to the account page
//     } catch (error) {
//       switch (error.code) {
//         case 'auth/email-already-in-use':
//           alert('An account with this email already exists.');
//           break;
//         case 'auth/invalid-email':
//           alert('Invalid email. Not an NUS Student email.');
//           break;
//         case 'auth/weak-password':
//           alert('Password is too weak. Please choose a stronger password.');
//           break;
//         default:
//           alert(error.message);
//       }
//     }
//   };

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior='padding'>
//       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//         <Ionicons name='chevron-back' size={24} color='white' />
//       </TouchableOpacity>

//       <Image source={logo} style={styles.image} />

//       <Text style={styles.headerText}>Welcome!</Text>

//       <View style={styles.inputContainer}>
//         <TextInput
//           placeholder='Email'
//           value={email}
//           onChangeText={text => setEmail(text)}
//           style={styles.input}
//           autoCapitalize='none'
//         />
//         <TextInput
//           placeholder='Password'
//           value={password}
//           onChangeText={text => setPassword(text)}
//           style={styles.input}
//           autoCapitalize='none'
//           secureTextEntry
//         />
//       </View>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity onPress={handleSignup} style={styles.button}>
//           <Text style={styles.buttonInput}>Sign Up</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default SignupScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//     backgroundColor: '#003882',
//   },
//   image: {
//     width: 150,
//     height: 100,
//     marginBottom: 30,
//     marginLeft: 20,
//   },
//   headerText: {
//     color: 'white',
//     fontSize: 40,
//     fontFamily: 'Ubuntu-Regular',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   inputContainer: {
//     width: '80%',
//   },
//   input: {
//     backgroundColor: 'white',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 25,
//     marginBottom: 15,
//     alignItems: 'center',
//     fontFamily: 'Ubuntu-Regular',
//   },
//   buttonContainer: {
//     width: '60%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 30,
//   },
//   button: {
//     backgroundColor: 'white',
//     width: '100%',
//     padding: 12,
//     alignItems: 'center',
//     borderRadius: 25,
//     borderWidth: 2,
//     borderColor: '#e7e7e7',
//   },
//   buttonInput: {
//     color: '#003882',
//     fontSize: 16,
//     fontFamily: 'Ubuntu-Bold',
//   },
//   backButton: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//   },
// });
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, updateProfile, signInWithEmailAndPassword, signOut, reload } from 'firebase/auth';
import { useNavigation } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = require('../../assets/logo.png');

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [resendAllowed, setResendAllowed] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    const checkStoredTimer = async () => {
      const storedTimer = await AsyncStorage.getItem('resendTimer');
      const storedEmail = await AsyncStorage.getItem('currentUserEmail');
      const storedPassword = await AsyncStorage.getItem('currentUserPassword');
      const storedUsername = await AsyncStorage.getItem('currentUsername');
      if (storedTimer) {
        const remainingTime = parseInt(storedTimer, 10) - Math.floor(Date.now() / 1000);
        if (remainingTime > 0) {
          setResendAllowed(false);
          setResendTimer(remainingTime);
          const interval = setInterval(() => {
            setResendTimer(prev => {
              if (prev <= 1) {
                clearInterval(interval);
                setResendAllowed(true);
                AsyncStorage.removeItem('resendTimer');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
      if (storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
      }
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };
    checkStoredTimer();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await reload(user); // Ensure we get the latest user state
        if (user.emailVerified) {
          console.log("User verified");
          await addUserToFirestore(user);
          navigation.navigate("Login");
        } else {
          setCurrentUser(user);
        }
      }
    });
    return unsubscribe;
  }, [navigation]);

  const isValidEmail = email => {
    const regex = /^e\d{7}@u\.nus\.edu$/;
    return regex.test(email);
  };

  const isStrongPassword = password => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
  };

  const handleSignup = async () => {
    if (!isValidEmail(email)) {
      alert('Invalid email. Not an NUS Student email.');
      return;
    }
    if (!isStrongPassword(password)) {
      alert('Password is too weak. Please choose a stronger password.');
      return;
    }

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      setCurrentUser(user);

      await updateProfile(user, {
        displayName: username,
      });

      await sendEmailVerification(user);
      await signOut(auth);

      Alert.alert(
        "Email Verification",
        "Please check your email to verify your account. If you haven't received the email, please check your spam folder or click Resend Verification Email.",
        [{ text: "OK" }]
      );

      setResendAllowed(false);
      setResendTimer(60); // Set the timer to 60 seconds
      await AsyncStorage.setItem('resendTimer', (Math.floor(Date.now() / 1000) + 60).toString());
      await AsyncStorage.setItem('currentUserEmail', email);
      await AsyncStorage.setItem('currentUserPassword', password);
      await AsyncStorage.setItem('currentUsername', username);

      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendAllowed(true);
            AsyncStorage.removeItem('resendTimer');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const deleteUserAfterTimeout = async () => {
        try {
          console.log('Attempting to delete user due to unverified email after timeout');
          // Re-sign in the user to ensure we have the latest state
          await signInWithEmailAndPassword(auth, email, password);
          const reloadedUser = auth.currentUser;
          console.log('User reloaded:', reloadedUser);

          if (reloadedUser && !reloadedUser.emailVerified) {
            console.log('Deleting user:', reloadedUser.uid);
            await reloadedUser.delete();
            console.log('User deleted successfully');
            Alert.alert(
              "Account Deleted",
              "Your account was deleted because the email was not verified within 30 minutes. Please sign up again."
            );
            await AsyncStorage.clear();
            setEmail('');
            setPassword('');
            setUsername('');
            setCurrentUser(null);
            setResendAllowed(true);
            setResendTimer(0);
          }
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      };

      // Set timeout for 1 minute for testing, change to 30 * 60 * 1000 for 30 minutes
      setTimeout(deleteUserAfterTimeout, 30 * 60 * 1000); // 30 minute
    } catch (error) {
      console.error('Error during signup:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          alert('An account with this email already exists.');
          break;
        case 'auth/invalid-email':
          alert('Invalid email. Not an NUS Student email.');
          break;
        case 'auth/weak-password':
          alert('Password is too weak. Please choose a stronger password.');
          break;
        default:
          alert(error.message);
      }
    }
  };

  const handleResendVerificationEmail = async () => {
    if (currentUser && !currentUser.emailVerified) {
      try {
        await signInWithEmailAndPassword(auth, currentUser.email, password);
        await sendEmailVerification(currentUser);
        alert('Verification email resent. Please check your inbox.');
        await signOut(auth);
        setResendAllowed(false);
        setResendTimer(60); // Reset the timer to 60 seconds
        await AsyncStorage.setItem('resendTimer', (Math.floor(Date.now() / 1000) + 60).toString());

        const interval = setInterval(() => {
          setResendTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setResendAllowed(true);
              AsyncStorage.removeItem('resendTimer');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error) {
        console.error('Error resending verification email:', error);
        if (error.code === 'auth/too-many-requests') {
          alert('Too many requests. Please wait a moment before trying again.');
        } else {
          alert('Failed to resend verification email. Please try again.');
        }
      }
    } else {
      alert('User information is not available for resending email.');
    }
  };

  const addUserToFirestore = async (user) => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        username: user.displayName,
        year: '',
        image: ''
      });
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name='chevron-back' size={24} color='white' />
      </TouchableOpacity>

      <Image source={logo} style={styles.image} />

      <Text style={styles.headerText}>Welcome!</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Username'
          value={username}
          onChangeText={text => setUsername(text)}
          style={styles.input}
          autoCapitalize='none'
        />
        <TextInput
          placeholder='Email'
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          autoCapitalize='none'
        />
        <TextInput
          placeholder='Password'
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          autoCapitalize='none'
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignup} style={styles.button}>
          <Text style={styles.buttonInput}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleResendVerificationEmail}
          style={[styles.button, (!resendAllowed || (currentUser && currentUser.emailVerified)) && { backgroundColor: '#e7e7e7' }]}
          disabled={!resendAllowed || (currentUser && currentUser.emailVerified)}
        >
          <Text style={[styles.buttonInput, (!resendAllowed || (currentUser && currentUser.emailVerified)) && { color: '#A9A9A9' }]}>
            Resend Verification Email
          </Text>
        </TouchableOpacity>
        {!resendAllowed && <Text style={styles.timerText}>{resendTimer}s</Text>}
      </View>

      <Text style={styles.passwordRequirements}>
        Password must be at least 8 characters long, contain upper and lower case letters, a digit, and a special character.
      </Text>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#003882',
  },
  image: {
    width: 150,
    height: 100,
    marginBottom: 30,
    marginLeft: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 40,
    fontFamily: 'Ubuntu-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
    fontFamily: 'Ubuntu-Regular',
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: 'white',
    width: '100%',
    padding: 12,
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e7e7e7',
    marginTop: 10,
  },
  buttonInput: {
    color: '#003882',
    fontSize: 16,
    fontFamily: 'Ubuntu-Bold',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  timerText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  passwordRequirements: {
    color: 'white',
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
    width: '80%',
  },
});
