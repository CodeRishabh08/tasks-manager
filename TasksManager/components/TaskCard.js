
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <View style={styles.card}>

      <Pressable
        style={styles.taskContent}
        onPress={onToggle}
      >
        <Text style={styles.checkbox}>
          {task.completed ? '☑' : '☐'}
        </Text>

        <View style={styles.details}>
          <Text
            style={[
              styles.title,
              task.completed && styles.completed,
            ]}
          >
            {task.title}
          </Text>

          <Text style={styles.description}>
            {task.description}
          </Text>
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Pressable onPress={onEdit}>
          <Text style={styles.edit}>Edit</Text>
        </Pressable>

        <Pressable onPress={onDelete}>
          <Text style={styles.delete}>Delete</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    fontSize: 24,
    marginRight: 12,
  },

  details: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  description: {
    color: '#777',
    marginTop: 5,
  },

  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    gap: 20,
  },

  edit: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },

  delete: {
    color: '#DC2626',
    fontWeight: 'bold',
  },
});
