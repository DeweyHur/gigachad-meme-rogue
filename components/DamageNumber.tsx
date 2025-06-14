import React, { useRef, useEffect } from 'react';
import { Text, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS } from '@/constants/colors';

type DamageNumberProps = {
  value: number;
  type: 'damage' | 'block' | 'heal';
  position: { x: number; y: number };
  onComplete: () => void;
};

export default function DamageNumber({ value, type, position, onComplete }: DamageNumberProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1.2,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -50,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onComplete();
    });
  }, []);
  
  const getColor = () => {
    switch (type) {
      case 'damage':
        return COLORS.danger;
      case 'block':
        return COLORS.info;
      case 'heal':
        return COLORS.success;
      default:
        return COLORS.text;
    }
  };
  
  const getPrefix = () => {
    switch (type) {
      case 'damage':
        return '-';
      case 'block':
        return '+🛡️ ';
      case 'heal':
        return '+❤️ ';
      default:
        return '';
    }
  };
  
  return (
    <Animated.Text
      style={[
        styles.number,
        {
          color: getColor(),
          opacity,
          transform: [
            { translateY },
            { scale },
          ],
          left: position.x,
          top: position.y,
        },
      ]}
    >
      {getPrefix()}{value}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  number: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});