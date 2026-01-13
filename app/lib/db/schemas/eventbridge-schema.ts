import { integer, pgTable, jsonb, text, primaryKey } from "drizzle-orm/pg-core";
import { eventbridgeRawEventsStatusEnum } from "~/lib/form/form-data-enums.defaults";
import { timestamps } from "~/lib/db/schema-utils";

/**
 * Eventbridge event store
 */
export const eventbridgeRawEventsTable = pgTable(
  "eventbridge_raw_events",
  {
    ...timestamps,
    // resource_id: uuid()
    //   .notNull()
    //   .references(() => resourcesTable.id, { onDelete: "cascade" }),
    event_id: text().notNull(),
    raw_event_payload: jsonb().notNull(),
    status: text({ enum: eventbridgeRawEventsStatusEnum }).notNull(),
    detail_type: text().notNull(),
    // to catch if we're stuck in_progress
    current_times_in_progress: integer().notNull().default(0),
  },
  (table) => [
    // Ensure that the event_id + detail_type is unique
    primaryKey({ columns: [table.event_id, table.detail_type] }),
  ]
);
