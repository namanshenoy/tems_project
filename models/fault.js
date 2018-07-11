export default (sequelize, DataTypes) => {
  const Fault = sequelize.define('fault', {
    faultNumber: {
      type: DataTypes.INTEGER,
      field: 'fault_number'
    },
    value:  DataTypes.INTEGER,
    monitor: DataTypes.INTEGER,
    date: {
      type: DataTypes.DATE,
      get () {
        const d = this.getDataValue('date');
        console.log("DATE: ",d)
        if (d==null){
          return 'Setting Date. Please Try again'
        }
        return d.toString();
      }
    }
  })

  Fault.associate = (models) => {
   //1:M
    // Each Tester has Many Faults
    models.Fault.belongsTo(models.Tester, {
      onDelete: "CASCADE",
      targetKey: 'id'
    })
  }

  return Fault
}