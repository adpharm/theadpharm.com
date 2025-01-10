// import { $leaderboard } from "@/lib/stores";
// import { useStore } from "@nanostores/react";
// import fs from "fs";

// const leaderboardData = useStore($leaderboard);
// const leaderBoardJsonString = JSON.stringify(leaderboardData, null, 2);

// fs.writeFile("./leaderboardData.json", leaderBoardJsonString, (err) => {
//   if (err) {
//     console.error("Error writing file:", err);
//   } else {
//     console.log(
//       "Leaderboard data has been written to /path/to/output/leaderboardData.json",
//     );
//   }
// });

// Used the above to get the data from the leaderboard into a JSON to use here.

import * as fs from "fs";

interface Game {
  created_at: string;
  updated_at: string;
  id: number;
  user_id: number;
  current_round_key: string;
  score: number;
  upgrade_budget: number;
  game_over: boolean;
}

interface User {
  id: number;
  email: string | null;
  username: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
}

interface GameData {
  game: Game;
  user: User;
}

interface CSVContent {
  company: string;
  first_name: string;
  email: string;
  last_name: string;
}

interface ProcessedData {
  company: string;
  first_name: string;
  last_name: string;
  email: string;
  number_of_rounds_played: number;
  number_of_games_played: number;
  list_of_scores: string;
  username: string;
}


function CSVParser(csvContent: string): CSVContent[] {
  const lines = csvContent.trim().split("\n");

  const headers = lines[0].split(",");
  const withoutHeaders = lines.slice(1);


  return withoutHeaders.map((line) => {
    const values = line.split(",").map((value) => value.trim());
    return {
      company: values[0],
      first_name: values[1],
      email: values[2],
      last_name: values[3],
    };
  });
}
// Now I have the csv data in the form of an array of objects.


// Get round number from the current round key (After we successfully have access to the data that we parse from the json)
function getRoundNumber(roundKey: string): number {
  const numberFromRoundKey = roundKey.slice(3);
  return parseInt(numberFromRoundKey);
}

function convertToCSV(data: ProcessedData[]): string {
  const headers = [
    "company",
    "First Name",
    "Last Name",
    "Email",
    "Number of Rounds Played",
    "Number of Games Played",
    "List Of Scores",
    "Username",
  ];


  let csv = headers.join(",") + "\n";

  data.forEach((row) => {
    const values = [
      escapeCsvValue(row.company),
      escapeCsvValue(row.first_name),
      escapeCsvValue(row.last_name),
      escapeCsvValue(row.email),
      row.number_of_rounds_played,
      row.number_of_games_played,
      escapeCsvValue(row.list_of_scores),
      escapeCsvValue(row.username),
    ];
    csv += values.join(",") + "\n";
  });

  return csv;
}

// Helper function to escape CSV values properly
function escapeCsvValue(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function processData(
  gameData: GameData[],
  csvContent: CSVContent[],
): ProcessedData[] {
  const userGamesMap = new Map<string, GameData[]>();

  gameData.forEach((data) => {
    // Make the email lwer case to ensure match to all 30 emails.
    const email = data.user.email?.toLowerCase();

    if (email) {
      if (!userGamesMap.has(email)) {
        userGamesMap.set(email, []);
      }
      userGamesMap.get(email)?.push(data);
    }
  });

  // Each CSV row into Separate row
  const processedData: ProcessedData[] = [];

  csvContent.forEach((csvRow) => {
    const email = csvRow.email.toLowerCase();
    const userGames = userGamesMap.get(email) || [];


    if (userGames.length > 0) {
      const userData = userGames[0].user;

      processedData.push({
        company: csvRow.company,
        first_name: csvRow.first_name,
        last_name: csvRow.last_name,
        email: email,
        number_of_rounds_played: Math.max(
          ...userGames.map((g) => getRoundNumber(g.game.current_round_key)),
        ),
        number_of_games_played: userGames.length,
        list_of_scores: userGames.map((g) => g.game.score).join(";"),
        username: userData.username,
      });
    }
  });

  return processedData;
}

function main() {
  try {
    const gameData: GameData[] = JSON.parse(
      fs.readFileSync("leaderboardData.json", "utf-8"),
    );
    const companyData = CSVParser(
      fs.readFileSync(
        "src/lib/ReportDataScripts/2024ChristmasCardForClients.csv",
        "utf-8",
      ),
    );

    const processedData = processData(gameData, companyData);
    const csvOutput = convertToCSV(processedData);

    fs.writeFileSync("output.csv", csvOutput);
    console.log("Processing completed successfully!");
  } catch (error) {
    console.error("Error processing data:", error);
  }
}


// bun run parse-files --> in the pacakge.json file
main();
