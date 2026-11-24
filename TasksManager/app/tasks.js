
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useCallback } from 'react';

import { useFocusEffect } from 'expo-router';

import { router, Redirect } from 'expo-router';

import { useAuth } from '../context/AuthContext';

import { signOut } from '../services/authService';

import { useTasks } from '../hooks/useTasks';

import TaskCard from '../components/TaskCard';

export default function TasksScreen() {

  const { user, loading: authLoading } = useAuth();
  

  const {
    tasks,
    loading,
    fetchTasks,
    changeTaskStatus,
    removeTask,
  } = useTasks();


  // Fetch tasks when the screen mounts
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );


  // Toggle task completion
  const handleToggle = async (task) => {
    try {
      await changeTaskStatus(
        task.id,
        !task.completed
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };


  // Navigate to edit screen
  const handleEdit = (task) => {
    router.push({
      pathname: '/edit-task',
      params: { id: task.id },
    });
  };


  // Delete task
  const handleDelete = (task) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTask(task.id);
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };


  // Logout
  const handleLogout = async () => {
    const { error } = await signOut();

    if (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };


  // Loading state
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (authLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>
            My Tasks
          </Text>

          <Text style={styles.email}>
            {user?.email}
          </Text>
        </View>

        <Pressable onPress={handleLogout}>
          <Text style={styles.logout}>
            Logout
          </Text>
        </Pressable>
      </View>


      <Pressable
        style={styles.addButton}
        onPress={() => router.push('/add-task')}
      >
        <Text style={styles.addButtonText}>
          + Add New Task
        </Text>
      </Pressable>


      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={() => handleToggle(item)}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No tasks yet. Add your first task!
          </Text>
        }
        contentContainerStyle={styles.list}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 20,
    paddingTop: 60,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  email: {
    color: '#777',
    marginTop: 5,
  },

  logout: {
    color: '#DC2626',
    fontWeight: 'bold',
  },

  addButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },

  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  list: {
    paddingBottom: 30,
    flexGrow: 1,
  },

  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 50,
  },
});
