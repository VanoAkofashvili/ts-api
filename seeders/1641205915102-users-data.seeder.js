exports.shorthands = undefined;
const faker = require('faker');
const format = require('pg-format');
function up() {
  let query = `
    INSERT INTO users (id, email, firstname, lastname, password, username,bio)
    VALUES 
      (1, 'vanikoakofa@gmail.com', 'vaniko', 'akopashvili', '3dc78ed9fe9d8918a9c9893e1e9c6033981aa2e9c219337d727b8cacefc2c22d82c14863378bfc6fd4cb8e909eaa14ac540b22db32c1658adcc894ba794edb16.2faa281eb4575360', 'vano' ,'this is my bio'),
      (2, 'test@gmail.com', 'testuser', 'test lastname', '3dc78ed9fe9d8918a9c9893e1e9c6033981aa2e9c219337d727b8cacefc2c22d82c14863378bfc6fd4cb8e909eaa14ac540b22db32c1658adcc894ba794edb16.2faa281eb4575360', 'test','this is my bio'),
      (3, 'test2@gmail.com', '2 user', 'lastname', '3dc78ed9fe9d8918a9c9893e1e9c6033981aa2e9c219337d727b8cacefc2c22d82c14863378bfc6fd4cb8e909eaa14ac540b22db32c1658adcc894ba794edb16.2faa281eb4575360', 'test2','this is my bio')
  `;

  for (let i = 4; i < 1000; i++) {
    const { id, email, firstname, lastname, password, username, bio } = {
      id: i,
      email: faker.internet.email(),
      firstname: faker.name.firstName().replace(/'/g, ''),
      lastname: faker.name.lastName().replace(/'/g, ''),
      password:
        '3dc78ed9fe9d8918a9c9893e1e9c6033981aa2e9c219337d727b8cacefc2c22d82c14863378bfc6fd4cb8e909eaa14ac540b22db32c1658adcc894ba794edb16.2faa281eb4575360',
      username: faker.internet.userName().replace(/'/, ''),
      bio: faker.lorem.sentence().replace(/'/, ''),
    };
    query += `,(${id}, '${email}', '${firstname}', '${lastname}', '${password}' , '${username}', '${bio}')`;
  }
  return format(query);
}

function down() {
  return `
    DELETE FROM users
  `;
}

module.exports = {
  up,
  down,
};
