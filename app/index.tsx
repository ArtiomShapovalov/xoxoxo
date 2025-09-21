import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { 
  Platform, 
  View, 
  StyleSheet, 
  NativeModules, 
  TouchableOpacity 
 } from 'react-native';
import React, { useState, useRef } from 'react';
import Entypo from '@expo/vector-icons/Entypo';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MainScreenWrapper } from '@/components/main-screen-wrapper'
import { Board, GameResult, XShape, OShape } from '@/components/board'
import { TimerView, TimeValue, TimerHandle } from '@/components/timer-view'
import { Leaderboard } from '@/components/leaderboard-modal'

type Score = {
  x: number;
  o: number;
};

const { API } = NativeModules;

export default function HomeScreen() {
  const router = useRouter();
  const [score, setScore] = useState<Score>({ x: 0, o: 0 });
  const [isLeaderboardVisible, setLeaderboardVisible] = useState<boolean>(false);
  const timerRef = useRef<TimerHandle>(null);

  const onGameResult = (gameResult: GameResult) => {
    if (gameResult == 'playing') {
      timerRef.current?.start();
      return;
    }

    let newScore = { ...score };
    
    if (gameResult == 'x') {
      newScore.x += 1;
    } else if (gameResult == 'o') {
      newScore.o += 1;
    }

    const { seconds, milliseconds } = timerRef.current?.getTimeValue();
    
    console.log('--------');
    console.log(seconds);
    console.log(milliseconds);
    API.saveProgress(gameResult == 'o', seconds, milliseconds);
    API.sendGameResult(gameResult, (error, userId, message) => {
      console.log("[API] POST GameResult:")
      console.log(error);
      console.log(userId);
      console.log(message);
    });

    timerRef.current?.stop();
    setScore(newScore);
  };

  const showLeaderboard = (): void => {
    setLeaderboardVisible(true);
  };
  const hideLeaderboard = (): void => {
    setLeaderboardVisible(false);
  }

  return (
    <MainScreenWrapper>
      <View style={styles.scoreContainer}>
        <View style={styles.scoreLogo}>
          <XShape />
        </View>
        <ThemedText type="title">
          {score.x}
        </ThemedText>
        <View style={styles.scoreLogo}>
          <OShape />
        </View>
        <ThemedText type="title">
          {score.o}
        </ThemedText>
      </View>

      <Board onGameResult={onGameResult} />

      <View style={styles.bottomContainer}>
        <TimerView ref={timerRef} />
        <TouchableOpacity onPress={showLeaderboard} style={styles.leaderboardButton}>
          <Entypo name="list" size={32} color="#060606" />
        </TouchableOpacity>
      </View>

      <Leaderboard 
        isVisible={isLeaderboardVisible} 
        onClose={hideLeaderboard}
      />
    </MainScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  scoreLogo: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  leaderboardButton: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
