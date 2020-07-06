const db = require('../db');

exports.get = async id => {
  const sql = `SELECT * FROM users WHERE id = ${id}`;

  const result = await db.getConnection().query(sql);
  return result[0];
};

exports.getByEmail = async email => {
  const sql = `SELECT * FROM users WHERE email = '${email}'`;

  const result = await db.getConnection().query(sql);
  return result[0];
};

exports.insert = async ({ email, password }) => {
  const sql = `INSERT INTO users (email, password) VALUES('${email}', '${password}')`;

  const result = await db.getConnection().query(sql);
  return result.insertId;
};