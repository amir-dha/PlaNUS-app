import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../PlaNUS-APP/Screens/Authentication Screens/LoginScreen'; 
import { auth } from '../firebase'; 

jest.mock('../firebase');

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Log In')).toBeTruthy();
    expect(getByText('Forget Password')).toBeTruthy();
  });

  it('handles login', async () => {
    auth.signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { email: 'test@u.nus.edu' },
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@u.nus.edu');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Log In'));

    await waitFor(() => {
      expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        'test@u.nus.edu',
        'password123'
      );
    });
  });

  it('handles forget password', async () => {
    auth.sendPasswordResetEmail.mockResolvedValueOnce();

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@u.nus.edu');
    fireEvent.press(getByText('Forget Password'));

    await waitFor(() => {
      expect(auth.sendPasswordResetEmail).toHaveBeenCalledWith('test@u.nus.edu');
    });
  });
});
