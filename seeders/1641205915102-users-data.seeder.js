exports.shorthands = undefined;
function up() {
  return `
    INSERT INTO users (id, email, firstname, lastname, password, username,bio)
    VALUES 
      (1, 'vanikoakofa@gmail.com', 'vaniko', 'akopashvili', 'a134522d5134fe6e97413cd56b850fa03c06919e9f037eec26d37d42279d08e50bc9847ef1b9288f7ee96c0b897ae14005fc02edc0ff4aa78ce9e05622f194e6.f2b70723528b6a41', 'vano' ,'this is my bio'),
      (2, 'test@gmail.com', 'testuser', 'test lastname', 'a134522d5134fe6e97413cd56b850fa03c06919e9f037eec26d37d42279d08e50bc9847ef1b9288f7ee96c0b897ae14005fc02edc0ff4aa78ce9e05622f194e6.f2b70723528b6a41', 'test','this is my bio'),
      (3, 'test2@gmail.com', '2 user', 'lastname', 'a134522d5134fe6e97413cd56b850fa03c06919e9f037eec26d37d42279d08e50bc9847ef1b9288f7ee96c0b897ae14005fc02edc0ff4aa78ce9e05622f194e6.f2b70723528b6a41', 'test2','this is my bio')
  `;
}

function down() {
  return `
    DELETE FROM users
    WHERE id IN (1,2,3);
  `;
}

module.exports = {
  up,
  down,
};
