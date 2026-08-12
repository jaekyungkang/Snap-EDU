// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Image,
// } from "react-native";
// import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
// import lesson from "../../lesson";
// // import AwesomeButton from "react-native-really-awesome-button";
// import { useNavigation } from "@react-navigation/native";

// export default function TaskScreen() {
//   const [currentLesson, setCurrentLesson] = useState(0);
//   const [selectedTab, setSelectedTab] = useState("");
//   // this is for navigating to gamescreen
//   const navigation = useNavigation();
//   const handleStartGame = () => {
//     navigation.navigate("GameScreen");
//   };
//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container} edges={["top"]}>
//         <ScrollView style={styles.scrollView}>
//           <View style={{ marginTop: 20 }}>
//             <Text style={styles.text}>Generator 101</Text>

//             <Text
//               style={{
//                 fontSize: 16,
//                 color: "#000000",
//                 marginTop: 6,
//                 lineHeight: 24,
//               }}
//             >
//               Let's dive into the world of engineerinng with our generator!
//             </Text>
//           </View>

//           <View style={styles.imageContainer}>
//             {lesson[currentLesson].lessonPictures.map((picture, index) => (
//               <Image
//                 key={index}
//                 source={picture}
//                 style={
//                   lesson[currentLesson].lessonPictures.length > 1
//                     ? styles.smallImage
//                     : styles.image
//                 }
//               />
//             ))}
//           </View>

//           <Text style={styles.title}>{lesson[currentLesson].lessonTitle}</Text>

//           <Text style={styles.description}>
//             {lesson[currentLesson].lessonDescription}
//           </Text>

//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => {
//               if (currentLesson === lesson.length - 1) {
//                 handleStartGame();
//               } else {
//                 setCurrentLesson(currentLesson + 1);
//               }
//             }}
//           >
//             <Text style={styles.buttonText}>
//               {currentLesson === lesson.length - 1 ? "Start Game" : "Next"}
//             </Text>
//           </TouchableOpacity>

//           <View style={styles.bottomButtons}>
//             <TouchableOpacity
//               style={[
//                 styles.smallButton,
//                 {
//                   backgroundColor:
//                     selectedTab === "DIY" ? "#E6B000" : "#FFC529",
//                 },
//               ]}
//               onPress={() => setSelectedTab("DIY")}
//             >
//               <Text style={styles.smallButtonText}>DIY</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.smallButton,
//                 {
//                   backgroundColor:
//                     selectedTab === "Schools" ? "#3E7EF2" : "#4A90FF",
//                 },
//               ]}
//               onPress={() => setSelectedTab("Schools")}
//             >
//               <Text style={styles.smallButtonText}>Schools</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.smallButton,
//                 {
//                   backgroundColor:
//                     selectedTab === "Programs" ? "#E94343" : "#FF5A5A",
//                 },
//               ]}
//               onPress={() => setSelectedTab("Programs")}
//             >
//               <Text style={styles.smallButtonText}>Programs</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.smallButton,
//                 {
//                   backgroundColor:
//                     selectedTab === "Learn" ? "#1FA76E" : "#28C98C",
//                 },
//               ]}
//               onPress={() => setSelectedTab("Learn")}
//             >
//               <Text style={styles.smallButtonText}>Learn</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.contentArea}>
//             {selectedTab === "DIY" && (
//               <Text style={styles.contentText}>
//                 Are you interested in learning more about engineering? Check out
//                 this video on learning how to build a potato battery at home!
//                 https://youtu.be/U74F00oRuEY?si=u41g1dCwzInrCQZU .
//               </Text>
//             )}

//             {selectedTab === "Schools" && (
//               <Text style={styles.contentText}>
//                 Many schools offer mechanical engineering programs for students.
//                 A couple of them include Cal Poly SLO, Pasadena City College,
//                 and UC Berkeley.
//               </Text>
//             )}

