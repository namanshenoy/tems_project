export default (sequelize, DataTypes) => {
  const Tester = sequelize.define('tester', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    igxlVersion: {
      type: DataTypes.STRING,
      field: 'igxl_version'
    }
  })

  Tester.associate = (models) => {
    //1:M
    // Each Tester has Many Slots
    models.Tester.hasMany(models.Slot, {as: 'Slots', sourceKey: 'id'})

    //1:M
    // Each Tester has Many Faults
    models.Tester.hasMany(models.Fault, {as: 'Faults', sourceKey: 'id'})

    //1:M
    // Each Tester has Many Warnings
    models.Tester.hasMany(models.Warning, {as: 'Warnings', sourceKey: 'id'})
  }
  return Tester
}