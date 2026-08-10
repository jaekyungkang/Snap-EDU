import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { ResumableZoom } from "react-native-zoom-toolkit";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../utils/hooks/supabase";
const islandImage = require("../../assets/island.png");
const logoImage = require("../../assets/logo.png");
const bitmojiImage = require("../../assets/daniel.png");
// const meche = require("../../assets/meche.png");
const pathwayImages = {
  meche: require("../../assets/meche.png"),
  culinary: require("../../assets/culinary.png"),
  cs: require("../../assets/cs.png"),
  chem: require("../../assets/chem.png"),
  music: require("../../assets/music.png"),
  law: require("../../assets/law.png"),
  film: require("../../assets/film.png"),
  bio: require("../../assets/biology.png"),
};
export default function IslandScreen({ navigation }) {
  // controls which part of IslandScreen is currently visible.
  const [step, setStep] = useState("start");

  const closeIsland = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <Pressable
          style={styles.closeButton}
          onPress={closeIsland}
          hitSlop={12}
        >
          <Text style={styles.closeText}>×</Text>
        </Pressable>

        {step === "start" && <StartView onPlay={() => setStep("intro")} />}

        {step === "intro" && <IntroView onContinue={() => setStep("game")} />}

        {step === "game" && <GameView navigation={navigation} />}
      </SafeAreaView>
    </View>
  );
}

function StartView({ onPlay }) {
  const { width } = useWindowDimensions();

  const islandWidth = Math.min(width * 0.95, 450);
  const islandHeight = islandWidth * 0.82;

  return (
    <View style={styles.content}>
      <ImageBackground
        source={islandImage}
        resizeMode="contain"
        style={[
          styles.startIsland,
          {
            width: islandWidth,
            height: islandHeight,
          },
        ]}
      >
        <Image source={logoImage} resizeMode="contain" style={styles.logo} />
      </ImageBackground>

      <YellowButton text="PLAY" onPress={onPlay} />
    </View>
  );
}

function IntroView({ onContinue }) {
  const { width } = useWindowDimensions();

  const islandWidth = Math.min(width * 1.4, 620);
  const islandHeight = islandWidth * 0.82;

  return (
    <View style={styles.content}>
      <Image
        source={islandImage}
        resizeMode="contain"
        style={[
          styles.introIsland,
          {
            width: islandWidth,
            height: islandHeight,
          },
        ]}
      />

      <View style={styles.introCard}>
        <Text style={styles.introLabel}>INTRO</Text>

        <Text style={styles.introTitle}>Welcome to{"\n"}SNAP ISLAND!</Text>

        <Text style={styles.introDescription}>
          A place for students of all backgrounds to discover and explore future
          career and major options.
        </Text>
      </View>

      <YellowButton text="LET'S GO!" onPress={onContinue} />
    </View>
  );
}

