import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// In a real app, we would import a charting library like react-native-chart-kit
// or victory-native. For this demo, we'll simulate charts with custom components.

const { width } = Dimensions.get("window");
const chartWidth = width - 40;

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AnalyticsCard = ({
  title,
  subtitle,
  children,
}: AnalyticsCardProps) => {
  return (
    <View style={styles.analyticsCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
      </View>
      {children}
    </View>
  );
};

export const RevenueChart = () => {
  // Simulate revenue data for the last 7 days
  const revenueData = [120, 150, 200, 180, 250, 300, 280];
  const maxValue = Math.max(...revenueData);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartYAxis}>
        <Text style={styles.axisLabel}>{maxValue} TND</Text>
        <Text style={styles.axisLabel}>{maxValue / 2} TND</Text>
        <Text style={styles.axisLabel}>0 TND</Text>
      </View>
      <View style={styles.barChartContainer}>
        {revenueData.map((value, index) => (
          <View key={index} style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  height: (value / maxValue) * 150,
                  backgroundColor: "#3b82f6",
                },
              ]}
            />
            <Text style={styles.barLabel}>Day {index + 1}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export const BookingsTrend = () => {
  // Simulate monthly bookings data
  const monthlyData = [
    { month: "Jan", bookings: 150 },
    { month: "Feb", bookings: 180 },
    { month: "Mar", bookings: 210 },
    { month: "Apr", bookings: 240 },
    { month: "May", bookings: 190 },
    { month: "Jun", bookings: 220 },
  ];
  const maxValue = Math.max(...monthlyData.map((item) => item.bookings));

  return (
    <View style={styles.chartContainer}>
      <View style={styles.lineChart}>
        <View style={styles.chartYAxis}>
          <Text style={styles.axisLabel}>{maxValue}</Text>
          <Text style={styles.axisLabel}>{maxValue / 2}</Text>
          <Text style={styles.axisLabel}>0</Text>
        </View>
        <View style={styles.lineChartContainer}>
          {/* In a real app, we would use a proper charting library */}
          <View style={styles.lineChartLine} />
          <View style={styles.lineChartLabels}>
            {monthlyData.map((item, index) => (
              <Text key={index} style={styles.lineChartLabel}>
                {item.month}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export const CustomerRetentionMetrics = () => {
  return (
    <View style={styles.metricsContainer}>
      <View style={styles.metricItem}>
        <Text style={styles.metricValue}>85%</Text>
        <Text style={styles.metricLabel}>Retention Rate</Text>
        <View style={styles.trendIndicator}>
          <Ionicons name="arrow-up" size={16} color="#10b981" />
          <Text style={[styles.trendText, { color: "#10b981" }]}>5%</Text>
        </View>
      </View>
      <View style={styles.metricItem}>
        <Text style={styles.metricValue}>12</Text>
        <Text style={styles.metricLabel}>Avg. Visits</Text>
        <View style={styles.trendIndicator}>
          <Ionicons name="arrow-up" size={16} color="#10b981" />
          <Text style={[styles.trendText, { color: "#10b981" }]}>2</Text>
        </View>
      </View>
      <View style={styles.metricItem}>
        <Text style={styles.metricValue}>4.2%</Text>
        <Text style={styles.metricLabel}>Churn Rate</Text>
        <View style={styles.trendIndicator}>
          <Ionicons name="arrow-down" size={16} color="#10b981" />
          <Text style={[styles.trendText, { color: "#10b981" }]}>1.5%</Text>
        </View>
      </View>
    </View>
  );
};

export const RevenueForecast = () => {
  return (
    <View style={styles.forecastContainer}>
      <View style={styles.forecastHeader}>
        <Text style={styles.forecastTitle}>Revenue Forecast</Text>
        <View style={styles.forecastPeriod}>
          <Text style={styles.forecastPeriodText}>Next 30 Days</Text>
        </View>
      </View>
      <View style={styles.forecastMetrics}>
        <View style={styles.forecastMetric}>
          <Text style={styles.forecastValue}>8,500 TND</Text>
          <Text style={styles.forecastLabel}>Expected Revenue</Text>
          <View style={styles.trendIndicator}>
            <Ionicons name="arrow-up" size={16} color="#10b981" />
            <Text style={[styles.trendText, { color: "#10b981" }]}>12%</Text>
          </View>
        </View>
        <View style={styles.forecastMetric}>
          <Text style={styles.forecastValue}>320</Text>
          <Text style={styles.forecastLabel}>Expected Bookings</Text>
          <View style={styles.trendIndicator}>
            <Ionicons name="arrow-up" size={16} color="#10b981" />
            <Text style={[styles.trendText, { color: "#10b981" }]}>8%</Text>
          </View>
        </View>
      </View>
      <View style={styles.forecastChart}>
        {/* This would be a real chart in an actual implementation */}
        <View style={styles.mockChart}>
          <View style={styles.mockChartLine} />
          <View style={styles.mockChartProjection} />
        </View>
      </View>
    </View>
  );
};

export const CustomerSegmentation = () => {
  const segments = [
    { name: "Loyal", percentage: 45, color: "#3b82f6" },
    { name: "Regular", percentage: 30, color: "#10b981" },
    { name: "Occasional", percentage: 15, color: "#f59e0b" },
    { name: "New", percentage: 10, color: "#8b5cf6" },
  ];

  return (
    <View style={styles.segmentationContainer}>
      <View style={styles.pieChart}>
        {/* In a real app, this would be a proper pie chart */}
        <View style={styles.pieChartCenter}>
          <Text style={styles.pieChartCenterText}>100%</Text>
        </View>
      </View>
      <View style={styles.segmentLegend}>
        {segments.map((segment, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: segment.color }]}
            />
            <Text style={styles.legendText}>
              {segment.name} ({segment.percentage}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export const EnhancedAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = React.useState<"week" | "month" | "year">(
    "month"
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Enhanced Analytics</Text>
        <View style={styles.timeRangeSelector}>
          <TouchableOpacity
            style={[
              styles.timeRangeButton,
              timeRange === "week" && styles.activeTimeRange,
            ]}
            onPress={() => setTimeRange("week")}
          >
            <Text
              style={[
                styles.timeRangeText,
                timeRange === "week" && styles.activeTimeRangeText,
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeRangeButton,
              timeRange === "month" && styles.activeTimeRange,
            ]}
            onPress={() => setTimeRange("month")}
          >
            <Text
              style={[
                styles.timeRangeText,
                timeRange === "month" && styles.activeTimeRangeText,
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeRangeButton,
              timeRange === "year" && styles.activeTimeRange,
            ]}
            onPress={() => setTimeRange("year")}
          >
            <Text
              style={[
                styles.timeRangeText,
                timeRange === "year" && styles.activeTimeRangeText,
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summaryMetrics}>
        <View style={styles.summaryMetric}>
          <Text style={styles.summaryValue}>4,250 TND</Text>
          <Text style={styles.summaryLabel}>Revenue</Text>
        </View>
        <View style={styles.summaryMetric}>
          <Text style={styles.summaryValue}>187</Text>
          <Text style={styles.summaryLabel}>Bookings</Text>
        </View>
        <View style={styles.summaryMetric}>
          <Text style={styles.summaryValue}>42</Text>
          <Text style={styles.summaryLabel}>New Customers</Text>
        </View>
      </View>

      <AnalyticsCard
        title="Revenue Trend"
        subtitle="Daily revenue for the past week"
      >
        <RevenueChart />
      </AnalyticsCard>

      <AnalyticsCard title="Bookings Trend" subtitle="Monthly bookings">
        <BookingsTrend />
      </AnalyticsCard>

      <AnalyticsCard title="Customer Retention">
        <CustomerRetentionMetrics />
      </AnalyticsCard>

      <AnalyticsCard title="Revenue Forecast">
        <RevenueForecast />
      </AnalyticsCard>

      <AnalyticsCard title="Customer Segmentation">
        <CustomerSegmentation />
      </AnalyticsCard>

      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>Key Insights</Text>
        <View style={styles.insightItem}>
          <Ionicons name="trending-up" size={20} color="#10b981" />
          <Text style={styles.insightText}>
            Your peak booking hours are between 10AM-2PM. Consider adding
            special promotions for off-peak hours.
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Ionicons name="people" size={20} color="#3b82f6" />
          <Text style={styles.insightText}>
            85% of your revenue comes from repeat customers. Consider a loyalty
            program to increase retention.
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Ionicons name="calendar" size={20} color="#f59e0b" />
          <Text style={styles.insightText}>
            Weekends are your busiest days. Consider increasing capacity or
            prices during these times.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  timeRangeSelector: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 2,
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeTimeRange: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  timeRangeText: {
    fontSize: 14,
    color: "#6b7280",
  },
  activeTimeRangeText: {
    color: "#111827",
    fontWeight: "500",
  },
  summaryMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryMetric: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  analyticsCard: {
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
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  chartContainer: {
    flexDirection: "row",
    height: 200,
    alignItems: "center",
  },
  chartYAxis: {
    width: 50,
    height: "100%",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 8,
  },
  axisLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  barChartContainer: {
    flex: 1,
    flexDirection: "row",
    height: 180,
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  barContainer: {
    alignItems: "center",
  },
  bar: {
    width: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 4,
  },
  lineChart: {
    flex: 1,
    flexDirection: "row",
    height: 180,
  },
  lineChartContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },
  lineChartLine: {
    height: 2,
    backgroundColor: "#3b82f6",
    marginBottom: 20,
    width: "100%",
  },
  lineChartLabels: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  lineChartLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
    padding: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  trendIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 2,
  },
  forecastContainer: {
    marginVertical: 8,
  },
  forecastHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  forecastTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  forecastPeriod: {
    backgroundColor: "#ebf5ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  forecastPeriodText: {
    fontSize: 12,
    color: "#3b82f6",
  },
  forecastMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  forecastMetric: {
    flex: 1,
    paddingHorizontal: 8,
  },
  forecastValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  forecastLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  forecastChart: {
    height: 100,
    marginTop: 8,
  },
  mockChart: {
    flex: 1,
    position: "relative",
  },
  mockChartLine: {
    position: "absolute",
    height: 2,
    backgroundColor: "#6b7280",
    width: "70%",
    top: "50%",
  },
  mockChartProjection: {
    position: "absolute",
    height: 2,
    backgroundColor: "#3b82f6",
    width: "30%",
    top: "50%",
    left: "70%",
    borderStyle: "dashed",
  },
  segmentationContainer: {
    marginVertical: 8,
  },
  pieChart: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  pieChartCenter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  pieChartCenterText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
  },
  segmentLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    width: "48%",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#6b7280",
  },
  insightsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  insightText: {
    fontSize: 14,
    color: "#4b5563",
    flex: 1,
    marginLeft: 8,
  },
});

export default EnhancedAnalyticsDashboard;
