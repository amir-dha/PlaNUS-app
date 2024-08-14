// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import SignupScreen from '../path/to/SignupScreen'; // Adjust the path accordingly
// import { auth, db } from '../../firebase'; // Adjust the path accordingly
// import { doc, setDoc } from 'firebase/firestore';

// jest.mock('../../firebase');
// jest.mock('firebase/firestore');

// describe('SignupScreen', () => {
//   it('renders correctly', () => {
//     const { getByPlaceholderText, getByText } = render(<SignupScreen />);
//     expect(getByPlaceholderText('Username')).toBeTruthy();
//     expect(getByPlaceholderText('Email')).toBeTruthy();
//     expect(getByPlaceholderText('Password')).toBeTruthy();
//     expect(getByText('Sign Up')).toBeTruthy();
//     expect(getByText('Resend Verification Email')).toBeTruthy();
//   });

//   it('handles signup', async () => {
//     auth.createUserWithEmailAndPassword.mockResolvedValueOnce({
//       user: { email: 'test@u.nus.edu', uid: '12345' },
//     });
//     auth.updateProfile.mockResolvedValueOnce();
//     auth.sendEmailVerification.mockResolvedValueOnce();
//     setDoc.mockResolvedValueOnce();

//     const { getByPlaceholderText, getByText } = render(<SignupScreen />);
//     fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
//     fireEvent.changeText(getByPlaceholderText('Email'), 'test@u.nus.edu');
//     fireEvent.changeText(getByPlaceholderText('Password'), 'Password123!');
//     fireEvent.press(getByText('Sign Up'));

//     await waitFor(() => {
//       expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
//         'test@u.nus.edu',
//         'Password123!'
//       );
//     });

//     await waitFor(() => {
//       expect(setDoc).toHaveBeenCalledWith(
//         doc(db, 'users', '12345'),
//         expect.objectContaining({ email: 'test@u.nus.edu', username: 'testuser' })
//       );
//     });
//   });
// });
const { remote } = require('webdriverio');

describe('Signup Screen Tests', () => {
  let driver;

  beforeAll(async () => {
    driver = await remote({
      port: 4723,
      capabilities: {
        platformName: 'Android',
        platformVersion: '11',  // Replace with your device/emulator version
        deviceName: 'Pixel_3a_API_30',  // Replace with your device/emulator name
        app: '/path/to/your/app.apk',  // Replace with the path to your APK
        automationName: 'UiAutomator2'
      }
    });
  });

  afterAll(async () => {
    await driver.deleteSession();
  });

  it('should display the signup screen', async () => {
    const signupScreen = await driver.$('~SignupScreen');
    expect(await signupScreen.isDisplayed()).toBe(true);
  });

  it('should sign up with valid credentials', async () => {
    const emailInput = await driver.$('~emailInput');
    await emailInput.setValue('testuser@u.nus.edu');

    const usernameInput = await driver.$('~usernameInput');
    await usernameInput.setValue('testuser');

    const passwordInput = await driver.$('~passwordInput');
    await passwordInput.setValue('Test@1234');

    const signupButton = await driver.$('~signupButton');
    await signupButton.click();

    const alertText = await driver.getAlertText();
    expect(alertText).toContain('Email Verification');

    await driver.acceptAlert();  // Close the alert
  });
});
