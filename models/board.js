export default (sequelize, DataTypes) => {
  const Board = sequelize.define('board', {
    boardId: { type: DataTypes.STRING, field: 'board_id' },
    name: DataTypes.STRING,
    partNumber: { type: DataTypes.STRING, field: 'part_number' },
    slotNumber: { type: DataTypes.INTEGER, field: 'slot_number' },
    rev: DataTypes.STRING,
    sector: DataTypes.STRING,
    testerName: { type: DataTypes.STRING, field: 'tester_name' },
  })

  Board.associate = (models) => {
    // 1:M
    // Each Slot has Many Boards
    models.Board.belongsTo(models.Slot, {
      onDelete: 'CASCADE',
      targetKey: 'id',
    })
  }
  return Board
}
