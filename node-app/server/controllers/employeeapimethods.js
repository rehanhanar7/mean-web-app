const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://aws_db_user:rehan$123@aws-postgres-live.c8tjkjwkqaur.us-east-1.rds.amazonaws.com:5432/poc_live');

var employeemodel = require('../models/employee')(sequelize, Sequelize);

// Check connection
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

module.exports = {
    fetch: function(req, res){
        return employeemodel.all().then(
            result => {
                res.status(200).send(result);
            }
        ).catch(
            error => {
                res.status(400).send(error);
            }
        )
    }
}