import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Modal,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

/**
 * GameScreen.js
 * -------------------------------------------------------------------------
 * Drag-and-drop "Motor Rig Build-Out" game.
 *
 * Flow:
 *  1. Four parts must be installed in order: Engine -> Bearing -> Stator -> Rotor
 *  2. Only the current step's part card is draggable; the rest are locked
 *     and show "Waiting on the sequence."
 *  3. Drag the active part card up into the drop zone at the top. If it
 *     overlaps the zone on release, it "snaps in" and a popup explains
 *     what was just installed and why it matters.
 *  4. After the Rotor (the last step) is installed, the screen swaps to a
 *     "Generator Complete" reward screen, where every button is pressable
 *     and reveals its own text when tapped.
 *
 * No extra libraries required beyond what's already in a standard RN /
 * Expo + React Navigation project -- dragging is done with the built-in
 * PanResponder + Animated APIs.
 *
 * IMAGE ASSETS
 * Drop these four PNGs into  assets/game/  at your project root
 * (i.e. sibling to your top-level App.js / app folder):
 *   assets/game/enginebase.png
 *   assets/game/bearingbase.png
 *   assets/game/statorbase.png
 *   assets/game/rotorbase.png
 * If GameScreen.js lives somewhere other than two folders deep, adjust
 * the require() paths below to match (same pattern TaskScreen.js uses
 * for "../../lesson.json").
 * -------------------------------------------------------------------------
 */

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// How many pixels of slack to give around the drop zone when checking
// whether a card was dropped "close enough." Bigger number = more forgiving.
const DROP_TOLERANCE = 40;

const PARTS = [
  {
    id: "engine",
    stepLabel: "01 ENGINE",
    partNumber: "DR-1140",
    name: "Drive Engine",
    icon: require("../../assets/game/enginebase.png"),
    hint: "Bolts to the bed plate and sets the shaft line.",
    popupTitle: "Drive Engine Installed",
    popupText:
      "The drive engine is the power source of the whole rig. It converts fuel or electrical energy into rotational motion, spinning the main shaft that every other part lines up against. Get this misaligned and nothing downstream will spin true.",
  },
  {
    id: "bearing",
    stepLabel: "02 BEARING",
    partNumber: "BR-0307",
    name: "Journal Bearing",
    icon: require("../../assets/game/bearingbase.png"),
    hint: "Supports the shaft and keeps friction low.",
    popupTitle: "Journal Bearing Installed",
    popupText:
      "The journal bearing cradles the spinning shaft and lets it rotate with minimal friction. Without it, metal would grind directly on metal, generating heat and wearing the shaft down fast. It also keeps the shaft centered so it doesn't wobble.",
  },
  {
    id: "stator",
    stepLabel: "03 STATOR",
    partNumber: "ST-0925",
    name: "Stator Core",
    icon: require("../../assets/game/statorbase.png"),
    hint: "Stays fixed in place around the shaft.",
    popupTitle: "Stator Core Installed",
    popupText:
      "The stator is the stationary part wrapped in copper windings. As the rotor spins its magnetic field past the stator, it induces an electrical current — this is the core of how a generator actually makes electricity.",
  },
  {
    id: "rotor",
    stepLabel: "04 ROTOR",
    partNumber: "RO-0418",
    name: "Rotor Assembly",
    icon: require("../../assets/game/rotorbase.png"),
    hint: "The final piece — completes the generator.",
    popupTitle: "Rotor Assembly Installed",
    popupText:
      "The rotor is the rotating magnetic core at the heart of the generator. Spinning inside the stator, it's the last piece of the puzzle — with it installed, your generator is fully assembled and ready to produce power.",
  },
];

// Text revealed when each Learn More button on the completion screen is pressed.
const LEARN_MORE_INFO = {
  DIY: "Are you interested in learning more about engineering? Check out this video on learning how to build a potato battery athome! https://youtu.be/U74F00oRuEY?si=u41g1dCwzInrCQZU",
  SCHOOLS:
    "Many schools offer mechanical engineering programs for students. A couple of them include Cal Poly SLO, Pasadena City College, and UC Berkeley.",
  PROGRAMS:
    "Interested in a summer program? Look into the Research Science Institute or the Engineering Summer Academy at Penn.",
  LEARN:
    "Enjoyed this? You might also like Aerospace, Robotics, Civil, Electrical, and many more engineering fields.",
};

