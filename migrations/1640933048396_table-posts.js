/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      url VARCHAR(200),
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      caption VARCHAR(250),
      lat REAL,
      lng REAL
    );
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE posts;
  `);
};
