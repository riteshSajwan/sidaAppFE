import React from 'react';
import { Pressable, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { logout } from 'src/common/service/auth/action';
import { Routes } from 'src/routing/paths';
import { AppDispatch } from 'src/store';

const LogoutButton = () => {
  const dispatch: AppDispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.replace(Routes.LOGIN);
  };
  
  return (
    <Pressable
      style={{ backgroundColor: 'lightblue', marginTop: 10, width: 90 }}
      onPress={() => {
        handleLogOut();
      }}
    >
      <Text style={{ textAlign: 'center' }}>Log Out</Text>
    </Pressable>
  );
};
export default LogoutButton;