import Lottie from "lottie-react-native";
import type { RefObject } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  scrollY: SharedValue<number>;
  animationRef: RefObject<Lottie | null>;
};

export function AnimatedFeedHeader({ scrollY, animationRef }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          scrollY.value,
          [0, 96],
          [1, 0.78],
          Extrapolation.CLAMP
        ),
      },
      {
        translateY: interpolate(
          scrollY.value,
          [0, 120],
          [0, -14],
          Extrapolation.CLAMP
        ),
      },
    ],
    opacity: interpolate(
      scrollY.value,
      [0, 88],
      [1, 0.42],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <Animated.View
      style={[
        styles.wrap,
        headerStyle,
        { backgroundColor: isDark ? "#0a0a0a" : "transparent" },
      ]}
    >
      <Lottie
        ref={animationRef}
        source={require("@/Lottie_animation/threads.json")}
        style={styles.logo}
        loop={false}
        onAnimationFinish={() => animationRef.current?.pause()}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: 14,
    marginBottom: 6,
  },
  logo: {
    width: 96,
    height: 96,
  },
});
