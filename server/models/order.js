"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Define associations here if needed
      // Example: this.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Order.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productIds: {
        // Storing multiple product IDs
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
      size: {
        // Storing multiple sizes
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      color: {
        // Storing multiple colors
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      total: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );

  return Order;
};
