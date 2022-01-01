import { pool } from "../services";
import { config } from "../utils";
import migrate from "node-pg-migrate";
import jwt from "jsonwebtoken";


const DEFAULT_OPTS_TEST = {
  host: 'localhost',
  port: 5432,
  database: config.DB_NAME_TEST,
  user: config.DB_USER,
  password: config.DB_PASSWORD
}


beforeAll(async () => {
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

})

afterAll(async () => {
  // Drop tables after all tests, assuming default schema is "public"
  await pool.query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO postgres;
    GRANT ALL ON SCHEMA public TO public;
  `)

  // Disconnect from test database
  await pool.close();
})


const getJWT = function () {
  // Build JWT
  const payload = {
    id: 1,
    email: 'test@test.com'
  }

  const token = jwt.sign(payload, config.JWT_KEY);

  return token;
}


