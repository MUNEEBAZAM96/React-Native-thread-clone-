import { Thread } from "@/types/thread";
import { timeAgo } from "@/util/Time_algo";
import { AntDesign, Feather, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import type { ReactElement, ReactNode } from "react";
import { Pressable, StyleSheet, View, useColorScheme } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Text } from "./Themed";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ThreadItemProps {
  thread: Thread;
  /** Used to stagger list item entrance animations */
  index?: number;
}

export const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const SPRING = { damping: 16, stiffness: 380, mass: 0.6 };

function staggeredItemEntering(index: number) {
  const d = Math.min(index * 44, 560);
  return FadeInDown.delay(d).springify().damping(19).stiffness(210);
}

export default function ThreadItem({
  thread,
  index = 0,
}: ThreadItemProps): ReactElement {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const cardBg = isDark ? "#1c1c1e" : "#ffffff";
  const borderColor = isDark ? "#ffffff12" : "#0000000d";
  const shadow = isDark
    ? { shadowColor: "#000", shadowOpacity: 0.45, shadowRadius: 12 }
    : { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 14 };

  const scale = useSharedValue(1);
  const animatedCard = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const goDetail = () => {
    router.push({
      pathname: "/thread-details",
      params: { id: thread.id },
    });
  };

  return (
    <Animated.View
      entering={staggeredItemEntering(index)}
      style={[styles.cardOuter, shadow]}
    >
      <AnimatedPressable
        style={[
          styles.card,
          animatedCard,
          {
            backgroundColor: cardBg,
            borderColor,
          },
        ]}
        onPress={goDetail}
        onPressIn={() => {
          scale.value = withSpring(0.978, SPRING);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, SPRING);
        }}
      >
        <PostLeftSide author={thread.author} replies={thread.replies} />
        <View style={styles.main}>
          <PostHeading
            name={thread.author.name}
            verified={thread.author.verified}
            createdAt={thread.createdAt}
          />
          <Text style={styles.username}>@{thread.author.username}</Text>
          {thread.mention && thread.mentionUser ? (
            <View style={styles.mentionPill}>
              <Text style={styles.mention}>
                with{" "}
                <Text style={styles.mentionBold}>
                  @{thread.mentionUser.username}
                </Text>
              </Text>
            </View>
          ) : null}
          <Text style={styles.body}>{thread.content}</Text>
          {thread.image ? (
            <Animated.View
              entering={FadeInDown.delay(80).springify().damping(20)}
              style={styles.imageWrap}
            >
              <Image
                source={thread.image}
                style={styles.threadImage}
                placeholder={blurhash}
                contentFit="cover"
                transition={400}
              />
            </Animated.View>
          ) : null}
          <BottomIcons />
          <PostFooter replies={thread.repliesCount} likes={thread.likesCount} />
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

function PostLeftSide({
  author,
  replies,
}: Pick<Thread, "author" | "replies">) {
  const scheme = useColorScheme();
  const lineColor = scheme === "light" ? "#00000018" : "#ffffff22";
  const preview = (replies ?? []).slice(0, 3);

  return (
    <View style={styles.leftColumn}>
      <Animated.View
        entering={FadeInDown.delay(40).springify().damping(17)}
        style={styles.avatarRing}
      >
        <Image
          source={author.photo}
          style={styles.avatar}
          placeholder={blurhash}
          contentFit="cover"
          transition={300}
        />
      </Animated.View>
      <View style={[styles.threadLine, { borderColor: lineColor }]} />
      <View style={styles.replyStack}>
        {preview.map((reply, i) => (
          <Animated.View
            key={reply.id}
            entering={FadeInDown.delay(120 + i * 50).springify().damping(18)}
          >
            <Image
              source={reply.author.photo}
              style={{
                width: 10 + i * 4,
                height: 10 + i * 4,
                borderRadius: 20,
              }}
              placeholder={blurhash}
              contentFit="cover"
              transition={300}
            />
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

export function PostHeading({
  name,
  createdAt,
  verified,
}: {
  name: string;
  createdAt: string;
  verified: boolean;
}) {
  const scheme = useColorScheme();
  const muted = scheme === "dark" ? "#a3a3a3" : "#737373";

  return (
    <View style={styles.headingRow}>
      <View style={styles.headingLeft}>
        <Text style={styles.displayName}>{name}</Text>
        {verified ? (
          <MaterialIcons name="verified" size={15} color="#60a5fa" />
        ) : null}
      </View>
      <View style={styles.headingRight}>
        <Text style={[styles.time, { color: muted }]}>{timeAgo(createdAt)}</Text>
        <Feather name="more-horizontal" size={16} color={muted} />
      </View>
    </View>
  );
}

export function PostFooter({
  replies,
  likes,
}: {
  replies: number;
  likes: number;
}) {
  const scheme = useColorScheme();
  const muted = scheme === "dark" ? "#a3a3a3" : "#737373";

  return (
    <Text style={[styles.footerMeta, { color: muted }]}>
      {replies} {replies === 1 ? "reply" : "replies"} · {likes}{" "}
      {likes === 1 ? "like" : "likes"}
    </Text>
  );
}

function IconHit({ children }: { children: ReactNode }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      hitSlop={10}
      onPressIn={() => {
        scale.value = withSpring(0.82, { damping: 12, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 320 });
      }}
    >
      <Animated.View style={style}>{children}</Animated.View>
    </Pressable>
  );
}

export function BottomIcons() {
  const iconSize = 22;
  const scheme = useColorScheme();
  const iconColor = scheme === "dark" ? "#e5e5e5" : "#171717";

  return (
    <View style={styles.iconRow}>
      <IconHit>
        <FontAwesome name="heart-o" size={iconSize} color={iconColor} />
      </IconHit>
      <IconHit>
        <Ionicons name="chatbubble-outline" size={iconSize} color={iconColor} />
      </IconHit>
      <IconHit>
        <AntDesign name="retweet" size={iconSize} color={iconColor} />
      </IconHit>
      <IconHit>
        <Feather name="send" size={iconSize} color={iconColor} />
      </IconHit>
    </View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginBottom: 14,
    borderRadius: 18,
    marginHorizontal: 2,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  card: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  main: {
    flex: 1,
    minWidth: 0,
    gap: 7,
  },
  leftColumn: {
    alignItems: "center",
    width: 44,
  },
  avatarRing: {
    padding: 2,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#6366f155",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  threadLine: {
    width: 0,
    flexGrow: 1,
    minHeight: 12,
    borderLeftWidth: 1,
    marginVertical: 4,
  },
  replyStack: {
    alignItems: "center",
    gap: 4,
    paddingBottom: 4,
  },
  username: {
    fontSize: 13,
    opacity: 0.55,
    marginTop: -2,
  },
  mentionPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#6366f118",
  },
  mention: {
    fontSize: 12,
    opacity: 0.9,
  },
  mentionBold: {
    fontWeight: "700",
    opacity: 1,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.15,
  },
  imageWrap: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 4,
  },
  threadImage: {
    width: "100%",
    minHeight: 200,
    borderRadius: 14,
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  headingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  headingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  displayName: {
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  time: {
    fontSize: 13,
  },
  footerMeta: {
    fontSize: 13,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
    marginTop: 4,
    paddingVertical: 2,
  },
});
