import db from '../db';

const getUsers = () => {
  const sql = `SELECT * FROM users`;
  return db.query(sql).then((data) => data.rows);
};

export = { getUsers };
