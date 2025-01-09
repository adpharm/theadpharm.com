import { useStore } from "@nanostores/react";
import { $allGamesWithRounds, $allGames } from "../stores";


export function getPlinkoBallsDropped() {
  // const allGamesWithRounds = useStore($allGamesWithRounds);

  let ballsDropped = 0;

  $allGamesWithRounds.value.forEach(({ game, gameRound }) => {
    if (!gameRound.did_select_upgrade) {
      return;
    }

    ballsDropped += 5;

    if (gameRound.plinko_ball_6_on) {
      ballsDropped++;
    }
    if (gameRound.plinko_ball_7_on) {
      ballsDropped++;
    }
    if (gameRound.plinko_ball_8_on) {
      ballsDropped++;
    }
    if (gameRound.plinko_ball_9_on) {
      ballsDropped++;
    }
    if (gameRound.plinko_ball_10_on) {
      ballsDropped++;
    }
  });

  return ballsDropped;
}

export function getUserReplayCount() {
  const userCounts = new Map<number, number>();

  const allGames = useStore($allGames);

  allGames.forEach((game) => {
    const userId = game.user_id;

    if (userCounts.has(userId)) {
      console.log("User already exists: ", userId);
      userCounts.set(userId, (userCounts.get(userId) ?? 0) + 1);
    } else {
      userCounts.set(userId, 1);
    }
  });

  let totalReplays = 0;
  userCounts.forEach((count) => {
    if (count > 1) {
      // subtrat 1 because we only count the games after the first one to conisder as a replay.
      totalReplays += count - 1;
    }
  });

  console.log("USerCounts: ", userCounts);
  return totalReplays;
}