export default function GameScreen() {
  const navigation = useNavigation();

  const [stepIndex, setStepIndex] = useState(0); // which part is currently active
  const [installed, setInstalled] = useState([]); // ids of parts already placed
  const [popupPart, setPopupPart] = useState(null); // part object shown in popup
  const [missMessage, setMissMessage] = useState(""); // shown briefly on a bad drop
  const [gameComplete, setGameComplete] = useState(false);

  // Position of the drop zone in absolute screen coordinates, captured on layout.
  const dropZoneRef = useRef(null);
  const dropZoneLayout = useRef({ pageX: 0, pageY: 0, width: 0, height: 0 });

  // Animated position of the currently-draggable card.
  const pan = useRef(new Animated.ValueXY()).current;

  // IMPORTANT: PanResponder.create(...) below only runs ONCE (it's wrapped
  // in useRef so it survives re-renders). That means any plain `const` or
  // function declared in the component body that its handlers close over
  // gets "frozen" at whatever value it had on the very first render.
  // stepIndex changes on every successful drop, but the PanResponder's
  // closures would never see the update -- they'd keep reading the
  // step-0 value forever. To avoid that stale-closure trap, we mirror
  // stepIndex into a ref and have the PanResponder read from the ref
  // (refs are mutable and always reflect the latest value, even inside
  // a closure created long ago).
  const stepIndexRef = useRef(stepIndex);
  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  const activePart = PARTS[stepIndex];

  // Re-measures the drop zone's real on-screen position. Uses
  // measureInWindow (more reliable than measure()) and is called both on
  // layout AND right when a drag starts, so the coordinates are always
  // fresh even if something shifted (header, safe area, re-render, etc).
  const handleDropZoneLayout = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.measureInWindow((x, y, width, height) => {
        dropZoneLayout.current = { pageX: x, pageY: y, width, height };
      });
    }
  };

  // Checks whether a drop point is inside the drop zone, padded out by
  // DROP_TOLERANCE on every side so near-misses still register as a hit.
  const isOverDropZone = (moveX, moveY) => {
    const { pageX, pageY, width, height } = dropZoneLayout.current;
    return (
      moveX >= pageX - DROP_TOLERANCE &&
      moveX <= pageX + width + DROP_TOLERANCE &&
      moveY >= pageY - DROP_TOLERANCE &&
      moveY <= pageY + height + DROP_TOLERANCE
    );
  };

  // Reads the current step from the ref (not the `activePart` const) so
  // it's always accurate even when called from the long-lived
  // PanResponder closure below.
  const handleSuccessfulDrop = () => {
    const part = PARTS[stepIndexRef.current];
    setInstalled((prev) => [...prev, part.id]);
    setPopupPart(part);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Re-measure right as the drag begins so we have accurate,
        // up-to-date drop zone coordinates for this specific drag.
        handleDropZoneLayout();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, gestureState) => {
        const dropped = isOverDropZone(gestureState.moveX, gestureState.moveY);

        if (dropped) {
          handleSuccessfulDrop();
        } else {
          setMissMessage("Not quite — drag it into the marked opening.");
          setTimeout(() => setMissMessage(""), 1400);
        }

        // Snap the card back to its home position either way.
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 6,
        }).start();
      },
    }),
  ).current;

  const handlePopupContinue = () => {
    setPopupPart(null);
    if (stepIndex === PARTS.length - 1) {
      setGameComplete(true);
    } else {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handlePlayAgain = () => {
    setStepIndex(0);
    setInstalled([]);
    setGameComplete(false);
    pan.setValue({ x: 0, y: 0 });
  };

  const handleClose = () => {
    // Falls back gracefully even if GameScreen wasn't pushed from TaskScreen.
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  if (gameComplete) {
    return (
      <CompletionScreen onClose={handleClose} onPlayAgain={handlePlayAgain} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>ASSEMBLY BAY · SEQUENCE</Text>
        <Text style={styles.title}>Motor Rig Build-Out</Text>
      </View>

      {/* Step tabs */}
      <View style={styles.tabRow}>
        {PARTS.map((part, i) => {
          const isActive = i === stepIndex;
          const isDone = installed.includes(part.id);
          return (
            <View
              key={part.id}
              style={[
                styles.tab,
                isActive && styles.tabActive,
                isDone && styles.tabDone,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.tabTextActive,
                  isDone && styles.tabTextDone,
                ]}
              >
                {part.stepLabel}
                {isDone ? " ✓" : ""}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Drop zone */}
      <View
        ref={dropZoneRef}
        onLayout={handleDropZoneLayout}
        style={styles.dropZone}
      >
        <Image
          source={activePart.icon}
          style={styles.dropZoneImage}
          resizeMode="contain"
        />
        <View style={styles.dropZoneCaption}>
          <Text style={styles.dropZoneText}>
            {missMessage ? missMessage : `Drag the ${activePart.name} here`}
          </Text>
        </View>
      </View>

      {/* Part cards grid */}
      <View style={styles.grid}>
        {PARTS.map((part, i) => {
          const isActive = i === stepIndex;
          const isDone = installed.includes(part.id);
          const isLocked = !isActive && !isDone;

          const cardContent = (
            <View
              style={[
                styles.card,
                isActive && styles.cardActive,
                isDone && styles.cardDone,
              ]}
            >
              <Image
                source={part.icon}
                style={styles.cardImage}
                resizeMode="contain"
              />
              {isActive && <Text style={styles.dragBadge}>● DRAG</Text>}
              <Text style={styles.cardName}>{part.name}</Text>
              <Text style={styles.cardPartNumber}>{part.partNumber}</Text>
              <Text style={styles.cardHint}>
                {isDone
                  ? "Installed."
                  : isLocked
                    ? "Waiting on the sequence."
                    : part.hint}
              </Text>
            </View>
          );

          // Only the active card is draggable.
          if (isActive) {
            return (
              <Animated.View
                key={part.id}
                {...panResponder.panHandlers}
                style={[
                  styles.cardWrapper,
                  { transform: pan.getTranslateTransform() },
                ]}
              >
                {cardContent}
              </Animated.View>
            );
          }

          return (
            <View key={part.id} style={styles.cardWrapper}>
              {cardContent}
            </View>
          );
        })}
      </View>

      {/* Popup shown after a correct drop */}
      <Modal
        visible={!!popupPart}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {popupPart && (
              <Image
                source={popupPart.icon}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
            <Text style={styles.modalTitle}>{popupPart?.popupTitle}</Text>
            <Text style={styles.modalBody}>{popupPart?.popupText}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handlePopupContinue}
            >
              <Text style={styles.modalButtonText}>
                {stepIndex === PARTS.length - 1 ? "Finish" : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Completion screen — styled after the "Generator Complete" reference */
/* ------------------------------------------------------------------ */

function CompletionScreen({ onClose, onPlayAgain }) {
  const navigation = useNavigation();
  const [activeInfo, setActiveInfo] = useState(null); // "DIY" | "SCHOOLS" | "PROGRAMS" | "LEARN" | null

  const goToLessons = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleLearnPress = (key) => {
    // Tapping the same button again collapses the text; tapping a
    // different one swaps straight to the new text.
    setActiveInfo((prev) => (prev === key ? null : key));
  };

  return (
    <SafeAreaView style={styles.completeContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.starsRow}>
        <Text style={styles.starSmall}>⭐</Text>
        <Text style={styles.starBig}>⭐</Text>
        <Text style={styles.starSmall}>⭐</Text>
      </View>

      <View style={styles.ribbon}>
        <Text style={styles.ribbonEyebrow}>GENERATOR</Text>
        <Text style={styles.ribbonTitle}>COMPLETE</Text>
      </View>

      <View style={styles.rewardCard}>
        <Text style={styles.rewardLabel}>REWARD</Text>

        <View style={styles.rewardPill}>
          <Text style={styles.coin}>🪙</Text>
          <Text style={styles.rewardAmount}>32</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.progressLabel}>35%</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: "35%" }]} />
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={goToLessons}>
          <Text style={styles.nextButtonText}>Back to the Island</Text>
        </TouchableOpacity>

        <Text style={styles.learnMoreLabel}>Learn More</Text>

        <View style={styles.learnGrid}>
          <TouchableOpacity
            style={[
              styles.learnButton,
              { backgroundColor: "#F5C518" },
              activeInfo === "DIY" && styles.learnButtonActive,
            ]}
            onPress={() => handleLearnPress("DIY")}
            activeOpacity={0.75}
          >
            <Text style={styles.learnButtonText}>DIY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.learnButton,
              { backgroundColor: "#3B82F6" },
              activeInfo === "SCHOOLS" && styles.learnButtonActive,
            ]}
            onPress={() => handleLearnPress("SCHOOLS")}
            activeOpacity={0.75}
          >
            <Text style={styles.learnButtonText}>SCHOOLS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.learnButton,
              { backgroundColor: "#EF4444" },
              activeInfo === "PROGRAMS" && styles.learnButtonActive,
            ]}
            onPress={() => handleLearnPress("PROGRAMS")}
            activeOpacity={0.75}
          >
            <Text style={styles.learnButtonText}>PROGRAMS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.learnButton,
              { backgroundColor: "#10B981" },
              activeInfo === "LEARN" && styles.learnButtonActive,
            ]}
            onPress={() => handleLearnPress("LEARN")}
            activeOpacity={0.75}
          >
            <Text style={styles.learnButtonText}>LEARN</Text>
          </TouchableOpacity>
        </View>

        {activeInfo && (
          <View style={styles.infoPanel}>
            <Text style={styles.infoPanelText}>
              {LEARN_MORE_INFO[activeInfo]}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.playAgainButton}
          onPress={onPlayAgain}
          activeOpacity={0.75}
        >
          <Text style={styles.playAgainText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12181A",
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 16,
  },
  eyebrow: {
    color: "#7B8A8C",
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "600",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
  },

  tabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  tab: {
    borderWidth: 1,
    borderColor: "#33403F",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tabActive: {
    borderColor: "#FFFFFF",
  },
  tabDone: {
    borderColor: "#3ED598",
    backgroundColor: "rgba(62,213,152,0.08)",
  },
  tabText: {
    color: "#5C6B6A",
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: "700",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  tabTextDone: {
    color: "#3ED598",
  },

  dropZone: {
    marginTop: 22,
    minHeight: 200,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#3A4A48",
    borderStyle: "dashed",
    backgroundColor: "#1B2325",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  dropZoneImage: {
    width: 110,
    height: 110,
    marginBottom: 10,
  },
  dropZoneCaption: {
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  dropZoneText: {
    color: "#E5E7EB",
    fontSize: 14,
    textAlign: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 22,
    paddingBottom: 30,
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1B2325",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A3435",
    padding: 16,
    minHeight: 190,
  },
  cardActive: {
    borderColor: "#F5C518",
    borderWidth: 2,
  },
  cardDone: {
    borderColor: "#3ED598",
  },
  cardImage: {
    width: 72,
    height: 72,
    marginBottom: 8,
  },
  dragBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    color: "#F5C518",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  cardName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cardPartNumber: {
    color: "#5C6B6A",
    fontSize: 11,
    marginTop: 2,
  },
  cardHint: {
    color: "#9AA6A5",
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },

  // Popup modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    alignItems: "center",
  },
  modalImage: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
    textAlign: "center",
  },
  modalBody: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  // Completion screen
  completeContainer: {
    flex: 1,
    backgroundColor: "#3FA9F5",
    alignItems: "center",
    paddingTop: 20,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "300",
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 30,
    gap: 6,
  },
  starSmall: {
    fontSize: 30,
  },
  starBig: {
    fontSize: 48,
  },
  ribbon: {
    backgroundColor: "#D879E0",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginTop: -6,
    zIndex: 2,
  },
  ribbonEyebrow: {
    color: "#5B2A75",
    fontWeight: "800",
    fontSize: 13,
    letterSpacing: 1,
  },
  ribbonTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 26,
  },
  rewardCard: {
    backgroundColor: "#EBD3B4",
    width: "88%",
    marginTop: -18,
    borderRadius: 26,
    paddingTop: 34,
    paddingHorizontal: 22,
    paddingBottom: 26,
    alignItems: "center",
  },
  rewardLabel: {
    color: "#6B5842",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 1,
  },
  rewardPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBF3E7",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 14,
    width: "100%",
    justifyContent: "center",
  },
  coin: {
    fontSize: 26,
    marginRight: 10,
  },
  rewardAmount: {
    fontSize: 30,
    fontWeight: "800",
    color: "#3A2E22",
  },
  divider: {
    height: 1,
    backgroundColor: "#C9B392",
    width: "100%",
    marginVertical: 18,
  },
  progressLabel: {
    color: "#6B5842",
    fontWeight: "700",
    marginBottom: 6,
    alignSelf: "center",
  },
  progressTrack: {
    height: 10,
    width: "100%",
    backgroundColor: "#FBF3E7",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#D879E0",
  },
  nextButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 14,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 1,
  },
  learnMoreLabel: {
    color: "#6B5842",
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 10,
  },
  learnGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  learnButton: {
    width: "48%",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  learnButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  learnButtonActive: {
    borderWidth: 3,
    borderColor: "#3A2E22",
  },
  infoPanel: {
    backgroundColor: "#FBF3E7",
    borderRadius: 14,
    padding: 16,
    width: "100%",
    marginTop: 4,
    marginBottom: 4,
  },
  infoPanelText: {
    color: "#3A2E22",
    fontSize: 14,
    lineHeight: 21,
  },
  playAgainButton: {
    marginTop: 6,
    paddingVertical: 10,
  },
  playAgainText: {
    color: "#3A2E22",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
