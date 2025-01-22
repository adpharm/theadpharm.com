import { db } from "@/db";
import {
  christmas21QuestionsUsers,
} from "@/db/schema";
import { ActionError } from "astro:actions";
import { eq, sql } from "drizzle-orm";

export const canUserPlay = async (userId: number) => {
  const MAX_GAMES = 10;

  const [user] = await db
    .select()
    .from(christmas21QuestionsUsers)
    .where(eq(christmas21QuestionsUsers.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    canPlay: user.numberOfGamesPlayed < MAX_GAMES,
    gamesRemaining: MAX_GAMES - user.numberOfGamesPlayed,
    gamesPlayed: user.numberOfGamesPlayed,
  };
};

export const incrementGamesPlayed = async (userId: number) => {
  const { canPlay } = await canUserPlay(userId);

  if (!canPlay) {
    throw new ActionError({
      code: "BAD_REQUEST",
      message: "Maximum number of games reached",
    });
  }

  try {
    const [updated] = await db
      .update(christmas21QuestionsUsers)
      .set({
        numberOfGamesPlayed: sql`${christmas21QuestionsUsers.numberOfGamesPlayed} + 1`,
      })
      .where(eq(christmas21QuestionsUsers.id, userId))
      .returning();

    return updated;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error("Error incrementing games played: " + errorMessage);
  }
};
