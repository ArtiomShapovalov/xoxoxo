import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  NativeModules,
  SafeAreaView,
} from 'react-native';
import { ThemedText } from '@/components/themed-text'

interface LeaderboardProps {
  isVisible: boolean;
  onClose: () => void;
}

type GameSession = {
  userId: string;
  seconds: number;
  milliseconds: number;
  winCount: number;
};

const { API } = NativeModules;

export function Leaderboard({
  isVisible,
  onClose,
}: LeaderboardProps) {
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const formatTime = (seconds: number, milliseconds: number): string => {
    const totalSeconds = seconds + milliseconds / 1000;
    return `${totalSeconds.toFixed(2)}s`;
  };

  const fetchSessions = useCallback(() => {
    if (!isVisible) return;

    API.getSessions((error, sessions) => {
      console.log("[API] Sessions:");
      console.log(sessions);
      setGameSessions(sessions.filter((session) => (session.winCount > 0)));
    });
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      fetchSessions();
    }
  }, [isVisible, fetchSessions]);

  const content = () => {
    if (gameSessions.length == 0) {
      return ( 
        <View style={styles.emptyViewWrapper}>
          <ThemedText type='title'>
            No game sessions
          </ThemedText>
        </View>
      );
    }

    const getMedal = (index: number): string => {
      if (index == 0) {
        return '🥇';
      } else if (index == 1) {
        return '🥈';
      } else if (index == 2) {
        return '🥉';
      }
      return '';
    }

    return (
      <ScrollView style={styles.scrollView}>
        {gameSessions.map((session, index) => (
          <View key={session.userId + index} style={styles.sessionItem}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionUserId}>
                {session.userId.slice(0, 8) + getMedal(index)}
              </Text>
              <Text style={styles.time}>
                Time: {formatTime(session.seconds, session.milliseconds)}
              </Text>
            </View>
            
            <View style={styles.stats}>
              <Text style={styles.wins}>Wins: {session.winCount}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  console.log('leaderboard rendered');

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
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionUserId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  time: {
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
});

