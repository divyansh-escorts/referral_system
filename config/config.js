require('dotenv').config();
const {username,password,db_name,host}= process.env
async function fetchCredentials() {
  return {
    development: {
      username: username,
      password: password,
      database: db_name,
      host: host,
      dialect: 'postgres',
    },
    test: {
      username: username,
      password: password,
      database: db_name,
      host: host,
      dialect: 'postgres',
    },
    production: {
      username: username,
      password: password,
      database: db_name,
      host: host,
      dialect: 'postgres',
    }
  }
}

module.exports = fetchCredentials();