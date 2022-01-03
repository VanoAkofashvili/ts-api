require('dotenv').config()

if (!process.env.DB_NAME) {
  throw new Error('DB_NAME must be defined')
}

if (!process.env.DB_NAME_TEST) {
  throw new Error('DB_NAME_TEST must be defined');
}

if (!process.env.DB_USER) {
  throw new Error('DB_USER must be defined');
}
if (!process.env.DB_PASSWORD) {
  throw new Error('DB_PASSWORD must be defined');
}

if (!process.env.JWT_KEY) {
  throw new Error('JWT_KEY must be defined');
}

const PORT = process.env.PORT || 4000;
const DB_NAME = process.env.DB_NAME;
const DB_NAME_TEST = process.env.DB_NAME_TEST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const JWT_KEY = process.env.JWT_KEY;
const __prod__ = process.env.NODE_ENV === 'production';

export const config = {
  PORT,
  DB_NAME,
  DB_NAME_TEST,
  DB_USER,
  DB_PASSWORD,
  JWT_KEY,
  __prod__
}