export default (sequelize, DataTypes) => {
  const Fault = sequelize.define('fault', {
    faultNumber: {
      type: DataTypes.INTEGER,
      field: 'fault_number'
    },
    value:  DataTypes.INTEGER,
    monitor: DataTypes.INTEGER,
    date: DataTypes.DATE,
  })

  Fault.associate = (models) => {
    //1:M
    /* models.Fault.belongsTo(models.Tester, {
      onDelete: "CASCADE",
      targetKey: 'id'
    }) */
  }

  return Fault
}