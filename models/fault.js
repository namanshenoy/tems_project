export default (sequelize, DataTypes) => {
  const Fault = sequelize.define('fault', {
    faultNum: {
      type: DataTypes.INTEGER,
      field: 'fault_number',
    },
    faultVal: {
      type: DataTypes.INTEGER,
      field: 'fault_val',
    },
    indexNum: {
      type: DataTypes.INTEGER,
      field: 'index_num',
    },
    slotNum: {
      type: DataTypes.INTEGER,
      field: 'slot_num',
    },
    faultDate: {
      type: DataTypes.DATE,
      field: 'fault_date',
    },
  })

  Fault.associate = (models) => {
    // 1:M
    // Each Tester has Many Faults
    models.Fault.belongsTo(models.Tester, {
      onDelete: 'CASCADE',
      targetKey: 'id',
    })
  }

  return Fault
}
