export default (sequelize, DataTypes) => {
  const Board = sequelize.define('board', {
    name: DataTypes.STRING,
  })

  Board.associate = (models) => {
    //1:M
    // Each Slot has Many Boards
    models.Board.belongsTo(models.Slot, {
      onDelete: "CASCADE",
      targetKey: 'id'
    })
  }

  return Board
}