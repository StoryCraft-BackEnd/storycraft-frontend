import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, Animated, Image } from 'react-native';
import boxstarImage from '@/assets/images/star/boxstar.png';
import animatedToggleButtonStyles from '@/styles/AnimatedToggleButton.styles';

interface AnimatedToggleButtonProps {
  isActive: boolean;
  onPress: () => void;
  activeIcon: string;
  style?: any;
}

export const AnimatedToggleButton: React.FC<AnimatedToggleButtonProps> = ({
  isActive,
  onPress,
  activeIcon,
  style,
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    bounceAnimation.start();

    return () => {
      bounceAnimation.stop();
    };
  }, [bounceAnim]);

  return (
    <Animated.View
      style={[
        animatedToggleButtonStyles.animatedContainer,
        {
          transform: [
            {
              translateY: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -8],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[animatedToggleButtonStyles.button, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {isActive ? (
          <Text style={animatedToggleButtonStyles.buttonText}>{activeIcon}</Text>
        ) : (
          <Image source={boxstarImage} style={animatedToggleButtonStyles.starImage} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedToggleButton;
