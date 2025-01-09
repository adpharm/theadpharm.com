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


// Items needed:
//Row 1:
// Dollar Raised ----------------> DONE
// Plinko Balls Dropped ---------> DONE
// Total Points Scored ----------> DONE
//Row 2:
// Placeholder ------------------> DONE
// Time Spent Playing -----------> DONE
// Placeholder ------------------> DONE
// Leaderboard (spans 2 rows) ---> DONE
//Row 3:
// Players ----------------------> DONE
// Replays ----------------------> DONE
// Active Users

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
  
  console.log("All games with rounds data: ", allGamesWithRounds);
  console.log("All Games: ", allGames)
  console.log("Here is the Total Time Spent: ", timeSpentPlayingPlinko)

  return (
    <div>
      {/* Row 1 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 pt-6">
        <Card className="bg-[#111111] text-white border-none md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-zinc-500">Dollars raised</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">$5,000</div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] text-white border-none md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-zinc-500">Plinko balls dropped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalBallsDropped}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] text-white border-none md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-zinc-500">Total points scored</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalScores}</div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4 pb-6">
        <div className="lg:col-span-4 grid md:col-span-1 lg:grid-cols-4 gap-4">
          {/* // Placeholder --> Logo */}
          {/* <Card className="bg-none text-white border-none md:col-span-1"> */}
          <div className="h-full flex items-center justify-center md:col-span-2 lg:col-span-1">
            <img src="/hexagon.png" className="w-36" />
          </div>
          {/* </Card> */}

          <Card className="bg-[#111111] text-white border-none md:col-span-2 ">
            <CardHeader>
              <CardTitle className="text-sm font-normal text-zinc-500">Time spent playing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timeSpentPlayingPlinko}</div>
            </CardContent>
          </Card>

          {/* // Placeholder --> Play */}
          <Card className="bg-[#111111] text-white border-none md:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-normal text-zinc-500">
                Let's play!
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full flex justify-center">
              <a href='/digital/plinko'>
                <img src="/play-button.png" className="w-24" />
              </a>
            </CardContent>
          </Card>
        </div>
        {/* TODO: Check with Ben on the overflow, what's a better way to do it without having the bar? */}
        {/* TODO: Check with Ben if I should be filtering out the duplicates in the leaderboard. So make them unique values only?*/}
        <Card className="bg-[#111111] text-white border-none md:col-span-2 lg:col-span-2 md:row-span-4 lg:row-span-2 lg:max-h-96 overflow-auto">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              {leaderboardData.map((rowData, idx) => {
                return (
                  <TableRow key={`game-${rowData.game.id}`}>
                    {/* <TableCell>{idx + 1}</TableCell> */}
                    <TableCell className="font-medium">
                      {rowData.user.username}{" "}
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
                );
              })}
            </Table>
          </CardContent>
        </Card>


        {/* Row 3 */}
        <Card className="bg-[#111111] text-white border-none md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-zinc-500">Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUniqueUsers}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] text-white border-none md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-zinc-500">Replays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalReplays}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] text-white border-none md:col-span-2">
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-bold">+1,448%</span>
              <span>active users</span>
            </div>
            <div className="text-sm text-zinc-500">on theadpharm.com</div>
            <div className="h-16 mt-2">
              <div className="w-full h-full bg-zinc-800 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

  );
};

export default PlinkoReportDashboard;