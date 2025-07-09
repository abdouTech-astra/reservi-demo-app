import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  style,
  disabled,
  ...props
}: ButtonProps) => {
  // Determine styles based on variant and size
  const getVariantStyle = () => {
    switch (variant) {
      case "outline":
        return styles.outline;
      case "ghost":
        return styles.ghost;
      case "primary":
      default:
        return styles.primary;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return styles.small;
      case "lg":
        return styles.large;
      case "md":
      default:
        return styles.medium;
    }
  };

  const getTextStyle = () => {
    if (variant === "primary") {
      return styles.primaryText;
    }
    return styles.outlineText;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "primary" ? "white" : "#3b82f6"}
          size="small"
        />
      ) : (
        <Text
          style={[styles.text, getTextStyle(), disabled && styles.disabledText]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "#3b82f6", // blue-500
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    fontWeight: "500",
    textAlign: "center",
  },
  primaryText: {
    color: "white",
  },
  outlineText: {
    color: "#3b82f6",
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

export default Button;
