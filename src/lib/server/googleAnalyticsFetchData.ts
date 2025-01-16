// First steps to the recipe: https://dev.to/j471n/how-to-use-google-analytics-data-api-2133
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import fs from "fs";
import path from "path";
import { convertSecondsToTime } from "../utils.numbers.ts";

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
  rawData: {
    pagePath: string;
    activeUsers: number;
    userEngagementDuration: number;
  }[];
}

export async function fetchAnalyticsData(): Promise<AnalyticsResult | null> {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "2024-12-01",
          endDate: "today",
        },
      ],
      dimensions: [{ name: "pagePath" }],
      metrics: [{name: "activeUsers"}, { name: "userEngagementDuration" }],
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
      activeUsers: parseInt(row.metricValues?.[0]?.value || "0"),
      userEngagementDuration: parseFloat(row.metricValues?.[1]?.value || "0"),
    }));

    // Calculate Tiotal time spent playing --> in seconds
    const totalTimeSpent = rawData.reduce(
      (sum, item) => sum + item.userEngagementDuration,
      0,
    )/2;

    const cleanTimeFormat = convertSecondsToTime(totalTimeSpent);
    const result: AnalyticsResult = {
      totalTimeSpent: cleanTimeFormat,
      rawData,
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