//             {selectedTab === "Programs" && (
//               <Text style={styles.contentText}>
//                 Interested in summer programs for mechanical engineering? Check
//                 out the Research Science Institute or the Engineering Summer
//                 Academy at Penn.
//               </Text>
//             )}

//             {selectedTab === "Learn" && (
//               <Text style={styles.contentText}>
//                 Enjoyed this? You might also like Aerospace, Robotics, Civil,
//                 Electrical, and many more engineering fields.,
//               </Text>
//             )}
//           </View>
//           {/* <AwesomeButton
//             width={75}
//             height={50}
//             backgroundColor="#4F46E5"
//             onPress={() => console.log("Lesson")}
//           >
//             Lesson
//           </AwesomeButton>

//           <AwesomeButton
//             width={75}
//             height={50}
//             backgroundColor="#10B981"
//             onPress={() => console.log("Game")}
//           >
//             Game
//           </AwesomeButton>

//           <AwesomeButton
//             width={75}
//             height={50}
//             backgroundColor="#F59E0B"
//             onPress={() => console.log("Resources")}
//           >
//             Info
//           </AwesomeButton>

//           <AwesomeButton
//             width={75}
//             height={50}
//             backgroundColor="#EF4444"
//             onPress={() => console.log("Done")}
//           >
//             Done
//           </AwesomeButton>
//            */}
//         </ScrollView>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#B8DB72",
//   },

//   scrollView: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },

//   text: {
//     fontSize: 34,
//     fontWeight: "800",
//     color: "#111827",
//     marginTop: 20,
//   },

//   card: {
//     backgroundColor: "#FFF8EF",
//     marginTop: 28,
//     borderRadius: 30,
//     padding: 22,

//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },

//     elevation: 5,
//   },

//   title: {
//     fontSize: 26,
//     fontWeight: "800",
//     color: "#2F2F2F",
//     textAlign: "center",
//     marginHorizontal: 12,
//   },

//   description: {
//     fontSize: 15,
//     color: "#555",
//     lineHeight: 23,
//     textAlign: "center",
//     marginBottom: 26,
//   },

//   button: {
//     marginBottom: 25,
//     backgroundColor: "#58BDF6",
//     borderRadius: 18,
//     paddingVertical: 16,
//     alignItems: "center",
//     shadowColor: "#2D8CC4",
//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },
//     shadowOpacity: 1,
//     shadowRadius: 0,
//     elevation: 8,
//   },

//   buttonText: {
//     color: "white",
//     fontSize: 20,
//     fontWeight: "800",
//     letterSpacing: 1,
//   },

//   bottomButtons: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     rowGap: 14,
//     marginHorizontal: 20,
//     marginBottom: 20,
//     // alignItems: "center",
//     // paddingVertical: 15,
//     // backgroundColor: "#FFFFFF",
//     // borderTopWidth: 1,
//     // borderTopColor: "#E5E7EB",
//   },
//   smallButton: {
//     width: "48%",
//     height: 54,
//     borderRadius: 14,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.18,
//     shadowRadius: 0,
//     elevation: 5,
//   },

//   smallButtonText: {
//     color: "white",
//     fontWeight: "800",
//     fontSize: 15,
//     letterSpacing: 0.4,
//   },

//   contentArea: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: "#E5E7EB",
//   },

//   contentText: {
//     fontSize: 16,
//     color: "#374151",
//     lineHeight: 24,
//   },
//   imageContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 12,
//     marginBottom: 20,
//     flexWrap: "wrap",
//   },

//   smallImage: {
//     width: 85,
//     height: 85,
//     resizeMode: "contain",
//   },

//   image: {
//     width: "100%",
//     height: 190,
//     borderRadius: 18,
//     resizeMode: "contain",
//     marginBottom: 18,
//   },
// });
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import lesson from "../../lesson";
import { useNavigation } from "@react-navigation/native";