function GameView({ navigation }) {
  const { width, height } = useWindowDimensions();

  const [pathwayAssets, setPathwayAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const categories = ["ALL", "TECH", "ARTS", "SOCIETY", "SCIENCE"];
  const islandWidth = Math.max(width * 2, 800);
  const islandHeight = islandWidth * 0.82;

  useEffect(() => {
    fetchPathwayAssets();
  }, []);

  async function fetchPathwayAssets() {
    try {
      setLoadingAssets(true);

      const { data, error } = await supabase
        .from("tags")
        .select("id, tag, asset_key, top_position, left_position, category")
        .not("top_position", "is", null)
        .not("left_position", "is", null);

      if (error) {
        throw error;
      }

      setPathwayAssets(data || []);
    } catch (error) {
      console.error("Error loading island assets:", error);

      Alert.alert("Error", "We couldn't load the island pathways.");
    } finally {
      setLoadingAssets(false);
    }
  }

  const openLesson = (asset) => {
    Alert.alert(
      asset.tag,
      `Coming soon! This will open the ${asset.tag} lesson.`,
    );

    /*
  navigation.navigate("Lesson", {
    pathway: asset.id,
    title: asset.tag,
  });
  */
  };
  const filteredAssets =
    selectedCategory === "ALL"
      ? pathwayAssets
      : pathwayAssets.filter((asset) => asset.category === selectedCategory);

  return (
    <View style={styles.gameViewport}>
      <View style={styles.categoryFilter}>
        {categories.map((category) => (
          <Pressable
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonSelected,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category &&
                  styles.categoryButtonTextSelected,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </View>
      <ResumableZoom
        minScale={1}
        maxScale={2.5}
        panEnabled
        pinchEnabled
        tapsEnabled={false}
      >
        <View
          style={[
            styles.islandCanvas,
            {
              width: islandWidth,
              height: islandHeight,
            },
          ]}
        >
          <ImageBackground
            source={islandImage}
            resizeMode="contain"
            style={styles.gameIsland}
          >
            {filteredAssets.map((asset) => {
              const imageSource = pathwayImages[asset.asset_key];

              // Prevent the app from crashing if Supabase contains
              // an asset_key we haven't added locally yet.
              if (!imageSource) {
                console.warn(
                  `No image found for asset key: ${asset.asset_key}`,
                );

                return null;
              }

              return (
                <Pressable
                  key={asset.id}
                  style={[
                    styles.assetButton,
                    {
                      top: `${asset.top_position}%`,
                      left: `${asset.left_position}%`,
                    },
                  ]}
                  onPress={() => openLesson(asset)}
                  hitSlop={10}
                >
                  {({ pressed }) => (
                    <View
                      style={[
                        styles.assetButtonContent,
                        pressed && styles.assetPressed,
                      ]}
                    >
                      <Image
                        source={imageSource}
                        resizeMode="contain"
                        style={styles.assetImage}
                      />

                      <Text style={styles.assetLabel}>
                        {asset.tag.toUpperCase()}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}

            <Image
              source={bitmojiImage}
              resizeMode="contain"
              style={styles.bitmoji}
            />
          </ImageBackground>
        </View>
      </ResumableZoom>

      {loadingAssets && (
        <View style={styles.loadingAssets}>
          <Text style={styles.loadingAssetsText}>Loading island...</Text>
        </View>
      )}
    </View>
  );
}

function YellowButton({ text, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.yellowButton,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.buttonHighlight} />

      <Text style={styles.yellowButtonText}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#20AAF0",
  },

  safeArea: {
    flex: 1,
  },

  closeButton: {
    position: "absolute",
    top: 100,
    left: 18,
    zIndex: 20,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "200",
    lineHeight: 44,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  startIsland: {
    alignItems: "center",
    justifyContent: "flex-start",
  },

  logo: {
    width: "80%",
    height: "75%",
    marginTop: 10,
  },

  introIsland: {
    position: "absolute",
    top: "18%",
  },

  introCard: {
    width: 240,
    paddingHorizontal: 24,
    paddingVertical: 30,
    borderRadius: 40,
    backgroundColor: "#FFD8C7",
    alignItems: "center",
    zIndex: 2,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },

  introLabel: {
    color: "#090909B2",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
  },

  introTitle: {
    color: "#090909B2",
    fontSize: 21,
    lineHeight: 24,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 14,
  },

  introDescription: {
    color: "#090909B2",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  yellowButton: {
    minWidth: 135,
    height: 54,
    paddingHorizontal: 24,
    borderRadius: 13,
    backgroundColor: "#FFEB00",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  buttonHighlight: {
    position: "absolute",
    top: 8,
    left: 14,
    right: 14,
    height: 13,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },

  yellowButtonText: {
    color: "#090909B2",
    fontSize: 21,
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  gameViewport: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#20AAF0",
  },

  zoomContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  islandCanvas: {
    alignItems: "center",
    justifyContent: "center",
  },

  gameIsland: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  assetButton: {
    position: "absolute",
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },

  assetButtonContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  assetPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.92 }],
  },

  assetImage: {
    width: 85,
    height: 85,
  },

  assetLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",

    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  loadingAssets: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  loadingAssetsText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },

  bitmoji: {
    position: "absolute",
    width: 110,
    height: 170,
    top: "42%",
    left: "20%",
    zIndex: 6,
  },

  navigationHint: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  navigationHintText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  categoryFilter: {
    position: "absolute",
    top: 18,
    left: 70,
    right: 10,

    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,

    zIndex: 50,
  },

  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,

    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },

  categoryButtonSelected: {
    backgroundColor: "#FFEB00",
  },

  categoryButtonText: {
    color: "#333333",
    fontSize: 10,
    fontWeight: "800",
  },

  categoryButtonTextSelected: {
    color: "#111111",
  },
});
