import type { APIRoute } from "astro";
import { db } from "@/db"; // Adjust import to match your actual db path
import { playHtCharacterCount } from "@/db/schema";
import { and, lte, gt } from "drizzle-orm";

/**
 * POST /api/chars-remaining
 */
export const POST: APIRoute = async () => {
  try {
    // 1) Figure out today's date in YYYY-MM-DD format
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().slice(0, 10);

    // 2) Select any row whose startDate <= currentDate < endDate
    const rows = await db
      .select()
      .from(playHtCharacterCount)
      .where(
        and(
          lte(playHtCharacterCount.startDate, currentDateString),
          gt(playHtCharacterCount.endDate, currentDateString),
        ),
      );

    let row = rows[0];

    // 3) If no row found, insert a new one
    if (!row) {
      // If day < 18, go back one month for start date, otherwise use 18th of this month
      const currentDay = currentDate.getDate();
      let startYear = currentDate.getFullYear();
      let startMonth = currentDate.getMonth();

      if (currentDay < 18) {
        startMonth--;
        if (startMonth < 0) {
          startYear--;
          startMonth = 11;
        }
      }

      // Create the start/end date
      const startDate = new Date(startYear, startMonth, 18);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1); // add 1 month

      const startDateString = startDate.toISOString().slice(0, 10);
      const endDateString = endDate.toISOString().slice(0, 10);

      // Insert a new row with default 37500 characters
      const insertedRows = await db
        .insert(playHtCharacterCount)
        .values({
          startDate: startDateString,
          endDate: endDateString,
          charactersRemaining: 37500,
        })
        .returning();

      row = insertedRows[0];
    }

    // 4) Return the row
    return new Response(JSON.stringify({ row }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Handle and return errors gracefully
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
    });
  }
};

export async function getCharRow() {
  const currentDate = new Date();

  const currentDateString = currentDate.toISOString().slice(0, 10);

  // Select row matching startDate <= currentDate < endDate
  const rows = await db
    .select()
    .from(playHtCharacterCount)
    .where(
      and(
        lte(playHtCharacterCount.startDate, currentDateString),
        gt(playHtCharacterCount.endDate, currentDateString),
      ),
    );

  let row = rows[0];

  // If no row found, we need to insert a new one for this usage window
  if (!row) {
    // 1) If day < 18, go back one month for the start date
    // 2) Otherwise, use the 18th of this month
    const currentDay = currentDate.getDate();
    let startYear = currentDate.getFullYear();
    let startMonth = currentDate.getMonth();

    if (currentDay < 18) {
      startMonth--;
      if (startMonth < 0) {
        startYear--;
        startMonth = 11;
      }
    }

    const startDate = new Date(startYear, startMonth, 18);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // add 1 month

    // Convert them to YYYY-MM-DD strings
    const startDateString = startDate.toISOString().slice(0, 10);
    const endDateString = endDate.toISOString().slice(0, 10);

    const insertedRows = await db
      .insert(playHtCharacterCount)
      .values({
        startDate: startDateString,
        endDate: endDateString,
        charactersRemaining: 37500,
      })
      .returning();

    row = insertedRows[0];
  }
  return row;
}
