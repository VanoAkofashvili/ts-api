import { config } from "../utils"
import { pool } from "../services";
import migrate from "node-pg-migrate";
import { randomBytes } from "crypto";
import format from "pg-format";
import jwt from 'jsonwebtoken';

const DEFAULT_OPTS_TEST = {
  host: 'localhost',
  port: 5432,
  database: config.DB_NAME_TEST,
  user: config.DB_USER,
  password: config.DB_PASSWORD
}

export class Context {
  private roleName: string;
  constructor(roleName: string) {
    this.roleName = roleName;
  }

  static async build() {
    // Randomly generating a role name to connect to PG as
    const roleName = 'a' + randomBytes(4).toString('hex');

    // Connect to PG as usual
    await pool.connect(DEFAULT_OPTS_TEST);

    // Create a new role
    await pool.query(
      format('CREATE ROLE %I WITH LOGIN PASSWORD %L;', roleName, roleName)
    );

    // Create a schema
    await pool.query(
      format('CREATE SCHEMA %I AUTHORIZATION %I', roleName, roleName)
    );
    // Disconnect entirely from PG
    await pool.close();

    // Run migrations in the new schema
    await migrate({
      schema: roleName,
      direction: 'up',
      log: () => { },
      noLock: true,
      dir: 'migrations',
      migrationsTable: 'pgmigrations',
      databaseUrl: {
        host: 'localhost',
        port: 5432,
        database: config.DB_NAME_TEST,
        user: roleName,
        password: roleName,
      },
    });
    // Connect to PG as the newly created role
    await pool.connect({
      host: 'localhost',
      port: 5432,
      database: config.DB_NAME_TEST,
      user: roleName,
      password: roleName,
    });

    return new Context(roleName);
  }

  async close() {
    // Disconnect from pg
    await pool.close();

    // Reconnect as our root user
    await pool.connect(DEFAULT_OPTS_TEST);

    // Delete the role and schema
    await pool.query(format('DROP SCHEMA %I CASCADE;', this.roleName));
    await pool.query(format('DROP ROLE %I', this.roleName));

    // Disconnect
    await pool.close();
  }

  async reset() {
    return pool.query(`
      DELETE FROM users;
      DELETE FROM posts;
      DELETE FROM friends;
    `);
  }

  signin() {
    // Build JWT
    const payload = {
      id: 1,
      email: 'test@test.com'
    }

    const token = jwt.sign(payload, config.JWT_KEY);

    return { header: { Authorization: token }, userId: 1 };
  }

}