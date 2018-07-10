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
    models.Tester.hasMany(models.Slot, {as: 'Slots', sourceKey: 'id'})
    models.Tester.hasOne(models.BoardHandler, {as: 'BoardHandler', sourceKey: 'id'})
  }
  return Tester
  }