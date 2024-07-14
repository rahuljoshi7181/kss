const connection = require('./connection');

const getUserByEmail = async (email) => {
  const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const createUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password_hash = hashedPassword;

  const [result] = await connection.query('INSERT INTO users SET ?', user);
  return result.insertId;
};

module.exports = { getUserByEmail, createUser };
