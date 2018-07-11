export default (sequelize, DataTypes) => {
  const Label = sequelize.define('label', {
    label: DataTypes.STRING,
    type: DataTypes.DATE,
  })

  /*
  Label.associate = (models) => {
    // 1:M
     models.Label.belongsTo(models.Tester, {
      onDelete: "CASCADE",
      targetKey: 'id'
    })
  }
  */

  return Label
}
