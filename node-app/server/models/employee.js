'use strict';
module.exports = (sequelize, DataTypes) => {
  var Employee = sequelize.define('employee', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    business: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    jobrole: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    stdcode: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    schema: 'poc',
    tableName: 'employee',
    createdAt: false,
    updatedAt: false
  });
  Employee.associate = function(models) {
    // associations can be defined here
  };
  return Employee;
};