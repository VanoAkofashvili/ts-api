import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
  })
}

start();