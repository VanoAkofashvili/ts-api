var fs = require('fs');
const timestamp = new Date().getTime();
const filenames = process.argv.slice(2).join('-');
const seederName = './seeders/' + timestamp + '-' + filenames + '.seeder.js';

const seederBody = `
function up() {

};

function down() {

};

module.exports = {
  up,
  down
}
`;

fs.writeFile(seederName, seederBody, function (error) {
  if (error) {
    console.log('Ann error occurred when creating seeder: ', error);
  } else {
    console.log(seederName + ' created');
  }
});
