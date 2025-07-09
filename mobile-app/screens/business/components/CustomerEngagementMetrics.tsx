import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getCustomerEngagementMetrics,
  getProfileClickTrend,
  getInterestHeatmap,
  CustomerEngagementMetrics as EngagementMetrics,
} from "../../../utils/analyticsTracker";

const { width } = Dimensions.get("window");

interface CustomerEngagementMetricsProps {
  businessId: string;
}

export const CustomerEngagementMetrics: React.FC<
  CustomerEngagementMetricsProps
> = ({ businessId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "today" | "week" | "month" | "year"
  >("week");
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [clickTrend, setClickTrend] = useState<
    Array<{ date: string; clicks: number; uniqueCustomers: number }>
  >([]);

  useEffect(() => {
    const engagementMetrics = getCustomerEngagementMetrics(
      businessId,
      selectedPeriod
    );
    const trendData = getProfileClickTrend(
      businessId,
      selectedPeriod === "week" ? 7 : 30
    );

    setMetrics(engagementMetrics);
    setClickTrend(trendData);
  }, [businessId, selectedPeriod]);

  if (!metrics) {
    return <Text>Loading metrics...</Text>;
  }

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {(["today", "week", "month", "year"] as const).map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            styles.periodButton,
            selectedPeriod === period && styles.activePeriodButton,
          ]}
          onPress={() => setSelectedPeriod(period)}
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.activePeriodButtonText,
            ]}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderProfileClicksCard = () => (
    <View style={styles.metricsCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Ionicons name="eye-outline" size={20} color="#3b82f6" />
          <Text style={styles.cardTitle}>Profile Views</Text>
        </View>
        <View style={styles.trendIndicator}>
          <Ionicons
            name={
              metrics.profileClicks.trend >= 0 ? "trending-up" : "trending-down"
            }
            size={16}
            color={metrics.profileClicks.trend >= 0 ? "#10b981" : "#ef4444"}
          />
          <Text
            style={[
              styles.trendText,
              {
                color: metrics.profileClicks.trend >= 0 ? "#10b981" : "#ef4444",
              },
            ]}
          >
            {metrics.profileClicks.trend >= 0 ? "+" : ""}
            {metrics.profileClicks.trend.toFixed(1)}%
          </Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{metrics.profileClicks.total}</Text>
          <Text style={styles.metricLabel}>Total Clicks</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{metrics.profileClicks.unique}</Text>
          <Text style={styles.metricLabel}>Unique Visitors</Text>
        </View>
      </View>

      <View style={styles.sourceBreakdown}>
        <Text style={styles.sectionSubtitle}>Traffic Sources</Text>
        <View style={styles.sourceList}>
          {Object.entries(metrics.profileClicks.bySource).map(
            ([source, count]) => (
              <View key={source} style={styles.sourceItem}>
                <View style={styles.sourceInfo}>
                  <Ionicons
                    name={getSourceIcon(source)}
                    size={16}
                    color="#6b7280"
                  />
                  <Text style={styles.sourceName}>
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </Text>
                </View>
                <Text style={styles.sourceCount}>{count}</Text>
              </View>
            )
          )}
        </View>
      </View>
    </View>
  );

  const renderInterestMetricsCard = () => (
    <View style={styles.metricsCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Ionicons name="heart-outline" size={20} color="#ef4444" />
          <Text style={styles.cardTitle}>Customer Interest</Text>
        </View>
        <Text style={styles.conversionRate}>
          {metrics.interestMetrics.conversionRate.toFixed(1)}% conversion
        </Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {metrics.interestMetrics.totalInteractions}
          </Text>
          <Text style={styles.metricLabel}>Total Interactions</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {metrics.interestMetrics.uniqueCustomers}
          </Text>
          <Text style={styles.metricLabel}>Engaged Customers</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {Math.round(metrics.interestMetrics.averageSessionDuration)}s
          </Text>
          <Text style={styles.metricLabel}>Avg. Session</Text>
        </View>
      </View>

      <View style={styles.interestBreakdown}>
        <Text style={styles.sectionSubtitle}>Interest Types</Text>
        <View style={styles.interestList}>
          {Object.entries(metrics.interestMetrics.byInterestType).map(
            ([type, count]) => (
              <View key={type} style={styles.interestItem}>
                <View style={styles.interestInfo}>
                  <Ionicons
                    name={getInterestIcon(type)}
                    size={16}
                    color="#6b7280"
                  />
                  <Text style={styles.interestName}>
                    {formatInterestType(type)}
                  </Text>
                </View>
                <Text style={styles.interestCount}>{count}</Text>
              </View>
            )
          )}
        </View>
      </View>
    </View>
  );

  const renderTopServicesCard = () => (
    <View style={styles.metricsCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Ionicons name="star-outline" size={20} color="#f59e0b" />
          <Text style={styles.cardTitle}>Popular Services</Text>
        </View>
      </View>

      <View style={styles.servicesList}>
        {metrics.interestMetrics.topServices.map((service, index) => (
          <View key={service.serviceId} style={styles.serviceItem}>
            <View style={styles.serviceRank}>
              <Text style={styles.rankNumber}>{index + 1}</Text>
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.serviceName}</Text>
              <Text style={styles.serviceStats}>
                {service.views} views • {service.conversionRate}% conversion
              </Text>
            </View>
            <View style={styles.serviceProgress}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${
                      (service.views /
                        Math.max(
                          ...metrics.interestMetrics.topServices.map(
                            (s) => s.views
                          )
                        )) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCustomerJourneyCard = () => (
    <View style={styles.metricsCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Ionicons name="analytics-outline" size={20} color="#8b5cf6" />
          <Text style={styles.cardTitle}>Customer Journey</Text>
        </View>
      </View>

      <View style={styles.journeyMetrics}>
        <View style={styles.journeyItem}>
          <Text style={styles.journeyValue}>
            {metrics.customerJourney.clickToBookingRate.toFixed(1)}%
          </Text>
          <Text style={styles.journeyLabel}>Click to Booking Rate</Text>
        </View>
        <View style={styles.journeyItem}>
          <Text style={styles.journeyValue}>
            {metrics.customerJourney.averageTimeToBooking}h
          </Text>
          <Text style={styles.journeyLabel}>Avg. Time to Book</Text>
        </View>
      </View>

      <View style={styles.dropOffAnalysis}>
        <Text style={styles.sectionSubtitle}>Drop-off Analysis</Text>
        {metrics.customerJourney.dropOffPoints.map((point, index) => (
          <View key={index} style={styles.dropOffItem}>
            <Text style={styles.dropOffStage}>{point.stage}</Text>
            <View style={styles.dropOffBar}>
              <View
                style={[styles.dropOffFill, { width: `${point.dropOffRate}%` }]}
              />
            </View>
            <Text style={styles.dropOffRate}>{point.dropOffRate}%</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderClickTrendChart = () => {
    const maxClicks = Math.max(...clickTrend.map((d) => d.clicks));

    return (
      <View style={styles.metricsCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="trending-up-outline" size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Profile Clicks Trend</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            {clickTrend.map((data, index) => (
              <View key={index} style={styles.chartBar}>
                <View
                  style={[
                    styles.bar,
                    {
                      height:
                        maxClicks > 0 ? (data.clicks / maxClicks) * 100 : 0,
                      backgroundColor: "#3b82f6",
                    },
                  ]}
                />
                <Text style={styles.chartLabel}>
                  {new Date(data.date).getDate()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Engagement Analytics</Text>
        {renderPeriodSelector()}
      </View>

      {renderProfileClicksCard()}
      {renderInterestMetricsCard()}
      {renderTopServicesCard()}
      {renderCustomerJourneyCard()}
      {renderClickTrendChart()}
    </ScrollView>
  );
};

// Helper functions
const getSourceIcon = (source: string): any => {
  switch (source) {
    case "search":
      return "search-outline";
    case "recommendation":
      return "thumbs-up-outline";
    case "direct":
      return "link-outline";
    case "social":
      return "share-social-outline";
    default:
      return "help-outline";
  }
};

const getInterestIcon = (type: string): any => {
  switch (type) {
    case "service_view":
      return "list-outline";
    case "gallery_view":
      return "images-outline";
    case "menu_view":
      return "restaurant-outline";
    case "reviews_read":
      return "star-outline";
    case "contact_info_view":
      return "call-outline";
    case "booking_attempt":
      return "calendar-outline";
    case "save_business":
      return "bookmark-outline";
    case "share_business":
      return "share-outline";
    default:
      return "help-outline";
  }
};

const formatInterestType = (type: string): string => {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  activePeriodButton: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  periodButtonText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  activePeriodButtonText: {
    color: "#111827",
    fontWeight: "600",
  },
  metricsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  trendIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  conversionRate: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "500",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  metricItem: {
    alignItems: "center",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  sourceBreakdown: {
    marginTop: 8,
  },
  sourceList: {
    gap: 8,
  },
  sourceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  sourceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  sourceName: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
  },
  sourceCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  interestBreakdown: {
    marginTop: 8,
  },
  interestList: {
    gap: 8,
  },
  interestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  interestInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  interestName: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
  },
  interestCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  servicesList: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  serviceRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  serviceStats: {
    fontSize: 12,
    color: "#6b7280",
  },
  serviceProgress: {
    width: 60,
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 2,
  },
  journeyMetrics: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  journeyItem: {
    alignItems: "center",
  },
  journeyValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  journeyLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  dropOffAnalysis: {
    marginTop: 8,
  },
  dropOffItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dropOffStage: {
    fontSize: 12,
    color: "#374151",
    width: 80,
  },
  dropOffBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    marginHorizontal: 8,
  },
  dropOffFill: {
    height: "100%",
    backgroundColor: "#ef4444",
    borderRadius: 3,
  },
  dropOffRate: {
    fontSize: 12,
    color: "#ef4444",
    fontWeight: "500",
    width: 30,
    textAlign: "right",
  },
  chartContainer: {
    marginTop: 8,
  },
  chart: {
    flexDirection: "row",
    height: 120,
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  chartBar: {
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
});

export default CustomerEngagementMetrics;
