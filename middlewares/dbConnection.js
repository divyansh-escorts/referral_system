const { Sequelize} = require('sequelize');

let sequelize;
const URL_REF= process.env.URL_REF;
async function checkConnection() {
    try {
        // let secrets = await fetchSecrets()
        sequelize = new Sequelize(URL_REF);
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

checkConnection()
module.exports=sequelize