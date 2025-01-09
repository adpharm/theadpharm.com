// First steps to the recipe: https://dev.to/j471n/how-to-use-google-analytics-data-api-2133
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import fs from "fs";
import path from "path";
import {convertSecondsToTime} from "../utils.numbers.ts";

const propertyId = process.env.GA_PROPERTY_ID!;
const clientEmail = process.env.GA_CLIENT_EMAIL!;
const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\n/g, "\n")!;

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
});

interface AnalyticsResult {
  totalTimeSpent: string;
  percentageIncrease: number;
  rawData: {
    pagePath: string;
    activeUsers: number;
    userEngagementDuration: number;
  }[];
  summary: {
    totalActiveUsers: number;
    previousPeriodActiveUsers: number;
    averageEngagementPerUser: number;
  };
}

export async function fetchAnalyticsData(): Promise<AnalyticsResult | null> {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "2024-12-16",
          endDate: "today",
        },
        // Previous period
        {
          startDate: "2024-01-01",
          endDate: "2024-12-15",
        },
      ],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "activeUsers" }, { name: "userEngagementDuration" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: {
            matchType: "BEGINS_WITH",
            value: "/digital/plinko",
          },
        },
      },
    });

    const rows = response.rows || [];

    // Process current period data
    const rawData = rows.map((row) => ({
      pagePath: row.dimensionValues?.[0]?.value || "Unknown",
      activeUsers: parseInt(row.metricValues?.[0]?.value || "0", 10),
      userEngagementDuration: parseFloat(row.metricValues?.[1]?.value || "0"),
    }));

    // Calculate Tiotal time spent playing --> in seconds
    const totalTimeSpent = rawData.reduce(
      (sum, item) => sum + item.userEngagementDuration,
      0,
    );

    const currentActiveUsers = rawData.reduce(
      (sum, item) => sum + item.activeUsers,
      0,
    );

    // Get previous period data from totals
    const previousActiveUsers = response.totals?.[1]?.metricValues?.[0]?.value
      ? parseInt(response.totals[1].metricValues[0].value, 10)
      : 0;

    const percentageIncrease =
      previousActiveUsers > 0
        ? ((currentActiveUsers - previousActiveUsers) / previousActiveUsers) *
          100
        : 0;

    const cleanTimeFormat = convertSecondsToTime(totalTimeSpent);
    const result: AnalyticsResult = {
      totalTimeSpent: cleanTimeFormat,
      percentageIncrease,
      rawData,
      summary: {
        totalActiveUsers: currentActiveUsers,
        previousPeriodActiveUsers: previousActiveUsers,
        averageEngagementPerUser:
          currentActiveUsers > 0 ? totalTimeSpent / currentActiveUsers : 0,
      },
    };

    // Save complete data including raw response to json
    const outputData = {
      outputResult: result,
      rawResponse: response,
    };
    const outputPath = path.resolve("./src/data/googleAnalyticsOutput.json");
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

    return result;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return null;
  }
}

(async () => {
  const analyticsData = await fetchAnalyticsData();
  console.log("Analytics Data:", analyticsData);
})();
