const {Pool} = require('pg');
const pool = new Pool();

async function initDb() {
  await pool.connect().then(() => {
    console.log('connected to db')
  });

  return pool
}

module.exports = {
  initDb,
  query: async (text, params) => {
    const start = Date.now()
    let x = await pool.query(text, params);
    const duration = Date.now() - start
    console.log('executed query', { text, duration, rows: x.rowCount })

    return x
  }
}