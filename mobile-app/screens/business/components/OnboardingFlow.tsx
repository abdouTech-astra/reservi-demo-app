import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface Step {
  id: string;
  title: string;
  description: string;
  targetId: string;
  position: "top" | "bottom" | "left" | "right";
  icon?: string;
  image?: any; // In a real app, this would be a proper image import
}

interface OnboardingProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
  steps: Step[];
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
}

const TooltipBubble = ({
  step,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
  totalSteps,
  currentStep,
}: {
  step: Step;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
  totalSteps: number;
  currentStep: number;
}) => {
  return (
    <View
      style={[
        styles.tooltipContainer,
        step.position === "top" && styles.tooltipBottom,
        step.position === "bottom" && styles.tooltipTop,
        step.position === "left" && styles.tooltipRight,
        step.position === "right" && styles.tooltipLeft,
      ]}
    >
      {step.position === "bottom" && <View style={styles.tooltipArrowTop} />}
      {step.position === "top" && <View style={styles.tooltipArrowBottom} />}
      {step.position === "left" && <View style={styles.tooltipArrowRight} />}
      {step.position === "right" && <View style={styles.tooltipArrowLeft} />}

      <View style={styles.tooltipContent}>
        <View style={styles.tooltipHeader}>
          {step.icon && (
            <Ionicons name={step.icon as any} size={20} color="#3b82f6" />
          )}
          <Text style={styles.tooltipTitle}>{step.title}</Text>
        </View>

        <Text style={styles.tooltipDescription}>{step.description}</Text>

        {step.image && (
          <View style={styles.tooltipImageContainer}>
            <Image
              source={step.image}
              style={styles.tooltipImage}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.tooltipFooter}>
          <View style={styles.tooltipPagination}>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentStep === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>

          <View style={styles.tooltipActions}>
            <TouchableOpacity
              style={styles.tooltipActionButton}
              onPress={onSkip}
            >
              <Text style={styles.tooltipSkipText}>Skip</Text>
            </TouchableOpacity>

            <View style={styles.tooltipNavButtons}>
              {!isFirst && (
                <TouchableOpacity
                  style={[styles.tooltipButton, styles.tooltipPrevButton]}
                  onPress={onPrev}
                >
                  <Ionicons name="arrow-back" size={18} color="#6b7280" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.tooltipButton, styles.tooltipNextButton]}
                onPress={onNext}
              >
                {isLast ? (
                  <Text style={styles.tooltipNextButtonText}>Finish</Text>
                ) : (
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// This simulates getting coordinates of elements
// In a real React Native app, you would use element.measure() API
const getElementPosition = (elementId: string) => {
  // This is just a simulation
  const positions: Record<
    string,
    { x: number; y: number; width: number; height: number }
  > = {
    "dashboard-header": { x: 0, y: 80, width: width, height: 60 },
    "calendar-button": {
      x: width / 4,
      y: height - 60,
      width: width / 4,
      height: 50,
    },
    "services-section": { x: 20, y: 300, width: width - 40, height: 100 },
    "analytics-chart": { x: 20, y: 500, width: width - 40, height: 200 },
    "notification-center": { x: width - 70, y: 60, width: 60, height: 40 },
  };

  return (
    positions[elementId] || {
      x: width / 2 - 150,
      y: height / 2 - 100,
      width: 300,
      height: 200,
    }
  );
};

export const OnboardingTour = ({
  visible,
  onClose,
  onComplete,
  steps,
  currentStepIndex,
  setCurrentStepIndex,
}: OnboardingProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [highlightPosition, setHighlightPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (steps[currentStepIndex]) {
        const position = getElementPosition(steps[currentStepIndex].targetId);
        setHighlightPosition(position);
      }
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, currentStepIndex, steps]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  if (!visible || !steps[currentStepIndex]) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.overlay}>
          <View
            style={[
              styles.highlight,
              {
                top: highlightPosition.y,
                left: highlightPosition.x,
                width: highlightPosition.width,
                height: highlightPosition.height,
              },
            ]}
          />
        </View>

        <TooltipBubble
          step={currentStep}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={onComplete}
          isFirst={currentStepIndex === 0}
          isLast={currentStepIndex === steps.length - 1}
          totalSteps={steps.length}
          currentStep={currentStepIndex}
        />
      </Animated.View>
    </Modal>
  );
};

interface ContextualHelpProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const ContextualHelp = ({
  id,
  title,
  description,
  children,
}: ContextualHelpProps) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <View style={styles.helpContainer} id={id}>
      <View style={styles.helpContent}>{children}</View>
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => setShowHelp(!showHelp)}
      >
        <Ionicons
          name={showHelp ? "close-circle" : "help-circle"}
          size={22}
          color="#3b82f6"
        />
      </TouchableOpacity>

      {showHelp && (
        <View style={styles.helpTooltip}>
          <Text style={styles.helpTooltipTitle}>{title}</Text>
          <Text style={styles.helpTooltipDescription}>{description}</Text>
        </View>
      )}
    </View>
  );
};

