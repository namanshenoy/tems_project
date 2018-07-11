export default (sequelize, DataTypes) => {
  const Board = sequelize.define('board', {
    name: DataTypes.STRING,
  })

  Board.associate = (models) => {
    //1:M
    /* models.Board.belongsTo(models.Tester, {
      onDelete: "CASCADE",
      targetKey: 'id'
    }) */
  }

  return Board
}