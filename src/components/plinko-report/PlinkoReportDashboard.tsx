import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { tableUsers } from '@/db/schema';
import { $allUsers, $gamesScores, $leaderboard } from '@/lib/stores';
import { useStore } from '@nanostores/react';
import { Table, TableCell, TableRow } from '../ui/table';
import { makePrettyNumber } from '@/lib/utils.numbers';
import { convertUTCToDistanceToNow } from '@/lib/utils.plinko.date';
import { ClientOnly } from '@/lib/utils.react-hydration';
import { listTop10Games } from "@/lib/server/loaders/plinkoReportingLoaders";

// Items needed:
//Row 1:
// Dollar Raised
// Plinko Balls Dropped
// Total Points Scored
//Row 2:
// Placeholder
// Time Spent Playing
// Placeholder
// Leaderboard (spans 2 rows)
//Row 3:
// Players
// Replays
// Active Users

function PlinkoReportDashboard() {
  const leaderboardData = useStore($leaderboard);
  const gamesTotals = useStore($gamesScores);
  const totalScores = makePrettyNumber(gamesTotals.reduce((acc, score) => acc + score, 0));
  const allUsers = useStore($allUsers);


  console.log("Total Scores: ", totalScores);
  console.log("LeaderboardData: ", leaderboardData);
  console.log("All Users: ", allUsers.length); //TODO: WHY AM I GETTING 10 USERS ONLY??? WRONG CALL TO DB?

  // const totalDollarsRaised = totalScores.reduce((acc, score) => acc + score, 0);

  return (
    <div>
      {/* Row 1 */}
      <div className="grid md:grid-cols-1 lg:grid-cols-5 gap-4 pt-6">
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
            <div className="text-4xl font-bold">3,743</div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] text-white border-none md:col-span-1 lg:col-span-2">
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
        <div className="md:col-span-2 lg:col-span-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* // Placeholder --> Logo */}
          {/* <Card className="bg-none text-white border-none md:col-span-1"> */}
          <div className="h-full flex items-center justify-center md:col-span-2 lg:col-span-1">
            <img src="/hexagon.png" className="w-36" />
          </div>
          {/* </Card> */}

          <Card className="bg-[#111111] text-white border-none md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-normal text-zinc-500">Time spent playing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 hours 18 minutes</div>
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
            <div className="text-3xl font-bold">42</div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] text-white border-none md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-zinc-500">Replays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">16</div>
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