interface OnboardingWelcomeProps {
  visible: boolean;
  onClose: () => void;
  onStartTour: () => void;
  businessName: string;
}

export const OnboardingWelcome = ({
  visible,
  onClose,
  onStartTour,
  businessName,
}: OnboardingWelcomeProps) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.welcomeContainer}>
        <View style={styles.welcomeContent}>
          <TouchableOpacity style={styles.welcomeCloseButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>

          <View style={styles.welcomeIcon}>
            <Ionicons name="rocket" size={48} color="#3b82f6" />
          </View>

          <Text style={styles.welcomeTitle}>
            Welcome to Reservi, {businessName}!
          </Text>
          <Text style={styles.welcomeDescription}>
            Let's get you set up and ready to take bookings. We've prepared a
            quick tour to help you get familiar with the app.
          </Text>

          <View style={styles.welcomeFeatures}>
            <View style={styles.welcomeFeatureItem}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color="#3b82f6"
                style={styles.welcomeFeatureIcon}
              />
              <View style={styles.welcomeFeatureContent}>
                <Text style={styles.welcomeFeatureTitle}>Manage Bookings</Text>
                <Text style={styles.welcomeFeatureDescription}>
                  View, accept, and manage all your customer bookings in one
                  place.
                </Text>
              </View>
            </View>

            <View style={styles.welcomeFeatureItem}>
              <Ionicons
                name="analytics-outline"
                size={24}
                color="#3b82f6"
                style={styles.welcomeFeatureIcon}
              />
              <View style={styles.welcomeFeatureContent}>
                <Text style={styles.welcomeFeatureTitle}>
                  Detailed Analytics
                </Text>
                <Text style={styles.welcomeFeatureDescription}>
                  Track your business performance with in-depth insights and
                  reports.
                </Text>
              </View>
            </View>

            <View style={styles.welcomeFeatureItem}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#3b82f6"
                style={styles.welcomeFeatureIcon}
              />
              <View style={styles.welcomeFeatureContent}>
                <Text style={styles.welcomeFeatureTitle}>
                  Smart Notifications
                </Text>
                <Text style={styles.welcomeFeatureDescription}>
                  Send personalized notifications to your customers and never
                  miss a booking.
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.welcomeButton} onPress={onStartTour}>
            <Text style={styles.welcomeButtonText}>Start Quick Tour</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.welcomeSkipButton} onPress={onClose}>
            <Text style={styles.welcomeSkipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Sample onboarding steps
export const dashboardTourSteps: Step[] = [
  {
    id: "step1",
    title: "Your Dashboard",
    description:
      "This is your business dashboard where you can find an overview of your bookings, revenue, and customer stats.",
    targetId: "dashboard-header",
    position: "bottom",
    icon: "home",
  },
  {
    id: "step2",
    title: "Calendar View",
    description:
      "Switch to calendar view to see your bookings organized by date and manage your availability.",
    targetId: "calendar-button",
    position: "top",
    icon: "calendar",
  },
  {
    id: "step3",
    title: "Manage Services",
    description: "Create and manage the services you offer to your customers.",
    targetId: "services-section",
    position: "bottom",
    icon: "list",
  },
  {
    id: "step4",
    title: "Business Analytics",
    description:
      "Get insights about your business performance, bookings, and revenue.",
    targetId: "analytics-chart",
    position: "top",
    icon: "analytics",
  },
  {
    id: "step5",
    title: "Notification Center",
    description:
      "Send personalized notifications to your customers and keep them engaged.",
    targetId: "notification-center",
    position: "left",
    icon: "notifications",
  },
];

// Main Onboarding Controller Component
export const OnboardingController = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  // In a real app, you would check if the user has completed onboarding
  useEffect(() => {
    // Simulate checking if this is the first launch
    const checkFirstLaunch = async () => {
      // Simulate delay to check storage
      setTimeout(() => {
        setShowWelcome(true);
      }, 1000);
    };

    if (!onboardingCompleted) {
      checkFirstLaunch();
    }
  }, [onboardingCompleted]);

  const handleStartTour = () => {
    setShowWelcome(false);
    setShowTour(true);
  };

  const handleTourComplete = () => {
    setShowTour(false);
    setOnboardingCompleted(true);
    // In a real app, you would save this to storage
  };

  return (
    <>
      <OnboardingWelcome
        visible={showWelcome}
        onClose={() => setShowWelcome(false)}
        onStartTour={handleStartTour}
        businessName="Le Petit Café"
      />

      <OnboardingTour
        visible={showTour}
        onClose={() => setShowTour(false)}
        onComplete={handleTourComplete}
        steps={dashboardTourSteps}
        currentStepIndex={currentStepIndex}
        setCurrentStepIndex={setCurrentStepIndex}
      />
    </>
  );
};

