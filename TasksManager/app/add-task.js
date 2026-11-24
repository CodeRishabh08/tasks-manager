
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

import { useAuth } from '../context/AuthContext';

import { useTasks } from '../hooks/useTasks';

export default function AddTaskScreen() {

  const { user } = useAuth();

  const { addTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);


  const handleSave = async () => {

    if (!title.trim()) {
      Alert.alert('Error', 'Task title is required.');
      return;
    }

    setSaving(true);

    try {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        userId: user.id,
      });

      Alert.alert('Success', 'Task created!');

      router.back();

    } catch (error) {
      Alert.alert('Error', error.message);

    } finally {
      setSaving(false);
    }
  };


  return (
    <View style={styles.container}>

      <Text style={styles.heading}>
        Create New Task
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Task title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Pressable
        style={styles.button}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            Save Task
          </Text>
        )}
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#F5F6FA',
  },

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  description: {
    height: 120,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
