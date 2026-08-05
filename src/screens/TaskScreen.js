import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import lesson from "../../lesson.json";
// import AwesomeButton from "react-native-really-awesome-button";
import { useNavigation } from "@react-navigation/native";

export default function TaskScreen() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [selectedTab, setSelectedTab] = useState("");
  // this is for navigating to gamescreen
  const navigation = useNavigation();
  const handleStartGame = () => {
    navigation.navigate("GameScreen");
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView style={styles.scrollView}>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.text}>Generator 101</Text>

            <Text
              style={{
                fontSize: 16,
                color: "#6B7280",
                marginTop: 6,
                lineHeight: 24,
              }}
            >
              Learn dive into the world of engineerinng with our generator!
            </Text>
          </View>

          <View style={styles.card}>
            <Image
              source={{
                uri: lesson[currentLesson].lessonPicture,
              }}
              style={styles.image}
            />

            <Text style={styles.title}>
              {lesson[currentLesson].lessonTitle}
            </Text>

            <Text style={styles.description}>
              {lesson[currentLesson].lessonDescription}
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (currentLesson === lesson.length - 1) {
                  handleStartGame();
                } else {
                  setCurrentLesson(currentLesson + 1);
                }
              }}
            >
              <Text style={styles.buttonText}>
                {currentLesson === lesson.length - 1
                  ? "Start Game"
                  : "View Details"}
              </Text>
            </TouchableOpacity>

            <View style={styles.bottomButtons}>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => setSelectedTab("DIY")}
              >
                <Text style={styles.smallButtonText}>DIY</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => setSelectedTab("Schools")}
              >
                <Text style={styles.smallButtonText}>Schools</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => setSelectedTab("Programs")}
              >
                <Text style={styles.smallButtonText}>Programs</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => setSelectedTab("Learn")}
              >
                <Text style={styles.smallButtonText}>Learn</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contentArea}>
              {selectedTab === "DIY" && (
                <Text style={styles.contentText}>
                  Are you interested in learning more about engineering? Check
                  out this video on learning how to build a potato battery at
                  home! https://youtu.be/U74F00oRuEY?si=u41g1dCwzInrCQZU .
                </Text>
              )}

              {selectedTab === "Schools" && (
                <Text style={styles.contentText}>
                  Many schools offer mechanical engineering programs for
                  students. A couple of them include Cal Poly SLO, Pasadena City
                  College, and UC Berkeley.
                </Text>
              )}

              {selectedTab === "Programs" && (
                <Text style={styles.contentText}>
                  Interested in summer programs for mechanical engineering?
                  Check out the Research Science Institute or the Engineering
                  Summer Academy at Penn.
                </Text>
              )}

              {selectedTab === "Learn" && (
                <Text style={styles.contentText}>
                  Do you like what you learned today? You might be interested in
                  Aerospace, Robitics, Civil, Electrical, and many more
                  engieering fields!
                </Text>
              )}
            </View>
          </View>
          {/* <AwesomeButton
            width={75}
            height={50}
            backgroundColor="#4F46E5"
            onPress={() => console.log("Lesson")}
          >
            Lesson
          </AwesomeButton>

          <AwesomeButton
            width={75}
            height={50}
            backgroundColor="#10B981"
            onPress={() => console.log("Game")}
          >
            Game
          </AwesomeButton>

          <AwesomeButton
            width={75}
            height={50}
            backgroundColor="#F59E0B"
            onPress={() => console.log("Resources")}
          >
            Info
          </AwesomeButton>

          <AwesomeButton
            width={75}
            height={50}
            backgroundColor="#EF4444"
            onPress={() => console.log("Done")}
          >
            Done
          </AwesomeButton>
           */}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },

  text: {
    fontSize: 34,
    fontWeight: "800",
    color: "#111827",
    marginTop: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginTop: 30,
    borderRadius: 24,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },

  image: {
    width: "100%",
    height: 220,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginHorizontal: 20,
    marginTop: 20,
  },

  description: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 24,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },

  button: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#4F46E5",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  smallButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  smallButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },

  contentArea: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  contentText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
});
