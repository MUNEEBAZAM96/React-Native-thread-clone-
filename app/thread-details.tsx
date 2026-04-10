import {
  blurhash,
  BottomIcons,
  PostFooter,
  PostHeading,
} from "@/components/Threads_Item";
import { Text, View } from "@/components/Themed";
import { useThreads } from "@/Context/Thread-contest";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useLayoutEffect } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown, FadeInRight } from "react-native-reanimated";

export default function ThreadDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const threads = useThreads();
  const thread = threads.find((t) => t.id === id);
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  useLayoutEffect(() => {
    navigation.setOptions({
      title: thread ? `@${thread.author.username}` : "Thread",
    });
  }, [navigation, thread]);

  if (!thread) {
    return (
      <SafeAreaView style={styles.centered} edges={["bottom"]}>
        <Stack.Screen options={{ title: "Thread" }} />
        <Animated.View entering={FadeIn.duration(420).springify().damping(18)}>
          <Text style={styles.muted}>This thread could not be found.</Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  const borderColor = isDark ? "#ffffff14" : "#00000012";
  const cardBg = isDark ? "#1c1c1e" : "#ffffff";
  const replyBg = isDark ? "#2c2c2e" : "#f5f5f7";

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: isDark ? "#000" : "#ebebef" }]}
      edges={["bottom"]}
    >
      <Animated.ScrollView
        entering={FadeIn.duration(380).springify().damping(20)}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.springify().damping(19).stiffness(200)}
          style={[styles.mainCard, { backgroundColor: cardBg, borderColor }]}
        >
          <View style={styles.row}>
            <Animated.View
              entering={FadeInRight.delay(60).springify().damping(17)}
              style={styles.avatarRing}
            >
              <Image
                source={thread.author.photo}
                style={styles.avatar}
                placeholder={blurhash}
                contentFit="cover"
                transition={400}
              />
            </Animated.View>
            <View style={styles.body}>
              <PostHeading
                name={thread.author.name}
                verified={thread.author.verified}
                createdAt={thread.createdAt}
              />
              <Text style={styles.handle}>@{thread.author.username}</Text>
              <Text style={styles.content}>{thread.content}</Text>
              {thread.image ? (
                <Animated.View
                  entering={FadeInDown.delay(100).springify().damping(20)}
                  style={styles.mediaWrap}
                >
                  <Image
                    source={thread.image}
                    style={styles.media}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={450}
                  />
                </Animated.View>
              ) : null}
              <BottomIcons />
              <PostFooter replies={thread.repliesCount} likes={thread.likesCount} />
            </View>
          </View>
        </Animated.View>

        {thread.replies && thread.replies.length > 0 ? (
          <View style={styles.repliesSection}>
            <Animated.View
              entering={FadeInDown.delay(40).springify().damping(18)}
            >
              <Text style={styles.repliesTitle}>Replies</Text>
            </Animated.View>
            {thread.replies.map((reply, i) => (
              <Animated.View
                key={reply.id}
                entering={FadeInRight.delay(70 + i * 52)
                  .springify()
                  .damping(19)
                  .stiffness(200)}
                style={[
                  styles.replyCard,
                  { backgroundColor: replyBg, borderColor },
                ]}
              >
                <Image
                  source={reply.author.photo}
                  style={styles.replyAvatar}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={300}
                />
                <View style={styles.replyBody}>
                  <Text style={styles.replyAuthor}>{reply.author.name}</Text>
                  <Text style={styles.replyText}>{reply.content}</Text>
                  <Text style={styles.replyMeta}>{reply.likes} likes</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        ) : null}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  muted: { opacity: 0.6 },
  scrollContent: { padding: 14, paddingBottom: 36 },
  mainCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  row: { flexDirection: "row", gap: 14 },
  avatarRing: {
    padding: 2,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#6366f155",
    alignSelf: "flex-start",
  },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  body: { flex: 1, gap: 8 },
  handle: { fontSize: 14, opacity: 0.55, marginTop: -4 },
  content: { fontSize: 16, lineHeight: 24, letterSpacing: 0.2 },
  mediaWrap: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 6,
  },
  media: {
    width: "100%",
    minHeight: 220,
    borderRadius: 16,
  },
  repliesSection: {
    marginTop: 18,
    gap: 10,
  },
  repliesTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  replyCard: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  replyAvatar: { width: 36, height: 36, borderRadius: 18 },
  replyBody: { flex: 1, gap: 5 },
  replyAuthor: { fontWeight: "700", fontSize: 14 },
  replyText: { fontSize: 15, lineHeight: 21 },
  replyMeta: { fontSize: 12, opacity: 0.5 },
});
