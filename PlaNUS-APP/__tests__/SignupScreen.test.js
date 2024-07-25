import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignupScreen from '../path/to/SignupScreen'; // Adjust the path accordingly
import { auth, db } from '../../firebase'; // Adjust the path accordingly
import { doc, setDoc } from 'firebase/firestore';

jest.mock('../../firebase');
jest.mock('firebase/firestore');

describe('SignupScreen', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);
    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByText('Resend Verification Email')).toBeTruthy();
  });

  it('handles signup', async () => {
    auth.createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { email: 'test@u.nus.edu', uid: '12345' },
    });
    auth.updateProfile.mockResolvedValueOnce();
    auth.sendEmailVerification.mockResolvedValueOnce();
    setDoc.mockResolvedValueOnce();

    const { getByPlaceholderText, getByText } = render(<SignupScreen />);
    fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@u.nus.edu');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123!');
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        'test@u.nus.edu',
        'Password123!'
      );
    });

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(
        doc(db, 'users', '12345'),
        expect.objectContaining({ email: 'test@u.nus.edu', username: 'testuser' })
      );
    });
  });
});
