async function fetchCredentials() {
  return {
    development: {
      username: process.env.username,
      password: process.env.password,
      database: process.env.db_name,
      host: process.env.host,
      dialect: 'postgres',
    },
    test: {
      username: process.env.username,
      password: process.env.password,
      database: process.env.db_name,
      host: process.env.host,
      dialect: 'postgres',
    },
    production: {
      username: process.env.username,
      password: process.env.password,
      database: process.env.db_name,
      host: process.env.host,
      dialect: 'postgres',
    }
  }
}

module.exports = fetchCredentials();