export default function TaskScreen() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [selectedTab, setSelectedTab] = useState("");
  const navigation = useNavigation();
  const handleStartGame = () => {
    navigation.navigate("GameScreen");
  };

  const diyVideoUrl = "https://youtu.be/U74F00oRuEY?si=u41g1dCwzInrCQZU";

  const handleOpenLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.warn("Couldn't open link:", err),
    );
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
                color: "#000000",
                marginTop: 6,
                lineHeight: 24,
              }}
            >
              Let's dive into the world of engineerinng with our generator!
            </Text>
          </View>

          <View style={styles.imageContainer}>
            {lesson[currentLesson].lessonPictures.map((picture, index) => (
              <Image
                key={index}
                source={picture}
                style={
                  lesson[currentLesson].lessonPictures.length > 1
                    ? styles.smallImage
                    : styles.image
                }
              />
            ))}
          </View>

          <Text style={styles.title}>{lesson[currentLesson].lessonTitle}</Text>

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
              {currentLesson === lesson.length - 1 ? "Start Game" : "Next"}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={[
                styles.smallButton,
                {
                  backgroundColor:
                    selectedTab === "DIY" ? "#E6B000" : "#FFC529",
                },
              ]}
              onPress={() => setSelectedTab("DIY")}
            >
              <Text style={styles.smallButtonText}>DIY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.smallButton,
                {
                  backgroundColor:
                    selectedTab === "Schools" ? "#3E7EF2" : "#4A90FF",
                },
              ]}
              onPress={() => setSelectedTab("Schools")}
            >
              <Text style={styles.smallButtonText}>Schools</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.smallButton,
                {
                  backgroundColor:
                    selectedTab === "Programs" ? "#E94343" : "#FF5A5A",
                },
              ]}
              onPress={() => setSelectedTab("Programs")}
            >
              <Text style={styles.smallButtonText}>Programs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.smallButton,
                {
                  backgroundColor:
                    selectedTab === "Learn" ? "#1FA76E" : "#28C98C",
                },
              ]}
              onPress={() => setSelectedTab("Learn")}
            >
              <Text style={styles.smallButtonText}>Learn</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentArea}>
            {selectedTab === "DIY" && (
              <Text style={styles.contentText}>
                Are you interested in learning more about engineering? Check out
                this video on learning how to build a potato battery at home!{" "}
                <Text
                  style={styles.linkText}
                  onPress={() => handleOpenLink(diyVideoUrl)}
                >
                  {diyVideoUrl}
                </Text>
              </Text>
            )}

            {selectedTab === "Schools" && (
              <Text style={styles.contentText}>
                Many schools offer mechanical engineering programs for students.
                A couple of them include Cal Poly SLO, Pasadena City College,
                and UC Berkeley.
              </Text>
            )}

            {selectedTab === "Programs" && (
              <Text style={styles.contentText}>
                Interested in summer programs for mechanical engineering? Check
                out the Research Science Institute or the Engineering Summer
                Academy at Penn.
              </Text>
            )}

            {selectedTab === "Learn" && (
              <Text style={styles.contentText}>
                Enjoyed this? You might also like Aerospace, Robotics, Civil,
                Electrical, and many more engineering fields.,
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B8DB72",
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
    backgroundColor: "#FFF8EF",
    marginTop: 28,
    borderRadius: 30,
    padding: 22,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2F2F2F",
    textAlign: "center",
    marginHorizontal: 12,
  },

  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 23,
    textAlign: "center",
    marginBottom: 26,
  },

  button: {
    marginBottom: 25,
    backgroundColor: "#58BDF6",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#2D8CC4",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },

  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
  },

  bottomButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  smallButton: {
    width: "48%",
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 0,
    elevation: 5,
  },

  smallButtonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.4,
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

  linkText: {
    color: "#1D4ED8",
    textDecorationLine: "underline",
    fontWeight: "600",
  },

  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap",
  },

  smallImage: {
    width: 85,
    height: 85,
    resizeMode: "contain",
  },

  image: {
    width: "100%",
    height: 190,
    borderRadius: 18,
    resizeMode: "contain",
    marginBottom: 18,
  },
});
