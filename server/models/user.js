"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // set to true if you want to allow Google sign-up without a password
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "customer",
      },

      // New fields for Google OAuth
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
