const command = process.argv.slice(2)[0];
const fs = require('fs');
let dirCont = fs.readdirSync('./seeders');
let files = dirCont.filter(file => file.match(/.*\.(seeder?)/gi));
const pg = require('pg');
if (!(command === 'up' || command === 'down')) {
  throw new Error('invalid command line argument: ' + command);
}

async function seed() {
  const pool = new pg.Pool({
    host: 'localhost',
    port: 5433,
    database: 'facebookdb',
    user: 'postgres',
    password: 'password',
  });

  for (const file of files) {
    const content = require('./' + file);
    try {
      await pool.query(content[command]());
    } catch (err) {
      console.log(err);
    }
  }
  console.log('Completed');
  await pool.end();
}

seed();
