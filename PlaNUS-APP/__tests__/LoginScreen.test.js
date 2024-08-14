// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import LoginScreen from '../../PlaNUS-APP/Screens/Authentication Screens/LoginScreen'; 
// import { auth } from '../firebase'; 

// jest.mock('../firebase');

// describe('LoginScreen', () => {
//   it('renders correctly', () => {
//     const { getByPlaceholderText, getByText } = render(<LoginScreen />);
//     expect(getByPlaceholderText('Email')).toBeTruthy();
//     expect(getByPlaceholderText('Password')).toBeTruthy();
//     expect(getByText('Log In')).toBeTruthy();
//     expect(getByText('Forget Password')).toBeTruthy();
//   });

//   it('handles login', async () => {
//     auth.signInWithEmailAndPassword.mockResolvedValueOnce({
//       user: { email: 'test@u.nus.edu' },
//     });

//     const { getByPlaceholderText, getByText } = render(<LoginScreen />);
//     fireEvent.changeText(getByPlaceholderText('Email'), 'test@u.nus.edu');
//     fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
//     fireEvent.press(getByText('Log In'));

//     await waitFor(() => {
//       expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
//         'test@u.nus.edu',
//         'password123'
//       );
//     });
//   });

//   it('handles forget password', async () => {
//     auth.sendPasswordResetEmail.mockResolvedValueOnce();

//     const { getByPlaceholderText, getByText } = render(<LoginScreen />);
//     fireEvent.changeText(getByPlaceholderText('Email'), 'test@u.nus.edu');
//     fireEvent.press(getByText('Forget Password'));

//     await waitFor(() => {
//       expect(auth.sendPasswordResetEmail).toHaveBeenCalledWith('test@u.nus.edu');
//     });
//   });
// });
const { remote } = require('webdriverio');

describe('Login Screen Tests', () => {
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

  it('should display the login screen', async () => {
    const loginScreen = await driver.$('~LoginScreen');
    expect(await loginScreen.isDisplayed()).toBe(true);
  });

  it('should log in with valid credentials', async () => {
    const emailInput = await driver.$('~emailInput');
    await emailInput.setValue('testuser@u.nus.edu');

    const passwordInput = await driver.$('~passwordInput');
    await passwordInput.setValue('Test@1234');

    const loginButton = await driver.$('~loginButton');
    await loginButton.click();

    const homeScreen = await driver.$('~homeScreen');
    expect(await homeScreen.isDisplayed()).toBe(true);
  });
});
