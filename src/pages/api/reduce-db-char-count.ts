import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { db } from "@/db"; // Your actual path to the db instance
import { playHtCharacterCount } from "@/db/schema";
import { getCharRow } from "./chars-remaining";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Expecting JSON body with { promptAmount: number }
    const { promptAmount } = await request.json();

    // 1) First, get (or insert) the current usage row
    const row = await getCharRow();
    if (!row) {
      throw new Error("Unable to retrieve or insert a valid row.");
    }

    // 2) Decrement usage by promptAmount
    const updatedRemaining = row.charactersRemaining - promptAmount;

    // 3) Update DB
    const [updatedRow] = await db
      .update(playHtCharacterCount)
      .set({ charactersRemaining: updatedRemaining })
      .where(eq(playHtCharacterCount.id, row.id))
      .returning();

    // 4) Return updated row as JSON
    return new Response(JSON.stringify({ updatedRow }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
