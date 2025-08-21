import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';

interface AnimatedToggleButtonProps {
  isActive: boolean;
  onPress: () => void;
  activeIcon: string;
  inactiveIcon: string;
  style?: any;
}

export const AnimatedToggleButton: React.FC<AnimatedToggleButtonProps> = ({
  isActive,
  onPress,
  activeIcon,
  inactiveIcon,
  style,
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startBounceAnimation = () => {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 3초 후 다시 시작
        setTimeout(startBounceAnimation, 3000);
      });
    };

    startBounceAnimation();

    return () => {
      bounceAnim.stopAnimation();
    };
  }, [bounceAnim]);

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          transform: [
            {
              translateY: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -8], // 위로 8px 이동
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.buttonText}>{isActive ? activeIcon : inactiveIcon}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderWidth: 2,
    borderColor: '#ffd700',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default AnimatedToggleButton;
