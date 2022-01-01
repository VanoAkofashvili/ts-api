import { config } from "./utils";
import app from "./app";
import { pool } from './services';
import { logError, logInfo } from './utils';

const start = async () => {
  try {
    await pool.connect({
      host: 'localhost',
      port: 5432,
      database: config.DB_NAME,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
    });
  } catch (err) {
    logError(err);
  }

  app().listen(config.PORT, () => {
    logInfo('Listening on port ' + config.PORT);
  });
};

start();
