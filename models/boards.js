export default (sequelize, DataTypes) => {
  const BoardHandler = sequelize.define('boardHandler', {})

  BoardHandler.associate = (models) => {
    //1:M
    models.BoardHandler.belongsTo(models.Tester, {
      onDelete: "CASCADE",
      targetKey: 'id'
    })

    models.BoardHandler.hasMany(models.Boards, {as: 'Slots', sourceKey: 'id'})
  }

  return BoardHandler
}