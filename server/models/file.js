const db = require('../db');

exports.getCount = async () => {
  const sql = `SELECT count(*) as numRows FROM files`;

  const result = await db.getConnection().query(sql);
  return result[0].numRows;
};

exports.getMany = (itemsPerPage, page) => {
  const sql = `SELECT * FROM files LIMIT ${(page - 1) * itemsPerPage}, ${itemsPerPage}`;

  return db.getConnection().query(sql);
};

exports.get = async id => {
  const sql = `SELECT * FROM files WHERE id = ${id}`;

  const result = await db.getConnection().query(sql);
  return result[0];
};

exports.insert = async ({ md5, name, extname, mimetype, size, uploaded }) => {
  const sql = `INSERT INTO files (md5, name, extname, mimetype, size, uploaded) 
    VALUES('${md5}', '${name}', '${extname}', '${mimetype}', ${size}, ${db.getConnection().escape(uploaded)})`;

  const result = await db.getConnection().query(sql);
  return result.insertId;
};

exports.delete = id => {
  const sql = `DELETE FROM files WHERE id = ${id}`;

  return db.getConnection().query(sql);
};

exports.update = (id, { md5, name, extname, mimetype, size, uploaded }) => {
  const sql = `UPDATE files SET md5 = '${md5}', name = '${name}', extname = '${extname}', mimetype = '${mimetype}', size = ${size}, uploaded = ${db.getConnection().escape(uploaded)}
    WHERE id = ${id}`;

  return db.getConnection().query(sql);
};