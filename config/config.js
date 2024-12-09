const fetchSecrets = require('../middlewares/fetchSecrets');

async function fetchCredentials() {
  let secrets = await fetchSecrets();
  return {
    development: {
      username: secrets.username,
      password: secrets.password,
      database: secrets.db_name,
      host: secrets.host,
      dialect: 'postgres',
    },
    test: {
      username: secrets.username,
      password: secrets.password,
      database: secrets.db_name,
      host: secrets.host,
      dialect: 'postgres',
    },
    production: {
      username: secrets.username,
      password: secrets.password,
      database: secrets.db_name,
      host: secrets.host,
      dialect: 'postgres',
    }
  }
}

module.exports = fetchCredentials();