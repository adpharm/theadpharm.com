import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { $allGames, $allGamesWithRounds, $allUsers, $gamesScores, $leaderboard } from '@/lib/stores';
import { useStore } from '@nanostores/react';
import { Table, TableCell, TableRow } from '../ui/table';
import { makePrettyNumber } from '@/lib/utils.numbers';
import { convertUTCToDistanceToNow } from '@/lib/utils.plinko.date';
import { ClientOnly } from '@/lib/utils.react-hydration';
import { getPlinkoBallsDropped, getUserReplayCount } from '@/lib/server/plinkoReportLogic';
import googleAnalyticsData from '@/data/googleAnalyticsOutput.json';
import StatsCardSvg from './StatsCardSvg';
import { FaInfoCircle } from "react-icons/fa";
import { CustomTooltip } from '../Tooltip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


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
  console.log("Total rounds played: ", (totalRoundsPlayed));


  // console.log("Here is the Total Time Spent: ", timeSpentPlayingPlinko)
  // console.log("LEADERBOARD: ", leaderboardData)

  // count the rounds played based on how many games are in the 

  // const jsonString = JSON.stringify(leaderboardData, null, 2);


  // fs.writeFile("./leaderboardData.json", jsonString, (err) => {
  //   if (err) {
  //     console.error("Error writing file:", err);
  //   } else {
  //     console.log(
  //       "Leaderboard data has been written to leaderboardData.json",
  //     );
  //   }
  // });

  return (
    <>
      <div className="space-y-4">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-6">
          {/* Games played */}
          <Card className="md:order-1 col-span-1 bg-[#111111] text-white border-none h-full">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-normal text-zinc-500">Games played</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex items-end justify-end h-fit">
              <div className="text-3xl md:text-4xl font-bold">{allGames.length}</div>
            </CardContent>
          </Card>

          {/* Plinko balls - single col */}
          <Card className="md:order-2 col-span-1 lg:col-span-1 bg-[#111111] text-white border-none">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-normal text-zinc-500">Balls dropped</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex items-end justify-end h-fit">
              <div className="text-3xl md:text-4xl font-bold">{totalBallsDropped}</div>
            </CardContent>
          </Card>

          {/* Total points - spans 2 cols */}
          <Card className="md:hidden lg:grid lg:order-3 md:order-4 col-span-3 lg:col-span-2 bg-[#111111] text-white border-none">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-normal text-zinc-500">Total points scored</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex h-fit">
              <div className="text-3xl md:text-4xl font-bold">{totalScores}</div>
            </CardContent>
          </Card>

          {/* Rounds Played */}
          <Card className="lg:order-4 md:order-3 cols-span-3 bg-[#111111] text-white border-none h-full">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-normal text-zinc-500">Rounds played</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex items-end justify-end">
              <div className="text-3xl md:text-4xl font-bold">{totalRoundsPlayed}</div>
            </CardContent>
          </Card>

          {/* Hexagon logo filler tile */}
          <div className="md:hidden col-span-1 lg:col-span-1 flex items-center justify-center">
            <img src="/hexagon.png" className="w-28" alt="Logo" />
          </div>


        </div>

        {/* Middle Row filler tile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Hexagon logo */}
          <div className="hidden lg:grid col-span-1 lg:col-span-1 flex items-center justify-center">
            <img src="/hexagon.png" className="w-28" alt="Logo" />
          </div>

          {/* Total points - spans 2 cols */}
          <Card className="hidden md:grid lg:hidden lg:order-3 md:order-4 col-span-1 md:col-span-2 bg-[#111111] text-white border-none">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-normal text-zinc-500">Total points scored</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex lg:items-end lg:justify-end h-fit">
              <div className="text-3xl md:text-4xl font-bold">{totalScores}</div>
            </CardContent>
          </Card>

          <Card className="col-span-2 md:col-span-2 lg:col-span-3 bg-[#111111] text-white border-none">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-normal text-zinc-500">Time spent playing</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex md:items-end md:justify-end lg:items-start lg:justify-start h-fit">
              <div className="text-3xl md:text-4xl font-bold">{timeSpentPlayingPlinko}</div>
            </CardContent>
          </Card>

          {/* Play button */}
          <Card className="col-span-1 bg-[#111111] text-white border-none">
            <CardHeader className='p-4 pb-2'>
              <CardTitle className="text-sm font-normal text-zinc-500">Let's play!</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pb-1 flex justify-center pt-0">
              <a href='/digital/plinko'>
                <img src="/play-button.png" className="w-20 md:w-16" alt="Play" />
              </a>
            </CardContent>
          </Card>

          {/* Players count */}
          <Card className="col-span-1 bg-[#111111] text-white border-none">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-normal text-zinc-500">Players</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex md:items-end md:justify-end h-fit">
              <div className="text-3xl md:text-4xl font-bold">{totalUniqueUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Last section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-start">
          <div className="col-span-2 md:col-span-4 lg:col-span-3 grid grid-cols-3 gap-4">

            {/* Active users box */}
            <Card className="col-span-3 md:col-span-2 bg-[#111111] text-white border-none h-full">
              <CardContent className="p-4 pt-0 md:pb-0">
                <div className="flex items-center gap-2 pt-2 text-sm md:text-md">
                  <span className="text-green-500 font-bold">+1,448%</span>
                  <span>active users</span>
                </div>
                <div className="text-sm text-zinc-500">on theadpharm.com</div>
                {/* <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75 left-[42.7%]"></span> */}
                {/* <img className='relative' src="/active_users_sparkline.svg" alt="Active users trend" /> 
                */}
                <div className="flex justify-center md:pb-2">
                  <div className="relative w-full max-w-[416px] h-[103px]">
                    <StatsCardSvg />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* X logo filler tile */}
            <div className="md:hidden col-span-1 lg:col-span-1 flex items-center justify-center">
              <img src="/x_symbol.svg" className="w-28" alt="Logo" />
            </div>

            {/* Replays count */}
            <Card className="col-span-2 md:col-span-1 bg-[#111111] text-white border-none h-full">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-normal text-zinc-500">Replays</CardTitle>
                  {/* <FaInfoCircle /> */}
                  <CustomTooltip
                    preview={
                      <button className="">
                        < FaInfoCircle />
                      </button>
                    }
                    hoverText="The number of games that are played by a user after their first game"
                    hoverTextCustomClass="bg-white opacity-80 rounded text-xs text-black w-40"
                  />
                </div>

              </CardHeader>
              <CardContent className="p-4 md:pt-12 flex md:items-end md:justify-end h-fit">
                <div className="text-3xl md:text-4xl font-bold">{totalReplays}</div>
              </CardContent>
            </Card>
          </div>


          {/* Leaderboard */}
          <Card className="col-span-2 md:col-span-4 lg:col-span-3 bg-[#111111] text-white border-none">
            <CardHeader className="p-4">
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="p-4 max-h-72 overflow-auto no-scrollbar">
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

      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover</TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
}

export default PlinkoReportDashboard;