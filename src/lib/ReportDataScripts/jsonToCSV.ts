import { $leaderboard } from "@/lib/stores";
import { useStore } from "@nanostores/react";
import fs from "fs";

const leaderboardData = useStore($leaderboard);
const leaderBoardJsonString = JSON.stringify(leaderboardData, null, 2);

fs.writeFile("./leaderboardData.json", leaderBoardJsonString, (err) => {
  if (err) {
    console.error("Error writing file:", err);
  } else {
    console.log(
      "Leaderboard data has been written to /path/to/output/leaderboardData.json",
    );
  }
});
