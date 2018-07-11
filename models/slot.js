export default (sequelize, DataTypes) => {
  const Slot = sequelize.define('slot', {
    slotNumber: {
      type: DataTypes.INTEGER,
      field: 'slot_number',
    },
  })

  Slot.associate = (models) => {
    // 1:M
    // Each Tester has Many Slots
    models.Slot.belongsTo(models.Tester, {
      onDelete: 'CASCADE',
      targetKey: 'id',
    })

    // 1:M
    // Each Slot has Many Monitors
    models.Slot.hasMany(models.Monitor, { as: 'Monitors', sourceKey: 'id' })

    // 1:M
    // Each Slot has Many Boards
    models.Slot.hasMany(models.Board, { as: 'Boards', sourceKey: 'id' })
  }

  return Slot
}
