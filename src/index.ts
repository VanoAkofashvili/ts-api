import { app } from './app';
import { pool } from './services';

const start = async () => {
  if (!process.env.DB_NAME) {
    throw new Error('DB_NAME must be defined')
  }
  if (!process.env.DB_USER) {
    throw new Error('DB_USER must be defined');
  }
  if (!process.env.DB_PASSWORD) {
    throw new Error('DB_PASSWORD must be defined');
  }

  try {
    await pool.connect({
      host: 'localhost',
      port: 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
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
