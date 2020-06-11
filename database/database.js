const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', 'v@LENTINA2677',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;