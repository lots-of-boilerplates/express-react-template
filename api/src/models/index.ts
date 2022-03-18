'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
const config = {
  "username": "postgres",
  "password": "1",
  "database": "express-react-template",
  "host": "127.0.0.1",
  "dialect": "postgres",
  "port": "5432"
}

const db = {};
let sequelize: any;

if (env !== "development") {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      }
  );

  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  }).catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname).filter((file: string)  => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach((file: any) => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  // @ts-ignore
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  // @ts-ignore
  if (db[modelName].associate) {
    // @ts-ignore
    db[modelName].associate(db);
  }
});

// @ts-ignore
db.sequelize = sequelize;
// @ts-ignore
db.Sequelize = Sequelize;

module.exports = db;
