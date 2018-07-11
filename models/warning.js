export default (sequelize, DataTypes) => {
  const Warning = sequelize.define('warning', {
    message: DataTypes.STRING,
    date: DataTypes.DATE
  })

  Warning.associate = (models) => {
    //1:M
    /* models.Warning.belongsTo(models.Tester, {
      onDelete: "CASCADE",
      targetKey: 'id'
    }) */
  }

  return Warning
}