import { AnimatedFeedHeader } from "@/components/AnimatedFeedHeader";
import ThreadItem from "@/components/Threads_Item";
import { ThreadContext } from "@/Context/Thread-contest";
import { Thread } from "@/types/thread";
import Lottie from "lottie-react-native";
import * as React from "react";
import {
  ListRenderItem,
  Platform,
  RefreshControl,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export default function TabOneScreen() {
  const animationRef = React.useRef<Lottie>(null);
  const { threads, refresh } = React.useContext(ThreadContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refresh();
    animationRef.current?.play();
    setTimeout(() => setRefreshing(false), 520);
  }, [refresh]);

  const renderItem: ListRenderItem<Thread> = React.useCallback(
    ({ item, index }) => <ThreadItem thread={item} index={index} />,
    []
  );

  const listHeader = React.useCallback(
    () => (
      <AnimatedFeedHeader scrollY={scrollY} animationRef={animationRef} />
    ),
    [scrollY]
  );

  const screenBg = isDark ? "#000000" : "#ebebef";

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: screenBg }]}
      edges={["top", "left", "right"]}
    >
      <Animated.FlatList<Thread>
        data={threads}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Platform.OS === "ios" ? (isDark ? "#ffffff" : "#000000") : undefined}
            progressViewOffset={Platform.OS === "android" ? 0 : undefined}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 32,
    flexGrow: 1,
  },
});
