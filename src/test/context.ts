import { config } from "../utils"
import { pool } from "../services";
import migrate from "node-pg-migrate";

const DEFAULT_OPTS_TEST = {
  host: 'localhost',
  port: 5432,
  database: config.DB_NAME_TEST,
  user: config.DB_USER,
  password: config.DB_PASSWORD
}

export class Context {
  static async build() {
    // Connect to test database
    pool.connect(DEFAULT_OPTS_TEST);

    // Run migrations in the test database
    await migrate({
      databaseUrl: DEFAULT_OPTS_TEST,
      dir: 'migrations',
      direction: 'up',
      noLock: true,
      log: () => { },
      migrationsTable: 'pgmigrations'
    })
  }

  static async close() {
    await Context.reset();

    // Disconnect from test database
    await pool.close();
  }

  static async reset() {
    // Drop tables after all tests, assuming default schema is "public"
    await pool.query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO postgres;
    GRANT ALL ON SCHEMA public TO public;
  `)
  }

}