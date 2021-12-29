import { app } from './app';
import pool from './pool';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.DATABASE_NAME) {
    throw new Error('DATABASE_NAME must be defined')
  }
  if (!process.env.DATABASE_USER) {
    throw new Error('DATABASE_USER must be defined');
  }
  if (!process.env.DATABASE_PASSWORD) {
    throw new Error('DATABASE_PASSWORD must be defined');
  }

  try {
    await pool.connect({
      host: 'localhost',
      port: 5432,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    });
  } catch (err) {
    console.error(err);
  }


  const PORT = 4000;
  app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
  });
};

start();
