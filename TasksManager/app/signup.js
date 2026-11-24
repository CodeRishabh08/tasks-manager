
import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { router } from 'expo-router';

import { signUp } from '../services/authService';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp(
        email.trim(),
        password
      );

      if (error) throw error;

      if (data.session) {
        Alert.alert('Success', 'Account created!');
        // AuthProvider will receive the new session.
        router.replace('/tasks');
      } else {
        Alert.alert(
          'Verify Email',
          'Please check your email to confirm your account.'
        );

        router.replace('/login');
      }
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Create Account
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password (minimum 6 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            Sign Up
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => router.replace('/login')}
      >
        <Text style={styles.link}>
          Already have an account? Login
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#F5F6FA',
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },

  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  link: {
    color: '#4F46E5',
    textAlign: 'center',
    marginTop: 20,
  },
});
