import { 
  View, 
  Animated, 
  TouchableOpacity, 
  StyleSheet, 
  type ViewProps 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useThemeColor } from '@/hooks/use-theme-color';

export type BoardProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  onGameResult: () => void;
};

type CellState = {
  x: boolean;
  o: boolean;
};

export type GameResult = 'playing' | 'x' | 'o' | 'draw';

interface MessageViewProps {
  gameResult: GameResult;
  onHide: () => void;
};

export function Board({ 
  style, 
  lightColor, 
  darkColor, 
  onGameResult, 
  ...otherProps 
}: BoardProps) {
  const backgroundColor = useThemeColor({ 
    light: lightColor, 
    dark: darkColor 
  }, 'background');
  const [cells, setCells] = useState<[CellState]>(
    Array(9).fill().map(() => ({ x: false, o: false }))
  );
  const [gameResult, setGameResult] = useState<GameResult>('playing');
  const winPatterns: number[][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const checkWinner = (currentCells: CellState[]): GameResult => {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (currentCells[a].x && currentCells[b].x && currentCells[c].x) {
        console.log('xWon');
        return 'x';
      }
      if (currentCells[a].o && currentCells[b].o && currentCells[c].o) {
        console.log('oWon');
        return 'o';
      }
    }

    const isDraw = currentCells.every(cell => cell.x|| cell.o);
    if (isDraw) {
      console.log('Draw');
      return 'draw';
    }
    return 'playing';
  };

  const botMove = (index: number, newCells: [CellState]) => {
    const emptyCells: [number] = [];

    cells.map((cell, idx) => {
      if (!cell.x && !cell.o) {
        emptyCells.push(idx);
      }
    });

    console.log(emptyCells);

    if (emptyCells.length > 0) {
      const oIndex = Math.floor(Math.random() * (emptyCells.length - 1));
      console.log(oIndex);
      newCells[emptyCells[oIndex]].o = true;
    } else {
      console.log(newCells);
    }

    const result = checkWinner(newCells);

    if (result != 'playing') {
      setGameResult(result);
      setCells(Array(9).fill().map(() => ({ x: false, o: false })));
      onGameResult(result);
      return;
    }

    setCells(newCells);
  };
  const handleCellPress = (index: number) => {
    if (cells[index].x == true || cells[index].o == true) {
      return;
    }

    const newCells = [...cells];
    
    newCells[index].x = true;
    botMove(index, newCells);
  }

  const renderCellContent = (cell, index) => {
    if (cell.x) {
      return <XShape />;
    } else if (cell.o) {
      return <OShape />;
    }
    return null;
  };

  const renderCell = (cell: CellState, index: number) => {
    return (
      <TouchableOpacity 
        key={index} 
        onPress={() => handleCellPress(index)}
        style={styles.cell}
      >
        {renderCellContent(cell, index)}
      </TouchableOpacity>
    );
  };

  const renderRow = (rowIndex: number) => {
    const startIndex = rowIndex * 3;
    return (
      <View key={rowIndex} style={styles.row}>
        {renderCell(cells[startIndex], startIndex)}
        {renderCell(cells[startIndex + 1], startIndex + 1)}
        {renderCell(cells[startIndex + 2], startIndex + 2)}
      </View>
    );
  };

  const viewStyle = [
    { backgroundColor }, 
    styles.container,
    style
  ];

  return <View style={viewStyle} {...otherProps}>
    {[0, 1, 2].map(renderRow)}
    <GameResultView 
      gameResult={gameResult} 
      onHide={() => { setGameResult('playing') }} 
    />
  </View>;
}

// X Shape
export const XShape = () => {
  return (
    <View style={styles.xContainer}>
      <View style={[styles.xLine, styles.xLine1]} />
      <View style={[styles.xLine, styles.xLine2]} />
    </View>
  );
};

// O Shape
export const OShape = () => {
  return (
    <View style={styles.oContainer}>
      <View style={styles.oCircle} />
    </View>
  );
};

// Draw Shape
const DrawShape = () => {
  return (
    <View style={styles.xContainer}>
      <View style={[styles.xLine, styles.xLine1, { backgroundColor: '#e0e0e0' }]} />
    </View>
  );
};

const GameResultView: React.FC<MessageViewProps> = ({ gameResult, onHide }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const visible = gameResult != 'playing';

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, fadeAnim, onHide]);

  if (!visible) {
    return null;
  }

  const renderResult = (result: GameResult) => {
    if (gameResult == 'x') {
      return <XShape />
    }
    if (gameResult == 'o') {
      return <OShape />
    }
    return <DrawShape />
  };

  return (
    <Animated.View 
      style={[
        styles.gameResultContainer,
        { 
          opacity: fadeAnim,
          transform: [{
            scale: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1]
            })
          }]
        }
      ]}
    >
      <View style={styles.gameResultBackground} />
      {renderResult(gameResult)}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    flex: '100%', 
  },
  cell: {
    aspectRatio: 1, 
    flex: 1, 
    margin: 4, 
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // X Shape Styles
  xContainer: {
    width: '70%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  xLine: {
    position: 'absolute',
    backgroundColor: '#FF6B6B',
    width: '100%',
    height: 8,
    borderRadius: 4,
  },
  xLine1: {
    transform: [{ rotate: '45deg' }],
  },
  xLine2: {
    transform: [{ rotate: '-45deg' }],
  },
  // O Shape Styles
  oContainer: {
    width: '70%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  oCircle: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    borderWidth: 8,
    borderColor: '#4ECDC4',
  },
  // GameResultView Styles
  gameResultContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 1000,
  },
  gameResultBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 12,
  },
  gameResultContent: {
    alignItems: 'center',
    padding: 20,
  },
});
