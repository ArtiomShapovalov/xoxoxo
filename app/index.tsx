import { Image } from 'expo-image';
import { Platform, View, StyleSheet } from 'react-native';
import React, { useState } from 'react';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MainScreenWrapper } from '@/components/main-screen-wrapper'
import { Board, GameResult, XShape, OShape } from '@/components/board'
import { Link } from 'expo-router';

type Score = {
  x: number;
  o: number;
};

export default function HomeScreen() {
  const [score, setScore] = useState<Score>({ x: 0, o: 0 });
  const onGameResult = (gameResult: GameResult) => {
    let newScore = { ...score };
    if (gameResult == 'x') {
      newScore.x += 1;
    } else if (gameResult == 'o') {
      newScore.o += 1;
    }
    setScore(newScore);
  };

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
  }
});
