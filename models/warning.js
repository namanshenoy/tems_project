export default (sequelize, DataTypes) => {
  const Warning = sequelize.define('warning', {
    message: DataTypes.TEXT,
    date: {
      type: DataTypes.DATE,
    },
  })

  Warning.associate = (models) => {
    // 1:M
    // Each Slot has Many Monitors
    models.Warning.belongsTo(models.Tester, {
      onDelete: 'CASCADE',
      targetKey: 'id',
    })
  }

  return Warning
}
