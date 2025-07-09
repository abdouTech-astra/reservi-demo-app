import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Button from "../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const WelcomeScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>R</Text>
          </View>
        </View>

        <Text style={styles.title}>Reservili</Text>
        <Text style={styles.subtitle}>
          Appointment booking made simple for Tunisian businesses and customers
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            fullWidth
            size="lg"
            onPress={() => navigation.navigate("CustomerLogin")}
          >
            I'm a Customer
          </Button>

          <View style={styles.spacer} />

          <Button
            fullWidth
            size="lg"
            variant="outline"
            onPress={() => navigation.navigate("BusinessLogin")}
          >
            I'm a Business
          </Button>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 Reservili - Tunisia's booking platform
        </Text>
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
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
    color: "#4b5563",
    marginBottom: 48,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 320,
  },
  spacer: {
    height: 16,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#6b7280",
  },
});

export default WelcomeScreen;
