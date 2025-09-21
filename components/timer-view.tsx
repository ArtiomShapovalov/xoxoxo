import React, { 
  useState, 
  useEffect, 
  useRef, 
  forwardRef, 
  useImperativeHandle 
} from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export interface TimeValue {
  seconds: number;
  milliseconds: number;
}

export interface TimerHandle {
  start: () => void;
  stop: () => void;
}

export const TimerView = forwardRef<TimerHandle, TimerProps>(({ 
  ...otherProps
}: TimerProps, ref) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [milliseconds, setMilliseconds] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const start = () => {
    if (!running) { 
      setSeconds(0);
      setMilliseconds(0);
    }
    setRunning(true);
  };
  const stop = () => {
    setRunning(false);
  };
  const getTimeValue = (): TimeValue => {
    return { seconds: seconds, milliseconds: milliseconds };
  } 

  useImperativeHandle(ref, () => ({
    start, 
    stop,
    getTimeValue,
  }));

  const formatTime = (secs: number, millis: number): string => {
    const formattedSeconds = secs.toString().padStart(2, '0');
    const formattedMilliseconds = Math.floor(millis / 10).toString().padStart(2, '0');
    return `${formattedSeconds}:${formattedMilliseconds}`;
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setMilliseconds(prevMillis => {
          const newMillis = prevMillis + 10;
          if (newMillis >= 1000) {
            setSeconds(prevSeconds => prevSeconds + 1);
            return 0;
          }
          return newMillis;
        });
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running]);

  return <ThemedView>
    <ThemedText type='title'>
      {formatTime(seconds, milliseconds)}
    </ThemedText>
  </ThemedView>
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  }
});
