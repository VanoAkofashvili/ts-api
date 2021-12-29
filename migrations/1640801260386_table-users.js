/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(50) NOT NULL UNIQUE,
      username VARCHAR(30) NOT NULL,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50),
      password VARCHAR(200) NOT NULl,
      profile_picture VARCHAR(200),
      bio VARCHAR(200),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updatet_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE users;
  `);
};