// Quick help tooltip for specific UI elements
export const QuickHelp = ({
  title,
  description,
  position = "bottom",
}: {
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.quickHelpContainer}>
      <TouchableOpacity
        style={styles.quickHelpTrigger}
        onPress={() => setVisible(!visible)}
      >
        <Ionicons name="help-circle" size={18} color="#6b7280" />
      </TouchableOpacity>

      {visible && (
        <View
          style={[
            styles.quickHelpTooltip,
            position === "top" && styles.quickHelpTooltipTop,
            position === "bottom" && styles.quickHelpTooltipBottom,
            position === "left" && styles.quickHelpTooltipLeft,
            position === "right" && styles.quickHelpTooltipRight,
          ]}
        >
          <Text style={styles.quickHelpTitle}>{title}</Text>
          <Text style={styles.quickHelpDescription}>{description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  highlight: {
    position: "absolute",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#3b82f6",
    backgroundColor: "transparent",
  },
  tooltipContainer: {
    position: "absolute",
    width: 300,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  tooltipTop: {
    bottom: height - 100, // This would be calculated based on the highlighted element position
  },
  tooltipBottom: {
    top: 150, // This would be calculated based on the highlighted element position
  },
  tooltipLeft: {
    right: 10, // This would be calculated based on the highlighted element position
  },
  tooltipRight: {
    left: 10, // This would be calculated based on the highlighted element position
  },
  tooltipArrowTop: {
    position: "absolute",
    top: -10,
    left: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white",
  },
  tooltipArrowBottom: {
    position: "absolute",
    bottom: -10,
    left: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
  },
  tooltipArrowLeft: {
    position: "absolute",
    left: -10,
    top: 20,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 10,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "white",
  },
  tooltipArrowRight: {
    position: "absolute",
    right: -10,
    top: 20,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "white",
  },
  tooltipContent: {
    padding: 16,
  },
  tooltipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
  },
  tooltipDescription: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 16,
    lineHeight: 20,
  },
  tooltipImageContainer: {
    width: "100%",
    height: 100,
    marginBottom: 16,
  },
  tooltipImage: {
    width: "100%",
    height: "100%",
  },
  tooltipFooter: {
    flexDirection: "column",
  },
  tooltipPagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1d5db",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#3b82f6",
  },
  tooltipActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tooltipActionButton: {
    padding: 8,
  },
  tooltipSkipText: {
    fontSize: 14,
    color: "#6b7280",
  },
  tooltipNavButtons: {
    flexDirection: "row",
  },
  tooltipButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  tooltipPrevButton: {
    backgroundColor: "#f3f4f6",
  },
  tooltipNextButton: {
    backgroundColor: "#3b82f6",
  },
  tooltipNextButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  // Contextual Help Styles
  helpContainer: {
    position: "relative",
  },
  helpContent: {
    position: "relative",
  },
  helpButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 4,
    zIndex: 10,
  },
  helpTooltip: {
    position: "absolute",
    top: "100%",
    right: 0,
    width: 200,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 100,
  },
  helpTooltipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  helpTooltipDescription: {
    fontSize: 12,
    color: "#4b5563",
  },
  // Welcome modal styles
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  welcomeContent: {
    width: width * 0.9,
    maxWidth: 450,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  welcomeCloseButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ebf5ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  welcomeDescription: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  welcomeFeatures: {
    width: "100%",
    marginBottom: 24,
  },
  welcomeFeatureItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  welcomeFeatureIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  welcomeFeatureContent: {
    flex: 1,
  },
  welcomeFeatureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  welcomeFeatureDescription: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  welcomeButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  welcomeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  welcomeSkipButton: {
    paddingVertical: 12,
  },
  welcomeSkipText: {
    fontSize: 14,
    color: "#6b7280",
  },
  // Quick help tooltips
  quickHelpContainer: {
    position: "relative",
  },
  quickHelpTrigger: {
    padding: 4,
  },
  quickHelpTooltip: {
    position: "absolute",
    width: 150,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 100,
  },
  quickHelpTooltipTop: {
    bottom: "100%",
    left: 0,
    marginBottom: 8,
  },
  quickHelpTooltipBottom: {
    top: "100%",
    left: 0,
    marginTop: 8,
  },
  quickHelpTooltipLeft: {
    right: "100%",
    top: 0,
    marginRight: 8,
  },
  quickHelpTooltipRight: {
    left: "100%",
    top: 0,
    marginLeft: 8,
  },
  quickHelpTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  quickHelpDescription: {
    fontSize: 10,
    color: "#4b5563",
  },
});

export default {
  OnboardingTour,
  OnboardingWelcome,
  OnboardingController,
  ContextualHelp,
  QuickHelp,
  dashboardTourSteps,
};
