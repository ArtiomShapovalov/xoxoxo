import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { ThemedText } from '@/components/themed-text'

interface User {
  id: number;
  wins: number;
  loses: number;
  seconds: number;
  milliseconds: number;
}

interface LeaderboardProps {
  isVisible: boolean;
  onClose: () => void;
  users: User[];
}

export function Leaderboard({
  isVisible,
  onClose,
  users,
}: LeaderboardProps) {
  const formatTime = (seconds: number, milliseconds: number): string => {
    const totalSeconds = seconds + milliseconds / 1000;
    return `${totalSeconds.toFixed(2)}s`;
  };

  const content = () => {
    if (users.length == 0) {
      return ( 
        <View style={styles.emptyViewWrapper}>
          <ThemedText type='title'>
            No scores yet
          </ThemedText>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollView}>
        {users.map((user) => (
          <View key={user.id} style={styles.userItem}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.id}</Text>
              <Text style={styles.userTime}>
                Time: {formatTime(user.seconds, user.milliseconds)}
              </Text>
            </View>
            
            <View style={styles.stats}>
              <Text style={styles.wins}>Wins: {user.wins}</Text>
              <Text style={styles.loses}>Loses: {user.loses}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Leaderboard</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        {content()}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 20,
    color: '#666',
  },
  emptyViewWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  userTime: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  stats: {
    alignItems: 'flex-end',
  },
  wins: {
    fontSize: 14,
    fontWeight: '500',
    color: '#27ae60',
    marginBottom: 2,
  },
  loses: {
    fontSize: 14,
    color: '#e74c3c',
  },
});

