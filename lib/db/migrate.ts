import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "drizzle-orm/neon-http"
import { neon  } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required. (Set in .env/.env.local)");
}

async function runMigration() {
    try {
        const sql = neon(process.env.DATABASE_URL!);
        const db = drizzle(sql);

        await migrate(db, { migrationsFolder: "./drizzle" });
        console.log("Migration complete.");
    } catch(error) {
        console.log("Migration failed.", (error as any).message);
        process.exit(1);
    }
}

runMigration();
