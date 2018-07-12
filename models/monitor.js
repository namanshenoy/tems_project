export default (sequelize, DataTypes) => {
  const Monitor = sequelize.define('monitor', {
    index: DataTypes.INTEGER,
    value: DataTypes.INTEGER,
    unit: DataTypes.STRING,
    name: DataTypes.STRING,
    asterix: DataTypes.BOOLEAN,
  })

  Monitor.associate = (models) => {
    // 1:M
    // Each Slot has Many Monitors
    models.Monitor.belongsTo(models.Slot, {
      onDelete: 'CASCADE',
      targetKey: 'id',
    })
  }

  return Monitor
}
