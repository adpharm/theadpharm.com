import { sql } from "drizzle-orm";
import {
  serial,
  text,
  pgTable,
  uuid,
  timestamp,
  unique,
  index,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

/***************************************************************
 *
 * Common
 *
 ****************************************************************/
// timestamps
const timestamps = {
  created_at: timestamp({ withTimezone: true, mode: "string" })
    .default(sql`(now() AT TIME ZONE 'utc'::text)`)
    .notNull(),
  updated_at: timestamp({ withTimezone: true, mode: "string" })
    .default(sql`(now() AT TIME ZONE 'utc'::text)`)
    .notNull()
    .$onUpdate(() => sql`(now() AT TIME ZONE 'utc'::text)`),
};

/***************************************************************
 *
 * Users
 *
 ****************************************************************/
export const tableUsers = pgTable(
  "user",
  {
    id: serial().primaryKey(),
    email: text(),
    username: text().notNull(),
    password_hash: text().notNull(),
    first_name: text(),
    last_name: text(),
    ...timestamps,
  },
  (table) => [
    // Ensure that the email is unique
    // unique("email").on(table.email),
    // Ensure that the username is unique
    unique("username").on(table.username),
    // index on email
    // index("email").on(table.email),
  ],
);

export const tableSessions = pgTable(
  "session",
  {
    // id: serial().primaryKey(),
    id: text().primaryKey(),
    user_id: integer()
      .notNull()
      .references(() => tableUsers.id),
    expires_at: timestamp({ withTimezone: true }).notNull(),
    // two_factor_verified: boolean().notNull().default(false),
  },
  (table) => [
    // Ensure that the user_uuid is unique
    // unique("user_id").on(table.user_uuid),
  ],
);

// export const signup_session = pgTable(
//   "signup_session",
//   {
//     id: uuid().primaryKey(),
//     user_uuid: uuid().references(() => users.uuid),
//     expires_at: timestamp({ withTimezone: true }).notNull(),
//   },
//   (table) => [
//     // Ensure that the user_uuid is unique
//     // unique("user_id").on(table.user_uuid),
//   ],
// );

/***************************************************************
 *
 * Plinko
 *
 ****************************************************************/

const roundKeys = [
  "rnd1",
  "rnd2",
  "rnd3",
  "rnd4",
  "rnd5",
  "rnd6",
  "rnd7",
  "rnd8",
  "rnd9",
  "rnd10",
] as const;

// plinko game
export const tablePlinkoGames = pgTable(
  "plinko_game",
  {
    ...timestamps,
    id: serial().primaryKey(),
    user_id: integer()
      .notNull()
      .references(() => tableUsers.id),
    current_round_key: text({ enum: roundKeys }).notNull().default("rnd1"),
    score: integer().notNull().default(0),
    game_over: boolean().notNull().default(false),
  },
  (table) => [
    // Ensure that the user_uuid is unique
    // unique("user_id").on(table.user_uuid),
  ],
);

const plinkoBallPowerUps = (name: string) =>
  text(name, { enum: ["golden"] })
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`);

// pocket power ups
const pocketPowerUps = (name: string) =>
  text(name, { enum: ["double"] })
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`);

// plinko round
export const tablePlinkoGameRounds = pgTable(
  "plinko_game_round",
  {
    ...timestamps,
    id: serial().primaryKey(),
    game_id: integer()
      .notNull()
      .references(() => tablePlinkoGames.id),
    key: text({ enum: roundKeys }).notNull(),
    // the score for this round
    score: integer().notNull().default(0),
    // did upgrade the board for this round
    upgraded: boolean().notNull().default(false),

    // ballsInPlay
    // activeBallIndices: integer()
    //   .array()
    //   .notNull()
    //   // default first 5 balls
    //   .default(sql`ARRAY[1, 2, 3, 4, 5]`),

    // // golden plinko balls
    // goldenBallsIndices: integer()
    //   .array()
    //   .notNull()
    //   .default(sql`ARRAY[]::int[]`),

    // ball details
    plinko_ball_1_on: boolean().notNull().default(true),
    plinko_ball_1_power_ups: plinkoBallPowerUps("plinko_ball_1_power_ups"),
    plinko_ball_2_on: boolean().notNull().default(true),
    plinko_ball_2_power_ups: plinkoBallPowerUps("plinko_ball_2_power_ups"),
    plinko_ball_3_on: boolean().notNull().default(true),
    plinko_ball_3_power_ups: plinkoBallPowerUps("plinko_ball_3_power_ups"),
    plinko_ball_4_on: boolean().notNull().default(true),
    plinko_ball_4_power_ups: plinkoBallPowerUps("plinko_ball_4_power_ups"),
    plinko_ball_5_on: boolean().notNull().default(true),
    plinko_ball_5_power_ups: plinkoBallPowerUps("plinko_ball_5_power_ups"),
    plinko_ball_6_on: boolean().notNull().default(false), // ball 6 and on are locked by default
    plinko_ball_6_power_ups: plinkoBallPowerUps("plinko_ball_6_power_ups"),
    plinko_ball_7_on: boolean().notNull().default(false),
    plinko_ball_7_power_ups: plinkoBallPowerUps("plinko_ball_7_power_ups"),
    plinko_ball_8_on: boolean().notNull().default(false),
    plinko_ball_8_power_ups: plinkoBallPowerUps("plinko_ball_8_power_ups"),
    plinko_ball_9_on: boolean().notNull().default(false),
    plinko_ball_9_power_ups: plinkoBallPowerUps("plinko_ball_9_power_ups"),
    plinko_ball_10_on: boolean().notNull().default(false),
    plinko_ball_10_power_ups: plinkoBallPowerUps("plinko_ball_10_power_ups"),

    // pocket details
    pocket_middle_value: integer().notNull(),
    pocket_middle_power_ups: pocketPowerUps("pocket_middle_power_ups"),
    pocket_middle_left_1_value: integer().notNull(),
    pocket_middle_left_1_power_ups: pocketPowerUps(
      "pocket_middle_left_1_power_ups",
    ),
    pocket_middle_right_1_value: integer().notNull(),
    pocket_middle_right_1_power_ups: pocketPowerUps(
      "pocket_middle_right_1_power_ups",
    ),
    pocket_middle_left_2_value: integer().notNull(),
    pocket_middle_left_2_power_ups: pocketPowerUps(
      "pocket_middle_left_2_power_ups",
    ),
    pocket_middle_right_2_value: integer().notNull(),
    pocket_middle_right_2_power_ups: pocketPowerUps(
      "pocket_middle_right_2_power_ups",
    ),
    pocket_middle_left_3_value: integer().notNull(),
    pocket_middle_left_3_power_ups: pocketPowerUps(
      "pocket_middle_left_3_power_ups",
    ),
    pocket_middle_right_3_value: integer().notNull(),
    pocket_middle_right_3_power_ups: pocketPowerUps(
      "pocket_middle_right_3_power_ups",
    ),
  },
  (table) => [
    // Ensure that the game and key are unique together
    unique("game_id_key").on(table.game_id, table.key),
  ],
);
