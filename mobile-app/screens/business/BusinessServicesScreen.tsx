import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  TextInput,
  Image,
  Switch,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { AppState, Service } from "./types";
import { cafeServices } from "./mockData";
import BusinessModals from "./components/BusinessModals";
import {
  BusinessHeader,
  BusinessNavBar,
  SectionHeader,
} from "./components/BusinessUIComponents";

type Props = NativeStackScreenProps<RootStackParamList, "BusinessServices">;

const BusinessServicesScreen = ({ navigation }: Props) => {
  // Set up state
  const [state, setState] = useState<AppState>({
    language: "English",
    currency: "TND",
    autoCancel: true,
    autoCancelTime: 15,
    bookingStatusFilter: "all",
    dateFilter: "today",
    showStatusModal: false,
    showDisputeModal: false,
    showNotificationModal: false,
    showCapacityModal: false,
    showLanguageModal: false,
    selectedBooking: null,
    disputeNote: "",
    disputeProof: "",
    notificationTitle: "",
    notificationMessage: "",
    isLoading: false,
  });

  // State for services
  const [services, setServices] = useState<Service[]>(cafeServices);
  const [filteredServices, setFilteredServices] =
    useState<Service[]>(cafeServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);

  // Helper function to update state
  const updateState = (newState: Partial<AppState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  // Handle service status toggle
  const toggleServiceStatus = (serviceId: string) => {
    setServices(
      services.map((service) =>
        service.id === serviceId
          ? { ...service, isActive: !service.isActive }
          : service
      )
    );

    // Also update filtered services
    setFilteredServices(
      filteredServices.map((service) =>
        service.id === serviceId
          ? { ...service, isActive: !service.isActive }
          : service
      )
    );
  };

  // Filter services by category and search query
  const filterServices = (category: string | null, query: string) => {
    let filtered = services;

    if (category) {
      filtered = filtered.filter((service) => service.category === category);
    }

    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(lowerCaseQuery) ||
          service.description.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredServices(filtered);
  };

  // Handle search input change
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterServices(selectedCategory, text);
  };

  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    filterServices(category, searchQuery);
  };

  // Open service edit modal
  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setShowServiceModal(true);
  };

  // Create new service
  const handleCreateService = () => {
    const newService: Service = {
      id: `S${(services.length + 1).toString().padStart(3, "0")}`,
      name: "",
      description: "",
      price: 0,
      duration: 0,
      isActive: true,
      category: "Beverages",
    };

    setCurrentService(newService);
    setShowServiceModal(true);
  };

  // Save service changes
  const handleSaveService = () => {
    if (!currentService) return;

    if (currentService.name && currentService.price > 0) {
      if (services.some((service) => service.id === currentService.id)) {
        // Update existing service
        setServices(
          services.map((service) =>
            service.id === currentService.id ? currentService : service
          )
        );
      } else {
        // Add new service
        setServices([...services, currentService]);
      }

      // Apply filters again
      filterServices(selectedCategory, searchQuery);
      setShowServiceModal(false);
    } else {
      alert("Please fill in all required fields");
    }
  };

  // Delete service
  const handleDeleteService = (serviceId: string) => {
    // In a real app, you would show a confirmation dialog
    setServices(services.filter((service) => service.id !== serviceId));
    setFilteredServices(
      filteredServices.filter((service) => service.id !== serviceId)
    );
  };

  // Extract unique categories from services
  const categories = Array.from(
    new Set(services.map((service) => service.category))
  );

  // Service Card component
  const renderServiceCard = ({ item }: { item: Service }) => (
    <View
      style={[styles.serviceCard, !item.isActive && styles.inactiveServiceCard]}
    >
      <View style={styles.serviceHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.serviceDescription}>{item.description}</Text>
          <View style={styles.serviceMetaRow}>
            <View style={styles.serviceMeta}>
              <Ionicons name="time-outline" size={14} color="#6b7280" />
              <Text style={styles.serviceMetaText}>{item.duration} min</Text>
            </View>
            <View style={styles.serviceMeta}>
              <Ionicons name="pricetag-outline" size={14} color="#6b7280" />
              <Text style={styles.serviceMetaText}>{item.price} TND</Text>
            </View>
            <View style={styles.serviceMeta}>
              <Ionicons name="folder-outline" size={14} color="#6b7280" />
              <Text style={styles.serviceMetaText}>{item.category}</Text>
            </View>
          </View>
        </View>
        <View style={styles.serviceActions}>
          <Switch
            value={item.isActive}
            onValueChange={() => toggleServiceStatus(item.id)}
            trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
            thumbColor={item.isActive ? "#3b82f6" : "#f4f4f5"}
          />
        </View>
      </View>

      <View style={styles.serviceFooter}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditService(item)}
        >
          <Ionicons name="create-outline" size={16} color="#3b82f6" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteService(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Service Edit Modal
  const ServiceModal = () => (
    <Modal
      visible={showServiceModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowServiceModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {currentService && currentService.name
                ? "Edit Service"
                : "New Service"}
            </Text>
            <TouchableOpacity
              onPress={() => setShowServiceModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Service Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter service name"
                value={currentService?.name}
                onChangeText={(text) =>
                  setCurrentService(
                    currentService ? { ...currentService, name: text } : null
                  )
                }
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaInput]}
                placeholder="Enter service description"
                value={currentService?.description}
                onChangeText={(text) =>
                  setCurrentService(
                    currentService
                      ? { ...currentService, description: text }
                      : null
                  )
                }
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.formLabel}>Price (TND)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0"
                  keyboardType="numeric"
                  value={
                    currentService?.price ? currentService.price.toString() : ""
                  }
                  onChangeText={(text) =>
                    setCurrentService(
                      currentService
                        ? {
                            ...currentService,
                            price: parseFloat(text) || 0,
                          }
                        : null
                    )
                  }
                />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Duration (minutes)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0"
                  keyboardType="numeric"
                  value={
                    currentService?.duration
                      ? currentService.duration.toString()
                      : ""
                  }
                  onChangeText={(text) =>
                    setCurrentService(
                      currentService
                        ? {
                            ...currentService,
                            duration: parseInt(text) || 0,
                          }
                        : null
                    )
                  }
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category</Text>
              <View style={styles.categoryOptions}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      currentService?.category === category &&
                        styles.categoryOptionSelected,
                    ]}
                    onPress={() =>
                      setCurrentService(
                        currentService ? { ...currentService, category } : null
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        currentService?.category === category &&
                          styles.categoryOptionTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.switchRow}>
                <Text style={styles.formLabel}>Active</Text>
                <Switch
                  value={currentService?.isActive || false}
                  onValueChange={(value) =>
                    setCurrentService(
                      currentService
                        ? { ...currentService, isActive: value }
                        : null
                    )
                  }
                  trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
                  thumbColor={currentService?.isActive ? "#3b82f6" : "#f4f4f5"}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveService}
            >
              <Text style={styles.saveButtonText}>Save Service</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <BusinessHeader
        title="Le Petit Café"
        subtitle="Service Management"
        language={state.language}
        onLanguagePress={() => updateState({ showLanguageModal: true })}
        onSettingsPress={() => navigation.navigate("BusinessSettings")}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#6b7280"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                filterServices(selectedCategory, "");
              }}
            >
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.categoryFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          <TouchableOpacity
            style={[
              styles.categoryFilterOption,
              selectedCategory === null && styles.categoryFilterOptionSelected,
            ]}
            onPress={() => handleCategorySelect(null)}
          >
            <Text
              style={[
                styles.categoryFilterText,
                selectedCategory === null && styles.categoryFilterTextSelected,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryFilterOption,
                selectedCategory === category &&
                  styles.categoryFilterOptionSelected,
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text
                style={[
                  styles.categoryFilterText,
                  selectedCategory === category &&
                    styles.categoryFilterTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.serviceListHeader}>
        <SectionHeader title={`Services (${filteredServices.length})`} />
        <TouchableOpacity
          style={styles.addServiceButton}
          onPress={handleCreateService}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addServiceButtonText}>Add Service</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.serviceList}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="list-outline" size={64} color="#e5e7eb" />
            <Text style={styles.emptyStateTitle}>No Services Found</Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery
                ? "Try a different search term or category"
                : "Start by adding your first service"}
            </Text>
          </View>
        )}
      />

      <BusinessNavBar
        active="services"
        onNavigate={(screen) =>
          navigation.navigate(screen as keyof RootStackParamList)
        }
      />

      <BusinessModals.LanguageModal state={state} updateState={updateState} />
      <ServiceModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#111827",
  },
  categoryFilterContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  categoryList: {
    paddingHorizontal: 12,
  },
  categoryFilterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginHorizontal: 4,
  },
  categoryFilterOptionSelected: {
    backgroundColor: "#ebf5ff",
    borderColor: "#3b82f6",
  },
  categoryFilterText: {
    fontSize: 14,
    color: "#6b7280",
  },
  categoryFilterTextSelected: {
    color: "#3b82f6",
    fontWeight: "500",
  },
  serviceListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 16,
  },
  addServiceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addServiceButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginLeft: 4,
  },
  serviceList: {
    padding: 16,
  },
  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 16,
  },
  inactiveServiceCard: {
    opacity: 0.7,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  serviceMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  serviceMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 4,
  },
  serviceMetaText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  serviceActions: {
    justifyContent: "center",
  },
  serviceFooter: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  editButtonText: {
    fontSize: 14,
    color: "#3b82f6",
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 14,
    color: "#ef4444",
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "90%",
    maxHeight: "90%",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  textAreaInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginBottom: 8,
  },
  categoryOption: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    margin: 4,
  },
  categoryOptionSelected: {
    backgroundColor: "#ebf5ff",
    borderColor: "#3b82f6",
  },
  categoryOptionText: {
    fontSize: 14,
    color: "#6b7280",
  },
  categoryOptionTextSelected: {
    color: "#3b82f6",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});

export default BusinessServicesScreen;
