export default (sequelize, DataTypes) => {
  const Slot = sequelize.define('slot', {
    slotNumber: {
      type: DataTypes.STRING,
      field: 'slot_number'
    }
  })

  Slot.associate = (models) => {
    //1:M
    models.Slot.belongsTo(models.Tester, {
      onDelete: "CASCADE",
      targetKey: 'id'
    })
  }

  return Slot
}