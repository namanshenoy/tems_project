export default (sequelize, DataTypes) => {
  const Board = sequelize.define('board', {
    boardId:{type: DataTypes.STRING, field: "board_id"},
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