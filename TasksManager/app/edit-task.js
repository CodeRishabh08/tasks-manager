
import { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import { useTasks } from '../hooks/useTasks';

import { getTasks } from '../services/taskService';

export default function EditTaskScreen() {

  const { id } = useLocalSearchParams();

  const { editTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  // Fetch the task we want to edit
  useEffect(() => {

    const loadTask = async () => {

      try {
        const { data, error } = await getTasks();

        if (error) throw error;

        const task = data.find(item => item.id === parseInt(id));
        if (!task) {
          throw new Error('Task not found');
        }

        setTitle(task.title);
        setDescription(task.description ?? '');

      } catch (error) {
        Alert.alert('Error', error.message);
        router.back();

      } finally {
        setLoading(false);
      }
    };

    loadTask();

  }, [id]);


  const handleUpdate = async () => {

    if (!title.trim()) {
      Alert.alert('Error', 'Task title is required.');
      return;
    }

    setSaving(true);

    try {
      await editTask(id, {
        title: title.trim(),
        description: description.trim(),
      });

      Alert.alert('Success', 'Task updated!');

      router.back();

    } catch (error) {
      Alert.alert('Error', error.message);

    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <View style={styles.container}>

      <Text style={styles.heading}>
        Edit Task
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
        onPress={handleUpdate}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            Update Task
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

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
