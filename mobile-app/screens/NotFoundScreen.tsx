import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Button from "../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "NotFound">;

const NotFoundScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Page Not Found</Text>
        <Text style={styles.description}>
          The page you are looking for doesn't exist or has been moved.
        </Text>

        <Button
          fullWidth
          style={styles.button}
          onPress={() => navigation.navigate("Welcome")}
        >
          Go to Home
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#3b82f6",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    marginTop: 16,
    width: "80%",
  },
});

export default NotFoundScreen;
