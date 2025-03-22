
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      productIds: {
        // Storing multiple product IDs as an array
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
        // Note: For a fully normalized design, consider a join table (OrderItems).
      },
      size: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      color: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      total: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "pending",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Orders");
  },
};
