// Sync
// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-serverless";

// const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle({ client: sql });

// Non-websockets (no transactions)
// see: https://orm.drizzle.team/docs/connect-neon#step-2---initialize-the-driver-and-make-a-query
// import { drizzle } from "drizzle-orm/neon-http";

// Websockets
// UPDATE: Can't use WS in Vercel serverless functions :/
// import { drizzle } from "drizzle-orm/neon-serverless";
// import ws from "ws";

// export const db = drizzle({
//   connection: process.env.DATABASE_URL!,
//   ws,
// });

// From https://orm.drizzle.team/docs/tutorials/drizzle-with-neon

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
// import { config } from "dotenv";
// config({ path: ".env" }); // or .env.local

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
