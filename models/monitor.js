export default (sequelize, DataTypes) => {
  const Monitor = sequelize.define('monitor', {
    index: DataTypes.INTEGER,
    value:  DataTypes.INTEGER,
    unit: DataTypes.STRING,
    name: DataTypes.STRING,
  })

  Monitor.associate = (models) => {
    //1:M
    /* models.Monitor.belongsTo(models.Tester, {
      onDelete: "CASCADE",
      targetKey: 'id'
    }) */
  }

  return Monitor
}