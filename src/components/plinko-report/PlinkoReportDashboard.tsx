import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { $allGames, $allGamesWithRounds, $allUsers, $gamesScores, $leaderboard } from '@/lib/stores';
import { useStore } from '@nanostores/react';
import { Table, TableCell, TableRow } from '../ui/table';
import { makePrettyNumber } from '@/lib/utils.numbers';
import { convertUTCToDistanceToNow } from '@/lib/utils.plinko.date';
import { ClientOnly } from '@/lib/utils.react-hydration';
import { getPlinkoBallsDropped, getUserReplayCount } from '@/lib/server/plinkoReportLogic';
import googleAnalyticsData from '@/data/googleAnalyticsOutput.json';
// import ActiveUsersCardSvg from './ActiveUsersCardSvg';
import { FaInfoCircle } from "react-icons/fa";
import { CustomTooltip } from '../Tooltip';
import CountUp from 'react-countup';

function PlinkoReportDashboard() {
  const leaderboardData = useStore($leaderboard);
  const gamesTotals = useStore($gamesScores);
  const allUsers = useStore($allUsers);
  const allGamesWithRounds = useStore($allGamesWithRounds);
  const allGames = useStore($allGames);

  // I want to get the variable totalTimeSpent from the json file googleAnalyticsOutput.json
  const timeSpentPlayingPlinko = googleAnalyticsData?.outputResult?.totalTimeSpent ?? "Something's wrong";

  // Below are the constants used for the cards
  const totalScores = gamesTotals.reduce((acc, score) => acc + score, 0);
  const totalBallsDropped = makePrettyNumber(getPlinkoBallsDropped());
  const totalUniqueUsers = allUsers.length;
  const totalReplays = makePrettyNumber(getUserReplayCount());
  const totalRoundsPlayed = makePrettyNumber(allGamesWithRounds.length);
  const totalGamesPlayed = allGames.length;

  return (
    <div className="space-y-4">
      {/* Top row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-6">
        {/* Games played */}
        <Card className="md:order-1 bg-[#111111] text-white border-none flex flex-col justify-between">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-normal text-zinc-500">Games played</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex items-end justify-end h-fit">
            <div className="text-4xl font-bold">{totalGamesPlayed}</div>
            {/* <CountUp className="text-3xl md:text-4xl font-bold" start={0} end={totalGamesPlayed} duration={5} decimals={0} prefix="" delay={0} separator=','/> */}
          </CardContent>
        </Card>

        {/* Plinko balls - single col */}
        <Card className="md:order-2 lg:col-span-1 bg-[#111111] text-white border-none flex flex-col justify-between">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-normal text-zinc-500">Balls dropped</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex items-end justify-end h-fit">
            <div className="text-4xl font-bold">{totalBallsDropped}</div>
            {/* <CountUp className="text-3xl md:text-4xl font-bold" start={0} end={totalBallsDropped} duration={5} decimals={0} prefix="" delay={0} separator=','/> */}
          </CardContent>
        </Card>

        {/* Total points - spans 2 cols */}
        <Card className="md:hidden lg:grid lg:order-3 md:order-4 col-span-2 lg:col-span-2 bg-[#111111] text-white border-none flex flex-col justify-between">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-normal text-zinc-500">Total points scored</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {/* <div className="text-3xl md:text-4xl font-bold">{totalScores}</div>
            */}
            <CountUp className="text-3xl md:text-4xl font-bold" start={0} end={totalScores} duration={3} decimals={0} prefix="" delay={0} separator=',' />
          </CardContent>
        </Card>

        {/* Rounds Played */}
        <Card className="lg:order-4 md:order-3 cols-span-3 bg-[#111111] text-white border-none h-full">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-normal text-zinc-500">Rounds played</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex items-end justify-end">
            <div className="text-4xl font-bold">{totalRoundsPlayed}</div>
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
        <Card className="hidden md:grid lg:hidden lg:order-3 md:order-4 col-span-2 md:col-span-2 bg-[#111111] text-white border-none flex flex-col justify-between">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-normal text-zinc-500">Total points scored</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex md:justify-end lg:items-end lg:justify-end">
            <CountUp className="text-3xl md:text-4xl font-bold" start={0} end={totalScores} duration={10} decimals={0} prefix="" delay={0} separator=',' />
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-2 lg:col-span-3 bg-[#111111] text-white border-none flex flex-col justify-between">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-normal text-zinc-500">Time spent playing</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex md:items-end md:justify-end lg:items-start lg:justify-start h-fit">
            <div className="text-2xl md:text-3xl font-bold">{timeSpentPlayingPlinko}</div>
          </CardContent>
        </Card>

        {/* Play button */}
        <Card className="col-span-1 bg-[#111111] text-white border-none flex flex-col justify-between">
          <CardHeader className='p-4 pb-2'>
            <CardTitle className="text-sm font-normal text-zinc-500">Let's play!</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex justify-center pt-0">
            <a href='/digital/plinko'>
              <img src="/play-button.png" className="w-20" alt="Play" />
            </a>
          </CardContent>
        </Card>

        {/* Players count */}
        <Card className="col-span-1 bg-[#111111] text-white border-none flex flex-col justify-between">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-normal text-zinc-500">Players</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex md:items-end md:justify-end h-fit">
            <div className="text-6xl font-medium">{totalUniqueUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Last section */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-start">
        <div className="col-span-2 md:col-span-4 lg:col-span-3 grid grid-cols-3 gap-4">
          {/* Active users box */}
          <Card className="col-span-3 md:col-span-2 bg-[#111111] text-white border-none flex flex-col justify-between">
            <CardHeader className="p-4 pb-0">
              {/* <CardTitle>Active users</CardTitle> */}
              <div>
                <div className='flex items-center gap-2 pt-0 xs:text-lg m-0 font-bold'>
                  <span className="text-green-500">+1,448%</span>
                  <span>active users</span>
                </div>
              </div>
              <CardTitle className="text-sm font-normal text-zinc-500 !mt-0">on theadpharm.com
              </CardTitle>

            </CardHeader>
            <CardContent className="!p-0">

              {/* <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75 left-[42.7%]"></span> */}
              {/* <img className='relative' src="/active_users_sparkline.svg" alt="Active users trend" /> 
                */}
              <div className="flex justify-center w-full">
                <div className="relative w-full">
                  {/* <ActiveUsersCardSvg /> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* X logo filler tile */}
          <div className="md:hidden col-span-1 lg:col-span-1 flex items-center justify-center">
            <img src="/x_symbol.svg" className="w-28" alt="Logo" />
          </div>

          {/* Replays count */}
          <Card className="col-span-2 md:col-span-1 bg-[#111111] text-white border-none h-full flex flex-col justify-between">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-normal text-zinc-500 flex items-center">
                <span>Replays</span>
                <CustomTooltip
                  preview={
                    <span className='cursor-pointer ml-1'>
                      <FaInfoCircle size={10} />
                    </span>
                  }
                  hoverText="The number of games that are played by a user after their first game."
                  hoverTextCustomClass="text-xs w-40 opacity-100"
                  doYouWantDelay={true}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:pt-12 flex items-end justify-end h-fit">
              <div className="text-6xl font-medium">{totalReplays}</div>
            </CardContent>
          </Card>
        </div>


        {/* Leaderboard */}
        <Card className="col-span-2 md:col-span-4 lg:col-span-3 bg-[#111111] text-white border-none">
          <CardHeader className="p-6">
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="p-6 max-h-72 overflow-auto no-scrollbar">
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
    </div >
  );
}

export default PlinkoReportDashboard;