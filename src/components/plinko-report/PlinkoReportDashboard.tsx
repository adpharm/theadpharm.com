import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { tableUsers } from '@/db/schema';
import { $allGames, $allGamesWithRounds, $allUsers, $gamesScores, $leaderboard } from '@/lib/stores';
import { useStore } from '@nanostores/react';
import { Table, TableCell, TableRow } from '../ui/table';
import { makePrettyNumber } from '@/lib/utils.numbers';
import { convertUTCToDistanceToNow } from '@/lib/utils.plinko.date';
import { ClientOnly } from '@/lib/utils.react-hydration';
import { listLeaderboardGames } from "@/lib/server/loaders/plinkoReportingLoaders";
import { getPlinkoBallsDropped, getUserReplayCount } from '@/lib/server/plinkoReportLogic';
import googleAnalyticsData from '@/data/googleAnalyticsOutput.json';
import fs from 'fs';

function PlinkoReportDashboard() {
  const leaderboardData = useStore($leaderboard);
  const gamesTotals = useStore($gamesScores);
  const allUsers = useStore($allUsers);
  const allGamesWithRounds = useStore($allGamesWithRounds);
  const allGames = useStore($allGames);

  // I want to get the variable totalTimeSpent from the json file googleAnalyticsOutput.json
  const timeSpentPlayingPlinko = googleAnalyticsData?.outputResult?.totalTimeSpent ?? "Something's wrong";


  // Below are the constants used for the cards
  const totalScores = makePrettyNumber(gamesTotals.reduce((acc, score) => acc + score, 0));
  const totalBallsDropped = makePrettyNumber(getPlinkoBallsDropped());
  const totalUniqueUsers = allUsers.length;
  const totalReplays = makePrettyNumber(getUserReplayCount());
  const totalRoundsPlayed = allGamesWithRounds.length;

  // console.log("All games with rounds data: ", allGamesWithRounds);
  console.log("Total rounds played: ", (totalRoundsPlayed / 2));
  console.log("All Games: ", allGames)
  // console.log("Here is the Total Time Spent: ", timeSpentPlayingPlinko)
  // console.log("LEADERBOARD: ", leaderboardData)

  const jsonString = JSON.stringify(leaderboardData, null, 2);


  fs.writeFile("./leaderboardData.json", jsonString, (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log(
        "Leaderboard data has been written to /path/to/output/leaderboardData.json",
      );
    }
  });

  return (
    <div className="space-y-4">
      {/* Top row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 pt-6">
        <Card className="col-span-1 lg:col-span-2 bg-[#111111] text-white border-none">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-zinc-500">Dollars raised</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold">$5,000</div>
          </CardContent>
        </Card>

        {/* Plinko balls - single col */}
        <Card className="col-span-1 lg:col-span-1 bg-[#111111] text-white border-none">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-zinc-500">Plinko balls dropped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold">{totalBallsDropped}</div>
          </CardContent>
        </Card>

        {/* Total points - spans 2 cols */}
        <Card className="col-span-2 lg:col-span-2 bg-[#111111] text-white border-none">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-zinc-500">Total points scored</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold">{totalScores}</div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Hexagon logo */}
        <div className="hidden lg:grid col-span-1 lg:col-span-1 flex items-center justify-center">
          <img src="/hexagon.png" className="w-36" alt="Logo" />
        </div>

        <Card className="col-span-2 lg:col-span-3 bg-[#111111] text-white border-none">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-zinc-500">Time spent playing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold">{timeSpentPlayingPlinko}</div>
          </CardContent>
        </Card>

        {/* Play button */}
        <Card className="col-span-1 bg-[#111111] text-white border-none">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-zinc-500">Let's play!</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <a href='/digital/plinko'>
              <img src="/play-button.png" className="w-24" alt="Play" />
            </a>
          </CardContent>
        </Card>

        {/* Players count */}
        <Card className="col-span-1 bg-[#111111] text-white border-none">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-zinc-500">Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold">{totalUniqueUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Last section */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-start">
        <div className="col-span-2 md:col-span-4 lg:col-span-3 grid grid-cols-3 gap-4">

          {/* Replays count */}
          <Card className="col-span-1 bg-[#111111] text-white border-none h-full">
            <CardHeader>
              <CardTitle className="text-sm font-normal text-zinc-500">Replays</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold">{totalReplays}</div>
            </CardContent>
          </Card>

          {/* Active users box */}
          <Card className="col-span-2 bg-[#111111] text-white border-none h-full">
            <CardContent>
              <div className="flex items-center gap-2 pt-4 text-lg">
                <span className="text-green-500 font-bold">+1,448%</span>
                <span>active users</span>
              </div>
              <div className="text-sm text-zinc-500">on theadpharm.com</div>
              <div className="flex justify-center">
                <img src="/active_users_sparkline.svg" alt="Active users trend" />
              </div>
            </CardContent>
          </Card>

          {/* Plinko balls - single col */}
          <Card className="col-span-1 lg:col-span-2 bg-[#111111] text-white border-none">
            <CardHeader>
              <CardTitle className="text-sm font-normal text-zinc-500">Plinko balls dropped</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold">{totalBallsDropped}</div>
            </CardContent>
          </Card>

          {/* Hexagon logo */}
          <div className="hidden lg:grid col-span-1 lg:col-span-1 flex items-center justify-center">
            <img src="/hexagon.png" className="w-36" alt="Logo" />
          </div>
        </div>


        {/* Leaderboard */}
        <Card className="col-span-2 md:col-span-4 lg:col-span-3 bg-[#111111] text-white border-none">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-auto no-scrollbar">
            <Table>
              {leaderboardData.map((rowData) => (
                <TableRow key={`game-${rowData.game.id}`}>
                  <TableCell className="font-medium">
                    {rowData.user.username}
                  </TableCell>
                  <TableCell>
                    <ClientOnly>
                      {() => (
                        <span className="capitalize">
                          {convertUTCToDistanceToNow(rowData.game.created_at)}
                        </span>
                      )}
                    </ClientOnly>
                  </TableCell>
                  <TableCell className="text-right">
                    {makePrettyNumber(rowData.game.score)}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default PlinkoReportDashboard;