import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import {
  trackProfileClick,
  trackInterestEvent,
} from "../../utils/analyticsTracker";

type Props = NativeStackScreenProps<RootStackParamList, "BusinessProfile">;

// Sample data
const mockBusiness = {
  id: "1",
  name: "Le Petit Café",
  category: "Café",
  image:
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  coverImage:
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  rating: 4.8,
  ratingCount: 124,
  address: "23 Rue de Marseille, Tunis 1000",
  phone: "+216 71 123 456",
  website: "www.lepetitcafe.tn",
  hours: "8:00 AM - 10:00 PM",
  description:
    "A cozy café in the heart of Tunis offering a blend of traditional Tunisian and French pastries. Our signature coffees and mint teas are crafted from the finest ingredients.",
  amenities: [
    "Free WiFi",
    "Outdoor Seating",
    "Air Conditioning",
    "Vegetarian Options",
    "Takeaway",
  ],
  gallery: [
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1493857671505-72967e2e2760?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  ],
};

const mockServices = [
  { id: "1", name: "Tunisian Mint Tea", price: "5 TND", duration: "10 min" },
  { id: "2", name: "Specialty Coffee", price: "7 TND", duration: "10 min" },
  {
    id: "3",
    name: "Croissant & Coffee Combo",
    price: "12 TND",
    duration: "15 min",
  },
  { id: "4", name: "Fresh Orange Juice", price: "6 TND", duration: "5 min" },
  { id: "5", name: "Pastry Selection", price: "15 TND", duration: "20 min" },
  { id: "6", name: "Breakfast Platter", price: "25 TND", duration: "30 min" },
];

const mockTimeSlots = [
  { id: "1", time: "9:00 AM", available: true },
  { id: "2", time: "10:00 AM", available: true },
  { id: "3", time: "11:00 AM", available: false },
  { id: "4", time: "12:00 PM", available: true },
  { id: "5", time: "1:00 PM", available: true },
  { id: "6", time: "2:00 PM", available: false },
  { id: "7", time: "3:00 PM", available: true },
  { id: "8", time: "4:00 PM", available: true },
  { id: "9", time: "5:00 PM", available: true },
  { id: "10", time: "6:00 PM", available: false },
];

const BusinessProfileScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const [selectedTab, setSelectedTab] = useState("services");

  // Track profile view when component mounts
  React.useEffect(() => {
    // Track profile click event
    trackProfileClick({
      customerId: "customer_001", // In real app, get from user context
      businessId: mockBusiness.id,
      source: "search", // In real app, get from navigation params
      sessionId: `session_${Date.now()}`,
      deviceType: "mobile",
    });
  }, []);

  // Track interest events
  const handleInterestEvent = (
    interestType:
      | "service_view"
      | "gallery_view"
      | "menu_view"
      | "reviews_read"
      | "contact_info_view"
      | "booking_attempt"
      | "save_business"
      | "share_business",
    metadata?: any
  ) => {
    trackInterestEvent({
      customerId: "customer_001", // In real app, get from user context
      businessId: mockBusiness.id,
      interestType,
      sessionId: `session_${Date.now()}`,
      metadata,
    });
  };
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get today and next 6 days for date picker
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDay = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  };

  const formatDate = (date: Date) => {
    return date.getDate().toString();
  };

  const isDateSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleBookService = (serviceId: string) => {
    navigation.navigate("Booking", { businessId: id });
  };

  const renderServiceItem = ({ item }: { item: (typeof mockServices)[0] }) => (
    <View style={styles.serviceItem}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <View style={styles.serviceDetails}>
          <Text style={styles.servicePrice}>{item.price}</Text>
          <Text style={styles.serviceDuration}>
            <Ionicons name="time-outline" size={14} color="#6b7280" />{" "}
            {item.duration}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => handleBookService(item.id)}
      >
        <Text style={styles.bookButtonText}>Book</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTimeSlot = ({ item }: { item: (typeof mockTimeSlots)[0] }) => (
    <TouchableOpacity
      style={[styles.timeSlot, !item.available && styles.timeSlotUnavailable]}
      disabled={!item.available}
      onPress={() =>
        item.available && navigation.navigate("Booking", { businessId: id })
      }
    >
      <Text
        style={[
          styles.timeSlotText,
          !item.available && styles.timeSlotTextUnavailable,
        ]}
      >
        {item.time}
      </Text>
    </TouchableOpacity>
  );

  const renderGalleryItem = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <TouchableOpacity
      onPress={() =>
        handleInterestEvent("gallery_view", { galleryImageIndex: index })
      }
    >
      <Image source={{ uri: item }} style={styles.galleryImage} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: mockBusiness.coverImage }}
            style={styles.coverImage}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.businessHeader}>
            <Image
              source={{ uri: mockBusiness.image }}
              style={styles.businessLogo}
            />
            <View style={styles.businessInfo}>
              <Text style={styles.businessName}>{mockBusiness.name}</Text>
              <Text style={styles.businessCategory}>
                {mockBusiness.category}
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{mockBusiness.rating}</Text>
                <Text style={styles.ratingCount}>
                  ({mockBusiness.ratingCount} reviews)
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleInterestEvent("contact_info_view")}
          >
            <Ionicons name="call-outline" size={20} color="#3b82f6" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleInterestEvent("contact_info_view")}
          >
            <Ionicons name="location-outline" size={20} color="#3b82f6" />
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              handleInterestEvent("share_business", { shareMethod: "native" })
            }
          >
            <Ionicons name="share-social-outline" size={20} color="#3b82f6" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleInterestEvent("save_business")}
          >
            <Ionicons name="bookmark-outline" size={20} color="#3b82f6" />
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="location" size={18} color="#6b7280" />
            <Text style={styles.infoText}>{mockBusiness.address}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time" size={18} color="#6b7280" />
            <Text style={styles.infoText}>{mockBusiness.hours}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="call" size={18} color="#6b7280" />
            <Text style={styles.infoText}>{mockBusiness.phone}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="globe" size={18} color="#6b7280" />
            <Text style={styles.infoText}>{mockBusiness.website}</Text>
          </View>
        </View>

        <View style={styles.description}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.descriptionText}>{mockBusiness.description}</Text>
        </View>

        <View style={styles.gallery}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <FlatList
            data={mockBusiness.gallery}
            renderItem={renderGalleryItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryList}
          />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "services" && styles.activeTab]}
            onPress={() => {
              setSelectedTab("services");
              handleInterestEvent("service_view");
            }}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "services" && styles.activeTabText,
              ]}
            >
              Services
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "availability" && styles.activeTab,
            ]}
            onPress={() => {
              setSelectedTab("availability");
              handleInterestEvent("booking_attempt");
            }}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "availability" && styles.activeTabText,
              ]}
            >
              Availability
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "reviews" && styles.activeTab]}
            onPress={() => {
              setSelectedTab("reviews");
              handleInterestEvent("reviews_read");
            }}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "reviews" && styles.activeTabText,
              ]}
            >
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === "services" && (
          <View style={styles.servicesContainer}>
            <FlatList
              data={mockServices}
              renderItem={renderServiceItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.servicesList}
            />
          </View>
        )}

        {selectedTab === "availability" && (
          <View style={styles.availabilityContainer}>
            <Text style={styles.availabilityTitle}>Available Time Slots</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateList}
            >
              {dates.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateItem,
                    isDateSelected(date) && styles.selectedDateItem,
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isDateSelected(date) && styles.selectedDayText,
                    ]}
                  >
                    {formatDay(date)}
                  </Text>
                  <Text
                    style={[
                      styles.dateText,
                      isDateSelected(date) && styles.selectedDateText,
                    ]}
                  >
                    {formatDate(date)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <FlatList
              data={mockTimeSlots}
              renderItem={renderTimeSlot}
              keyExtractor={(item) => item.id}
              numColumns={4}
              scrollEnabled={false}
              contentContainerStyle={styles.timeSlotsList}
            />

            <TouchableOpacity
              style={styles.bookAllButton}
              onPress={() => {
                handleInterestEvent("booking_attempt");
                navigation.navigate("Booking", { businessId: id });
              }}
            >
              <Text style={styles.bookAllButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedTab === "reviews" && (
          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewsText}>
              Customer reviews will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  businessHeader: {
    flexDirection: "row",
    marginTop: -40,
    marginHorizontal: 16,
    alignItems: "flex-end",
  },
  businessLogo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },
  businessInfo: {
    marginLeft: 12,
    flex: 1,
  },
  businessName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  businessCategory: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 12,
    marginTop: 16,
  },
  actionButton: {
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 12,
    color: "#3b82f6",
    marginTop: 4,
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#111827",
  },
  description: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4b5563",
  },
  gallery: {
    paddingTop: 8,
    paddingLeft: 16,
    paddingBottom: 16,
  },
  galleryList: {
    paddingRight: 16,
  },
  galleryImage: {
    width: 160,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  tabContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#3b82f6",
  },
  servicesContainer: {
    paddingTop: 16,
  },
  servicesList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  serviceDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
    marginRight: 12,
  },
  serviceDuration: {
    fontSize: 14,
    color: "#6b7280",
  },
  bookButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  availabilityContainer: {
    padding: 16,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 12,
  },
  dateList: {
    paddingBottom: 8,
  },
  dateItem: {
    width: 56,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
  },
  selectedDateItem: {
    backgroundColor: "#3b82f6",
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 4,
  },
  selectedDayText: {
    color: "#fff",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  selectedDateText: {
    color: "#fff",
  },
  timeSlotsList: {
    marginTop: 16,
  },
  timeSlot: {
    flex: 1,
    margin: 4,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  timeSlotUnavailable: {
    backgroundColor: "#f3f4f6",
    opacity: 0.5,
  },
  timeSlotText: {
    fontSize: 14,
    color: "#111827",
  },
  timeSlotTextUnavailable: {
    color: "#9ca3af",
  },
  bookAllButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  bookAllButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  reviewsContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  reviewsText: {
    fontSize: 16,
    color: "#6b7280",
  },
});

export default BusinessProfileScreen;
