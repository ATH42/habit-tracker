import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "paosdjkhalgf",
  },
  tablesFilter: ["habit-tracker_*"],
} satisfies Config;
