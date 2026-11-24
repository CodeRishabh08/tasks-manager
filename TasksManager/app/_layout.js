
import { Stack } from 'expo-router';

import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="login"
          options={{
            title: 'Login',
          }}
        />

        <Stack.Screen
          name="signup"
          options={{
            title: 'Create Account',
          }}
        />

        <Stack.Screen
          name="tasks"
          options={{
            headerShown: false,
          }}
        />

      <Stack.Screen
        name="add-task"
        options={{
          title: 'Add Task',
        }}
        />

      <Stack.Screen
        name="edit-task"
        options={{
          title: 'Edit Task',
        }}
        />
        </Stack>
    </AuthProvider>
  );
}
